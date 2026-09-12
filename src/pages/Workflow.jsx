import { useState } from "react";
import { Icon, Badge, TypeTag, Avatar } from "../ui";

const FILTERS = [
  ["all", "Tất cả"], ["pending", "Chờ phê duyệt"], ["signing", "Chờ ký số"], ["processing", "Đang xử lý"], ["signed", "Chờ phát hành"], ["returned", "Chờ chỉnh sửa"],
];

function Step({ s, i, next, returned }) {
  const lineDone = s.state === "done" && next && next.state !== "wait";
  return (
    <div className={`wt-step ${s.state}`}>
      {next && <i className={`wt-line ${lineDone ? "on" : s.state === "done" ? "half" : ""}`} />}
      <span className="wt-node">
        {s.state === "done" ? <Icon name="check" size={14} strokeWidth={2.6} /> : s.state === "rejected" ? <Icon name="x" size={14} strokeWidth={2.6} /> : i + 1}
      </span>
      <div className="wt-label">
        <b>{s.name}</b>
        <small>{s.who}</small>
        {s.state === "current" ? <em className={`wt-now ${returned ? "ret" : ""}`}>{returned ? "Chờ chỉnh sửa" : "Đang xử lý"}</em> : s.time ? <small className="wt-time">{s.time}</small> : <small className="wt-time">—</small>}
      </div>
    </div>
  );
}

function FlowCard({ d, go, onRemind }) {
  const [nudged, setNudged] = useState(false);
  const total = d.steps.length;
  const done = d.steps.filter((s) => s.state === "done").length;
  const pct = Math.round((done / total) * 100);
  const cur = d.steps.find((s) => s.state === "current");
  const urgent = d.priority === "Cao";
  return (
    <article className="wt-card">
      <header className="wt-head">
        <div className="wt-title">
          <div className="wt-top"><TypeTag type={d.type} /><span className="wt-id">{d.id}</span><Badge status={d.status} /></div>
          <h3 onClick={() => go("doc", { id: d.id })}>{d.title}</h3>
          <div className="wt-meta">
            <span><Icon name="building" size={14} />{d.dept}</span>
            <span><Icon name="plug" size={14} />Nguồn: {d.source}</span>
            <span className={urgent ? "hot" : ""}><Icon name="clock" size={14} />Hạn {d.deadline}</span>
            {d.amount && <span><Icon name="chart" size={14} />{d.amount}</span>}
          </div>
        </div>
        <div className="wt-progress">
          <div className="wt-progress-top"><span>Tiến độ</span><b>{pct}%</b></div>
          <div className="wt-bar"><i style={{ width: pct + "%" }} /></div>
          <small>{done}/{total} bước hoàn thành</small>
        </div>
      </header>

      <div className="wt-steps" style={{ gridTemplateColumns: `repeat(${total}, minmax(110px, 1fr))` }}>
        {d.steps.map((s, i) => <Step key={i} s={s} i={i} next={d.steps[i + 1]} returned={!!d.returned} />)}
      </div>

      <footer className="wt-foot">
        {cur ? (
          <div className="wt-who">
            <Avatar name={cur.who} size={30} />
            <div><small>Đang chờ xử lý</small><b>{cur.who}</b> <span className="muted">· {cur.name}</span></div>
          </div>
        ) : <div className="wt-who muted">Không có bước đang chờ</div>}
        <div className="wt-actions">
          <button className="btn ghost sm" onClick={() => { setNudged(true); onRemind && onRemind(d.id); }} disabled={nudged}><Icon name="bell" size={14} />{nudged ? "Đã gửi nhắc" : "Nhắc việc"}</button>
          <button className="btn primary sm" onClick={() => go("doc", { id: d.id })}>Xem chi tiết <Icon name="chevron" size={14} /></button>
        </div>
      </footer>
    </article>
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
        <div><h1>Theo dõi quy trình</h1><p className="muted">Vị trí hiện tại của từng văn bản trong luồng phê duyệt và người đang giữ việc.</p></div>
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

      <div className="wt-list">
        {list.length === 0 ? <div className="card empty"><Icon name="inbox" size={36} /><p>Không có văn bản phù hợp</p></div> : list.map((d) => <FlowCard key={d.id} d={d} go={go} onRemind={onRemind} />)}
      </div>
    </div>
  );
}
