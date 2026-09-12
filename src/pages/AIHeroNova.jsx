import { Icon } from "../ui";

const LEFT = [
  { name: "ERP", sub: "Đơn hàng, mua sắm", icon: "db", color: "#2a7bff" },
  { name: "CRM", sub: "Khách hàng, hợp đồng", icon: "users", color: "#0ea5a0" },
  { name: "HRM", sub: "Nhân sự, quyết định", icon: "building", color: "#f59e0b" },
];
const RIGHT = [
  { name: "Kế toán", sub: "Thanh toán, chứng từ", icon: "chart", color: "#8b5cf6" },
  { name: "Email", sub: "Công văn đến", icon: "mail", color: "#ef4444" },
  { name: "Người dùng", sub: "Soạn thảo, upload", icon: "upload", color: "#16a34a" },
];
const STAGES = [
  { label: "Phân tích", icon: "search" }, { label: "Đề xuất", icon: "bulb" }, { label: "Phê duyệt", icon: "check" }, { label: "Ký số", icon: "sign" }, { label: "Đồng bộ", icon: "refresh" },
];

const W = 900, H = 452;
const CX = 450, CY = 156, R = 58;
const CW = 196, CH = 58;
const LPOS = [[62, 14], [18, 127], [62, 240]];
const TRACK_Y = 388, TRACK_X0 = 160, TRACK_X1 = 740;

function curve(x1, y1, x2, y2) {
  const dx = (x2 - x1) * 0.55;
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

function Chip({ path, color, label, delay, dur = 4.2 }) {
  const w = Math.round(label.length * 7 + 34);
  return (
    <g opacity="0">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".4 0 .25 1" />
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.1;.62;.78;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
      <rect className="nv-chipbg" x={-w / 2} y={-11.5} width={w} height={23} rx={11.5} fill="#fff" stroke={color} strokeOpacity=".6" filter="url(#nvGlowS)" />
      <circle cx={-w / 2 + 12} cy="0" r="3.5" fill={color} />
      <text x={-w / 2 + 22} y={0.5} dominantBaseline="middle" fontSize="11.5" fontWeight="700" fill={color} fontFamily="Inter, Segoe UI, sans-serif">{label}</text>
    </g>
  );
}

function Glass({ x, y, s, side }) {
  return (
    <foreignObject x={x} y={y} width={CW} height={CH}>
      <div xmlns="http://www.w3.org/1999/xhtml" className={`nv-card ${side}`} style={{ "--c": s.color }}>
        <span className="nv-ic"><Icon name={s.icon} size={17} /></span>
        <div><b>{s.name}</b><small>{s.sub}</small></div>
      </div>
    </foreignObject>
  );
}

export default function AIHeroNova() {
  const lx = CX - R - 14, rx = CX + R + 14;
  const flows = [
    ...LEFT.map((s, i) => ({ s, d: curve(LPOS[i][0] + CW + 3, LPOS[i][1] + CH / 2, lx, CY) })),
    ...RIGHT.map((s, i) => ({ s, d: curve(W - LPOS[i][0] - CW - 3, LPOS[i][1] + CH / 2, rx, CY) })),
  ];
  const order = [0, 3, 1, 4, 2, 5];
  const down = `M${CX},${CY + R + 12} L${CX},${TRACK_Y - 24}`;
  const track = `M${TRACK_X0},${TRACK_Y} L${TRACK_X1},${TRACK_Y}`;
  const step = (TRACK_X1 - TRACK_X0) / (STAGES.length - 1);
  const stars = [[120, 24], [300, 16], [620, 28], [820, 60], [40, 350], [860, 350], [250, 330], [710, 330], [520, 18]];

  return (
    <div className="nv-scene">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="nvBg" cx="50%" cy="38%" r="70%"><stop offset="0%" stopColor="#16347a" /><stop offset="60%" stopColor="#0b1d4a" /><stop offset="100%" stopColor="#081535" /></radialGradient>
          <linearGradient id="nvOrb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3fd0ff" /><stop offset="55%" stopColor="#2a7bff" /><stop offset="100%" stopColor="#1846d6" /></linearGradient>
          <radialGradient id="nvHalo" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3fb8ff" stopOpacity=".45" /><stop offset="100%" stopColor="#3fb8ff" stopOpacity="0" /></radialGradient>
          <linearGradient id="nvHi" x1="0" x2="1"><stop offset="0%" stopColor="#3fd0ff" /><stop offset="100%" stopColor="#2a6bff" /></linearGradient>
          <linearGradient id="nvBeam" x1="0" x2="1"><stop offset="0%" stopColor="#3fd0ff" stopOpacity="0" /><stop offset="50%" stopColor="#2a7bff" /><stop offset="100%" stopColor="#3fd0ff" stopOpacity="0" /></linearGradient>
          <linearGradient id="nvRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3fd0ff" /><stop offset="55%" stopColor="#2a7bff" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient>
          <radialGradient id="nvTint" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#3fb8ff" stopOpacity=".16" /><stop offset="100%" stopColor="#3fb8ff" stopOpacity="0" /></radialGradient>
          <filter id="nvCoreSh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#2a7bff" floodOpacity=".28" /></filter>
          <filter id="nvCard" x="-10%" y="-40%" width="120%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1a3a6b" floodOpacity=".08" /></filter>
          <filter id="nvGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" /></filter>
          <filter id="nvGlowS" x="-30%" y="-80%" width="160%" height="260%"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3fb8ff" floodOpacity=".45" /></filter>
          <pattern id="nvGrid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#1f5fbf" opacity=".10" /></pattern>
          {flows.map((f, i) => (
            <linearGradient key={i} id={`nvL${i}`} gradientUnits="userSpaceOnUse" x1={i < 3 ? LPOS[i][0] + CW : W - LPOS[i - 3][0] - CW} y1="0" x2={i < 3 ? lx : rx} y2="0">
              <stop offset="0%" stopColor={f.s.color} stopOpacity=".25" /><stop offset="100%" stopColor={f.s.color} stopOpacity="1" />
            </linearGradient>
          ))}
        </defs>


        <rect width={W} height={H} fill="url(#nvGrid)" />
        <circle cx={CX} cy={CY} r="210" fill="none" stroke="#1f5fbf" strokeOpacity=".06" />
        <circle cx={CX} cy={CY} r="150" fill="none" stroke="#1f5fbf" strokeOpacity=".08" />
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1.1} fill="#2a7bff">
            <animate attributeName="opacity" values=".15;.9;.15" dur={`${2.4 + (i % 4) * 0.7}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* flows with glow */}
        {flows.map((f, i) => (
          <g key={f.s.name}>
            <path d={f.d} fill="none" stroke={f.s.color} strokeWidth="5" strokeOpacity=".22" filter="url(#nvGlow)" />
            <path d={f.d} fill="none" stroke={`url(#nvL${i})`} strokeWidth="2" />
            <path d={f.d} fill="none" stroke="#fff" strokeWidth="2" strokeOpacity=".9" strokeDasharray="1 14" strokeLinecap="round" className="nv-dash" />
          </g>
        ))}

        {/* core */}
        <circle cx={CX} cy={CY} r={R + 70} fill="url(#nvHalo)" />
        {[0, 1, 2].map((k) => <circle key={k} cx={CX} cy={CY} r={R + 6} fill="none" stroke="#3fd0ff" strokeWidth="1.5" className="nv-radar" style={{ animationDelay: `${k}s` }} />)}
        <circle cx={CX} cy={CY} r={R + 16} fill="none" stroke="#3fd0ff" strokeOpacity=".35" strokeWidth="1.2" strokeDasharray="2 6" className="nv-spin" />
        <circle className="nv-root" cx={lx} cy={CY} r="4.5" fill="#fff" stroke="#2a7bff" strokeWidth="2" />
        <circle className="nv-root" cx={rx} cy={CY} r="4.5" fill="#fff" stroke="#2a7bff" strokeWidth="2" />
        <circle cx={CX} cy={CY} r={R + 8} fill="none" stroke="url(#nvRing)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(R + 8) * 2 * Math.PI * 0.68} ${(R + 8) * 2 * Math.PI * 0.32}`} className="nv-ring-spin" />
        <circle cx={CX} cy={CY} r={R} className="nv-disc" filter="url(#nvCoreSh)" />
        <circle cx={CX} cy={CY} r={R - 8} fill="url(#nvTint)" />
        <image href="/logo.png" x={CX - 22} y={CY - 32} width="44" height="44" />
        <text x={CX} y={CY + 27} textAnchor="middle" fontSize="12.5" fontWeight="800" letterSpacing="2.4" className="dn-v" fill="#1a3a6b" fontFamily="Inter, Segoe UI, sans-serif">DCMS</text>

        {/* down link */}
        <path d={down} stroke="#2a7bff" strokeWidth="2" strokeOpacity=".45" strokeDasharray="1 9" strokeLinecap="round" className="nv-dash" />

        {/* pipeline (classic style) */}
        <path className="nv-track" d={track} stroke="#e1e9f5" strokeWidth="6" strokeLinecap="round" />
        <path d={track} stroke="url(#nvHi)" strokeWidth="6" strokeLinecap="round" strokeOpacity=".3" />
        <rect x={TRACK_X0 - 60} y={TRACK_Y - 3} width="120" height="6" rx="3" fill="url(#nvBeam)">
          <animate attributeName="x" from={TRACK_X0 - 60} to={TRACK_X1 - 60} dur="4s" repeatCount="indefinite" />
        </rect>
        {STAGES.map((st, i) => {
          const x = TRACK_X0 + i * step;
          return (
            <foreignObject key={st.label} x={x - 60} y={TRACK_Y - 32} width="120" height="84">
              <div xmlns="http://www.w3.org/1999/xhtml" className="hx-stage" style={{ animationDelay: `${i - 0.7}s` }}>
                <span className="hx-node" style={{ animationDelay: `${i - 0.7}s` }}><i className="hx-ring" /><i className="hx-fill" /><Icon name={st.icon} size={16} /></span>
                <b>{st.label}</b>
              </div>
            </foreignObject>
          );
        })}

        {order.map((idx, k) => <Chip key={idx} path={flows[idx].d} color={flows[idx].s.color} label={flows[idx].s.name} delay={k * 0.7} />)}
        <Chip path={down} color="#3fd0ff" label="Đã xử lý" delay={0.5} dur={2.6} />

        {LEFT.map((s, i) => <Glass key={s.name} x={LPOS[i][0]} y={LPOS[i][1]} s={s} side="l" />)}
        {RIGHT.map((s, i) => <Glass key={s.name} x={W - LPOS[i][0] - CW} y={LPOS[i][1]} s={s} side="r" />)}
      </svg>
    </div>
  );
}
