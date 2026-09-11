import { useState } from "react";
import { Icon, Badge, TypeTag, Card, Empty } from "../ui";
import { STATUS, TYPES } from "../mock";

export default function Documents({ docs, go, filter, title }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [sel, setSel] = useState([]);

  let list = docs.filter(filter || (() => true));
  if (q) list = list.filter((d) => (d.id + d.title + d.creator).toLowerCase().includes(q.toLowerCase()));
  if (type) list = list.filter((d) => d.type === type);
  if (status) list = list.filter((d) => d.status === status);

  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="page">
      <div className="page-head">
        <div><h1>{title}</h1><p className="muted">{list.length} văn bản</p></div>
        <div className="page-actions">
          <button className="btn ghost"><Icon name="download" size={16} />Xuất Excel</button>
          <button className="btn primary" onClick={() => go("create")}><Icon name="plus" size={16} />Tạo văn bản</button>
        </div>
      </div>
      <Card pad={false}>
        <div className="toolbar">
          <label className="search"><Icon name="search" size={16} /><input placeholder="Tìm theo số văn bản, trích yếu, người gửi…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
          <select value={type} onChange={(e) => setType(e.target.value)}><option value="">Tất cả loại</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tất cả trạng thái</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
          <button className="btn ghost"><Icon name="filter" size={15} />Bộ lọc</button>
          {sel.length > 0 && <span className="sel-info">{sel.length} đã chọn · <button className="link">Chuyển xử lý</button> · <button className="link">Lưu trữ</button></span>}
        </div>
        {list.length === 0 ? <Empty text="Không có văn bản phù hợp" /> : (
          <table className="tbl">
            <thead><tr><th style={{ width: 36 }}><input type="checkbox" onChange={(e) => setSel(e.target.checked ? list.map((d) => d.id) : [])} /></th><th>Số văn bản</th><th>Trích yếu</th><th>Loại</th><th>Nguồn</th><th>Phòng ban</th><th>Ưu tiên</th><th>Trạng thái</th><th>Hạn xử lý</th><th /></tr></thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id} className={sel.includes(d.id) ? "selected" : ""}>
                  <td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={sel.includes(d.id)} onChange={() => toggle(d.id)} /></td>
                  <td onClick={() => go("doc", { id: d.id })}><span className="doc-id"><Icon name="file" size={15} />{d.id}</span></td>
                  <td className="strong" onClick={() => go("doc", { id: d.id })}>{d.title}<small className="muted block">{d.creator} · {d.date}</small></td>
                  <td><TypeTag type={d.type} /></td>
                  <td><span className="src">{d.source}</span></td>
                  <td className="muted">{d.dept}</td>
                  <td><span className={`prio ${d.priority === "Cao" ? "hi" : ""}`}>{d.priority}</span></td>
                  <td><Badge status={d.status} /></td>
                  <td className="muted">{d.deadline}</td>
                  <td><button className="icon-btn" onClick={() => go("doc", { id: d.id })}><Icon name="eye" size={16} /></button><button className="icon-btn"><Icon name="more" size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="pager"><span className="muted">Hiển thị 1–{list.length} / {list.length}</span><div><button className="btn ghost sm" disabled>‹</button><button className="btn sm primary">1</button><button className="btn ghost sm" disabled>›</button></div></div>
      </Card>
    </div>
  );
}
