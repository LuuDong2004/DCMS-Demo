import { useState } from "react";
import { Icon, Badge, TypeTag, Card, Avatar } from "../ui";

export default function DocumentDetail({ doc, go, onAction }) {
  const [tab, setTab] = useState("info");
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState("");
  if (!doc) return <div className="page"><p>Không tìm thấy văn bản.</p></div>;

  const canAct = ["pending", "processing", "signing"].includes(doc.status);
  const submit = () => { onAction(doc.id, modal, note); setModal(null); setNote(""); };

  return (
    <div className="page">
      <button className="link back" onClick={() => go("docs")}><Icon name="back" size={16} />Quay lại danh sách</button>
      <div className="page-head">
        <div>
          <div className="crumbs"><span>{doc.dir === "in" ? "Văn bản đến" : "Văn bản đi"}</span><Icon name="chevron" size={12} /><span>{doc.id}</span></div>
          <h1>{doc.title}</h1>
          <div className="meta-line"><TypeTag type={doc.type} /><Badge status={doc.status} /><span className="src">Nguồn: {doc.source}</span><span className="muted">Tạo {doc.date} · {doc.creator}</span></div>
        </div>
        {canAct && (
          <div className="page-actions">
            <button className="btn ghost" onClick={() => setModal("revise")}><Icon name="refresh" size={16} />Yêu cầu chỉnh sửa</button>
            <button className="btn danger" onClick={() => setModal("reject")}><Icon name="x" size={16} />Từ chối</button>
            {doc.status === "signing"
              ? <button className="btn primary" onClick={() => setModal("sign")}><Icon name="sign" size={16} />Ký số</button>
              : <button className="btn primary" onClick={() => setModal("approve")}><Icon name="check" size={16} />Phê duyệt</button>}
          </div>
        )}
      </div>

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
                  <dt>Trạng thái</dt><dd><Badge status={doc.status} /></dd>
                </dl>
              )}
              {tab === "content" && (
                <div className="content-preview">
                  <h4>Trích yếu</h4><p>{doc.title}</p>
                  <h4>Nội dung tóm tắt</h4><p>{doc.summary}</p>
                  <div className="paper">
                    <p className="center"><b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br />Độc lập – Tự do – Hạnh phúc</p>
                    <p><b>Số: {doc.id.replace("VB-", "")}/{doc.type === "Hợp đồng" ? "HĐ" : "CV"}</b></p>
                    <p className="center"><b>{doc.title.toUpperCase()}</b></p>
                    <p>{doc.summary}</p>
                    <p className="muted">(Nội dung mô phỏng để xem trước giao diện)</p>
                  </div>
                </div>
              )}
              {tab === "files" && (
                <ul className="files">
                  <li><Icon name="file" /><div><b>{doc.id}.pdf</b><small>2.4 MB · Bản chính</small></div><button className="icon-btn"><Icon name="eye" size={16} /></button><button className="icon-btn"><Icon name="upload" size={16} /></button></li>
                  <li><Icon name="file" /><div><b>Phu-luc-dinh-kem.docx</b><small>318 KB · Phụ lục</small></div><button className="icon-btn"><Icon name="eye" size={16} /></button><button className="icon-btn"><Icon name="upload" size={16} /></button></li>
                  <li className="drop"><Icon name="upload" /> Kéo thả hoặc <button className="link">chọn file</button> để đính kèm thêm</li>
                </ul>
              )}
              {tab === "history" && (
                <ul className="history">
                  {doc.steps.filter((s) => s.state !== "wait").slice().reverse().map((s, i) => (
                    <li key={i}><Avatar name={s.who} size={28} /><div><b>{s.who}</b> · {s.name}<small>{s.time || "Đang xử lý"}{s.note && <> · <i>"{s.note}"</i></>}</small></div><Badge tone={s.state === "rejected" ? "danger" : s.state === "current" ? "info" : "ok"}>{s.state === "rejected" ? "Từ chối" : s.state === "current" ? "Đang xử lý" : "Hoàn thành"}</Badge></li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card title={<span className="with-ic"><Icon name="ai" size={18} />Phân tích của AI Agent</span>} action={<span className="conf">Độ tin cậy {doc.ai.confidence}%</span>}>
            <div className="ai-grid">
              <div><small>Loại tài liệu</small><b>{doc.ai.type}</b></div>
              <div><small>Phòng ban đề xuất</small><b>{doc.ai.dept}</b></div>
              <div className="span2"><small>Workflow đề xuất</small><b>{doc.ai.workflow}</b></div>
            </div>
            <h4 className="sub">Thông tin trích xuất</h4>
            <div className="chips">{doc.ai.fields.map(([k, v]) => <span key={k} className="chip"><small>{k}</small>{v}</span>)}</div>
            <h4 className="sub">Tóm tắt</h4>
            <p className="ai-summary">{doc.summary}</p>
            <div className="ai-actions"><button className="btn sm">Áp dụng đề xuất</button><button className="btn ghost sm">Chọn workflow khác</button><span className="muted small">AI chỉ đề xuất, quyết định cuối cùng thuộc người có thẩm quyền.</span></div>
          </Card>
        </div>

        <div>
          <Card title="Quy trình phê duyệt" action={<Badge status={doc.status} />}>
            <ul className="wf">
              {doc.steps.map((s, i) => (
                <li key={i} className={s.state}>
                  <span className="wf-dot">{s.state === "done" ? <Icon name="check" size={11} /> : s.state === "rejected" ? <Icon name="x" size={11} /> : i + 1}</span>
                  <div className="wf-body">
                    <div className="wf-top"><b>{s.name}</b><Badge tone={s.state === "done" ? "ok" : s.state === "current" ? "info" : s.state === "rejected" ? "danger" : "muted"}>{s.state === "done" ? "Đã duyệt" : s.state === "current" ? "Đang xử lý" : s.state === "rejected" ? "Từ chối" : "Chờ"}</Badge></div>
                    <small>{s.who}{s.time && ` · ${s.time}`}</small>
                    {s.note && <div className="wf-note">"{s.note}"</div>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="muted small">Dự kiến hoàn tất: {doc.deadline}</div>
          </Card>
          <Card title="Đồng bộ hệ thống nguồn">
            {doc.source === "Nhập tay" || doc.source === "Email" ? <p className="muted small">Văn bản tạo trực tiếp / từ email, không có hệ thống nguồn cần đồng bộ.</p> : (
              <ul className="sync">
                <li><span>Hệ thống</span><b>{doc.source}</b></li>
                <li><span>External reference</span><b>{doc.ai.fields.find(([k]) => k.startsWith("Mã"))?.[1] || "—"}</b></li>
                <li><span>Trạng thái đã đẩy</span><b>{doc.status === "published" || doc.status === "done" ? "APPROVED / SIGNED" : "Chưa (chờ hoàn tất)"}</b></li>
                <li><span>Lần đồng bộ cuối</span><b>{doc.steps.find((s) => s.state === "done")?.time}</b></li>
              </ul>
            )}
          </Card>
        </div>
      </div>

      {modal && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{{ approve: "Phê duyệt văn bản", reject: "Từ chối văn bản", revise: "Yêu cầu chỉnh sửa", sign: "Ký số văn bản" }[modal]}</h3>
            <p className="muted">{doc.id} · {doc.title}</p>
            {modal === "sign" ? (
              <div className="sign-box"><Icon name="shield" size={28} /><div><b>Chứng thư số: Lê Văn D (VNPT-CA)</b><small>Hiệu lực đến 31/12/2026 · Tài liệu sẽ được băm SHA-256 và ký</small></div></div>
            ) : (
              <label className="field"><span>Ý kiến {modal !== "approve" && "(bắt buộc)"}</span><textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ý kiến xử lý…" /></label>
            )}
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setModal(null)}>Hủy</button>
              <button className={`btn ${modal === "reject" ? "danger" : "primary"}`} disabled={modal !== "approve" && modal !== "sign" && !note} onClick={submit}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
