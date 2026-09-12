import { Icon, Card, Avatar, Badge, TypeTag } from "../ui";
import { ROLE_CAPS, isMine, currentStep } from "../accounts";

const CAP = {
  create: ["plus", "Soạn và trình văn bản"],
  approve: ["check", "Phê duyệt / trả về / từ chối"],
  sign: ["sign", "Ký số văn bản"],
  publish: ["send", "Cấp số và phát hành"],
  admin: ["shield", "Quản trị người dùng, workflow, tích hợp"],
  all: ["eye", "Xem toàn bộ văn bản của hệ thống"],
};

export default function Profile({ user, docs, logs, go, onLogout, onSwitch }) {
  const caps = ROLE_CAPS[user.role] || [];
  const mine = docs.filter((d) => isMine(d, user));
  const created = docs.filter((d) => d.creator === user.name);
  const handled = docs.filter((d) => d.steps.some((s) => s.state === "done" && String(s.who || "").includes(user.name) && ["approve", "sign", "publish"].includes(s.kind)));
  const acts = logs.filter((l) => l.actor === user.name).slice(0, 8);

  return (
    <div className="page pf">
      <div className="page-head">
        <div>
          <div className="crumbs"><span>Tài khoản</span><Icon name="chevron" size={12} /><span>Trang cá nhân</span></div>
          <h1>Trang cá nhân</h1>
          <p className="muted">Thông tin nhân sự, quyền hạn trong quy trình và công việc đang chờ bạn.</p>
        </div>
        <div className="page-actions">
          <button className="btn ghost" onClick={onSwitch}><Icon name="users" size={16} />Đổi tài khoản</button>
          <button className="btn danger" onClick={onLogout}><Icon name="x" size={16} />Đăng xuất</button>
        </div>
      </div>

      <div className="pf-grid">
        <div>
          <Card className="pf-card">
            <div className="pf-id">
              <Avatar name={user.name} size={72} />
              <div>
                <h2>{user.name}</h2>
                <p className="pf-title">{user.title}</p>
                <div className="meta-line">
                  <Badge tone="info">{user.role}</Badge>
                  <span className="src"><Icon name="building" size={13} />{user.dept}</span>
                </div>
              </div>
            </div>
            <div className="pf-rows">
              <div><span>Mã tài khoản</span><b>{user.id}</b></div>
              <div><span>Email</span><b>{user.email}</b></div>
              <div><span>Điện thoại</span><b>{user.phone}</b></div>
              <div><span>Đơn vị</span><b>{user.dept}</b></div>
              <div><span>Chức danh</span><b>{user.title}</b></div>
              <div><span>Trạng thái</span><b className="ok-txt"><i className="dot" />Đang hoạt động</b></div>
            </div>
          </Card>

          <Card title="Quyền hạn theo vai trò">
            <ul className="pf-caps">
              {caps.map((c) => (
                <li key={c}><span className="pf-cap-ic"><Icon name={CAP[c]?.[0] || "check"} size={15} /></span>{CAP[c]?.[1] || c}</li>
              ))}
            </ul>
            <p className="small muted" style={{ marginTop: 10 }}>Ở các bước không thuộc quyền của bạn, hệ thống chỉ cho xem và nhắc việc.</p>
          </Card>
        </div>

        <div>
          <div className="pf-kpis">
            <button className="pf-kpi" onClick={() => go("todo")}>
              <span className="pf-kpi-ic hot"><Icon name="clock" size={18} /></span>
              <b>{mine.length}</b><small>Đang chờ bạn xử lý</small>
            </button>
            <div className="pf-kpi">
              <span className="pf-kpi-ic ok"><Icon name="check" size={18} /></span>
              <b>{handled.length}</b><small>Bước bạn đã xử lý</small>
            </div>
            <div className="pf-kpi">
              <span className="pf-kpi-ic blue"><Icon name="docs" size={18} /></span>
              <b>{created.length}</b><small>Văn bản bạn tạo</small>
            </div>
          </div>

          <Card title="Văn bản đang chờ bạn" action={<button className="link" onClick={() => go("todo")}>Xem tất cả<Icon name="chevron" size={14} /></button>}>
            {mine.length === 0 ? (
              <div className="empty"><Icon name="check" size={34} /><p>Không có văn bản nào đang chờ bạn xử lý.</p></div>
            ) : (
              <ul className="pf-list">
                {mine.slice(0, 6).map((d) => (
                  <li key={d.id} onClick={() => go("doc", { id: d.id })}>
                    <div className="pf-list-main">
                      <b>{d.title}</b>
                      <small><span className="doc-id">{d.id}</span> · {currentStep(d)?.name} · Hạn {d.deadline}</small>
                    </div>
                    <TypeTag type={d.type} />
                    <Badge status={d.status} />
                    <Icon name="chevron" size={15} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Hoạt động của bạn">
            {acts.length === 0 ? (
              <div className="empty"><Icon name="log" size={34} /><p>Chưa có thao tác nào trong phiên làm việc này.</p></div>
            ) : (
              <ul className="pf-acts">
                {acts.map((l, i) => (
                  <li key={i}>
                    <span className="pf-act-tag">{l.action}</span>
                    <div><b>{l.target}</b><small>{l.detail}</small></div>
                    <em>{l.time}</em>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
