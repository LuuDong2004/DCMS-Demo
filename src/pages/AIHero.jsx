import { Icon } from "../ui";
import AIHeroNova from "./AIHeroNova";

const SOURCES = [
  ["db", "#2a7bff", "ERP"], ["users", "#12b5a5", "CRM"], ["building", "#f2a33a", "HRM"],
  ["chart", "#8b5cf6", "Kế toán"], ["mail", "#e05252", "Email"], ["upload", "#1a9a55", "Người dùng"],
];

export default function AIHero({ total = 63, go = () => {}, queue = {} }) {
  const parts = [["pending", "chờ phê duyệt"], ["signing", "chờ ký số"], ["signed", "chờ phát hành"], ["returned", "chờ chỉnh sửa"]].filter(([k]) => queue[k]);
  const waiting = parts.reduce((a, [k]) => a + queue[k], 0);
  return (
    <div className="ai-hero is-nova">
      <div className="ai-hero-left hl2">
        <h1>Hệ thống AI Điều phối và Quản{" "}lý Tài{" "}liệu Doanh{" "}nghiệp</h1>
        <p>Tài liệu từ ERP, CRM, HRM, kế toán, email đổ về DCMS. AI phân tích và đề xuất, workflow điều phối phê duyệt, ký số, con người quyết định.</p>

        <div className="hl-stats">
          <div><span className="hs-top"><b>{total}</b><em>↑ 12%</em></span><small>Văn bản/tháng</small></div>
          <div><span className="hs-top"><b>93%</b><em>↑ 2%</em></span><small>Chính xác AI</small></div>
          <div><span className="hs-top"><b>26h</b><em>↓ 18%</em></span><small>Xử lý TB</small></div>
        </div>

        <ul className="hl-feats">
          <li><Icon name="done" size={16} />Tiết kiệm thời gian xử lý văn bản</li>
          <li><Icon name="done" size={16} />Giảm sai sót thủ công</li>
          <li><Icon name="done" size={16} />Minh bạch, có audit đầy đủ</li>
        </ul>

        <button className="hl-queue" onClick={() => go("todo")}>
          <span className="hq-ic"><Icon name="bell" size={18} /></span>
          <span className="hq-txt"><b>{waiting} văn bản đang chờ bạn xử lý</b><small>{parts.length ? parts.map(([k, l]) => `${queue[k]} ${l}`).join(" · ") : "Không có việc tồn đọng"}</small></span>
          <Icon name="chevron" size={16} />
        </button>

        <div className="hl-src">
          <small>Đã kết nối</small>
          <div className="hl-stack">
            {SOURCES.map(([ic, c, n]) => <span key={n} title={n} style={{ "--c": c }}><Icon name={ic} size={14} /></span>)}
          </div>
          <em>6 nguồn dữ liệu</em>
        </div>
      </div>
      <AIHeroNova />
    </div>
  );
}
