import { Icon } from "../ui";
import AIHeroNova from "./AIHeroNova";

const SOURCES = [
  ["db", "#2a7bff", "ERP"], ["users", "#12b5a5", "CRM"], ["building", "#f2a33a", "HRM"],
  ["chart", "#8b5cf6", "Kế toán"], ["mail", "#e05252", "Email"], ["upload", "#1a9a55", "Người dùng"],
];

export default function AIHero() {
  return (
    <div className="ai-hero is-nova">
      <div className="ai-hero-left hl2">
        <div className="hl-eyebrow"><i />Document Coordination Management System</div>
        <h1>Hệ thống AI Điều phối và Quản{" "}lý Tài{" "}liệu Doanh{" "}nghiệp</h1>
        <p>Tài liệu từ ERP, CRM, HRM, kế toán, email đổ về DCMS. AI phân tích và đề xuất, workflow điều phối phê duyệt, ký số, con người quyết định.</p>

        <div className="hl-kpis">
          <div><span className="hl-kic"><Icon name="docs" size={15} /></span><b>63</b><small>Văn bản / tháng</small></div>
          <div><span className="hl-kic"><Icon name="sparkles" size={15} /></span><b>93%</b><small>Độ chính xác AI</small></div>
          <div><span className="hl-kic"><Icon name="clock" size={15} /></span><b>26h</b><small>Xử lý trung bình</small></div>
        </div>

        <ul className="hl-feats">
          <li><Icon name="done" size={16} />Tiết kiệm thời gian xử lý văn bản</li>
          <li><Icon name="done" size={16} />Giảm sai sót thủ công</li>
          <li><Icon name="done" size={16} />Minh bạch, có audit đầy đủ</li>
        </ul>

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
