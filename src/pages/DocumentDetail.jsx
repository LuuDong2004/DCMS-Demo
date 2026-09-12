import { useState } from "react";
import { Icon, Badge, TypeTag, Card, Avatar } from "../ui";
import { allowedActions, SYNC_SOURCES } from "../engine";
import { actionsFor, isAssignee, can } from "../accounts";

const KIND_ICON = { system: "plus", ai: "ai", approve: "check", sign: "sign", publish: "send", sync: "refresh" };
const DONE_LABEL = { system: "Đã tạo", ai: "Đã phân tích", approve: "Đã duyệt", sign: "Đã ký", publish: "Hoàn tất", sync: "Đã đồng bộ" };
const MODAL = {
  approve: { title: "Phê duyệt văn bản", btn: "Phê duyệt", need: false, ph: "Ý kiến phê duyệt (không bắt buộc)…" },
  reject: { title: "Từ chối văn bản", btn: "Từ chối", need: true, ph: "Nêu lý do từ chối…" },
  revise: { title: "Yêu cầu chỉnh sửa", btn: "Gửi yêu cầu", need: true, ph: "Nội dung cần chỉnh sửa…" },
  sign: { title: "Ký số văn bản", btn: "Ký số", need: false },
  publish: { title: "Phát hành văn bản", btn: "Phát hành", need: false, ph: "Ghi chú phát hành (không bắt buộc)…" },
  resubmit: { title: "Trình lại văn bản", btn: "Trình lại", need: false, ph: "Mô tả nội dung đã chỉnh sửa…" },
};

export default function DocumentDetail({ doc, go, onAction, user, onRemind }) {
  const [tab, setTab] = useState("info");
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState("");
  if (!doc) return <div className="page"><button className="link back" onClick={() => go("docs")}><Icon name="back" size={16} />Quay lại danh sách</button><p className="muted">Không tìm thấy văn bản.</p></div>;

  const allowed = allowedActions(doc);
  const actions = actionsFor(doc, user, allowed);
  const cur = doc.steps.find((s) => s.state === "current");
  const rejected = doc.steps.find((s) => s.state === "rejected");
  const analyzing = cur?.kind === "ai";
  const submit = () => { onAction(doc.id, modal, note.trim()); setModal(null); setNote(""); };
  const extRef = doc.ai.fields.find(([k]) => /^Mã/.test(k))?.[1];
  const m = modal && MODAL[modal];

  return (
    <div className="page">
      <button className="link back" onClick={() => go("docs")}><Icon name="back" size={16} />Quay lại danh sách</button>
      <div className="page-head">
        <div>
          <div className="crumbs"><span>{doc.dir === "in" ? "Văn bản đến" : "Văn bản đi"}</span><Icon name="chevron" size={12} /><span>{doc.id}</span></div>
          <h1>{doc.title}</h1>
          <div className="meta-line"><TypeTag type={doc.type} /><Badge status={doc.status} /><span className="src">Nguồn: {doc.source}</span><span className="muted">Tạo {doc.date} · {doc.creator}</span></div>
        </div>
        <div className="page-actions">
          {analyzing && <span className="ai-running"><span className="spinner" />AI đang phân tích văn bản…</span>}
          {actions.includes("revise") && <button className="btn ghost" onClick={() => setModal("revise")}><Icon name="refresh" size={16} />Yêu cầu chỉnh sửa</button>}
          {actions.includes("reject") && <button className="btn danger" onClick={() => setModal("reject")}><Icon name="x" size={16} />Từ chối</button>}
          {actions.includes("approve") && <button className="btn primary" onClick={() => setModal("approve")}><Icon name="check" size={16} />Phê duyệt</button>}
          {actions.includes("sign") && <button className="btn primary" onClick={() => setModal("sign")}><Icon name="sign" size={16} />Ký số</button>}
          {actions.includes("publish") && <button className="btn primary" onClick={() => setModal("publish")}><Icon name="send" size={16} />Phát hành</button>}
          {actions.includes("resubmit") && <button className="btn primary" onClick={() => setModal("resubmit")}><Icon name="send" size={16} />Trình lại</button>}
          {allowed.length > 0 && actions.length === 0 && onRemind && <button className="btn ghost" onClick={() => onRemind(doc.id)}><Icon name="bell" size={16} />Nhắc việc</button>}
        </div>
      </div>

      {allowed.length > 0 && actions.length === 0 && cur && (
        <div className="doc-banner info"><Icon name="shield" size={18} /><div><b>Bước "{cur.name}" thuộc quyền của {cur.who}</b><span>Bạn đang đăng nhập là {user?.name} · {user?.role}. Đăng nhập bằng tài khoản được gán để thực hiện bước này, hoặc bấm “Nhắc việc”.</span></div></div>
      )}

      {doc.returned && (
        <div className="doc-banner warn"><Icon name="refresh" size={18} /><div><b>Yêu cầu chỉnh sửa tại bước "{doc.returned.step}"</b><span>{doc.returned.by} · {doc.returned.time} · "{doc.returned.note}"</span></div></div>
      )}
      {rejected && (
        <div className="doc-banner danger"><Icon name="x" size={18} /><div><b>Văn bản bị từ chối tại bước "{rejected.name}"</b><span>{rejected.who} · {rejected.time}{rejected.note ? ` · "${rejected.note}"` : ""}</span></div></div>
      )}

      <div className="detail-grid">
        <div>
          <Card pad={false}>
            <div className="tabs-line">
              {[["info", "Thông tin"], ["content", "Nội dung"], ["files", "Tài liệu"], ["history", "Lịch sử"]].map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
            </div>
            <div className="card-body">
              {tab === "info" && (
                <dl className="dl">
                  <dt>Mã văn bản</dt><dd>{doc.id}</dd>
                  <dt>Loại văn bản</dt><dd>{doc.type}</dd>
                  <dt>Ngày tạo</dt><dd>{doc.date}</dd>
                  <dt>Người / nguồn tạo</dt><dd>{doc.creator}</dd>
                  <dt>Đơn vị xử lý</dt><dd>{doc.dept}</dd>
                  <dt>Độ ưu tiên</dt><dd><span className={`prio ${doc.priority === "Cao" ? "hi" : ""}`}>{doc.priority}</span></dd>
                  <dt>Hạn xử lý</dt><dd>{doc.deadline}</dd>
                  {doc.amount && <><dt>Giá trị</dt><dd className="strong">{doc.amount}</dd></>}
                  <dt>Workflow áp dụng</dt><dd>{doc.workflowName || "Theo cấu hình"}</dd>
                  <dt>Trạng thái</dt><dd><Badge status={doc.status} /></dd>
                </dl>
              )}
              {tab === "content" && (
                <div className="content-preview">
                  <h4>Trích yếu</h4><p>{doc.title}</p>
                  <h4>Nội dung tóm tắt</h4><p>{doc.summary}</p>
                  <div className="paper">
                    <p className="center"><b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br />Độc lập – Tự do – Hạnh phúc</p>
                    <p><b>Số: {doc.id.replace("VB-", "")}/{doc.type === "Hợp đồng" ? "HĐ" : doc.type === "Quyết định" ? "QĐ" : "CV"}</b></p>
                    <p className="center"><b>{doc.title.toUpperCase()}</b></p>
                    <p>{doc.summary}</p>
                    <p className="muted">(Nội dung mô phỏng để xem trước giao diện)</p>
                  </div>
                </div>
              )}
              {tab === "files" && (
                <ul className="files">
                  <li><Icon name="file" /><div><b>{doc.id}.pdf</b><small>2.4 MB · Bản chính</small></div><button className="icon-btn" title="Xem"><Icon name="eye" size={16} /></button><button className="icon-btn" title="Tải xuống"><Icon name="download" size={16} /></button></li>
                  <li><Icon name="file" /><div><b>Phu-luc-dinh-kem.docx</b><small>318 KB · Phụ lục</small></div><button className="icon-btn" title="Xem"><Icon name="eye" size={16} /></button><button className="icon-btn" title="Tải xuống"><Icon name="download" size={16} /></button></li>
                  <li className="drop"><Icon name="upload" /> Kéo thả hoặc <button className="link">chọn file</button> để đính kèm thêm</li>
                </ul>
              )}
              {tab === "history" && (
                <ul className="history">
                  {doc.steps.filter((s) => s.state !== "wait").slice().reverse().map((s, i) => (
                    <li key={i}><Avatar name={s.who} size={28} /><div><b>{s.who}</b> · {s.name}<small>{s.time || "Đang xử lý"}{s.note && <> · <i>"{s.note}"</i></>}</small></div><Badge tone={s.state === "rejected" ? "danger" : s.state === "current" ? "info" : "ok"}>{s.state === "rejected" ? "Từ chối" : s.state === "current" ? "Đang xử lý" : DONE_LABEL[s.kind] || "Hoàn thành"}</Badge></li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card title={<span className="with-ic"><Icon name="ai" size={18} />Phân tích của AI Agent</span>} action={analyzing ? <span className="ai-running sm"><span className="spinner" />Đang phân tích</span> : <span className="conf">Độ tin cậy {doc.ai.confidence}%</span>}>
            <div className="ai-grid">
              <div><small>Loại tài liệu</small><b>{doc.ai.type}</b></div>
              <div><small>Phòng ban đề xuất</small><b>{doc.ai.dept}</b></div>
              <div className="span2"><small>Workflow đề xuất</small><b>{doc.ai.workflow}</b></div>
            </div>
            <h4 className="sub">Thông tin trích xuất</h4>
            <div className="chips">{doc.ai.fields.map(([k, v]) => <span key={k} className="chip"><small>{k}</small>{v}</span>)}</div>
            <h4 className="sub">Tóm tắt</h4>
            <p className="ai-summary">{doc.summary}</p>
            <p className="muted small">AI chỉ đề xuất. Luồng phê duyệt thực tế do cấu hình workflow "{doc.workflowName || "Theo cấu hình"}" quyết định, người có thẩm quyền ra quyết định cuối cùng.</p>
          </Card>
        </div>

        <div>
          <Card title="Quy trình phê duyệt" action={<Badge status={doc.status} />}>
            <ul className="wf">
              {doc.steps.map((s, i) => (
                <li key={i} className={s.state}>
                  <span className="wf-dot">
                    {s.state === "done" ? <Icon name="check" size={12} />
                      : s.state === "rejected" ? <Icon name="x" size={12} />
                      : <Icon name={KIND_ICON[s.kind] || "clock"} size={12} />}
                    {s.state === "current" && <i className="wf-pulse" />}
                  </span>
                  <div className="wf-body">
                    <div className="wf-top"><b>{s.name}</b><Badge tone={s.state === "done" ? "ok" : s.state === "current" ? (doc.returned ? "orange" : "info") : s.state === "rejected" ? "danger" : "muted"}>{s.state === "done" ? DONE_LABEL[s.kind] || "Hoàn thành" : s.state === "current" ? (doc.returned ? "Chờ chỉnh sửa" : "Đang xử lý") : s.state === "rejected" ? "Từ chối" : "Chờ"}</Badge></div>
                    <small>{s.who}{s.time && ` · ${s.time}`}</small>
                    {s.note && <div className="wf-note">"{s.note}"</div>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="muted small">Hạn xử lý: {doc.deadline}</div>
          </Card>
          <Card title="Đồng bộ hệ thống nguồn">
            {SYNC_SOURCES.includes(doc.source) ? (
              <ul className="sync">
                <li><span>Hệ thống</span><b>{doc.source}</b></li>
                <li><span>Mã tham chiếu</span><b>{extRef || "—"}</b></li>
                <li><span>Kênh</span><b>REST API + Webhook</b></li>
                <li><span>Trạng thái đã đẩy</span><b className={doc.sync ? "ok-text" : ""}>{doc.sync ? doc.sync.status : "Chưa đồng bộ (chờ hoàn tất)"}</b></li>
                <li><span>Lần đồng bộ cuối</span><b>{doc.sync?.time || "—"}</b></li>
              </ul>
            ) : doc.source === "Email" ? (
              <p className="muted small">Văn bản nhận qua Email connector, không cần đồng bộ ngược về hệ thống nguồn.</p>
            ) : (
              <p className="muted small">Văn bản tạo trực tiếp trên DCMS, không có hệ thống nguồn cần đồng bộ.</p>
            )}
          </Card>
        </div>
      </div>

      {m && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{m.title}</h3>
            <p className="muted">{doc.id} · {doc.title}{cur ? ` · Bước: ${cur.name}` : ""}</p>
            {modal === "sign" ? (
              <div className="sign-box"><Icon name="shield" size={28} /><div><b>Chứng thư số: {cur?.who || "Lê Văn D"} (VNPT-CA)</b><small>Hiệu lực đến 31/12/2027 · Tài liệu sẽ được băm SHA-256 và ký</small></div></div>
            ) : (
              <label className="field"><span>Ý kiến {m.need && "(bắt buộc)"}</span><textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder={m.ph} autoFocus /></label>
            )}
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setModal(null)}>Hủy</button>
              <button className={`btn ${modal === "reject" ? "danger" : "primary"}`} disabled={m.need && !note.trim()} onClick={submit}>{m.btn}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
