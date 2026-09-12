export const USER = { name: "Lưu Văn Đông", role: "Admin", dept: "Phòng IT" };

export const STATUS = {
  processing: { label: "Đang xử lý", tone: "info" },
  pending: { label: "Chờ phê duyệt", tone: "warn" },
  approved: { label: "Đã duyệt", tone: "ok" },
  rejected: { label: "Từ chối", tone: "danger" },
  signing: { label: "Chờ ký số", tone: "purple" },
  signed: { label: "Chờ phát hành", tone: "purple" },
  published: { label: "Đã phát hành", tone: "info" },
  done: { label: "Đã hoàn tất", tone: "ok" },
  returned: { label: "Chờ chỉnh sửa", tone: "orange" },
};

export const TYPES = ["Công văn đến", "Công văn đi", "Hợp đồng", "Quyết định", "Báo cáo", "Tờ trình", "Kế hoạch"];
export const DEPTS = ["Phòng Kinh doanh", "Phòng Pháp chế", "Phòng Tài chính", "Phòng Hành chính – Nhân sự", "Phòng Đào tạo", "Phòng IT", "Ban Giám đốc"];

export const DOCUMENTS = [
  { id: "VB-2026-0102", title: "Đề nghị hợp tác đào tạo", type: "Công văn đến", dir: "in", status: "pending", date: "12/09/2026 10:24", creator: "Công ty ABC", dept: "Phòng Đào tạo", source: "Email", priority: "Cao", deadline: "15/09/2026", amount: null,
    summary: "Công ty ABC đề nghị hợp tác đào tạo kỹ năng số cho 120 nhân viên trong quý IV/2026, kèm dự toán chi phí và lịch dự kiến.",
    ai: { type: "Công văn đến", dept: "Phòng Đào tạo", workflow: "Trưởng phòng Đào tạo → Giám đốc", confidence: 92, fields: [["Đơn vị gửi", "Công ty ABC"], ["Lĩnh vực", "Đào tạo"], ["Hạn xử lý", "15/09/2026"], ["Số hiệu", "123/CV-ABC"]] },
    steps: [{ name: "Tạo văn bản", who: "Hệ thống (Email)", state: "done", time: "12/09/2026 10:24" }, { name: "AI phân tích", who: "AI Agent", state: "done", time: "12/09/2026 10:25" }, { name: "Đề xuất xử lý", who: "AI Agent", state: "done", time: "12/09/2026 10:25" }, { name: "Trưởng phòng Đào tạo", who: "Phạm Thị E", state: "current", time: "" }, { name: "Giám đốc", who: "Lê Văn D", state: "wait", time: "" }, { name: "Hoàn tất", who: "Hệ thống", state: "wait", time: "" }] },
  { id: "VB-2026-0101", title: "Hợp đồng cung cấp thiết bị", type: "Hợp đồng", dir: "out", status: "signing", date: "11/09/2026 16:32", creator: "Nguyễn Văn A", dept: "Phòng Kinh doanh", source: "CRM", priority: "Cao", deadline: "16/09/2026", amount: "2.000.000.000 ₫",
    summary: "Hợp đồng cung cấp thiết bị văn phòng cho Công ty ABC, giá trị 2 tỷ đồng, thời hạn giao hàng 30 ngày, bảo hành 24 tháng.",
    ai: { type: "Hợp đồng", dept: "Phòng Pháp chế", workflow: "Trưởng phòng → Pháp chế → Tài chính → Giám đốc → Ký số", confidence: 95, fields: [["Đối tác", "Công ty ABC"], ["Giá trị", "2.000.000.000 ₫"], ["Mã CRM", "HD-2026-001"], ["Hiệu lực", "12 tháng"]] },
    steps: [{ name: "Tạo văn bản", who: "CRM → API", state: "done", time: "11/09/2026 16:32" }, { name: "AI phân tích", who: "AI Agent", state: "done", time: "11/09/2026 16:33" }, { name: "Trưởng phòng KD", who: "Nguyễn Văn B", state: "done", time: "12/09/2026 08:15" }, { name: "Phòng Pháp chế", who: "Trần Thị C", state: "done", time: "12/09/2026 14:20" }, { name: "Phòng Tài chính", who: "Hoàng Văn F", state: "done", time: "13/09/2026 09:40" }, { name: "Giám đốc ký số", who: "Lê Văn D", state: "current", time: "" }, { name: "Đồng bộ CRM", who: "Integration Layer", state: "wait", time: "" }] },
  { id: "VB-2026-0098", title: "Báo cáo tình hình hoạt động", type: "Báo cáo", dir: "out", status: "signed", date: "10/09/2026 14:20", creator: "Trần Văn G", dept: "Phòng Hành chính – Nhân sự", source: "Nhập tay", priority: "Thường", deadline: "20/09/2026", amount: null,
    summary: "Báo cáo hoạt động quý II: doanh thu, nhân sự, các dự án trọng điểm và kế hoạch quý IV.",
    ai: { type: "Báo cáo", dept: "Ban Giám đốc", workflow: "Trưởng phòng → Giám đốc", confidence: 88, fields: [["Kỳ báo cáo", "Quý III/2026"], ["Số trang", "14"]] },
    steps: [{ name: "Tạo văn bản", who: "Trần Văn G", state: "done", time: "10/09/2026 14:20" }, { name: "AI phân tích", who: "AI Agent", state: "done", time: "10/09/2026 14:21" }, { name: "Trưởng phòng", who: "Phạm Thị E", state: "done", time: "10/09/2026 16:00" }, { name: "Giám đốc ký số", who: "Lê Văn D", state: "done", time: "11/09/2026 09:10" }, { name: "Phát hành", who: "Hệ thống", state: "current", time: "" }] },
  { id: "VB-2026-0097", title: "Quyết định bổ nhiệm", type: "Quyết định", dir: "out", status: "published", date: "09/09/2026 09:15", creator: "HRM", dept: "Phòng Hành chính – Nhân sự", source: "HRM", priority: "Thường", deadline: "12/09/2026", amount: null,
    summary: "Quyết định bổ nhiệm ông Lê Văn C giữ chức Trưởng phòng IT kể từ ngày 15/09/2026.",
    ai: { type: "Quyết định", dept: "Phòng Hành chính – Nhân sự", workflow: "Trưởng phòng HCNS → Giám đốc → Ký số", confidence: 97, fields: [["Nhân sự", "Lê Văn C"], ["Chức vụ", "Trưởng phòng IT"], ["Hiệu lực", "15/09/2026"]] },
    steps: [{ name: "Tạo văn bản", who: "HRM → Webhook", state: "done", time: "09/09/2026 09:15" }, { name: "AI phân tích", who: "AI Agent", state: "done", time: "09/09/2026 09:16" }, { name: "Trưởng phòng HCNS", who: "Phạm Thị E", state: "done", time: "09/09/2026 10:30" }, { name: "Giám đốc ký số", who: "Lê Văn D", state: "done", time: "09/09/2026 15:00" }, { name: "Phát hành & đồng bộ HRM", who: "Hệ thống", state: "done", time: "09/09/2026 15:02" }] },
  { id: "VB-2026-0096", title: "Văn bản trả lời đối tác", type: "Công văn đi", dir: "out", status: "done", date: "08/09/2026 17:42", creator: "Nguyễn Văn A", dept: "Phòng Kinh doanh", source: "Nhập tay", priority: "Thường", deadline: "10/09/2026", amount: null,
    summary: "Trả lời Công ty XYZ về đề nghị gia hạn hợp đồng bảo trì, đồng ý gia hạn 6 tháng.",
    ai: { type: "Công văn đi", dept: "Phòng Kinh doanh", workflow: "Trưởng phòng → Giám đốc", confidence: 90, fields: [["Đối tác", "Công ty XYZ"], ["Chủ đề", "Gia hạn bảo trì"]] },
    steps: [{ name: "Tạo văn bản", who: "Nguyễn Văn A", state: "done", time: "08/09/2026 17:42" }, { name: "AI phân tích", who: "AI Agent", state: "done", time: "08/09/2026 17:43" }, { name: "Trưởng phòng", who: "Nguyễn Văn B", state: "done", time: "09/09/2026 08:00" }, { name: "Giám đốc", who: "Lê Văn D", state: "done", time: "09/09/2026 11:20" }, { name: "Hoàn tất", who: "Hệ thống", state: "done", time: "09/09/2026 11:21" }] },
  { id: "VB-2026-0095", title: "Đề nghị mua sắm thiết bị CNTT", type: "Tờ trình", dir: "in", status: "processing", date: "08/09/2026 09:05", creator: "ERP", dept: "Phòng IT", source: "ERP", priority: "Cao", deadline: "14/09/2026", amount: "850.000.000 ₫",
    summary: "Đề nghị mua 40 máy tính xách tay và 2 máy chủ phục vụ mở rộng đội ngũ phát triển, tổng dự toán 850 triệu đồng.",
    ai: { type: "Đề nghị mua sắm", dept: "Phòng IT", workflow: "Trưởng phòng IT → Tài chính → Giám đốc → Ký số", confidence: 93, fields: [["Mã ERP", "PO-2026-001"], ["Giá trị", "850.000.000 ₫"], ["Số lượng", "42 thiết bị"]] },
    steps: [{ name: "Tạo văn bản", who: "ERP → API", state: "done", time: "08/09/2026 09:05" }, { name: "AI phân tích", who: "AI Agent", state: "done", time: "08/09/2026 09:06" }, { name: "Trưởng phòng IT", who: "Lê Văn C", state: "current", time: "" }, { name: "Phòng Tài chính", who: "Hoàng Văn F", state: "wait", time: "" }, { name: "Giám đốc ký số", who: "Lê Văn D", state: "wait", time: "" }, { name: "Đồng bộ ERP", who: "Integration Layer", state: "wait", time: "" }] },
  { id: "VB-2026-0094", title: "Kế hoạch triển khai DCMS giai đoạn 2", type: "Kế hoạch", dir: "out", status: "rejected", date: "07/09/2026 10:00", creator: "Lê Văn C", dept: "Phòng IT", source: "Nhập tay", priority: "Thường", deadline: "20/09/2026", amount: null,
    summary: "Kế hoạch triển khai tích hợp DCMS với ERP và HRM, dự kiến 3 tháng, cần bổ sung ngân sách và nhân sự.",
    ai: { type: "Kế hoạch", dept: "Ban Giám đốc", workflow: "Trưởng phòng → Giám đốc", confidence: 85, fields: [["Thời gian", "3 tháng"], ["Phạm vi", "ERP, HRM"]] },
    steps: [{ name: "Tạo văn bản", who: "Lê Văn C", state: "done", time: "07/09/2026 10:00" }, { name: "AI phân tích", who: "AI Agent", state: "done", time: "07/09/2026 10:01" }, { name: "Giám đốc", who: "Lê Văn D", state: "rejected", time: "08/09/2026 09:30", note: "Bổ sung dự toán chi tiết và lộ trình theo tuần." }] },
  { id: "VB-2026-0093", title: "Đề nghị thanh toán đợt 2 dự án Alpha", type: "Tờ trình", dir: "in", status: "approved", date: "06/09/2026 15:12", creator: "Kế toán", dept: "Phòng Tài chính", source: "Kế toán", priority: "Thường", deadline: "13/09/2026", amount: "320.000.000 ₫",
    summary: "Thanh toán đợt 2 cho nhà thầu dự án Alpha theo tiến độ nghiệm thu 60%.",
    ai: { type: "Đề nghị thanh toán", dept: "Phòng Tài chính", workflow: "Kế toán trưởng → Giám đốc", confidence: 91, fields: [["Nhà thầu", "Công ty Beta"], ["Giá trị", "320.000.000 ₫"]] },
    steps: [{ name: "Tạo văn bản", who: "Kế toán → API", state: "done", time: "06/09/2026 15:12" }, { name: "AI phân tích", who: "AI Agent", state: "done", time: "06/09/2026 15:13" }, { name: "Kế toán trưởng", who: "Hoàng Văn F", state: "done", time: "07/09/2026 08:45" }, { name: "Giám đốc ký số", who: "Lê Văn D", state: "current", time: "" }] },
];

export const TASKS = [
  { doc: "VB-2026-0102", title: "Đề nghị hợp tác đào tạo", type: "Công văn đến", priority: "Cao", left: "Còn 2 giờ", urgent: true },
  { doc: "VB-2026-0101", title: "Hợp đồng cung cấp thiết bị", type: "Hợp đồng", priority: "Cao", left: "Còn 5 giờ", urgent: true },
  { doc: "VB-2026-0098", title: "Báo cáo quý II", type: "Báo cáo", priority: "Thường", left: "Còn 1 ngày", urgent: false },
  { doc: "VB-2026-0095", title: "Đề nghị mua sắm thiết bị CNTT", type: "Tờ trình", priority: "Cao", left: "Còn 2 ngày", urgent: false },
];

export const ACTIVITY = [
  { time: "10:24", text: "Nguyễn Văn A tạo văn bản VB-2026-0102", sub: "Công văn đến · Đề nghị hợp tác đào tạo" },
  { time: "09:45", text: "AI Agent đã hoàn thành phân tích văn bản", sub: "Độ tin cậy: 92% · Đề xuất: Phòng Đào tạo" },
  { time: "09:32", text: "Trần Thị B phê duyệt văn bản VB-2026-0098", sub: "Báo cáo quý II" },
  { time: "08:15", text: "Lê Văn C ký số văn bản VB-2026-0097", sub: "Quyết định bổ nhiệm" },
  { time: "08:02", text: "ERP đẩy tài liệu PO-2026-001 vào DCMS", sub: "Integration Layer · Webhook" },
];

export const USERS = [
  { name: "Nguyễn Văn A", email: "a.nguyen@company.vn", role: "Nhân viên", dept: "Phòng Kinh doanh", active: true },
  { name: "Nguyễn Văn B", email: "b.nguyen@company.vn", role: "Trưởng phòng", dept: "Phòng Kinh doanh", active: true },
  { name: "Trần Thị C", email: "c.tran@company.vn", role: "Pháp chế", dept: "Phòng Pháp chế", active: true },
  { name: "Lê Văn D", email: "d.le@company.vn", role: "Giám đốc", dept: "Ban Giám đốc", active: true },
  { name: "Phạm Thị E", email: "e.pham@company.vn", role: "Trưởng phòng", dept: "Phòng Hành chính – Nhân sự", active: true },
  { name: "Hoàng Văn F", email: "f.hoang@company.vn", role: "Kế toán trưởng", dept: "Phòng Tài chính", active: true },
  { name: "Lê Văn C", email: "c.le@company.vn", role: "Trưởng phòng", dept: "Phòng IT", active: false },
  { name: "Lưu Văn Đông", email: "dong.luu@company.vn", role: "Admin", dept: "Phòng IT", active: true },
];

export const ROLES = [
  { name: "Nhân viên", users: 24, perms: ["Tạo văn bản", "Xem văn bản của mình", "Theo dõi trạng thái"] },
  { name: "Trưởng phòng", users: 7, perms: ["Phê duyệt cấp phòng", "Từ chối / yêu cầu sửa", "Xem văn bản phòng ban"] },
  { name: "Pháp chế", users: 2, perms: ["Thẩm định pháp lý", "Yêu cầu chỉnh sửa hợp đồng"] },
  { name: "Kế toán trưởng", users: 1, perms: ["Phê duyệt tài chính", "Xem chứng từ thanh toán"] },
  { name: "Giám đốc", users: 1, perms: ["Phê duyệt cấp cao", "Ký số", "Xem toàn bộ báo cáo"] },
  { name: "Quản trị hệ thống", users: 1, perms: ["Quản lý người dùng", "Cấu hình workflow", "Xem nhật ký hệ thống", "Cấu hình tích hợp"] },
];

export const WORKFLOWS = [
  { name: "Hợp đồng ≥ 1 tỷ", type: "Hợp đồng", steps: ["Trưởng phòng", "Pháp chế", "Tài chính", "Giám đốc", "Ký số"], mode: "Tuần tự", active: true },
  { name: "Hợp đồng < 1 tỷ", type: "Hợp đồng", steps: ["Trưởng phòng", "Pháp chế", "Giám đốc", "Ký số"], mode: "Tuần tự", active: true },
  { name: "Công văn đến", type: "Công văn đến", steps: ["Trưởng phòng phụ trách", "Giám đốc"], mode: "Tuần tự", active: true },
  { name: "Đề nghị mua sắm", type: "Tờ trình", steps: ["Trưởng phòng", "Tài chính", "Giám đốc", "Ký số"], mode: "Tuần tự", active: true },
  { name: "Quyết định nhân sự", type: "Quyết định", steps: ["Trưởng phòng HCNS", "Giám đốc", "Ký số"], mode: "Tuần tự", active: true },
  { name: "Báo cáo định kỳ", type: "Báo cáo", steps: ["Trưởng phòng + Kế toán trưởng", "Giám đốc"], mode: "Song song", active: false },
];

export const LOGS = [
  { time: "12/09/2026 10:25:14", actor: "AI Agent", action: "ANALYZE", target: "VB-2026-0102", detail: "Phân loại: Công văn đến · Độ tin cậy 92%" },
  { time: "12/09/2026 10:24:50", actor: "System", action: "INGEST_EMAIL", target: "VB-2026-0102", detail: "Nhận từ mailbox vanthu@company.vn" },
  { time: "12/09/2026 09:40:02", actor: "Hoàng Văn F", action: "APPROVE", target: "VB-2026-0101", detail: "Phê duyệt cấp Tài chính" },
  { time: "12/09/2026 08:02:11", actor: "Integration", action: "WEBHOOK_IN", target: "PO-2026-001", detail: "Nguồn: ERP · Tạo VB-2026-0095" },
  { time: "11/09/2026 09:10:33", actor: "Lê Văn D", action: "SIGN", target: "VB-2026-0098", detail: "Ký số thành công · Chứng thư hợp lệ" },
  { time: "09/09/2026 15:02:40", actor: "Integration", action: "WEBHOOK_OUT", target: "VB-2026-0097", detail: "Đồng bộ HRM: status = PUBLISHED" },
  { time: "08/09/2026 09:30:05", actor: "Lê Văn D", action: "REJECT", target: "VB-2026-0094", detail: "Bổ sung dự toán chi tiết" },
  { time: "08/09/2026 08:00:00", actor: "Admin", action: "UPDATE_ROLE", target: "Lê Văn C", detail: "Gán vai trò Trưởng phòng IT" },
];

export const INTEGRATIONS = [
  { name: "ERP", vendor: "SAP B1", status: "Kết nối", last: "12/09/2026 08:02", docs: 128, mode: "API + Webhook" },
  { name: "CRM", vendor: "Salesforce", status: "Kết nối", last: "11/09/2026 16:32", docs: 64, mode: "API + Webhook" },
  { name: "HRM", vendor: "Base HRM", status: "Kết nối", last: "09/09/2026 09:15", docs: 41, mode: "Webhook" },
  { name: "Kế toán", vendor: "MISA", status: "Kết nối", last: "06/09/2026 15:12", docs: 87, mode: "API" },
  { name: "Email", vendor: "Microsoft 365", status: "Kết nối", last: "12/09/2026 10:24", docs: 212, mode: "Email connector" },
];
