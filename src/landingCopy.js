// Nội dung landing page hai ngôn ngữ. Icon/màu dùng chung, chỉ chữ đổi theo lang.
export const ICONS = {
  features: ["ai", "flow", "sign", "plug", "chart", "shield"],
  steps: ["inbox", "ai", "flow", "check", "refresh"],
  sources: ["db", "users", "building", "chart", "mail", "upload"],
};
export const COLORS = {
  features: ["#2a7bff", "#8b5cf6", "#0ea5a0", "#f59e0b", "#e05252", "#16a34a"],
  sources: ["#2a7bff", "#0ea5a0", "#f59e0b", "#8b5cf6", "#ef4444", "#16a34a"],
};

const vi = {
  nav: [["features", "Tính năng"], ["how", "Quy trình"], ["integrations", "Tích hợp"], ["benefits", "Lợi ích"], ["faq", "Câu hỏi"]],
  themeTitle: "Đổi giao diện",
  langTitle: "Switch to English",
  demoNav: "Xem bản demo",
  heroTag: "Document Coordination Management System",
  heroTitle: ["Điều phối và quản lý tài liệu doanh nghiệp bằng ", "AI"],
  heroLead: "DCMS tiếp nhận tài liệu từ mọi hệ thống, để AI phân loại và bóc tách dữ liệu, tự điều phối phê duyệt — ký số — phát hành, rồi đồng bộ kết quả trở lại ERP, CRM, HRM và kế toán.",
  heroCta1: "Trải nghiệm hệ thống",
  heroCta2: "Xem quy trình vận hành",
  heroTicks: ["Tiết kiệm thời gian xử lý văn bản", "Giảm sai sót thủ công", "Minh bạch, có audit đầy đủ"],
  stripLabel: "Đã kết nối",
  stripNote: "6 nguồn dữ liệu",

  problemEyebrow: "Vấn đề",
  problemTitle: "Tài liệu là nơi quy trình doanh nghiệp bị nghẽn",
  problemLead: "Mỗi hệ thống sinh ra tài liệu riêng, nhưng việc trình — duyệt — lưu trữ vẫn làm thủ công.",
  pains: [
    ["Văn bản rải rác nhiều nơi", "Email, ERP, CRM, bản in — không ai biết văn bản đang ở đâu, ai đang giữ."],
    ["Phê duyệt chậm, khó truy vết", "Trình ký qua nhiều cấp bằng tay, không có mốc thời gian và bằng chứng xử lý."],
    ["Nhập liệu lặp lại, dễ sai", "Cùng một hợp đồng phải gõ lại vào ERP, kế toán và sổ văn thư."],
  ],

  featEyebrow: "Tính năng",
  featTitle: "Một nền tảng cho toàn bộ vòng đời tài liệu",
  featLead: "Từ lúc tài liệu phát sinh đến khi được phát hành, lưu trữ và đồng bộ trở lại hệ nghiệp vụ.",
  featNavLabel: "Danh mục tính năng",
  features: [
    ["Trí tuệ nhân tạo", "AI phân loại & bóc tách", "Tự nhận diện loại văn bản, trích số hiệu, đối tác, giá trị, thời hạn và tóm tắt nội dung chính.", ["Độ chính xác 93%", "Trích xuất tự động"]],
    ["Quy trình", "Điều phối quy trình động", "Tự chọn luồng phê duyệt theo loại văn bản, phòng ban và giá trị; hỗ trợ trả về chỉnh sửa, trình lại.", ["Luồng theo loại VB", "Trả về · trình lại"]],
    ["Ký số", "Ký số & phát hành", "Ký số theo thứ tự thẩm quyền, phát hành kèm số văn bản và lưu trữ bản gốc bất biến.", ["Ký tuần tự", "Lưu trữ bất biến"]],
    ["Tích hợp", "Tích hợp hai chiều", "Nhận tài liệu từ ERP/CRM/HRM/Kế toán qua API–webhook và đồng bộ kết quả trở lại hệ nguồn.", ["REST API · webhook", "Hàng đợi & retry"]],
    ["Phân tích", "Báo cáo & KPI vận hành", "Theo dõi khối lượng, thời gian xử lý trung bình, điểm nghẽn theo phòng ban theo thời gian thực.", ["Dashboard realtime", "Cảnh báo trễ hạn"]],
    ["Bảo mật", "Phân quyền & nhật ký", "Vai trò theo chức danh, kiểm soát truy cập từng văn bản, nhật ký đầy đủ phục vụ audit.", ["RBAC theo chức danh", "Audit log đầy đủ"]],
  ],

  howEyebrow: "Quy trình",
  howTitle: "Năm bước, chạy tự động từ đầu đến cuối",
  howLead: "Người dùng chỉ cần quyết định; phần còn lại hệ thống tự điều phối.",
  steps: [
    ["Tiếp nhận", "Văn bản vào từ ERP, CRM, HRM, kế toán, email hoặc người dùng soạn thảo."],
    ["AI phân tích", "Phân loại, bóc tách dữ liệu, tóm tắt và đề xuất hướng xử lý kèm độ tin cậy."],
    ["Điều phối", "Hệ thống gán đúng quy trình, đúng người xử lý và đặt hạn theo quy định."],
    ["Phê duyệt & ký số", "Lãnh đạo duyệt trên web hoặc mobile, ký số tuần tự, có thể trả về chỉnh sửa."],
    ["Phát hành & đồng bộ", "Cấp số, phát hành, lưu trữ và đẩy kết quả về hệ thống nghiệp vụ liên quan."],
  ],
  flowNodes: [
    ["Tiếp nhận", "ERP · CRM · HRM", "Vào hệ thống"],
    ["AI phân tích", "AI Agent", "Phân loại · bóc tách"],
    ["Điều phối", "Theo loại văn bản", "Gán người xử lý"],
    ["Phê duyệt & ký số", "Lãnh đạo phê duyệt", "Duyệt tuần tự"],
    ["Phát hành", "Văn thư · hệ nguồn", "Cấp số · lưu trữ"],
  ],
  flowPackets: ["VB-0117", "Hợp đồng", "Đã duyệt", "Đã ký"],
  flowAria: "Sơ đồ năm bước xử lý văn bản của DCMS",
  novaSources: ["ERP", "CRM", "HRM", "Kế toán", "Email", "Người dùng"],
  novaStages: ["Phân tích", "Đề xuất", "Phê duyệt", "Ký số", "Đồng bộ"],
  novaDone: "Đã xử lý",

  intEyebrow: "Tích hợp",
  intTitle: "Lớp điều phối nằm trên hệ thống bạn đang dùng",
  intLead: "DCMS không yêu cầu thay thế ERP, CRM hay HRM. Tài liệu phát sinh ở đâu vẫn được đưa về một nơi để xử lý, và kết quả xử lý được trả lại đúng hệ thống nguồn.",
  intTicks: [
    "REST API & webhook hai chiều, có hàng đợi và cơ chế thử lại",
    "Đối soát trạng thái theo mã tham chiếu của hệ nguồn",
    "Giám sát kết nối, kiểm tra sức khoẻ và nhật ký từng lần đồng bộ",
  ],
  intCta: "Xem trang tích hợp trong demo",
  sources: [
    ["ERP", "Đơn hàng, hợp đồng mua sắm, đề nghị thanh toán"],
    ["CRM", "Hợp đồng khách hàng, báo giá, phụ lục"],
    ["HRM", "Quyết định nhân sự, tờ trình, nghỉ phép"],
    ["Kế toán", "Chứng từ, hóa đơn, bảng kê thanh toán"],
    ["Email", "Công văn đến từ đối tác, cơ quan quản lý"],
    ["Người dùng", "Soạn thảo trực tiếp hoặc tải tệp lên"],
  ],

  stats: [
    ["62%", "Giảm thời gian xử lý một văn bản"],
    ["93%", "Độ chính xác phân loại của AI"],
    ["6", "Hệ thống nghiệp vụ kết nối sẵn"],
    ["100%", "Thao tác có nhật ký phục vụ audit"],
  ],
  benEyebrow: "Lợi ích",
  benTitle: "Giá trị rõ ràng cho từng vai trò",
  benefits: [
    ["Lãnh đạo", "Nhìn toàn cảnh khối lượng công việc, biết văn bản nào đang nghẽn ở đâu và duyệt mọi lúc trên mobile."],
    ["Văn thư & hành chính", "Hết nhập liệu lặp, tự cấp số, tự lưu trữ theo khung phân loại, tìm lại văn bản trong vài giây."],
    ["Phòng ban nghiệp vụ", "Trình ký nhanh, biết chính xác đang chờ ai, nhận nhắc việc trước hạn."],
    ["Phòng IT", "Kết nối bằng API chuẩn, không phá vỡ hệ thống hiện hữu, phân quyền và nhật ký tập trung."],
  ],

  uiEyebrow: "Giao diện",
  uiTitle: "Thiết kế cho công việc hằng ngày",
  uiLead: "Bảng điều khiển, danh sách văn bản, sơ đồ quy trình và trợ lý AI trong cùng một không gian làm việc.",
  uiAlt: "Bảng điều khiển hệ thống DCMS",

  faqEyebrow: "Câu hỏi thường gặp",
  faqTitle: "Những điều doanh nghiệp hay hỏi",
  faq: [
    ["DCMS có thay thế ERP/CRM hiện tại của doanh nghiệp không?", "Không. DCMS là lớp điều phối tài liệu nằm trên các hệ thống đó: nhận tài liệu phát sinh từ ERP/CRM/HRM/kế toán, xử lý phê duyệt — ký số — phát hành, rồi đồng bộ kết quả trở lại hệ nguồn."],
    ["AI phân loại sai thì sao?", "Mọi đề xuất của AI đều kèm độ tin cậy và người xử lý có quyền chỉnh lại loại văn bản, phòng ban, quy trình. Các lần chỉnh sửa được ghi nhận để cải thiện độ chính xác."],
    ["Triển khai mất bao lâu?", "Bản chuẩn với luồng phê duyệt mặc định có thể chạy trong 2–4 tuần. Thời gian phụ thuộc số hệ thống cần tích hợp và mức độ tùy biến quy trình."],
    ["Dữ liệu được lưu ở đâu?", "Hỗ trợ cả triển khai trên hạ tầng của doanh nghiệp (on-premise) và cloud riêng. Tài liệu gốc lưu bất biến, truy cập theo phân quyền và có nhật ký đầy đủ."],
  ],

  ctaTitle: "Sẵn sàng xem DCMS chạy trên dữ liệu thật của bạn?",
  ctaLead: "Mở bản demo để thử toàn bộ luồng: tiếp nhận, AI phân tích, phê duyệt, ký số và đồng bộ.",
  ctaOpen: "Mở bản demo",
  ctaContact: "Liên hệ tư vấn",

  footTagline: "Hệ thống AI Điều phối và Quản lý Tài liệu Doanh nghiệp.",
  footDemo: "Bản demo",
  footNote: "© 2026 DCMS. Bản demo phục vụ giới thiệu giải pháp.",
};

const en = {
  nav: [["features", "Features"], ["how", "How it works"], ["integrations", "Integrations"], ["benefits", "Benefits"], ["faq", "FAQ"]],
  themeTitle: "Switch theme",
  langTitle: "Chuyển sang tiếng Việt",
  demoNav: "View live demo",
  heroTag: "Document Coordination Management System",
  heroTitle: ["Coordinate and manage enterprise documents with ", "AI"],
  heroLead: "DCMS ingests documents from every system, lets AI classify and extract their data, routes approval — digital signing — release automatically, then syncs the outcome back to ERP, CRM, HRM and accounting.",
  heroCta1: "Explore the system",
  heroCta2: "See how it works",
  heroTicks: ["Cut document turnaround time", "Fewer manual mistakes", "Fully transparent and auditable"],
  stripLabel: "Connected",
  stripNote: "6 data sources",

  problemEyebrow: "The problem",
  problemTitle: "Documents are where business processes stall",
  problemLead: "Every system produces its own paperwork, yet submitting, approving and archiving is still manual.",
  pains: [
    ["Documents scattered everywhere", "Email, ERP, CRM, printouts — nobody knows where a document is or who is holding it."],
    ["Slow approvals, no audit trail", "Multi-level sign-off done by hand, with no timestamps and no proof of handling."],
    ["Duplicate data entry", "The same contract is retyped into ERP, accounting and the registry book."],
  ],

  featEyebrow: "Features",
  featTitle: "One platform for the entire document lifecycle",
  featLead: "From the moment a document is created until it is released, archived and synced back to your business systems.",
  featNavLabel: "Feature index",
  features: [
    ["Artificial intelligence", "AI classification & extraction", "Automatically detects the document type and pulls out reference numbers, counterparties, values, deadlines and a summary.", ["93% accuracy", "Automatic extraction"]],
    ["Workflow", "Dynamic process routing", "Picks the approval flow by document type, department and value; supports send-back for edits and resubmission.", ["Flow per document type", "Send back · resubmit"]],
    ["Digital signature", "Signing & release", "Signs in order of authority, releases with an official number and stores an immutable original.", ["Sequential signing", "Immutable archive"]],
    ["Integration", "Two-way integration", "Receives documents from ERP/CRM/HRM/accounting over API and webhooks, then syncs results back to the source system.", ["REST API · webhooks", "Queue & retry"]],
    ["Analytics", "Reporting & operational KPIs", "Tracks volume, average handling time and bottlenecks by department in real time.", ["Real-time dashboard", "Overdue alerts"]],
    ["Security", "Access control & audit log", "Roles mapped to job titles, per-document access control and a complete log for audits.", ["Role-based access", "Complete audit log"]],
  ],

  howEyebrow: "How it works",
  howTitle: "Five steps, automated end to end",
  howLead: "People only make decisions; the system coordinates everything else.",
  steps: [
    ["Intake", "Documents arrive from ERP, CRM, HRM, accounting, email or are drafted by users."],
    ["AI analysis", "Classifies, extracts data, summarises and recommends next steps with a confidence score."],
    ["Routing", "The system assigns the right workflow, the right handler and a deadline per policy."],
    ["Approval & signing", "Leaders approve on web or mobile, sign in sequence, and can send documents back for edits."],
    ["Release & sync", "Assigns the official number, releases, archives and pushes results to related systems."],
  ],
  flowNodes: [
    ["Intake", "ERP · CRM · HRM", "Into the system"],
    ["AI analysis", "AI Agent", "Classify · extract"],
    ["Routing", "By document type", "Assign handler"],
    ["Approval & signing", "Leadership approval", "Sequential sign-off"],
    ["Release", "Registry · sources", "Number · archive"],
  ],
  flowPackets: ["DOC-0117", "Contract", "Approved", "Signed"],
  flowAria: "Diagram of the five DCMS document processing steps",
  novaSources: ["ERP", "CRM", "HRM", "Accounting", "Email", "Users"],
  novaStages: ["Analyse", "Recommend", "Approve", "Sign", "Sync"],
  novaDone: "Processed",

  intEyebrow: "Integrations",
  intTitle: "A coordination layer on top of the systems you already run",
  intLead: "DCMS does not replace ERP, CRM or HRM. Wherever a document originates it is handled in one place, and the outcome is returned to the right source system.",
  intTicks: [
    "Two-way REST API and webhooks, with queueing and retries",
    "Status reconciliation using the source system's reference id",
    "Connection monitoring, health checks and a log for every sync",
  ],
  intCta: "See the integrations page in the demo",
  sources: [
    ["ERP", "Purchase orders, procurement contracts, payment requests"],
    ["CRM", "Customer contracts, quotations, addendums"],
    ["HRM", "HR decisions, proposals, leave requests"],
    ["Accounting", "Vouchers, invoices, payment statements"],
    ["Email", "Incoming letters from partners and authorities"],
    ["Users", "Drafted directly or uploaded as files"],
  ],

  stats: [
    ["62%", "Less time to process one document"],
    ["93%", "AI classification accuracy"],
    ["6", "Business systems connected out of the box"],
    ["100%", "Actions recorded for audit"],
  ],
  benEyebrow: "Benefits",
  benTitle: "Clear value for every role",
  benefits: [
    ["Leadership", "See the whole workload, spot where documents are stuck and approve from mobile at any time."],
    ["Registry & admin", "No more duplicate entry: numbering, filing and retrieval happen in seconds."],
    ["Business departments", "Faster sign-off, always knowing who is holding a document, with reminders before the deadline."],
    ["IT", "Standard APIs, no disruption to existing systems, centralised permissions and logging."],
  ],

  uiEyebrow: "Interface",
  uiTitle: "Designed for everyday work",
  uiLead: "Dashboard, document lists, process diagrams and the AI assistant in a single workspace.",
  uiAlt: "DCMS system dashboard",

  faqEyebrow: "FAQ",
  faqTitle: "What companies usually ask",
  faq: [
    ["Does DCMS replace our existing ERP or CRM?", "No. DCMS is a document coordination layer above them: it receives documents created in ERP/CRM/HRM/accounting, runs approval — signing — release, then syncs the results back to the source system."],
    ["What if the AI classifies something incorrectly?", "Every AI suggestion carries a confidence score and the handler can correct the document type, department or workflow. Corrections are recorded to improve accuracy."],
    ["How long does deployment take?", "A standard rollout with the default approval flows can run in 2–4 weeks, depending on how many systems need integrating and how much the workflows are customised."],
    ["Where is the data stored?", "Both on-premise and private cloud deployments are supported. Originals are stored immutably, with access by permission and a full audit log."],
  ],

  ctaTitle: "Ready to see DCMS run on your own data?",
  ctaLead: "Open the demo to try the whole flow: intake, AI analysis, approval, signing and sync.",
  ctaOpen: "Open the demo",
  ctaContact: "Talk to us",

  footTagline: "AI system for coordinating and managing enterprise documents.",
  footDemo: "Demo",
  footNote: "© 2026 DCMS. Demo build for solution presentation.",
};

export const COPY = { vi, en };
