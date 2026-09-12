import { Icon } from "../ui";
import AIHeroNova from "./AIHeroNova";

export default function AIHero({ total = 63, go = () => {}, queue = {} }) {
  const parts = [["pending", "chờ phê duyệt"], ["signing", "chờ ký số"], ["signed", "chờ phát hành"], ["returned", "chờ chỉnh sửa"]].filter(([k]) => queue[k]);
  const waiting = parts.reduce((a, [k]) => a + queue[k], 0);
  return (
    <div className="ai-hero is-nova">
      <div className="ai-hero-left hl2">
        <h1>Hệ thống AI Điều phối và Quản{" "}lý Tài{" "}liệu Doanh{" "}nghiệp</h1>
        <p>Tiếp nhận, phân tích và phê duyệt tài liệu từ mọi hệ thống trên một nền tảng.</p>

        <div className="hl-stats">
          <div><span className="hs-top"><b>{total}</b><em>↑ 12%</em></span><small>Văn bản/tháng</small></div>
          <div><span className="hs-top"><b>93%</b><em>↑ 2%</em></span><small>Chính xác AI</small></div>
          <div><span className="hs-top"><b>26h</b><em>↓ 18%</em></span><small>Xử lý TB</small></div>
        </div>

        <button className="hl-queue" onClick={() => go("todo")}>
          <span className="hq-ic"><Icon name="bell" size={18} /></span>
          <span className="hq-txt"><b>{waiting} văn bản chờ bạn xử lý</b></span>
          <Icon name="chevron" size={16} />
        </button>
      </div>
      <AIHeroNova />
    </div>
  );
}
