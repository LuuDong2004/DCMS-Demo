import { useEffect, useRef, useState } from "react";
import { Icon, Logo, Avatar } from "./ui";
import { DOCUMENTS, LOGS, INTEGRATIONS } from "./mock";
import { ACCOUNTS, findAccount, can, isMine, currentStep } from "./accounts";
import { normalize, advance, makeDoc, nextId, INGEST, nowStr, nowFull, guessType } from "./engine";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DocumentDetail from "./pages/DocumentDetail";
import CreateDocument from "./pages/CreateDocument";
import Workflow from "./pages/Workflow";
import WorkflowDetail from "./pages/WorkflowDetail";
import { AIAnalyze, AISuggest, AISummary } from "./pages/AIAgent";
import { Users, Roles, WorkflowConfig, Logs, Integrations } from "./pages/Admin";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import "./App.css";

const ACTIONABLE = ["pending", "signing", "signed", "returned"];
const HANDLED = ["published", "done", "rejected"];
const TOAST_MSG = {
  approve: "Đã phê duyệt", reject: "Đã từ chối", revise: "Đã trả về yêu cầu chỉnh sửa", sign: "Ký số thành công",
  publish: "Đã phát hành", resubmit: "Đã trình lại",
};

export default function App() {
  const parse = () => { const raw = location.hash ? location.hash.replace(/^#\/?/, "") : location.pathname.replace(/^\/+/, ""); const [p = "landing", id] = decodeURIComponent(raw).split("/"); return { page: p || "landing", params: id ? (p === "create" ? { dir: id } : { id }) : {} }; };
  const [route, setRoute] = useState(parse);
  useEffect(() => { if (location.hash) history.replaceState(null, "", "/" + location.hash.replace(/^#\/?/, "") + location.search); const h = () => setRoute(parse()); window.addEventListener("popstate", h); return () => window.removeEventListener("popstate", h); }, []);

  // theme
  const [theme, setTheme] = useState(() => { try { const t = localStorage.getItem("dcms-theme"); if (t) return t; } catch {} return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; });
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem("dcms-theme", theme); } catch {} }, [theme]);
  const [ripple, setRipple] = useState(null);
  const toggleTheme = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    setRipple({ x, y, end, to: next, id: Date.now() });
    setTheme(next);
  };
  useEffect(() => { if (!ripple) return; const t = setTimeout(() => setRipple(null), 800); return () => clearTimeout(t); }, [ripple]);

  // auth
  const [user, setUser] = useState(() => { try { return findAccount(localStorage.getItem("dcms-user")) || null; } catch { return null; } });
  const [userMenu, setUserMenu] = useState(false);
  const login = (acc) => { try { localStorage.setItem("dcms-user", acc.id); } catch {} setUser(acc); setRoute({ page: "home", params: {} }); history.pushState(null, "", "/home"); };
  const logout = () => { try { localStorage.removeItem("dcms-user"); } catch {} setUser(null); setUserMenu(false); setRoute({ page: "login", params: {} }); history.pushState(null, "", "/login"); };

  // business state
  const [docs, setDocs] = useState(() => DOCUMENTS.map(normalize));
  const [logs, setLogs] = useState(LOGS);
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const docsRef = useRef(docs);
  useEffect(() => { docsRef.current = docs; }, [docs]);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef();
  const notify = (msg) => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 3000); };
  const addLogs = (entries) => entries.length && setLogs((l) => [...entries.slice().reverse(), ...l]);
  const bumpIntegration = (name, add) => setIntegrations((list) => list.map((i) => (i.name === name ? { ...i, docs: i.docs + add, last: nowStr() } : i)));

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState({ q: "", n: 0 });
  const searchRef = useRef();
  useEffect(() => {
    const k = (e) => { if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement?.tagName)) { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  const go = (page, params = {}) => { const url = "/" + page + (params.id ? "/" + params.id : params.dir ? "/" + params.dir : ""); if (location.pathname !== url) history.pushState(null, "", url + location.search); setRoute({ page, params }); setMobileOpen(false); window.scrollTo({ top: 0 }); };

  const apply = (id, action, note, actor = user?.name || "Hệ thống") => {
    const d = docsRef.current.find((x) => x.id === id);
    if (!d) return null;
    const r = advance(d, action, { note, actor });
    docsRef.current = docsRef.current.map((x) => (x.id === id ? r.doc : x));
    setDocs(docsRef.current);
    addLogs(r.logs);
    if (r.synced) bumpIntegration(r.synced, 0);
    return r;
  };

  const runAi = (id, delay = 1600) => setTimeout(() => {
    const r = apply(id, "ai", "", "AI Agent");
    if (r) notify(`AI đã phân tích ${id}: ${r.doc.ai.type} · áp dụng workflow "${r.doc.workflowName}"`);
  }, delay);

  const onAction = (id, action, note) => {
    const r = apply(id, action, note);
    if (!r) return;
    const extra = r.synced ? ` · đã đồng bộ ${r.synced}` : "";
    notify(`${TOAST_MSG[action] || "Đã cập nhật"} ${id}${extra}`);
  };

  const onCreate = (f) => {
    const id = nextId(docsRef.current);
    const type = f.type || f.ai?.type || guessType(f.title, f.dir);
    const doc = makeDoc({
      id, title: f.title, type, dir: f.dir, dept: f.dept || f.ai?.dept || user.dept, priority: f.priority,
      deadline: f.deadline ? f.deadline.split("-").reverse().join("/") : undefined, creator: user.name,
      summary: f.summary || f.ai?.summary, aiType: f.ai?.type, confidence: f.ai?.confidence,
    });
    docsRef.current = [doc, ...docsRef.current];
    setDocs(docsRef.current);
    addLogs([{ time: nowFull(), actor: user.name, action: "CREATE", target: id, detail: `${type} · ${f.title}` }]);
    notify(`Đã tạo ${id}. AI đang phân tích…`);
    go("doc", { id });
    runAi(id);
  };

  const onIngest = (source) => {
    const t = INGEST[source];
    if (!t) return;
    const id = nextId(docsRef.current);
    const doc = makeDoc({ id, ...t, source, creator: source === "Email" ? "Email connector" : `${source} (API)` });
    docsRef.current = [doc, ...docsRef.current];
    setDocs(docsRef.current);
    bumpIntegration(source, 1);
    addLogs([{ time: nowFull(), actor: "Integration", action: source === "Email" ? "INGEST_EMAIL" : "WEBHOOK_IN", target: t.ref, detail: `Nguồn: ${source} · Tạo ${id}` }]);
    notify(`${source} vừa gửi ${id} "${t.title}". AI đang phân tích…`);
    runAi(id, 1800);
  };

  const onRemind = (id) => {
    const d = docsRef.current.find((x) => x.id === id);
    const cur = d?.steps.find((s) => s.state === "current");
    if (!cur) return;
    addLogs([{ time: nowFull(), actor: user.name, action: "REMIND", target: id, detail: `Nhắc ${cur.who} · ${cur.name}` }]);
    notify(`Đã gửi nhắc việc tới ${cur.who}`);
  };

  const onCheck = (name) => {
    addLogs([{ time: nowFull(), actor: user.name, action: "HEALTH_CHECK", target: name, detail: "Kết nối hoạt động · phản hồi 120ms" }]);
    notify(`Kết nối ${name} hoạt động bình thường`);
  };

  const count = (fn) => docs.filter(fn).length;
  const visible = (d) => can(user, "all") || d.dept === user?.dept || d.creator === user?.name || d.steps.some((st) => String(st.who || "").includes(user?.name || " "));
  const todoCount = docs.filter((d) => isMine(d, user)).length;
  const MENU = [
    { group: null, items: [{ id: "home", label: "Trang chủ", icon: "home" }, { id: "landing", label: "Giới thiệu hệ thống", icon: "sparkles" }] },
    { group: "Văn bản", items: [{ id: "in", label: "Văn bản đến", icon: "inbox", count: count((d) => d.dir === "in") }, { id: "out", label: "Văn bản đi", icon: "send", count: count((d) => d.dir === "out") }, { id: "docs", label: "Tất cả văn bản", icon: "docs" }] },
    { group: "Phê duyệt", items: [{ id: "todo", label: "Cần xử lý", icon: "clock", count: todoCount, hot: true }, { id: "done", label: "Đã xử lý", icon: "check" }, { id: "workflow", label: "Theo dõi quy trình", icon: "flow" }, { id: "create", label: "Tạo văn bản", icon: "plus" }] },
    { group: "AI Agent", items: [{ id: "ai", label: "Phân tích văn bản", icon: "ai" }, { id: "ai-suggest", label: "Đề xuất xử lý", icon: "bulb" }, { id: "ai-summary", label: "Tóm tắt thông tin", icon: "summary" }] },
    { group: "Quản trị", admin: true, items: [{ id: "users", label: "Người dùng", icon: "users" }, { id: "roles", label: "Vai trò & Quyền", icon: "shield" }, { id: "wf-config", label: "Cấu hình workflow", icon: "flow" }, { id: "integrations", label: "Tích hợp hệ thống", icon: "plug" }, { id: "logs", label: "Nhật ký hệ thống", icon: "log" }] },
  ];

  const { page, params } = route;
  const listKey = `${page}-${search.n}`;
  const listProps = { docs, go, initialQ: search.q };
  const view = () => {
    switch (page) {
      case "home": return <Dashboard docs={docs} go={go} />;
      case "in": return <Documents key={listKey} {...listProps} title="Văn bản đến" filter={(d) => d.dir === "in"} />;
      case "out": return <Documents key={listKey} {...listProps} title="Văn bản đi" filter={(d) => d.dir === "out"} />;
      case "docs": return <Documents key={listKey} {...listProps} title="Tất cả văn bản" />;
      case "todo": return <Documents key={listKey} {...listProps} title="Cần xử lý" subtitle={`Văn bản đang chờ ${user.name} xử lý`} filter={(d) => isMine(d, user)} />;
      case "done": return <Documents key={listKey} {...listProps} title="Đã xử lý" filter={(d) => HANDLED.includes(d.status)} />;
      case "doc": return <DocumentDetail doc={docs.find((d) => d.id === params.id)} go={go} onAction={onAction} user={user} onRemind={onRemind} />;
      case "create": return <CreateDocument go={go} onCreate={onCreate} dir={params.dir || "out"} />;
      case "workflow": return <Workflow docs={docs} go={go} onRemind={onRemind} />;
      case "wf": return <WorkflowDetail doc={docs.find((d) => d.id === params.id)} go={go} onRemind={onRemind} />;
      case "ai": return <AIAnalyze docs={docs} go={go} />;
      case "ai-suggest": return <AISuggest docs={docs} go={go} />;
      case "ai-summary": return <AISummary docs={docs} go={go} />;
      case "users": return <Users />;
      case "roles": return <Roles />;
      case "wf-config": return <WorkflowConfig />;
      case "integrations": return <Integrations integrations={integrations} onIngest={onIngest} onCheck={onCheck} />;
      case "logs": return <Logs logs={logs} />;
      case "profile": return <Profile user={user} docs={docs} logs={logs} go={go} onLogout={logout} onSwitch={() => { setUserMenu(false); logout(); }} />;
      default: return <Dashboard docs={docs} go={go} />;
    }
  };

  const activeId = page === "doc" ? "docs" : page === "wf" ? "workflow" : page;
  const submitSearch = (e) => { e.preventDefault(); setSearch((s) => ({ q: query.trim(), n: s.n + 1 })); go("docs"); };

  if (page === "landing") return (
    <>
      <Landing go={go} theme={theme} onToggleTheme={toggleTheme} user={user} />
      {ripple && <span key={ripple.id} className={`theme-ripple to-${ripple.to}`} style={{ left: ripple.x, top: ripple.y, "--r": `${ripple.end}px` }} />}
    </>
  );

  if (page === "login" || !user) return (
    <>
      <Login onLogin={login} go={go} theme={theme} onToggleTheme={toggleTheme} />
      {ripple && <span key={ripple.id} className={`theme-ripple to-${ripple.to}`} style={{ left: ripple.x, top: ripple.y, "--r": `${ripple.end}px` }} />}
    </>
  );

  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand" onClick={() => go("home")}>
          <Logo size={22} />
          {!collapsed && <b className="brand-name">CMS</b>}
        </div>
        <nav>
          {MENU.filter((g) => !g.admin || can(user, "admin")).map((g, gi) => (
            <div key={gi} className="nav-group">
              {g.group && !collapsed && <div className="nav-title">{g.group}</div>}
              {g.items.map((it) => (
                <button key={it.id} className={activeId === it.id ? "on" : ""} onClick={() => go(it.id)} title={it.label}>
                  <Icon name={it.icon} size={18} />
                  {!collapsed && <span>{it.label}</span>}
                  {!collapsed && it.count > 0 && <em className={it.hot ? "hot" : ""}>{it.count}</em>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sys-status">
          <i /> {!collapsed && <div><b>Hệ thống đang hoạt động</b><small>Phiên bản 1.0.0</small></div>}
        </div>
      </aside>
      {mobileOpen && <div className="backdrop" onClick={() => setMobileOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn burger" onClick={() => setMobileOpen(true)}><Icon name="menu" /></button>
          <button className="icon-btn desk" onClick={() => setCollapsed(!collapsed)} title="Thu gọn menu"><Icon name="panel" /></button>
          <form className="search top" onSubmit={submitSearch}>
            <Icon name="search" size={16} />
            <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm văn bản, số văn bản, người gửi, người xử lý…" />
            <kbd>/</kbd>
          </form>
          <button className="icon-btn theme-btn" onClick={toggleTheme} title={theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"} aria-label="Đổi giao diện"><span key={theme} className="theme-ic"><Icon name={theme === "dark" ? "sun" : "moon"} /></span></button>
          <button className="icon-btn bell" onClick={() => go("todo")} title={`${todoCount} văn bản cần xử lý`}><Icon name="bell" />{todoCount > 0 && <i>{todoCount}</i>}</button>
          <div className="me-wrap">
            <button className="me" onClick={() => setUserMenu(!userMenu)}>
              <Avatar name={user.name} size={32} />
              <div><b>{user.name}</b><small>{user.role} · {user.dept}</small></div>
              <Icon name="down" size={14} />
            </button>
            {userMenu && (
              <>
                <div className="me-back" onClick={() => setUserMenu(false)} />
                <div className="me-menu">
                  <div className="me-menu-h"><Avatar name={user.name} size={38} /><div><b>{user.name}</b><small>{user.email}</small></div></div>
                  <button onClick={() => { setUserMenu(false); go("profile"); }}><Icon name="users" size={16} />Trang cá nhân</button>
                  <button onClick={() => { setUserMenu(false); go("landing"); }}><Icon name="sparkles" size={16} />Giới thiệu hệ thống</button>
                  <div className="me-menu-l" />
                  <div className="me-menu-t">Đổi nhanh tài khoản</div>
                  {ACCOUNTS.filter((a) => a.id !== user.id).slice(0, 4).map((a) => (
                    <button key={a.id} className="me-sw" onClick={() => { setUserMenu(false); login(a); }}>
                      <Avatar name={a.name} size={22} /><span>{a.name}</span><em>{a.role}</em>
                    </button>
                  ))}
                  <button className="me-sw" onClick={logout}><Icon name="users" size={16} />Xem tất cả tài khoản…</button>
                  <div className="me-menu-l" />
                  <button className="me-out" onClick={logout}><Icon name="x" size={16} />Đăng xuất</button>
                </div>
              </>
            )}
          </div>
        </header>
        <div className="content">{view()}</div>
      </div>
      {ripple && <span key={ripple.id} className={`theme-ripple to-${ripple.to}`} style={{ left: ripple.x, top: ripple.y, "--r": `${ripple.end}px` }} />}
      {toast && <div className="toast"><Icon name="check" size={16} />{toast}</div>}
    </div>
  );
}
