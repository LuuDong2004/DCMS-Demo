import { useEffect, useState } from "react";
import { Icon, Avatar, Logo } from "./ui";
import { DOCUMENTS, USER } from "./mock";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DocumentDetail from "./pages/DocumentDetail";
import CreateDocument from "./pages/CreateDocument";
import Workflow from "./pages/Workflow";
import { AIAnalyze, AISuggest, AISummary } from "./pages/AIAgent";
import { Users, Roles, WorkflowConfig, Logs, Integrations } from "./pages/Admin";
import "./App.css";

const MENU = [
  { group: null, items: [{ id: "home", label: "Trang chủ", icon: "home" }] },
  { group: "Văn bản", items: [{ id: "in", label: "Văn bản đến", icon: "inbox", count: 12 }, { id: "out", label: "Văn bản đi", icon: "send", count: 8 }, { id: "docs", label: "Tất cả văn bản", icon: "docs" }] },
  { group: "Phê duyệt", items: [{ id: "todo", label: "Cần xử lý", icon: "clock", count: 3, hot: true }, { id: "done", label: "Đã xử lý", icon: "check" }, { id: "workflow", label: "Theo dõi quy trình", icon: "flow" }, { id: "create", label: "Tạo văn bản", icon: "plus" }] },
  { group: "AI Agent", items: [{ id: "ai", label: "Phân tích văn bản", icon: "ai" }, { id: "ai-suggest", label: "Đề xuất xử lý", icon: "bulb" }, { id: "ai-summary", label: "Tóm tắt thông tin", icon: "summary" }] },
  { group: "Quản trị", items: [{ id: "users", label: "Người dùng", icon: "users" }, { id: "roles", label: "Vai trò & Quyền", icon: "shield" }, { id: "wf-config", label: "Cấu hình workflow", icon: "flow" }, { id: "integrations", label: "Tích hợp hệ thống", icon: "plug" }, { id: "logs", label: "Nhật ký hệ thống", icon: "log" }] },
];

export default function App() {
  const parse = () => { const raw = location.hash ? location.hash.replace(/^#\/?/, "") : location.pathname.replace(/^\/+/, ""); const [p = "home", id] = decodeURIComponent(raw).split("/"); return { page: p || "home", params: id ? (p === "create" ? { dir: id } : { id }) : {} }; };
  const [route, setRoute] = useState(parse);
  useEffect(() => { if (location.hash) history.replaceState(null, "", "/" + location.hash.replace(/^#\/?/, "") + location.search); const h = () => setRoute(parse()); window.addEventListener("popstate", h); return () => window.removeEventListener("popstate", h); }, []);
  const [docs, setDocs] = useState(DOCUMENTS);
  const [toast, setToast] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (page, params = {}) => { const url = "/" + page + (params.id ? "/" + params.id : params.dir ? "/" + params.dir : ""); if (location.pathname !== url) history.pushState(null, "", url + location.search); setRoute({ page, params }); setMobileOpen(false); window.scrollTo({ top: 0 }); };
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const onAction = (id, action, note) => {
    setDocs((list) => list.map((d) => {
      if (d.id !== id) return d;
      const steps = d.steps.map((s) => ({ ...s }));
      const cur = steps.findIndex((s) => s.state === "current");
      const now = new Date().toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
      let status = d.status;
      if (action === "reject") { if (cur >= 0) { steps[cur].state = "rejected"; steps[cur].time = now; steps[cur].note = note; } status = "rejected"; }
      else if (action === "revise") { if (cur >= 0) { steps[cur].note = "Yêu cầu chỉnh sửa: " + note; } status = "processing"; }
      else {
        if (cur >= 0) { steps[cur].state = "done"; steps[cur].time = now; if (cur + 1 < steps.length) steps[cur + 1].state = "current"; }
        const next = steps[cur + 1]?.name || "";
        status = action === "sign" ? "signed" : /ký số/i.test(next) ? "signing" : cur + 1 >= steps.length - 1 ? "done" : "pending";
        if (cur + 1 >= steps.length) status = "done";
      }
      return { ...d, status, steps };
    }));
    notify({ approve: "Đã phê duyệt văn bản " + id, reject: "Đã từ chối văn bản " + id, revise: "Đã gửi yêu cầu chỉnh sửa " + id, sign: "Ký số thành công " + id }[action]);
  };

  const onCreate = (f) => {
    const id = "VB-2025-" + String(103 + (docs.length - DOCUMENTS.length)).padStart(4, "0");
    const now = new Date().toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const type = f.type || f.ai?.type || (f.dir === "in" ? "Công văn đến" : "Công văn đi");
    const dept = f.dept || f.ai?.dept || USER.dept;
    const wf = (f.ai?.wf || "Trưởng phòng → Giám đốc").split(" → ");
    const doc = {
      id, title: f.title, type, dir: f.dir, status: "pending", date: now, creator: USER.name, dept, source: "Nhập tay", priority: f.priority, deadline: f.deadline ? f.deadline.split("-").reverse().join("/") : "—", amount: null,
      summary: f.summary || f.ai?.summary || f.title,
      ai: { type, dept, workflow: wf.join(" → "), confidence: f.ai?.confidence || 0, fields: [["Người tạo", USER.name], ["Phòng ban", dept]] },
      steps: [{ name: "Tạo văn bản", who: USER.name, state: "done", time: now }, { name: "AI phân tích", who: "AI Agent", state: "done", time: now }, ...wf.map((w, i) => ({ name: w, who: w, state: i === 0 ? "current" : "wait", time: "" })), { name: "Hoàn tất", who: "Hệ thống", state: "wait", time: "" }],
    };
    setDocs((l) => [doc, ...l]);
    notify("Đã tạo văn bản " + id + " và gửi vào luồng phê duyệt");
    go("doc", { id });
  };

  const { page, params } = route;
  const view = () => {
    switch (page) {
      case "home": return <Dashboard docs={docs} go={go} />;
      case "in": return <Documents docs={docs} go={go} title="Văn bản đến" filter={(d) => d.dir === "in"} />;
      case "out": return <Documents docs={docs} go={go} title="Văn bản đi" filter={(d) => d.dir === "out"} />;
      case "docs": return <Documents docs={docs} go={go} title="Tất cả văn bản" />;
      case "todo": return <Documents docs={docs} go={go} title="Cần xử lý" filter={(d) => ["pending", "processing", "signing"].includes(d.status)} />;
      case "done": return <Documents docs={docs} go={go} title="Đã xử lý" filter={(d) => ["approved", "signed", "published", "done", "rejected"].includes(d.status)} />;
      case "doc": return <DocumentDetail doc={docs.find((d) => d.id === params.id)} go={go} onAction={onAction} />;
      case "create": return <CreateDocument go={go} onCreate={onCreate} dir={params.dir || "out"} />;
      case "workflow": return <Workflow docs={docs} go={go} />;
      case "ai": return <AIAnalyze docs={docs} go={go} />;
      case "ai-suggest": return <AISuggest docs={docs} go={go} />;
      case "ai-summary": return <AISummary docs={docs} go={go} />;
      case "users": return <Users />;
      case "roles": return <Roles />;
      case "wf-config": return <WorkflowConfig />;
      case "integrations": return <Integrations />;
      case "logs": return <Logs />;
      default: return <Dashboard docs={docs} go={go} />;
    }
  };

  const activeId = page === "doc" ? "docs" : page;
  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand" onClick={() => go("home")}>
          <Logo size={26} />
          {!collapsed && <b className="brand-name">CMS</b>}
        </div>
        <nav>
          {MENU.map((g, gi) => (
            <div key={gi} className="nav-group">
              {g.group && !collapsed && <div className="nav-title">{g.group}</div>}
              {g.items.map((it) => (
                <button key={it.id} className={activeId === it.id ? "on" : ""} onClick={() => go(it.id)} title={it.label}>
                  <Icon name={it.icon} size={18} />
                  {!collapsed && <span>{it.label}</span>}
                  {!collapsed && it.count && <em className={it.hot ? "hot" : ""}>{it.count}</em>}
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
          <div className="topbar-title"><b>Hệ thống AI Điều phối và Phê duyệt Tài liệu Doanh nghiệp</b></div>
          <label className="search top"><Icon name="search" size={16} /><input placeholder="Tìm kiếm văn bản, số văn bản, người gửi, người xử lý…" /><kbd>/</kbd></label>
          <button className="icon-btn bell"><Icon name="bell" /><i>3</i></button>
          <div className="me"><span className="me-avatar"><img src="/logo.png" alt="" /></span><div><b>{USER.name}</b><small>{USER.role}</small></div><Icon name="down" size={14} /></div>
        </header>
        <div className="content">{view()}</div>
      </div>
      {toast && <div className="toast"><Icon name="check" size={16} />{toast}</div>}
    </div>
  );
}
