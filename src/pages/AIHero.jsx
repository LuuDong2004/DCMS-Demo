import { Icon } from "../ui";

const LEFT = [
  { name: "ERP", sub: "Đơn hàng, mua sắm", icon: "db", color: "#2a7bff", count: 128 },
  { name: "CRM", sub: "Khách hàng, hợp đồng", icon: "users", color: "#12b5a5", count: 64 },
  { name: "HRM", sub: "Nhân sự, quyết định", icon: "building", color: "#f2a33a", count: 41 },
];
const RIGHT = [
  { name: "Kế toán", sub: "Thanh toán, chứng từ", icon: "chart", color: "#8b5cf6", count: 87 },
  { name: "Email", sub: "Công văn đến", icon: "mail", color: "#e05252", count: 212 },
  { name: "Người dùng", sub: "Soạn thảo, upload", icon: "upload", color: "#1a9a55", count: 36 },
];
const STAGES = [
  { label: "Phân tích", icon: "search" }, { label: "Đề xuất", icon: "bulb" }, { label: "Phê duyệt", icon: "check" }, { label: "Ký số", icon: "sign" }, { label: "Đồng bộ", icon: "refresh" },
];

const W = 900, H = 430;
const CX = 450, CY = 150, R = 60;
const CARD_W = 236, CARD_H = 62, GAP = 22, CARD_X = 6;
const ys = [CY - CARD_H / 2 - (CARD_H + GAP), CY - CARD_H / 2, CY - CARD_H / 2 + (CARD_H + GAP)];
const ANG = [-32, 0, 32];
const TRACK_Y = 360, TRACK_X0 = 160, TRACK_X1 = 740;

const rad = (d) => (d * Math.PI) / 180;
function entry(side) {
  return side === "l" ? [CX - R - 10, CY] : [CX + R + 10, CY];
}
function curve(x1, y1, x2, y2) {
  const dx = (x2 - x1) * 0.5;
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

function Packet({ path, color, label, delay, dur = 4.2 }) {
  const w = Math.round(label.length * 7 + 34);
  return (
    <g opacity="0">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".4 0 .25 1" />
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.1;.62;.78;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
      <rect x={-w / 2} y={-11.5} width={w} height={23} rx={11.5} fill="#fff" stroke={color} strokeOpacity=".45" filter="url(#pshadow)" />
      <path d={`M${-w / 2 + 10},-5.5 h5 l3,3 v8 h-8z`} fill={color} fillOpacity=".14" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <text x={-w / 2 + 24} y={0.5} dominantBaseline="middle" fontSize="11.5" fontWeight="700" fill={color} fontFamily="Inter, Segoe UI, sans-serif">{label}</text>
    </g>
  );
}

function SysCard({ x, y, s, side }) {
  return (
    <foreignObject x={x} y={y} width={CARD_W} height={CARD_H}>
      <div xmlns="http://www.w3.org/1999/xhtml" className={`hx-card ${side}`} style={{ "--c": s.color }}>
        <span className="hx-ic"><Icon name={s.icon} size={18} /></span>
        <div className="hx-txt"><b>{s.name}</b><small>{s.sub}</small></div>
        <i className="hx-port" />
      </div>
    </foreignObject>
  );
}

export default function AIHero() {
  const flows = [
    ...LEFT.map((s, i) => { const [ex, ey] = entry("l"); return { s, d: curve(CARD_X + CARD_W + 4, ys[i] + CARD_H / 2, ex, ey), ex, ey }; }),
    ...RIGHT.map((s, i) => { const [ex, ey] = entry("r"); return { s, d: curve(W - CARD_X - CARD_W - 4, ys[i] + CARD_H / 2, ex, ey), ex, ey }; }),
  ];
  const order = [0, 3, 1, 4, 2, 5];
  const down = `M${CX},${CY + R + 10} L${CX},${TRACK_Y - 24}`;
  const track = `M${TRACK_X0},${TRACK_Y} L${TRACK_X1},${TRACK_Y}`;
  const step = (TRACK_X1 - TRACK_X0) / (STAGES.length - 1);

  return (
    <div className="ai-hero">
      <div className="ai-hero-left">
        <div className="hero-brand">DCMS · DOCUMENT COORDINATION</div>
        <h1>Một điểm điều phối cho mọi tài liệu doanh nghiệp</h1>
        <p>Tài liệu từ ERP, CRM, HRM, kế toán, email đổ về DCMS. AI phân tích và đề xuất, workflow điều phối phê duyệt, ký số, con người quyết định.</p>
        <div className="hero-kpis">
          <div><b>63</b><small>văn bản tháng này</small></div>
          <div><b>93%</b><small>độ chính xác AI</small></div>
          <div><b>26h</b><small>thời gian xử lý TB</small></div>
        </div>
        <div className="hero-feats">
          <span><Icon name="clock" size={15} />Tiết kiệm thời gian</span>
          <span><Icon name="shield" size={15} />Giảm sai sót thủ công</span>
          <span><Icon name="done" size={15} />Minh bạch, có audit</span>
        </div>
      </div>

      <svg className="ai-scene" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="hxOrb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3fd0ff" /><stop offset="55%" stopColor="#2a7bff" /><stop offset="100%" stopColor="#1846d6" /></linearGradient>
          <radialGradient id="hxGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3fb8ff" stopOpacity=".32" /><stop offset="100%" stopColor="#3fb8ff" stopOpacity="0" /></radialGradient>
          <linearGradient id="hxTrack" x1="0" x2="1"><stop offset="0%" stopColor="#3fd0ff" /><stop offset="100%" stopColor="#1846d6" /></linearGradient>
          <linearGradient id="hxBeam" x1="0" x2="1"><stop offset="0%" stopColor="#3fd0ff" stopOpacity="0" /><stop offset="50%" stopColor="#2a7bff" /><stop offset="100%" stopColor="#3fd0ff" stopOpacity="0" /></linearGradient>
          <filter id="pshadow" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1a3a6b" floodOpacity=".14" /></filter>
          <pattern id="hxDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#1f5fbf" opacity=".10" /></pattern>
        </defs>
        <rect width={W} height={H} fill="url(#hxDots)" />

        {/* flows */}
        {flows.map((f, i) => (
          <g key={f.s.name}>
            <path d={f.d} fill="none" stroke={f.s.color} strokeWidth="2" strokeOpacity=".16" />
            <path d={f.d} fill="none" stroke={f.s.color} strokeWidth="2" strokeOpacity=".55" strokeDasharray="2 9" strokeLinecap="round" className="hx-dash" />
            <circle cx={f.ex} cy={f.ey} r="4" fill="#fff" stroke={f.s.color} strokeWidth="2" />
          </g>
        ))}

        {/* orb */}
        <circle cx={CX} cy={CY} r={R + 86} fill="url(#hxGlow)" />
        <circle cx={CX} cy={CY} r={R + 10} fill="none" stroke="#2a7bff" strokeOpacity=".18" strokeWidth="1.5" />
        <g className="hx-orbit">
          <circle cx={CX} cy={CY} r={R + 26} fill="none" stroke="#2a7bff" strokeOpacity=".16" strokeWidth="1.2" strokeDasharray="3 7" />
          <circle cx={CX + R + 26} cy={CY} r="4" fill="#3fd0ff" />
          <circle cx={CX - R - 26} cy={CY} r="3" fill="#8b5cf6" />
          <circle cx={CX} cy={CY - R - 26} r="2.5" fill="#12b5a5" />
        </g>
        <circle cx={CX} cy={CY} r={R} fill="url(#hxOrb)" className="hx-core" />
        <circle cx={CX} cy={CY} r={R - 1} fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="2" />
        <text x={CX} y={CY + 1} dominantBaseline="middle" textAnchor="middle" fontSize="25" fontWeight="800" letterSpacing="1" fill="#fff" fontFamily="Inter, Segoe UI, sans-serif">DCMS</text>

        {/* output pipeline */}
        <path d={down} stroke="#2a7bff" strokeWidth="2" strokeOpacity=".35" strokeDasharray="2 7" strokeLinecap="round" className="hx-dash" />
        <Packet path={down} color="#2a7bff" label="Đã xử lý" delay={0.4} dur={2.6} />
        <path d={track} stroke="#e1e9f5" strokeWidth="6" strokeLinecap="round" />
        <path d={track} stroke="url(#hxTrack)" strokeWidth="6" strokeLinecap="round" strokeOpacity=".35" />
        <rect x={TRACK_X0 - 60} y={TRACK_Y - 3} width="120" height="6" rx="3" fill="url(#hxBeam)">
          <animate attributeName="x" from={TRACK_X0 - 60} to={TRACK_X1 - 60} dur="4s" repeatCount="indefinite" />
        </rect>
        {STAGES.map((st, i) => {
          const x = TRACK_X0 + i * step;
          return (
            <foreignObject key={st.label} x={x - 60} y={TRACK_Y - 20} width="120" height="70">
              <div xmlns="http://www.w3.org/1999/xhtml" className="hx-stage" style={{ animationDelay: `${i - 0.7}s` }}>
                <span className="hx-node" style={{ animationDelay: `${i - 0.7}s` }}><Icon name={st.icon} size={16} /></span>
                <b>{st.label}</b>
              </div>
            </foreignObject>
          );
        })}

        {/* packets on top of paths, below cards */}
        {order.map((idx, k) => <Packet key={idx} path={flows[idx].d} color={flows[idx].s.color} label={flows[idx].s.name} delay={k * 0.7} />)}

        {LEFT.map((s, i) => <SysCard key={s.name} x={CARD_X} y={ys[i]} s={s} side="l" />)}
        {RIGHT.map((s, i) => <SysCard key={s.name} x={W - CARD_X - CARD_W} y={ys[i]} s={s} side="r" />)}
      </svg>
    </div>
  );
}
