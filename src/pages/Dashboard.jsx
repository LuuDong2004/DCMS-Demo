import { Icon, Card } from "../ui";
import AIHero from "./AIHero";
import { Donut, WeeklyBars, DeptBars, AILine, BY_STATUS } from "./Charts";


export default function Dashboard({ docs, go }) {
  const BUCKET = { processing: 0, returned: 0, signed: 0, pending: 1, signing: 2, done: 3, published: 3, rejected: 4 };
  const counts = [11, 8, 5, 27, 4];
  docs.forEach((d) => { counts[BUCKET[d.status] ?? 0] += 1; });
  const liveStatus = BY_STATUS.map((s, i) => ({ ...s, value: counts[i] }));
  const total = counts.reduce((a, b) => a + b, 0);
  return (
    <div className="dash">
      <div className="dash-main">
        <AIHero total={total} go={go} queue={docs.reduce((q, d) => ({ ...q, [d.status]: (q[d.status] || 0) + 1 }), {})} />

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
