import { useState } from "react";
import {
  PieChart, Pie, Cell, Sector, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area, LineChart, Line,
} from "recharts";

const ANIM = !location.search.includes("static");
const C = { blue: "#1f5fbf", teal: "#12b5a5", amber: "#f2a33a", purple: "#8b5cf6", red: "#e05252", green: "#22a55b", grey: "#c9d3e0", navy: "#1a3a6b" };

export const BY_STATUS = [
  { name: "Đang xử lý", value: 14, color: C.blue },
  { name: "Chờ phê duyệt", value: 9, color: C.amber },
  { name: "Chờ ký số", value: 5, color: C.purple },
  { name: "Đã hoàn tất", value: 31, color: C.teal },
  { name: "Từ chối", value: 4, color: C.red },
];
export const BY_TYPE = [
  { name: "Công văn đến", value: 20, color: C.blue }, { name: "Công văn đi", value: 12, color: C.teal }, { name: "Hợp đồng", value: 8, color: C.amber }, { name: "Quyết định", value: 6, color: C.purple }, { name: "Khác", value: 10, color: C.grey },
];
const WEEKLY = [
  { w: "T2", in: 6, out: 3 }, { w: "T3", in: 9, out: 5 }, { w: "T4", in: 7, out: 4 }, { w: "T5", in: 11, out: 6 }, { w: "T6", in: 8, out: 7 }, { w: "T7", in: 3, out: 2 }, { w: "CN", in: 1, out: 0 },
];
const TREND = [
  { m: "T12", hours: 52 }, { m: "T1", hours: 47 }, { m: "T2", hours: 41 }, { m: "T3", hours: 36 }, { m: "T4", hours: 30 }, { m: "T5", hours: 26 },
];
const DEPT = [
  { d: "Kinh doanh", pending: 6, done: 14 }, { d: "Pháp chế", pending: 4, done: 9 }, { d: "Tài chính", pending: 5, done: 11 }, { d: "HCNS", pending: 2, done: 8 }, { d: "IT", pending: 3, done: 5 }, { d: "Đào tạo", pending: 2, done: 3 },
];
const AI = [
  { m: "T12", acc: 82 }, { m: "T1", acc: 85 }, { m: "T2", acc: 87 }, { m: "T3", acc: 89 }, { m: "T4", acc: 91 }, { m: "T5", acc: 93 },
];

const tipStyle = { borderRadius: 10, border: "1px solid #e3e9f2", boxShadow: "0 8px 24px rgba(26,58,107,.12)", fontSize: 13 };

function ActiveShape(p) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, midAngle } = p;
  const RAD = Math.PI / 180; const sin = Math.sin(-RAD * midAngle); const cos = Math.cos(-RAD * midAngle);
  const sx = cx + (outerRadius + 6) * cos, sy = cy + (outerRadius + 6) * sin;
  const mx = cx + (outerRadius + 22) * cos, my = cy + (outerRadius + 22) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 18, ey = my; const ta = cos >= 0 ? "start" : "end";
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={6} />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} strokeWidth={2} fill="none" />
      <circle cx={ex} cy={ey} r={3} fill={fill} />
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={ta} dominantBaseline="middle" fontSize={13} fontWeight={700} fill="#1a3a6b">{payload.name}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey + 16} textAnchor={ta} fontSize={12} fill="#6b7788">{payload.value} văn bản · {(percent * 100).toFixed(0)}%</text>
    </g>
  );
}

export function Donut({ data, unit = "văn bản", height = 260 }) {
  const [i, setI] = useState(null);
  const total = data.reduce((a, b) => a + b.value, 0);
  const cur = i == null ? null : data[i];
  return (
    <div className="chart-donut">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="58%" outerRadius="78%" paddingAngle={2} cornerRadius={6} stroke="none"
            activeIndex={i} activeShape={ActiveShape} onMouseEnter={(_, idx) => setI(idx)} onMouseLeave={() => setI(null)} isAnimationActive={ANIM} animationDuration={700}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
          <text x="50%" y="47%" textAnchor="middle" fontSize={26} fontWeight={800} fill="#1a3a6b">{cur ? cur.value : total}</text>
          <text x="50%" y="47%" dy={20} textAnchor="middle" fontSize={12} fill="#6b7788">{cur ? cur.name : unit}</text>
        </PieChart>
      </ResponsiveContainer>
      <ul className="legend">
        {data.map((d, idx) => (
          <li key={d.name} className={i === idx ? "on" : ""} onMouseEnter={() => setI(idx)} onMouseLeave={() => setI(null)}>
            <i style={{ background: d.color }} />{d.name}<b>{d.value}</b><span>{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WeeklyBars({ height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={WEEKLY} barGap={4} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="#eef1f5" />
        <XAxis dataKey="w" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7788" }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7788" }} width={28} />
        <Tooltip cursor={{ fill: "#f4f6fb" }} contentStyle={tipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="in" name="Văn bản đến" fill={C.blue} radius={[6, 6, 0, 0]} animationDuration={800} isAnimationActive={ANIM} />
        <Bar dataKey="out" name="Văn bản đi" fill={C.teal} radius={[6, 6, 0, 0]} animationDuration={800} isAnimationActive={ANIM} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendArea({ height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={TREND}>
        <defs><linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.blue} stopOpacity={.35} /><stop offset="100%" stopColor={C.blue} stopOpacity={0} /></linearGradient></defs>
        <CartesianGrid vertical={false} stroke="#eef1f5" />
        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7788" }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7788" }} width={28} unit="h" />
        <Tooltip contentStyle={tipStyle} formatter={(v) => [`${v} giờ`, "Thời gian xử lý TB"]} />
        <Area type="monotone" dataKey="hours" stroke={C.blue} strokeWidth={2.5} fill="url(#gBlue)" dot={{ r: 4, fill: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={900} isAnimationActive={ANIM} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DeptBars({ height = 230 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={DEPT} layout="vertical" barCategoryGap="28%">
        <CartesianGrid horizontal={false} stroke="#eef1f5" />
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7788" }} />
        <YAxis type="category" dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#26313f" }} width={78} />
        <Tooltip cursor={{ fill: "#f4f6fb" }} contentStyle={tipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="done" name="Đã xử lý" stackId="a" fill={C.teal} radius={[0, 0, 0, 0]} animationDuration={800} isAnimationActive={ANIM} />
        <Bar dataKey="pending" name="Đang chờ" stackId="a" fill={C.amber} radius={[0, 6, 6, 0]} animationDuration={800} isAnimationActive={ANIM} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AILine({ height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={AI}>
        <CartesianGrid vertical={false} stroke="#eef1f5" />
        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7788" }} />
        <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7788" }} width={40} unit="%" />
        <Tooltip contentStyle={tipStyle} formatter={(v) => [`${v}%`, "Độ chính xác đề xuất"]} />
        <Line type="monotone" dataKey="acc" stroke={C.purple} strokeWidth={2.5} dot={{ r: 4, fill: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={900} isAnimationActive={ANIM} />
      </LineChart>
    </ResponsiveContainer>
  );
}
