import { useState } from "react";
import { Icon, Logo, Avatar } from "../ui";
import { ACCOUNTS, DEMO_PASSWORD, ROLE_CAPS } from "../accounts";

const CAP_LABEL = { create: "Soạn văn bản", approve: "Phê duyệt", sign: "Ký số", publish: "Phát hành", admin: "Quản trị", all: "Xem toàn hệ thống" };

export default function Login({ onLogin, go, theme, onToggleTheme }) {
  const [id, setId] = useState(ACCOUNTS.at(-1).id);
  const [pw, setPw] = useState(DEMO_PASSWORD);
  const [err, setErr] = useState("");
  const acc = ACCOUNTS.find((a) => a.id === id);

  const submit = (e) => {
    e.preventDefault();
    if (pw !== DEMO_PASSWORD) { setErr("Mật khẩu không đúng. Bản demo dùng mật khẩu 123456."); return; }
    setErr("");
    onLogin(acc);
  };

  return (
    <div className="lgn">
      <aside className="lg-side">
        <div className="lg-brand"><Logo size={30} /><b>DCMS</b><span className="lp-by">by <em>LVĐ</em></span></div>
        <h1>Hệ thống AI Điều phối và Quản lý Tài liệu Doanh nghiệp</h1>
        <p>Chọn một tài khoản nhân sự để kiểm thử đúng vai trò trong luồng phê duyệt: nhân viên soạn văn bản, trưởng phòng và pháp chế phê duyệt, giám đốc ký số, văn thư phát hành.</p>
        <ul className="lg-ticks">
          <li><Icon name="done" size={17} />Mỗi vai trò chỉ thấy nút hành động thuộc quyền của mình</li>
          <li><Icon name="done" size={17} />Hàng đợi “Cần xử lý” lọc theo người đang đăng nhập</li>
          <li><Icon name="done" size={17} />Mọi thao tác đều ghi nhật ký kèm tên người thực hiện</li>
        </ul>
        <div className="lg-side-foot">
          <span><i />Bản demo 1.0.0</span>
          <button className="link" onClick={() => go("landing")}>Xem trang giới thiệu<Icon name="chevron" size={15} /></button>
        </div>
      </aside>

      <main className="lg-main">
        <div className="lg-top">
          <button className="lp-ic" onClick={onToggleTheme} title="Đổi giao diện" aria-label="Đổi giao diện">
            <span key={theme} className="theme-ic"><Icon name={theme === "dark" ? "sun" : "moon"} /></span>
          </button>
        </div>

        <form className="lg-card" onSubmit={submit}>
          <h2>Đăng nhập hệ thống</h2>
          <p className="lg-sub">Chọn tài khoản nhân sự bên dưới. Mật khẩu chung cho bản demo: <code>123456</code></p>

          <div className="lg-accs">
            {ACCOUNTS.map((a) => (
              <button type="button" key={a.id} className={`lg-acc ${a.id === id ? "on" : ""}`} style={{ "--c": a.tone }} onClick={() => { setId(a.id); setErr(""); }}>
                <Avatar name={a.name} size={36} />
                <span className="lg-acc-txt">
                  <b>{a.name}</b>
                  <small>{a.title}</small>
                </span>
                <em className="lg-acc-role">{a.role}</em>
                {a.id === id && <span className="lg-acc-tick"><Icon name="check" size={14} /></span>}
              </button>
            ))}
          </div>

          <div className="lg-accs-hint"><Icon name="down" size={13} />Cuộn trong danh sách để xem đủ {ACCOUNTS.length} tài khoản</div>

          <div className="lg-picked" style={{ "--c": acc.tone }}>
            <div className="lg-picked-h"><Icon name="shield" size={16} /><b>{acc.role}</b><span>{acc.dept}</span></div>
            <p>{acc.note}</p>
            <div className="lg-caps">
              {(ROLE_CAPS[acc.role] || []).map((c) => <span key={c}>{CAP_LABEL[c] || c}</span>)}
            </div>
          </div>

          <label className="field lg-pw">
            <span>Mật khẩu</span>
            <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} placeholder="123456" autoComplete="current-password" />
          </label>
          {err && <div className="lg-err"><Icon name="warn" size={15} />{err}</div>}

          <button className="btn primary lg-submit" type="submit"><Icon name="check" size={16} />Đăng nhập với tài khoản {acc.name}</button>
          <p className="lg-hint">Đây là bản demo: không có máy chủ xác thực, dữ liệu nghiệp vụ là dữ liệu mô phỏng và trở về ban đầu khi tải lại trang.</p>
        </form>
      </main>
    </div>
  );
}
