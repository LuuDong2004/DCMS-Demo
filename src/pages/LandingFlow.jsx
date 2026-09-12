import { Icon } from "../ui";

const W = 1440, H = 252;
const NW = 220, NH = 86;
const GEO = [
  { x: 0, y: 16, icon: "inbox", tone: "#2a7bff" },
  { x: 305, y: 150, icon: "ai", tone: "#0ea5a0" },
  { x: 610, y: 16, icon: "flow", tone: "#8b5cf6" },
  { x: 915, y: 150, icon: "check", tone: "#f59e0b" },
  { x: 1220, y: 16, icon: "refresh", tone: "#16a34a" },
];

const cx = (n) => n.x + NW, cy = (n) => n.y + NH / 2;
function edgePath(a, b) {
  const x1 = cx(a), y1 = cy(a), x2 = b.x, y2 = cy(b);
  const dx = (x2 - x1) * 0.62;
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

export default function LandingFlow({ t }) {
  const NODES = GEO.map((g, i) => ({ ...g, name: t.flowNodes[i][0], who: t.flowNodes[i][1], state: t.flowNodes[i][2] }));
  const PACKETS = t.flowPackets;
  const edge = (a, b) => edgePath(a, b);
  const edges = NODES.slice(0, -1).map((n, i) => ({ d: edge(n, NODES[i + 1]), from: n.tone, to: NODES[i + 1].tone, label: PACKETS[i], i }));
  return (
    <div className="lf">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={t.flowAria}>
        <defs>
          <pattern id="lfGrid" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="1.1" className="lf-dot" /></pattern>
          {edges.map((e) => (
            <linearGradient key={e.i} id={`lfG${e.i}`} gradientUnits="userSpaceOnUse" x1={cx(NODES[e.i])} y1="0" x2={NODES[e.i + 1].x} y2="0">
              <stop offset="0%" stopColor={e.from} stopOpacity=".4" /><stop offset="100%" stopColor={e.to} stopOpacity=".55" />
            </linearGradient>
          ))}
        </defs>

        <rect width={W} height={H} fill="url(#lfGrid)" />

        {edges.map((e) => (
          <g key={e.i}>
            <path d={e.d} fill="none" stroke={`url(#lfG${e.i})`} strokeWidth="1.6" strokeLinecap="round" />
            <path className="lf-dash" d={e.d} fill="none" stroke={`url(#lfG${e.i})`} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="2 14" style={{ animationDelay: `${e.i * -0.8}s` }} />
            <g opacity="0">
              <animateMotion dur="8s" begin={`${e.i * 1.8}s`} repeatCount="indefinite" path={e.d} keyPoints="0;1;1" keyTimes="0;.2;1" calcMode="linear" />
              <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.04;.08;.14;.18;1" dur="8s" begin={`${e.i * 1.8}s`} repeatCount="indefinite" />
              <rect className="lf-chip" x={-(e.label.length * 6.0 + 21) / 2} y="-10.5" width={e.label.length * 6.0 + 21} height="21" rx="10.5" stroke={e.to} strokeOpacity=".3" />
              <circle cx={-(e.label.length * 6.0 + 21) / 2 + 10} cy="0" r="2.8" fill={e.to} />
              <text x={-(e.label.length * 6.0 + 21) / 2 + 17} y="0.5" dominantBaseline="middle" fontSize="10.5" fontWeight="650" fill={e.to} fontFamily="Inter, Segoe UI, sans-serif">{e.label}</text>
            </g>
          </g>
        ))}

        {NODES.map((n, i) => (
          <foreignObject key={n.name} x={n.x} y={n.y} width={NW} height={NH}>
            <div className="lf-card" style={{ "--c": n.tone }}>
              <span className="lf-ic"><Icon name={n.icon} size={17} /></span>
              <div className="lf-txt">
                <b>{n.name}</b>
                <small>{n.who}</small>
                <em>{n.state}</em>
              </div>
              <span className="lf-n">{i + 1}</span>
            </div>
          </foreignObject>
        ))}
      </svg>
    </div>
  );
}
