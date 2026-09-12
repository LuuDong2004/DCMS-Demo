import { useEffect, useRef, useState } from "react";
import { Icon, Badge, TypeTag, Avatar } from "../ui";

const KIND_ICON = { system: "file", ai: "ai", approve: "check", sign: "sign", publish: "send", sync: "refresh" };
const DONE_LABEL = { system: "Đã tạo", ai: "Đã phân tích", approve: "Đã duyệt", sign: "Đã ký", publish: "Hoàn tất", sync: "Đã đồng bộ" };
const NW = 196, NH = 76, W = 1240, H = 400;

function layout(n) {
  const pad = 40 + NW / 2;
  const span = W - pad * 2;
  return Array.from({ length: n }, (_, i) => ({ x: n === 1 ? W / 2 : pad + (i * span) / (n - 1), y: H / 2 + (i % 2 ? 80 : -80) }));
}
const Z = { x: 0, y: 0 };
const cps = (a, b, o = Z) => { const dx = (b.x - a.x) * 0.6; return [{ x: a.x + dx + o.x, y: a.y + o.y }, { x: b.x - dx + o.x, y: b.y + o.y }]; };
const ctrl = (a, b, o = Z) => { const [c1, c2] = cps(a, b, o); return `C${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`; };
const edge = (a, b, o = Z) => `M${a.x},${a.y} ${ctrl(a, b, o)}`;
const mid = (a, b, o = Z) => { const [c1, c2] = cps(a, b, o); return { x: (a.x + 3 * c1.x + 3 * c2.x + b.x) / 8, y: (a.y + 3 * c1.y + 3 * c2.y + b.y) / 8 }; };

function Ring({ pct }) {
  const r = 22, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 56 56" width="56" height="56" aria-label={`Tiến độ ${pct}%`}>
      <defs><linearGradient id="fxRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3fd0ff" /><stop offset="100%" stopColor="#1846d6" /></linearGradient></defs>
      <circle cx="28" cy="28" r={r} className="wt2-ring-bg" strokeWidth="5" fill="none" />
      <circle cx="28" cy="28" r={r} stroke="url(#fxRing)" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 28 28)" />
      <text x="28" y="29" textAnchor="middle" dominantBaseline="middle" className="wt2-ring-t">{pct}%</text>
    </svg>
  );
}

function FlowCanvas({ d }) {
  const n = d.steps.length;
  const storeKey = `dcms-flow-${d.id}`;
  const [saved] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(storeKey) || "null");
      if (v && Array.isArray(v.pos) && v.pos.length === n && Array.isArray(v.bends) && v.bends.length === Math.max(0, n - 1)) return v;
    } catch { /* storage unavailable */ }
    return null;
  });
  const [pos, setPos] = useState(() => saved?.pos || layout(n));
  const [bends, setBends] = useState(() => saved?.bends || Array.from({ length: Math.max(0, n - 1) }, () => ({ x: 0, y: 0 })));
  const [drag, setDrag] = useState(null);
  const [pan, setPan] = useState(null);
  const [view, setView] = useState(() => saved?.view || { k: 1, x: 0, y: 0 });
  useEffect(() => {
    if (drag || pan) return;
    const t = setTimeout(() => { try { localStorage.setItem(storeKey, JSON.stringify({ pos, bends, view })); } catch { /* ignore */ } }, 150);
    return () => clearTimeout(t);
  }, [pos, bends, view, drag, pan, storeKey]);
  const svgRef = useRef();
  const viewRef = useRef(view);
  viewRef.current = view;
  const curIdx = d.steps.findIndex((s) => s.state === "current" || s.state === "rejected");
  const reach = curIdx >= 0 ? curIdx : n - 1;

  const clampK = (k) => Math.min(2.5, Math.max(0.4, k));
  const toSvg = (e) => { const pt = svgRef.current.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svgRef.current.getScreenCTM().inverse()); };
  const toWorld = (e) => { const p = toSvg(e); const v = viewRef.current; return { x: (p.x - v.x) / v.k, y: (p.y - v.y) / v.k }; };
  const zoomAt = (k2, px, py) => setView((v) => { const k = clampK(k2); return { k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) }; });

  useEffect(() => {
    const el = svgRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) { const p = toSvg(e); zoomAt(viewRef.current.k * Math.exp(-e.deltaY * 0.0015), p.x, p.y); }
      else if (e.shiftKey) setView((v) => ({ ...v, x: v.x - (e.deltaY || e.deltaX) * 0.8 }));
      else setView((v) => ({ ...v, x: v.x - e.deltaX * 0.8, y: v.y - e.deltaY * 0.8 }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const down = (i) => (e) => { e.stopPropagation(); const p = toWorld(e); svgRef.current.setPointerCapture(e.pointerId); setDrag({ i, ox: p.x - pos[i].x, oy: p.y - pos[i].y }); };
  const lastEdge = useRef({ k: -1, t: 0 });
  const pressedEdge = useRef({ k: -1, t: 0 });
  const onCanvasDbl = () => { const pe = pressedEdge.current; if (pe.k >= 0 && Date.now() - pe.t < 700) straighten(pe.k); };
  const edgeDown = (k) => (e) => {
    e.stopPropagation();
    const now = Date.now();
    pressedEdge.current = { k, t: now };
    if (lastEdge.current.k === k && now - lastEdge.current.t < 350) { lastEdge.current = { k: -1, t: 0 }; straighten(k); return; }
    lastEdge.current = { k, t: now };
    const p = toWorld(e); 
    svgRef.current.setPointerCapture(e.pointerId);
    setDrag({ edge: k, sx: p.x, sy: p.y, ox: bends[k].x, oy: bends[k].y });
  };
  const straighten = (k) => setBends((bs) => bs.map((b, j) => (j === k ? { x: 0, y: 0 } : b)));
  const panDown = (e) => { const p = toSvg(e); svgRef.current.setPointerCapture(e.pointerId); setPan({ sx: p.x, sy: p.y, x0: view.x, y0: view.y }); };
  const move = (e) => {
    if (drag && drag.edge !== undefined) {
      const p = toWorld(e);
      const nx = drag.ox + (p.x - drag.sx) / 0.75, ny = drag.oy + (p.y - drag.sy) / 0.75;
      setBends((bs) => bs.map((b, j) => (j === drag.edge ? { x: nx, y: ny } : b)));
    } else if (drag) { const p = toWorld(e); setPos((ps) => ps.map((q, k) => (k === drag.i ? { x: p.x - drag.ox, y: p.y - drag.oy } : q))); }
    else if (pan) { const p = toSvg(e); setView((v) => ({ ...v, x: pan.x0 + p.x - pan.sx, y: pan.y0 + p.y - pan.sy })); }
  };
  const up = () => { setDrag(null); setPan(null); };
  const fit = () => {
    const xs = pos.map((p) => p.x), ys = pos.map((p) => p.y);
    const minX = Math.min(...xs) - NW / 2 - 30, maxX = Math.max(...xs) + NW / 2 + 30;
    const minY = Math.min(...ys) - NH / 2 - 30, maxY = Math.max(...ys) + NH / 2 + 30;
    const k = clampK(Math.min(W / (maxX - minX), H / (maxY - minY), 1.4));
    setView({ k, x: (W - (maxX - minX) * k) / 2 - minX * k, y: (H - (maxY - minY) * k) / 2 - minY * k });
  };
  const rearrange = () => { setPos(layout(n)); setBends((bs) => bs.map(() => ({ x: 0, y: 0 }))); setView({ k: 1, x: 0, y: 0 }); };

  const travel = reach > 0 ? `M${pos[0].x},${pos[0].y} ` + pos.slice(1, reach + 1).map((b, k) => ctrl(pos[k], b, bends[k])).join(" ") : null;
  const edgeState = (k) => {
    const a = d.steps[k], b = d.steps[k + 1];
    if (b.state === "rejected") return "rejected";
    if (a.state === "done" && b.state === "done") return "done";
    if (a.state === "done" && b.state === "current") return d.returned ? "returned" : "active";
    return "wait";
  };
  const label = (st, i, s) => (st === "done" ? DONE_LABEL[s.kind] || "Hoàn thành" : st === "current" ? "Đang xử lý" : st === "returned" ? "Chờ chỉnh sửa" : st === "rejected" ? "Từ chối" : `Bước ${i + 1}`);

  return (
    <div className="fx-wrap">
      <div className="fx-bar">
        <span className="muted small"><Icon name="move" size={14} />Ctrl + cuộn để phóng to / thu nhỏ · kéo nền để di chuyển · kéo bước hoặc đường nối để sắp xếp · nhấp đúp đường nối để thẳng lại · bố cục được tự lưu</span>
        <button className="btn ghost sm" onClick={rearrange}><Icon name="refresh" size={14} />Sắp xếp lại</button>
      </div>
      <div className="fx-stage">
        <svg ref={svgRef} className={`fx-canvas ${drag ? "dragging" : ""} ${pan ? "panning" : ""}`} viewBox={`0 0 ${W} ${H}`} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onDoubleClick={onCanvasDbl}>
          <defs>
            <pattern id="fxDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" className="fx-dot" /></pattern>
            <linearGradient id="fxActive" x1="0" x2="1"><stop offset="0%" stopColor="#22a55b" /><stop offset="100%" stopColor="#2a7bff" /></linearGradient>
            <filter id="fxGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
            <filter id="fxSh" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1a3a6b" floodOpacity=".15" /></filter>
          </defs>
          <g className="fx-world" transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
            <rect x={-4000} y={-4000} width={W + 8000} height={H + 8000} fill="url(#fxDots)" className="fx-bg" onPointerDown={panDown} />

            {pos.slice(0, -1).map((a, k) => {
              const st = edgeState(k);
              const p = edge(a, pos[k + 1], bends[k]);
              const bent = bends[k].x !== 0 || bends[k].y !== 0;
              return (
                <g key={k} className={`fx-edge ${st} ${drag && drag.edge === k ? "bending" : ""} ${bent ? "bent" : ""}`}>
                  {st !== "wait" && <path d={p} className="fx-glowpath" filter="url(#fxGlow)" />}
                  <path d={p} className="fx-base" />
                  {st !== "wait" && <path d={p} className="fx-flow" />}
                  <path d={p} className="fx-hit" onPointerDown={edgeDown(k)} onDoubleClick={() => straighten(k)}><title>Kéo để uốn đường nối · nhấp đúp để thẳng lại</title></path>
                </g>
              );
            })}

            {travel && !drag && (
              <g className="fx-packet" opacity="0">
                <animateMotion dur={`${Math.max(2.4, reach * 1.1)}s`} repeatCount="indefinite" path={travel} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 0 .25 1" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.85;1" dur={`${Math.max(2.4, reach * 1.1)}s`} repeatCount="indefinite" />
                <rect x="-44" y="-12" width="88" height="24" rx="12" className="fx-chip" filter="url(#fxSh)" />
                <circle cx="-31" cy="0" r="3.5" fill="#2a7bff" />
                <text x="-22" y="0.5" dominantBaseline="middle" className="fx-chip-t">{d.id.replace("VB-2026-", "VB-")}</text>
              </g>
            )}

            {d.steps.map((s, i) => {
              const p = pos[i];
              const st = s.state === "current" && d.returned ? "returned" : s.state;
              return (
                <g key={i} className={`fx-node-g ${st}`} onPointerDown={down(i)}>
                  {(st === "current" || st === "returned") && (
                    <>
                      <rect x={p.x - NW / 2 - 7} y={p.y - NH / 2 - 7} width={NW + 14} height={NH + 14} rx="20" className="fx-halo" />
                      <rect x={p.x - NW / 2 - 7} y={p.y - NH / 2 - 7} width={NW + 14} height={NH + 14} rx="20" className="fx-halo b" />
                    </>
                  )}
                  <foreignObject x={p.x - NW / 2} y={p.y - NH / 2} width={NW} height={NH}>
                    <div xmlns="http://www.w3.org/1999/xhtml" className={`fx-node ${st}`}>
                      <span className="fx-ic"><Icon name={s.state === "rejected" ? "x" : KIND_ICON[s.kind] || "check"} size={17} strokeWidth={2.1} /></span>
                      <div className="fx-txt">
                        <b title={s.name}>{s.name}</b>
                        <small title={s.who}>{s.who}</small>
                        <em>{label(st, i, s)}</em>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </g>
        </svg>
        <div className="fx-zoom" role="toolbar" aria-label="Điều khiển thu phóng">
          <button onClick={() => zoomAt(view.k / 1.2, W / 2, H / 2)} title="Thu nhỏ" disabled={view.k <= 0.4}><Icon name="minus" size={16} /></button>
          <span title="Về 100%" onClick={() => setView({ k: 1, x: 0, y: 0 })}>{Math.round(view.k * 100)}%</span>
          <button onClick={() => zoomAt(view.k * 1.2, W / 2, H / 2)} title="Phóng to" disabled={view.k >= 2.5}><Icon name="plus" size={16} /></button>
          <i />
          <button onClick={fit} title="Vừa khung"><Icon name="fit" size={15} /></button>
          <button onClick={() => setView({ k: 1, x: 0, y: 0 })} title="Về 100%"><Icon name="zoomreset" size={15} /></button>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowDetail({ doc: d, go, onRemind }) {
  const [nudged, setNudged] = useState(false);
  if (!d) return <div className="page"><button className="link back" onClick={() => go("workflow")}><Icon name="back" size={16} />Quay lại Theo dõi quy trình</button><p className="muted">Không tìm thấy văn bản.</p></div>;
  const total = d.steps.length;
  const done = d.steps.filter((s) => s.state === "done").length;
  const pct = Math.round((done / total) * 100);
  const cur = d.steps.find((s) => s.state === "current");
  const label = (st, s) => (st === "done" ? DONE_LABEL[s.kind] || "Hoàn thành" : st === "current" ? "Đang xử lý" : st === "returned" ? "Chờ chỉnh sửa" : st === "rejected" ? "Từ chối" : "Chờ");

  return (
    <div className="page">
      <button className="link back" onClick={() => go("workflow")}><Icon name="back" size={16} />Quay lại Theo dõi quy trình</button>
      <div className="page-head">
        <div>
          <div className="drw-tags"><TypeTag type={d.type} /><Badge status={d.status} /><span className="wfg-id">{d.id}</span>{d.priority === "Cao" && <span className="wfg-hot"><Icon name="warn" size={11} />Ưu tiên cao</span>}</div>
          <h1 style={{ marginTop: 8 }}>{d.title}</h1>
          <div className="wt2-meta" style={{ marginTop: 6 }}>
            <span><Icon name="building" size={13} />{d.dept}</span>
            <span><Icon name="plug" size={13} />{d.source}</span>
            <span className={d.priority === "Cao" ? "hot" : ""}><Icon name="clock" size={13} />Hạn {d.deadline}</span>
            <span><Icon name="flow" size={13} />Workflow: {d.workflowName || "Theo cấu hình"}</span>
          </div>
        </div>
        <div className="fx-head-side">
          <div className="wt2-prog"><Ring pct={pct} /><div><b>{done}/{total} bước</b><small>{cur ? `Hiện tại: ${cur.name}` : "Đã hoàn tất"}</small></div></div>
          <div className="page-actions">
            {cur && <button className="btn ghost" onClick={() => { setNudged(true); if (onRemind) onRemind(d.id); }} disabled={nudged}><Icon name="bell" size={16} />{nudged ? "Đã gửi nhắc" : `Nhắc ${cur.who}`}</button>}
            <button className="btn primary" onClick={() => go("doc", { id: d.id })}>Mở văn bản<Icon name="chevron" size={16} /></button>
          </div>
        </div>
      </div>

      <div className="card fx-card">
        <div className="card-head"><h3 className="with-ic"><Icon name="flow" size={18} />Sơ đồ luồng xử lý</h3><div className="fx-legend"><span className="l-done">Đã xong</span><span className="l-cur">Đang xử lý</span><span className="l-wait">Chưa tới</span></div></div>
        <FlowCanvas key={d.id + total} d={d} />
      </div>

      {d.returned && <div className="doc-banner warn"><Icon name="refresh" size={18} /><div><b>Trả về tại bước "{d.returned.step}"</b><span>{d.returned.by} · {d.returned.time} · "{d.returned.note}"</span></div></div>}

      <div className="detail-grid">
        <div className="card">
          <div className="card-head"><h3>Nhật trình từng bước</h3></div>
          <div className="card-body">
            <ol className="drw-tl">
              {d.steps.map((s, i) => {
                const st = s.state === "current" && d.returned ? "returned" : s.state;
                return (
                  <li key={i} className={st}>
                    <span className="drw-node"><Icon name={s.state === "rejected" ? "x" : KIND_ICON[s.kind] || "check"} size={14} strokeWidth={2.2} /></span>
                    <div className="drw-item">
                      <div className="drw-row"><b>{s.name}</b><span className={`drw-st ${st}`}>{label(st, s)}</span></div>
                      <small>{s.who}{s.time ? ` · ${s.time}` : ""}</small>
                      {s.note && <p className="drw-q">"{s.note}"</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Thông tin văn bản</h3></div>
          <div className="card-body">
            <dl className="drw-dl" style={{ marginTop: 0 }}>
              <div><dt>Phòng ban</dt><dd>{d.dept}</dd></div>
              <div><dt>Nguồn</dt><dd>{d.source}</dd></div>
              <div><dt>Người tạo</dt><dd>{d.creator}</dd></div>
              <div><dt>Ngày tạo</dt><dd>{d.date}</dd></div>
              <div><dt>Hạn xử lý</dt><dd className={d.priority === "Cao" ? "hot" : ""}>{d.deadline}</dd></div>
              <div><dt>Ưu tiên</dt><dd className={d.priority === "Cao" ? "hot" : ""}>{d.priority}</dd></div>
              {d.amount && <div><dt>Giá trị</dt><dd>{d.amount}</dd></div>}
              <div><dt>Người đang giữ việc</dt><dd>{cur ? cur.who : "—"}</dd></div>
            </dl>
            {cur && <div className="fx-holder"><Avatar name={cur.who} size={34} /><div><b>{cur.who}</b><small>{cur.name} · {d.returned ? "chờ người tạo chỉnh sửa" : "đang xử lý"}</small></div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
