import { useState } from "react";
import { Icon, Badge, Card, Avatar } from "../ui";
import { USERS, ROLES, WORKFLOWS, LOGS, INTEGRATIONS } from "../mock";

export function Users() {
  const [q, setQ] = useState("");
  const list = USERS.filter((u) => (u.name + u.email + u.dept).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page">
      <div className="page-head"><div><h1>Người dùng</h1><p className="muted">{USERS.length} tài khoản</p></div><button className="btn primary"><Icon name="plus" size={16} />Thêm người dùng</button></div>
      <Card pad={false}>
        <div className="toolbar"><label className="search"><Icon name="search" size={16} /><input placeholder="Tìm theo tên, email, phòng ban…" value={q} onChange={(e) => setQ(e.target.value)} /></label></div>
        <table className="tbl">
          <thead><tr><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Phòng ban</th><th>Trạng thái</th><th /></tr></thead>
          <tbody>{list.map((u) => (
            <tr key={u.email}><td><span className="with-ic"><Avatar name={u.name} size={30} /><b>{u.name}</b></span></td><td className="muted">{u.email}</td><td><span className="src">{u.role}</span></td><td className="muted">{u.dept}</td><td><Badge tone={u.active ? "ok" : "muted"}>{u.active ? "Hoạt động" : "Khóa"}</Badge></td><td><button className="icon-btn"><Icon name="more" size={16} /></button></td></tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

export function Roles() {
  return (
    <div className="page">
      <div className="page-head"><div><h1>Vai trò & Quyền</h1><p className="muted">Phân quyền theo mô hình RBAC.</p></div><button className="btn primary"><Icon name="plus" size={16} />Thêm vai trò</button></div>
      <div className="sum-grid">
        {ROLES.map((r) => (
          <Card key={r.name} title={<span className="with-ic"><Icon name="shield" size={18} />{r.name}</span>} action={<span className="muted small">{r.users} người dùng</span>}>
            <ul className="perms">{r.perms.map((p) => <li key={p}><Icon name="check" size={14} />{p}</li>)}</ul>
            <button className="link">Chỉnh sửa quyền <Icon name="chevron" size={13} /></button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function WorkflowConfig() {
  const [sel, setSel] = useState(0);
  const w = WORKFLOWS[sel];
  return (
    <div className="page">
      <div className="page-head"><div><h1>Cấu hình workflow</h1><p className="muted">Định nghĩa luồng phê duyệt theo loại tài liệu, giá trị và phòng ban. Workflow này quyết định luồng cuối cùng, AI chỉ đề xuất.</p></div><button className="btn primary"><Icon name="plus" size={16} />Tạo workflow</button></div>
      <div className="detail-grid">
        <Card title="Danh sách workflow" pad={false}>
          <ul className="pick">{WORKFLOWS.map((x, i) => <li key={x.name} className={i === sel ? "on" : ""} onClick={() => setSel(i)}><Icon name="flow" /><div><b>{x.name}</b><small>{x.type} · {x.steps.length} bước · {x.mode}</small></div><Badge tone={x.active ? "ok" : "muted"}>{x.active ? "Bật" : "Tắt"}</Badge></li>)}</ul>
        </Card>
        <Card title={w.name} action={<div className="page-actions"><button className="btn ghost sm">Nhân bản</button><button className="btn sm">Chỉnh sửa</button></div>}>
          <dl className="dl"><dt>Áp dụng cho</dt><dd>{w.type}</dd><dt>Chế độ</dt><dd>{w.mode}</dd><dt>Trạng thái</dt><dd><Badge tone={w.active ? "ok" : "muted"}>{w.active ? "Đang áp dụng" : "Tạm tắt"}</Badge></dd></dl>
          <h4 className="sub">Các bước phê duyệt</h4>
          <div className="wf-builder">
            <div className="wfb start">Tiếp nhận + AI phân tích</div>
            {w.steps.map((s, i) => <div key={s} className="wfb-wrap"><span className="arrow">→</span><div className="wfb"><small>Bước {i + 1}</small><b>{s}</b></div></div>)}
            <span className="arrow">→</span><div className="wfb end">Hoàn tất & đồng bộ</div>
          </div>
          <h4 className="sub">Quy tắc</h4>
          <ul className="tips"><li>Nhắc hạn sau 24 giờ không xử lý, leo thang sau 48 giờ.</li><li>Từ chối ở bất kỳ bước nào sẽ trả về người tạo kèm lý do.</li><li>Ký số bắt buộc với hợp đồng và quyết định.</li></ul>
        </Card>
      </div>
    </div>
  );
}

export function Logs({ logs = LOGS }) {
  const [q, setQ] = useState("");
  const list = logs.filter((l) => (l.actor + l.action + l.target + l.detail).toLowerCase().includes(q.toLowerCase()));
  const TONE = { REJECT: "danger", REVISE: "orange", SIGN: "ok", APPROVE: "ok", PUBLISH: "ok", COMPLETE: "ok", WEBHOOK_IN: "purple", WEBHOOK_OUT: "purple", INGEST_EMAIL: "purple", REMIND: "muted", HEALTH_CHECK: "muted" };
  const tone = (a) => TONE[a] || "info";
  return (
    <div className="page">
      <div className="page-head"><div><h1>Nhật ký hệ thống</h1><p className="muted">Audit log ghi nhận mọi thao tác của người dùng, AI Agent và hệ thống · {logs.length} bản ghi</p></div><button className="btn ghost"><Icon name="download" size={16} />Xuất log</button></div>
      <Card pad={false}>
        <div className="toolbar"><label className="search"><Icon name="search" size={16} /><input placeholder="Tìm theo người thực hiện, hành động, đối tượng…" value={q} onChange={(e) => setQ(e.target.value)} /></label></div>
        <table className="tbl mono">
          <thead><tr><th>Thời gian</th><th>Người thực hiện</th><th>Hành động</th><th>Đối tượng</th><th>Chi tiết</th></tr></thead>
          <tbody>{list.map((l, i) => <tr key={i}><td className="muted">{l.time}</td><td><b>{l.actor}</b></td><td><Badge tone={tone(l.action)}>{l.action}</Badge></td><td>{l.target}</td><td className="muted">{l.detail}</td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}

export function Integrations({ integrations = INTEGRATIONS, onIngest, onCheck }) {
  return (
    <div className="page">
      <div className="page-head"><div><h1>Tích hợp hệ thống</h1><p className="muted">Integration Layer kết nối DCMS với các hệ thống quản trị đang vận hành. Bấm "Nhận tài liệu mẫu" để mô phỏng hệ thống nguồn đẩy văn bản vào DCMS qua API / Webhook.</p></div><button className="btn primary"><Icon name="plus" size={16} />Thêm kết nối</button></div>
      <div className="sum-grid">
        {integrations.map((x) => (
          <Card key={x.name} title={<span className="with-ic"><Icon name="plug" size={18} />{x.name}</span>} action={<Badge tone="ok">{x.status}</Badge>}>
            <dl className="dl compact"><dt>Hệ thống</dt><dd>{x.vendor}</dd><dt>Phương thức</dt><dd>{x.mode}</dd><dt>Tài liệu đã nhận</dt><dd>{x.docs}</dd><dt>Đồng bộ cuối</dt><dd>{x.last}</dd></dl>
            <div className="page-actions"><button className="btn primary sm" onClick={() => onIngest && onIngest(x.name)}><Icon name="download" size={14} />Nhận tài liệu mẫu</button><button className="btn ghost sm" onClick={() => onCheck && onCheck(x.name)}><Icon name="refresh" size={14} />Kiểm tra</button></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
