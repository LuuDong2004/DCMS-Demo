import { useState } from "react";
import { Icon, Badge, TypeTag, Card } from "../ui";

export function AIAnalyze({ docs, go }) {
  const [sel, setSel] = useState(docs[0]?.id);
  const d = docs.find((x) => x.id === sel);
  return (
    <div className="page">
      <div className="page-head"><div><h1>Phân tích văn bản</h1><p className="muted">AI Agent đọc nội dung (OCR + NLP), phân loại và trích xuất thông tin quan trọng.</p></div><button className="btn primary" onClick={() => go("create")}><Icon name="upload" size={16} />Phân tích file mới</button></div>
      <div className="detail-grid">
        <Card title="Văn bản đã phân tích" pad={false}>
          <ul className="pick">
            {docs.map((x) => <li key={x.id} className={x.id === sel ? "on" : ""} onClick={() => setSel(x.id)}><TypeTag type={x.type} /><div><b>{x.title}</b><small>{x.id} · {x.date}</small></div><span className="conf sm">{x.ai.confidence}%</span></li>)}
          </ul>
        </Card>
        {d && (
          <div>
            <Card title={<span className="with-ic"><Icon name="ai" size={18} />Kết quả phân tích · {d.id}</span>} action={<span className="conf">Độ tin cậy {d.ai.confidence}%</span>}>
              <div className="ai-grid"><div><small>Loại tài liệu</small><b>{d.ai.type}</b></div><div><small>Phòng ban đề xuất</small><b>{d.ai.dept}</b></div><div className="span2"><small>Workflow đề xuất</small><b>{d.ai.workflow}</b></div></div>
              <h4 className="sub">Thông tin trích xuất</h4>
              <table className="tbl compact"><tbody>{d.ai.fields.map(([k, v]) => <tr key={k}><td className="muted" style={{ width: 160 }}>{k}</td><td className="strong">{v}</td></tr>)}</tbody></table>
              <h4 className="sub">Tóm tắt</h4><p className="ai-summary">{d.summary}</p>
              <div className="ai-actions"><button className="btn sm" onClick={() => go("doc", { id: d.id })}>Mở văn bản</button><button className="btn ghost sm"><Icon name="refresh" size={14} />Phân tích lại</button></div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export function AISuggest({ docs, go }) {
  const list = docs.filter((d) => ["pending", "processing"].includes(d.status));
  return (
    <div className="page">
      <div className="page-head"><div><h1>Đề xuất xử lý</h1><p className="muted">Các văn bản AI đã đề xuất phòng ban / người xử lý, chờ người có thẩm quyền xác nhận.</p></div></div>
      <Card pad={false}>
        <table className="tbl">
          <thead><tr><th>Văn bản</th><th>Loại</th><th>AI đề xuất phòng ban</th><th>Workflow đề xuất</th><th>Độ tin cậy</th><th>Trạng thái</th><th /></tr></thead>
          <tbody>{list.map((d) => (
            <tr key={d.id}>
              <td><b>{d.title}</b><small className="muted block">{d.id}</small></td>
              <td><TypeTag type={d.type} /></td>
              <td className="strong">{d.ai.dept}</td>
              <td className="muted">{d.ai.workflow}</td>
              <td><div className="bar"><i style={{ width: d.ai.confidence + "%" }} /></div><small>{d.ai.confidence}%</small></td>
              <td><Badge status={d.status} /></td>
              <td><button className="btn sm" onClick={() => go("doc", { id: d.id })}>Xem xét</button></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

export function AISummary({ docs, go }) {
  return (
    <div className="page">
      <div className="page-head"><div><h1>Tóm tắt thông tin</h1><p className="muted">Bản tóm tắt ngắn giúp người duyệt nắm nhanh nội dung trước khi quyết định.</p></div></div>
      <div className="sum-grid">
        {docs.map((d) => (
          <Card key={d.id} title={<span><TypeTag type={d.type} /> {d.id}</span>} action={<Badge status={d.status} />}>
            <b>{d.title}</b>
            <p className="ai-summary">{d.summary}</p>
            <div className="chips">{d.ai.fields.slice(0, 3).map(([k, v]) => <span key={k} className="chip"><small>{k}</small>{v}</span>)}</div>
            <button className="link" onClick={() => go("doc", { id: d.id })}>Mở văn bản <Icon name="chevron" size={13} /></button>
          </Card>
        ))}
      </div>
    </div>
  );
}
