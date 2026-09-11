import { Icon } from "../ui";

const LEFT = [
  { name: "ERP", sub: "Đơn hàng, mua sắm", icon: "db", color: "#1f5fbf", doc: "Đề nghị mua sắm" },
  { name: "CRM", sub: "Khách hàng, hợp đồng", icon: "users", color: "#12b5a5", doc: "Hợp đồng" },
  { name: "HRM", sub: "Nhân sự, quyết định", icon: "building", color: "#f2a33a", doc: "Quyết định" },
];
const RIGHT = [
  { name: "Kế toán", sub: "Thanh toán, chứng từ", icon: "chart", color: "#8b5cf6", doc: "Thanh toán" },
  { name: "Email", sub: "Công văn đến", icon: "mail", color: "#e05252", doc: "Công văn" },
  { name: "Người dùng", sub: "Soạn thảo, upload", icon: "upload", color: "#1a7d43", doc: "Tờ trình" },
];
const STAGES = [
  { label: "Phân tích", icon: "search" }, { label: "Đề xuất", icon: "bulb" }, { label: "Phê duyệt", icon: "check" }, { label: "Ký số", icon: "sign" }, { label: "Đồng bộ", icon: "refresh" },
];

const W = 900, H = 440, CX = 450, CY = 180, R = 66;
const CARD_W = 208, CARD_H = 64, GAP = 26;
const ys = [30, 30 + CARD_H + GAP, 30 + 2 * (CARD_H + GAP)];

function curve(x1, y1, x2, y2) {
  const dx = (x2 - x1) * 0.55;
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

function SysCard({ x, y, s, side }) {
  return (
    <foreignObject x={x} y={y} width={CARD_W} height={CARD_H}>
      <div xmlns="http://www.w3.org/1999/xhtml" className={`hs-card ${side}`}>
        <span className="hs-ic" style={{ background: s.color + "1a", color: s.color }}><Icon name={s.icon} size={18} /></span>
        <div><b>{s.name}</b><small>{s.sub}</small></div>
        <i className="hs-dot" style={{ background: s.color }} />
      </div>
    </foreignObject>
  );
}

function Packet({ path, color, label, doc, delay, dur = 3.4 }) {
  const w = Math.round(label.length * 7.2 + 36);
  const motion = { dur: `${dur}s`, repeatCount: "indefinite", begin: `${delay}s`, calcMode: "spline", keyPoints: "0;1", keyTimes: "0;1", keySplines: ".45 0 .2 1" };
  return (
    <g className="packet" opacity="0">
      <animateMotion {...motion} path={path} />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.8;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
      <rect x={-w / 2} y={-12} width={w} height={24} rx={12} fill="#fff" stroke={color} strokeOpacity=".55" filter="url(#pshadow)" />
      <path d={`M${-w / 2 + 9},-5 h5 l3,3 v7 h-8z`} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <text x={-w / 2 + 23} y={0.5} dominantBaseline="middle" fontSize="11.5" fontWeight="700" fill={color} fontFamily="Inter, Segoe UI, sans-serif">{label}</text>
    </g>
  );
}

export default function AIHero() {
  const paths = [
    ...LEFT.map((s, i) => ({ d: curve(16 + CARD_W, ys[i] + CARD_H / 2, CX - R - 8, CY), color: s.color, label: s.name, doc: s.doc, delay: i * 1.1 })),
    ...RIGHT.map((s, i) => ({ d: curve(W - 16 - CARD_W, ys[i] + CARD_H / 2, CX + R + 8, CY), color: s.color, label: s.name, doc: s.doc, delay: i * 1.1 + 0.55 })),
  ];
  const stageY = H - 40; const stageW = 132; const stageGap = 14;
  const stageX0 = CX - (STAGES.length * stageW + (STAGES.length - 1) * stageGap) / 2;
  const down = `M${CX},${CY + R + 4} L${CX},${stageY - 18}`;
  const stageLine = `M${stageX0 + 10},${stageY} L${stageX0 + STAGES.length * (stageW + stageGap) - stageGap - 10},${stageY}`;

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
          <linearGradient id="orb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3fd0ff" /><stop offset="55%" stopColor="#2a7bff" /><stop offset="100%" stopColor="#1846d6" /></linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3fb8ff" stopOpacity=".35" /><stop offset="100%" stopColor="#2d7bff" stopOpacity="0" /></radialGradient>
          <linearGradient id="stageLine" x1="0" x2="1"><stop offset="0%" stopColor="#1f5fbf" /><stop offset="100%" stopColor="#12b5a5" /></linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="1.2" /></filter>
          <filter id="pshadow" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1a3a6b" floodOpacity=".15" /></filter>
        </defs>

        {/* grid dots background */}
        <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#1f5fbf" opacity=".12" /></pattern>
        <rect width={W} height={H} fill="url(#dots)" />

        {/* connection paths */}
        {paths.map((p, i) => (
          <g key={i}>
            <path d={p.d} fill="none" stroke={p.color} strokeWidth="2" strokeOpacity=".22" />
            <path d={p.d} fill="none" stroke={p.color} strokeWidth="2" strokeDasharray="6 10" strokeOpacity=".5" className="flow-dash" />
            <Packet path={p.d} color={p.color} label={p.label} doc={p.doc} delay={p.delay} />
          </g>
        ))}

        {/* orb */}
        <circle cx={CX} cy={CY} r={R + 80} fill="url(#glow)" />
        <circle cx={CX} cy={CY} r={R + 34} fill="none" stroke="#1f5fbf" strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="4 8" className="ring ring-a" />
        <circle cx={CX} cy={CY} r={R + 17} fill="none" stroke="#12b5a5" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="30 14" className="ring ring-b" />
        <circle cx={CX} cy={CY} r={R} fill="url(#orb)" className="orb" />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
        <text x={CX} y={CY} dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="800" fill="#fff" letterSpacing="1" fontFamily="Inter, Segoe UI, sans-serif">DCMS</text>
        

        {/* down flow to stages */}
        <path d={down} stroke="#1f5fbf" strokeWidth="2" strokeOpacity=".3" strokeDasharray="5 7" className="flow-dash" />
        <Packet path={down} color="#2a7bff" label="Đã phân loại" doc="" delay={0.3} dur={2.4} />
        <path d={stageLine} stroke="url(#stageLine)" strokeWidth="2" strokeOpacity=".35" />
        <circle r="4" fill="#12b5a5"><animateMotion dur="3.2s" repeatCount="indefinite" path={stageLine} /></circle>
        {STAGES.map((s, i) => {
          const x = stageX0 + i * (stageW + stageGap);
          return (
            <foreignObject key={s.label} x={x} y={stageY - 17} width={stageW} height={34}>
              <div xmlns="http://www.w3.org/1999/xhtml" className="hs-stage" style={{ animationDelay: `${i * 0.5}s` }}><Icon name={s.icon} size={14} />{s.label}</div>
            </foreignObject>
          );
        })}

        {/* cards */}
        {LEFT.map((s, i) => <SysCard key={s.name} x={16} y={ys[i]} s={s} side="l" />)}
        {RIGHT.map((s, i) => <SysCard key={s.name} x={W - 16 - CARD_W} y={ys[i]} s={s} side="r" />)}
      </svg>
    </div>
  );
}
