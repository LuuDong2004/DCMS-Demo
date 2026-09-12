import { useState } from "react";
import { Icon, Badge, TypeTag, Avatar } from "../ui";

const FILTERS = [
  ["all", "Tất cả"], ["pending", "Chờ phê duyệt"], ["signing", "Chờ ký số"], ["processing", "Đang xử lý"], ["signed", "Chờ phát hành"], ["returned", "Chờ chỉnh sửa"],
];

const stats = (d) => {
  const total = d.steps.length;
  const done = d.steps.filter((s) => s.state === "done").length;
  const idx = d.steps.findIndex((s) => s.state === "current");
  return { total, done, pct: Math.round((done / total) * 100), cur: idx >= 0 ? d.steps[idx] : null, pos: idx + 1 };
};

function Segments({ d }) {
  return (
    <div className="wfg-seg" aria-hidden="true">
      {d.steps.map((s, i) => <i key={i} className={s.state === "current" && d.returned ? "returned" : s.state} title={s.name} />)}
    </div>
  );
}

const TYPE_TONE = { "Công văn đến": "#2a7bff", "Công văn đi": "#0f9488", "Hợp đồng": "#7c3aed", "Quyết định": "#d97706", "Báo cáo": "#16a34a", "Tờ trình": "#ea580c", "Kế hoạch": "#64748b" };

function MiniRing({ pct, tone }) {
  const r = 15, c = 2 * Math.PI * r;
  return (
    <svg className="wt3-ring" viewBox="0 0 40 40" width="40" height="40" aria-label={`Tiến độ ${pct}%`}>
      <circle cx="20" cy="20" r={r} className="wt2-ring-bg" strokeWidth="4" fill="none" />
      <circle cx="20" cy="20" r={r} stroke={tone} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 20 20)" />
      <text x="20" y="21" textAnchor="middle" dominantBaseline="middle" className="wt3-ring-t">{pct}</text>
    </svg>
  );
}

function Tile({ d, onOpen }) {
  const { total, pct, cur, pos } = stats(d);
  const urgent = d.priority === "Cao";
  const tone = TYPE_TONE[d.type] || "#2a7bff";
  const ringTone = d.returned ? "#f97316" : "url(#wt3Grad)";
  return (
    <button className="wfg-tile wt3" onClick={() => onOpen(d.id)} style={{ "--c": tone }}>
      <div className="wt3-head">
        <span className="wt3-ic"><Icon name="file" size={18} /></span>
        <div className="wt3-title">
          <h3 title={d.title}>{d.title}</h3>
          <small>{d.type} · {d.id}</small>
        </div>
        <Badge status={d.status} />
      </div>

      <div className="wt3-now">
        <MiniRing pct={pct} tone={ringTone} />
        <div className="wt3-step">
          <small>Bước {pos}/{total}</small>
          <b title={cur?.name}>{cur?.name}</b>
        </div>
        <span className="wt3-who" title={cur?.who}><Avatar name={cur?.who || "?"} size={26} /><span>{cur?.who}</span></span>
      </div>
      <Segments d={d} />

      <div className="wt3-meta"><Icon name="building" size={13} />{d.dept}</div>

      <div className="wt3-foot">
        <span className={`wt3-due ${urgent ? "hot" : ""}`}><Icon name="clock" size={13} />Hạn {d.deadline}</span>
        <span className="wt3-go">Xem quy trình<Icon name="chevron" size={14} /></span>
      </div>
    </button>
  );
}

export default function Workflow({ docs, go, onRemind }) {
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  const active = docs.filter((d) => !["done", "published", "rejected"].includes(d.status));
  const list = active.filter((d) => (f === "all" || d.status === f) && (d.id + d.title + d.dept).toLowerCase().includes(q.toLowerCase()));
  const count = (k) => active.filter((d) => d.status === k).length;
  const kpis = [
    { label: "Đang trong luồng", value: active.length, icon: "flow", tone: "blue" },
    { label: "Chờ phê duyệt", value: count("pending") + count("returned"), icon: "clock", tone: "amber" },
    { label: "Chờ ký số", value: count("signing"), icon: "sign", tone: "purple" },
    { label: "Ưu tiên cao", value: active.filter((d) => d.priority === "Cao").length, icon: "warn", tone: "red" },
  ];
  return (
    <div className="page">
      <div className="page-head">
        <div><h1>Theo dõi quy trình</h1><p className="muted">Bấm vào từng văn bản để xem toàn bộ quy trình phê duyệt và người đang giữ việc.</p></div>
      </div>

      <div className="wt-kpis">
        {kpis.map((k) => (
          <div key={k.label} className={`wt-kpi ${k.tone}`}>
            <span className="wt-kpi-ic"><Icon name={k.icon} size={20} /></span>
            <div><small>{k.label}</small><b>{k.value}</b></div>
          </div>
        ))}
      </div>

      <div className="wt-toolbar">
        <div className="wt-tabs">
          {FILTERS.map(([k, l]) => (
            <button key={k} className={f === k ? "on" : ""} onClick={() => setF(k)}>
              {l}<em>{k === "all" ? active.length : count(k)}</em>
            </button>
          ))}
        </div>
        <label className="search"><Icon name="search" size={16} /><input placeholder="Tìm văn bản, phòng ban…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      </div>

      {list.length === 0
        ? <div className="card empty"><Icon name="inbox" size={36} /><p>Không có văn bản phù hợp</p></div>
        : <div className="wfg"><svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true"><defs><linearGradient id="wt3Grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3fd0ff" /><stop offset="100%" stopColor="#1846d6" /></linearGradient></defs></svg>{list.map((d) => <Tile key={d.id} d={d} onOpen={(id) => go("wf", { id })} />)}</div>}

    </div>
  );
}
