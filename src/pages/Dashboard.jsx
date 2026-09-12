import { Icon, Card } from "../ui";
import { Donut, WeeklyBars, DeptBars, AILine, BY_STATUS } from "./Charts";


export default function Dashboard({ docs, go }) {
  const BUCKET = { processing: 0, returned: 0, signed: 0, pending: 1, signing: 2, done: 3, published: 3, rejected: 4 };
  const counts = [11, 8, 5, 27, 4];
  docs.forEach((d) => { counts[BUCKET[d.status] ?? 0] += 1; });
  const liveStatus = BY_STATUS.map((s, i) => ({ ...s, value: counts[i] }));
  const total = counts.reduce((a, b) => a + b, 0);
  const waiting = docs.filter((d) => ["pending", "signing", "signed", "returned"].includes(d.status)).length;
  return (
    <div className="dash">
      <div className="dash-main">
        <div className="page-head">
          <div>
            <h1>Bảng điều khiển</h1>
            <p className="muted">Tổng quan {total} văn bản đang lưu hành, tiến độ phê duyệt và hiệu suất xử lý.</p>
          </div>
          <div className="page-actions">
            <button className="btn ghost" onClick={() => go("landing")}><Icon name="sparkles" size={16} />Giới thiệu hệ thống</button>
            <button className="btn ghost" onClick={() => go("todo")}><Icon name="bell" size={16} />{waiting} việc cần xử lý</button>
          </div>
        </div>

        <div className="quick">
          <button className="q primary" onClick={() => go("create")}><Icon name="send" /><b>Tạo văn bản đi</b></button>
          <button className="q" onClick={() => go("create", { dir: "in" })}><Icon name="upload" /><b>Tạo văn bản đến</b></button>
          <button className="q" onClick={() => go("docs")}><Icon name="search" /><b>Tra cứu văn bản</b></button>
          <button className="q" onClick={() => go("workflow")}><Icon name="flow" /><b>Xem quy trình</b></button>
        </div>

        <div className="grid2">
          <Card title="Tình trạng xử lý" action={<span className="select-like">Tháng này</span>}><Donut data={liveStatus} /></Card>
          <Card title="Văn bản đến / đi theo ngày" action={<span className="select-like">7 ngày qua</span>}><WeeklyBars /></Card>
        </div>
        <div className="grid2">
          <Card title="Khối lượng theo phòng ban" action={<button className="link">Chi tiết</button>}><DeptBars /></Card>
          <Card title="Độ chính xác đề xuất của AI" action={<span className="kpi-delta up">↑ 93% tháng này</span>}><AILine /></Card>
        </div>
        </div>


    </div>
  );
}
