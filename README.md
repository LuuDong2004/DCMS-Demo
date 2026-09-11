# DCMS-Demo

Prototype UI của **DCMS – Hệ thống AI Điều phối và Phê duyệt Tài liệu Doanh nghiệp**. Dữ liệu giả lập, thao tác phê duyệt / từ chối / ký số / tạo văn bản hoạt động ngay trên trình duyệt.

## Chạy

```bash
npm install      # hoặc: bun install
npm run dev      # http://localhost:5173
npm run build    # xuất dist/
```

## Màn hình

| Đường dẫn | Màn hình |
|---|---|
| `#/home` | Dashboard: thống kê, văn bản gần đây, quy trình, việc cần xử lý, AI Agent, biểu đồ |
| `#/in`, `#/out`, `#/docs`, `#/todo`, `#/done` | Danh sách văn bản có tìm kiếm, lọc, chọn nhiều |
| `#/doc/VB-2025-0101` | Chi tiết văn bản: tab thông tin / nội dung / tài liệu / lịch sử, phân tích AI, timeline phê duyệt, nút Phê duyệt / Từ chối / Ký số |
| `#/create` | Tạo văn bản, nút "AI phân tích" mô phỏng đề xuất loại, phòng ban, workflow |
| `#/workflow` | Theo dõi vị trí của từng văn bản trong luồng |
| `#/ai`, `#/ai-suggest`, `#/ai-summary` | AI Agent: phân tích, đề xuất xử lý, tóm tắt |
| `#/users`, `#/roles`, `#/wf-config`, `#/integrations`, `#/logs` | Quản trị: người dùng, vai trò, cấu hình workflow, tích hợp ERP/CRM/HRM, nhật ký |

## Cấu trúc

- `src/App.jsx` – khung giao diện (sidebar, topbar), điều hướng hash, xử lý phê duyệt / tạo mới
- `src/pages/` – các màn hình
- `src/mock.js` – dữ liệu giả (văn bản, người dùng, workflow, log, tích hợp)
- `src/ui.jsx` – component dùng chung (Icon, Badge, Card, Avatar…)
- `src/App.css` – giao diện
