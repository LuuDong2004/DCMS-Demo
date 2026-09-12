import { Icon } from "../ui";
import AIHeroNova from "./AIHeroNova";

export default function AIHero() {
  return (
    <div className="ai-hero is-nova">
      <div className="ai-hero-left">
        <div className="hero-brand">DCMS · DOCUMENT COORDINATION</div>
        <h1>Hệ thống AI Điều phối và Quản lý Tài liệu Doanh nghiệp</h1>
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
      <AIHeroNova />
    </div>
  );
}
