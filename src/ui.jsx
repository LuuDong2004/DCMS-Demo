import { STATUS } from "./mock";

import {
  Home, Inbox, Send, FileText, Clock, Check, Plus, Bot, Lightbulb, AlignLeft, Users, ShieldCheck, GitBranch, ScrollText, Plug, Search, Bell, PenLine, Upload, Eye, X, ArrowLeft, File, ChevronDown, BarChart3, AlertTriangle, MoreHorizontal, Filter, LayoutGrid, ChevronRight, RefreshCw, Menu, PanelLeft, Download, Sparkles, CheckCircle2, Building2, Mail, Database,
} from "lucide-react";

const ICONS = {
  home: Home, inbox: Inbox, send: Send, docs: FileText, clock: Clock, check: Check, plus: Plus, ai: Bot, bulb: Lightbulb, summary: AlignLeft, users: Users, shield: ShieldCheck, flow: GitBranch, log: ScrollText, plug: Plug, search: Search, bell: Bell, sign: PenLine, upload: Upload, eye: Eye, x: X, back: ArrowLeft, file: File, down: ChevronDown, chart: BarChart3, warn: AlertTriangle, more: MoreHorizontal, filter: Filter, grid: LayoutGrid, chevron: ChevronRight, refresh: RefreshCw, menu: Menu, panel: PanelLeft, download: Download, sparkles: Sparkles, done: CheckCircle2, building: Building2, mail: Mail, db: Database,
};

export function Icon({ name, size = 18, className = "", strokeWidth = 1.9 }) {
  const C = ICONS[name] || File;
  return <C className={`ic ${className}`} size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export function Badge({ status, children, tone }) {
  const s = status ? STATUS[status] : null;
  return <span className={`badge ${tone || s?.tone || "info"}`}>{children || s?.label}</span>;
}

export function TypeTag({ type }) {
  const map = { "Công văn đến": "in", "Công văn đi": "out", "Hợp đồng": "contract", "Quyết định": "decision", "Báo cáo": "report", "Tờ trình": "proposal", "Kế hoạch": "plan" };
  return <span className={`type-tag ${map[type] || "in"}`}><Icon name="file" size={13} />{type}</span>;
}

export function Avatar({ name, size = 32 }) {
  const initials = name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${h} 60% 45%)` }}>{initials}</span>;
}

export function Card({ title, action, children, className = "", pad = true }) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card-head">
          <h3>{title}</h3>
          {action}
        </div>
      )}
      <div className={pad ? "card-body" : ""}>{children}</div>
    </div>
  );
}

export function Empty({ text }) {
  return <div className="empty"><Icon name="inbox" size={36} /><p>{text}</p></div>;
}

export function Logo({ size = 36 }) {
  return <img className="logo-svg" src="/logo.png" width={size} height={size} alt="DCMS" />;
}
