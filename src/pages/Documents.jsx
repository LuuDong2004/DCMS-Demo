import { useState } from "react";
import { Icon, Badge, TypeTag, Card, Empty } from "../ui";
import { STATUS, TYPES } from "../mock";

function exportCsv(list, title) {
  const head = ["Số văn bản", "Trích yếu", "Loại", "Nguồn", "Phòng ban", "Ưu tiên", "Trạng thái", "Ngày tạo", "Hạn xử lý"];
  const rows = list.map((d) => [d.id, d.title, d.type, d.source, d.dept, d.priority, STATUS[d.status]?.label || d.status, d.date, d.deadline]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = "﻿" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = `dcms-${title.toLowerCase().replace(/\s+/g, "-")}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function Documents({ docs, go, filter, title, subtitle, initialQ = "" }) {
  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [sel, setSel] = useState([]);

  let list = docs.filter(filter || (() => true));
  if (q) list = list.filter((d) => (d.id + " " + d.title + " " + d.type + " " + d.creator + " " + d.dept + " " + d.source).toLowerCase().includes(q.toLowerCase()));
  if (type) list = list.filter((d) => d.type === type);
  if (status) list = list.filter((d) => d.status === status);

  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="page">
      <div className="page-head">
        <div><h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}<p className="muted">{list.length} văn bản{q && <> · kết quả cho "<b>{q}</b>" <button className="link" onClick={() => setQ("")}>Xóa lọc</button></>}</p></div>
        <div className="page-actions">
          <button className="btn ghost" onClick={() => exportCsv(list, title)} disabled={!list.length}><Icon name="download" size={16} />Xuất Excel</button>
          <button className="btn primary" onClick={() => go("create")}><Icon name="plus" size={16} />Tạo văn bản</button>
        </div>
      </div>
      <Card pad={false}>
        <div className="toolbar">
          <label className="search"><Icon name="search" size={16} /><input placeholder="Tìm theo số văn bản, trích yếu, người gửi…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
          <select value={type} onChange={(e) => setType(e.target.value)}><option value="">Tất cả loại</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tất cả trạng thái</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
          {sel.length > 0 && <span className="sel-info">{sel.length} đã chọn · <button className="link" onClick={() => setSel([])}>Bỏ chọn</button></span>}
        </div>
        {list.length === 0 ? <Empty text="Không có văn bản phù hợp" /> : (
          <table className="tbl">
            <thead><tr><th style={{ width: 36 }}><input type="checkbox" checked={sel.length === list.length && list.length > 0} onChange={(e) => setSel(e.target.checked ? list.map((d) => d.id) : [])} /></th><th>Số văn bản</th><th>Trích yếu</th><th>Loại</th><th>Nguồn</th><th>Phòng ban</th><th>Ưu tiên</th><th>Trạng thái</th><th>Hạn xử lý</th><th /></tr></thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id} className={sel.includes(d.id) ? "selected" : ""} onClick={() => go("doc", { id: d.id })}>
                  <td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={sel.includes(d.id)} onChange={() => toggle(d.id)} /></td>
                  <td><span className="doc-id"><Icon name="file" size={15} />{d.id}</span></td>
                  <td className="strong">{d.title}<small className="muted block">{d.creator} · {d.date}</small></td>
                  <td><TypeTag type={d.type} /></td>
                  <td><span className="src">{d.source}</span></td>
                  <td className="muted">{d.dept}</td>
                  <td><span className={`prio ${d.priority === "Cao" ? "hi" : ""}`}>{d.priority}</span></td>
                  <td><Badge status={d.status} /></td>
                  <td className="muted">{d.deadline}</td>
                  <td><button className="icon-btn" title="Xem chi tiết" onClick={(e) => { e.stopPropagation(); go("doc", { id: d.id }); }}><Icon name="eye" size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="pager"><span className="muted">Hiển thị {list.length ? 1 : 0}–{list.length} / {list.length}</span><div><button className="btn ghost sm" disabled>‹</button><button className="btn sm primary">1</button><button className="btn ghost sm" disabled>›</button></div></div>
      </Card>
    </div>
  );
}
