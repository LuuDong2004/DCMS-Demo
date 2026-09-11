import { useState } from "react";
import { Icon, Card } from "../ui";
import { TYPES, DEPTS } from "../mock";

export default function CreateDocument({ go, onCreate, dir = "out" }) {
  const [f, setF] = useState({ dir, title: "", type: "", dept: "", priority: "Thường", deadline: "", summary: "", file: null });
  const [analyzing, setAnalyzing] = useState(false);
  const [ai, setAi] = useState(null);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const guessType = f.title.toLowerCase().includes("hợp đồng") ? "Hợp đồng" : f.title.toLowerCase().includes("báo cáo") ? "Báo cáo" : f.title.toLowerCase().includes("quyết định") ? "Quyết định" : f.dir === "in" ? "Công văn đến" : "Công văn đi";
      const dept = guessType === "Hợp đồng" ? "Phòng Pháp chế" : guessType === "Quyết định" ? "Phòng Hành chính – Nhân sự" : "Phòng Kinh doanh";
      const wf = guessType === "Hợp đồng" ? "Trưởng phòng → Pháp chế → Tài chính → Giám đốc → Ký số" : "Trưởng phòng → Giám đốc";
      setAi({ type: guessType, dept, wf, confidence: 86 + Math.floor(Math.random() * 10), summary: f.summary || `Văn bản "${f.title || "chưa đặt tên"}" thuộc loại ${guessType.toLowerCase()}, cần xử lý bởi ${dept}.` });
      setF((s) => ({ ...s, type: s.type || guessType, dept: s.dept || dept }));
      setAnalyzing(false);
    }, 1200);
  };

  const submit = () => {
    if (!f.title) return;
    onCreate({ ...f, ai });
  };

  return (
    <div className="page">
      <button className="link back" onClick={() => go("home")}><Icon name="back" size={16} />Quay lại</button>
      <div className="page-head"><div><h1>{f.dir === "in" ? "Tạo văn bản đến" : "Tạo văn bản đi"}</h1><p className="muted">Nhập thông tin hoặc upload file, AI sẽ phân tích và đề xuất luồng xử lý.</p></div></div>
      <div className="detail-grid">
        <Card title="Thông tin văn bản">
          <div className="form">
            <div className="seg">
              <button className={f.dir === "out" ? "on" : ""} onClick={() => set("dir", "out")}>Văn bản đi</button>
              <button className={f.dir === "in" ? "on" : ""} onClick={() => set("dir", "in")}>Văn bản đến</button>
            </div>
            <label className="field"><span>Trích yếu *</span><input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="VD: Hợp đồng cung cấp thiết bị văn phòng" /></label>
            <div className="row2">
              <label className="field"><span>Loại văn bản</span><select value={f.type} onChange={(e) => set("type", e.target.value)}><option value="">AI tự nhận diện</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="field"><span>Phòng ban xử lý</span><select value={f.dept} onChange={(e) => set("dept", e.target.value)}><option value="">AI đề xuất</option>{DEPTS.map((t) => <option key={t}>{t}</option>)}</select></label>
            </div>
            <div className="row2">
              <label className="field"><span>Độ ưu tiên</span><select value={f.priority} onChange={(e) => set("priority", e.target.value)}><option>Thường</option><option>Cao</option><option>Khẩn</option></select></label>
              <label className="field"><span>Hạn xử lý</span><input type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></label>
            </div>
            <label className="field"><span>Nội dung / tóm tắt</span><textarea rows={5} value={f.summary} onChange={(e) => set("summary", e.target.value)} placeholder="Soạn thảo nội dung hoặc để trống nếu upload file" /></label>
            <label className="field"><span>File đính kèm</span>
              <div className="dropzone" onClick={() => set("file", "van-ban-dinh-kem.pdf")}>
                <Icon name="upload" size={22} />
                {f.file ? <b>{f.file}</b> : <span>Kéo thả file PDF, DOCX hoặc <u>chọn file</u></span>}
                <small>Tối đa 25 MB · OCR tự động với file scan</small>
              </div>
            </label>
            <div className="form-actions">
              <button className="btn ghost" onClick={() => go("home")}>Hủy</button>
              <button className="btn ghost" onClick={analyze} disabled={analyzing}><Icon name="ai" size={16} />{analyzing ? "Đang phân tích…" : "AI phân tích"}</button>
              <button className="btn primary" onClick={submit} disabled={!f.title}><Icon name="send" size={16} />Gửi xử lý</button>
            </div>
          </div>
        </Card>

        <div>
          <Card title={<span className="with-ic"><Icon name="ai" size={18} />AI Agent</span>}>
            {analyzing && <div className="ai-loading"><span className="spinner" />Đang đọc nội dung, phân loại và trích xuất thông tin…</div>}
            {!analyzing && !ai && <p className="muted small">Nhập trích yếu hoặc upload file rồi bấm <b>AI phân tích</b> để nhận đề xuất loại văn bản, phòng ban và workflow.</p>}
            {ai && !analyzing && (
              <>
                <div className="conf big">Độ tin cậy {ai.confidence}%</div>
                <div className="ai-grid">
                  <div><small>Loại tài liệu</small><b>{ai.type}</b></div>
                  <div><small>Phòng ban đề xuất</small><b>{ai.dept}</b></div>
                  <div className="span2"><small>Workflow đề xuất</small><b>{ai.wf}</b></div>
                </div>
                <h4 className="sub">Tóm tắt</h4><p className="ai-summary">{ai.summary}</p>
                <div className="ai-actions"><button className="btn sm" onClick={() => { set("type", ai.type); set("dept", ai.dept); }}>Áp dụng đề xuất</button></div>
              </>
            )}
          </Card>
          <Card title="Lưu ý">
            <ul className="tips">
              <li>Văn bản từ ERP / CRM / HRM được tạo tự động qua API, không cần nhập lại.</li>
              <li>Workflow cuối cùng do cấu hình hệ thống quyết định, AI chỉ đề xuất.</li>
              <li>Mọi thao tác được ghi vào nhật ký hệ thống.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
