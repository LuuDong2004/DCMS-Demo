// Tài khoản nhân sự của bản demo. Mật khẩu dùng chung cho mọi tài khoản.
export const DEMO_PASSWORD = "123456";

/** caps: create=soạn văn bản, approve=phê duyệt, sign=ký số, publish=phát hành, admin=quản trị, all=xem toàn hệ thống */
export const ROLE_CAPS = {
  "Nhân viên": ["create"],
  "Trưởng phòng": ["create", "approve"],
  "Pháp chế": ["create", "approve"],
  "Kế toán trưởng": ["create", "approve"],
  "Giám đốc": ["approve", "sign", "all"],
  "Văn thư": ["create", "publish", "all"],
  Admin: ["create", "approve", "sign", "publish", "admin", "all"],
};

export const ACCOUNTS = [
  { id: "a.nguyen", name: "Nguyễn Văn A", role: "Nhân viên", title: "Chuyên viên kinh doanh", dept: "Phòng Kinh doanh", email: "a.nguyen@company.vn", phone: "0901 234 111", tone: "#2a7bff",
    note: "Soạn và trình văn bản, không có quyền phê duyệt." },
  { id: "b.nguyen", name: "Nguyễn Văn B", role: "Trưởng phòng", title: "Trưởng phòng Kinh doanh", dept: "Phòng Kinh doanh", email: "b.nguyen@company.vn", phone: "0901 234 222", tone: "#0ea5a0",
    note: "Phê duyệt cấp phòng cho văn bản của Phòng Kinh doanh." },
  { id: "c.tran", name: "Trần Thị C", role: "Pháp chế", title: "Chuyên viên pháp chế", dept: "Phòng Pháp chế", email: "c.tran@company.vn", phone: "0901 234 333", tone: "#8b5cf6",
    note: "Thẩm định pháp lý hợp đồng trước khi trình Giám đốc." },
  { id: "f.hoang", name: "Hoàng Văn F", role: "Kế toán trưởng", title: "Kế toán trưởng", dept: "Phòng Tài chính", email: "f.hoang@company.vn", phone: "0901 234 444", tone: "#f59e0b",
    note: "Phê duyệt tài chính cho hợp đồng và đề nghị thanh toán." },
  { id: "e.pham", name: "Phạm Thị E", role: "Trưởng phòng", title: "Trưởng phòng Hành chính – Nhân sự", dept: "Phòng Hành chính – Nhân sự", email: "e.pham@company.vn", phone: "0901 234 555", tone: "#e05252",
    note: "Phê duyệt văn bản nhân sự, đào tạo và công văn đến." },
  { id: "c.le", name: "Lê Văn C", role: "Trưởng phòng", title: "Trưởng phòng IT", dept: "Phòng IT", email: "c.le@company.vn", phone: "0901 234 666", tone: "#12b5a5",
    note: "Phê duyệt đề nghị mua sắm thiết bị CNTT." },
  { id: "d.le", name: "Lê Văn D", role: "Giám đốc", title: "Giám đốc công ty", dept: "Ban Giám đốc", email: "d.le@company.vn", phone: "0901 234 777", tone: "#1846d6",
    note: "Phê duyệt cấp cao và ký số toàn bộ văn bản." },
  { id: "h.ngo", name: "Ngô Thị H", role: "Văn thư", title: "Văn thư – Lưu trữ", dept: "Phòng Hành chính – Nhân sự", email: "h.ngo@company.vn", phone: "0901 234 888", tone: "#16a34a",
    note: "Cấp số, phát hành và lưu trữ văn bản sau khi ký." },
  { id: "dong.luu", name: "Lưu Văn Đông", role: "Admin", title: "Quản trị hệ thống", dept: "Phòng IT", email: "dong.luu@company.vn", phone: "0901 234 999", tone: "#0b1120",
    note: "Toàn quyền: thấy mọi văn bản, cấu hình workflow và tích hợp." },
];

export const findAccount = (id) => ACCOUNTS.find((a) => a.id === id) || null;

/** Tài khoản có năng lực này không (theo vai trò)? */
export const can = (user, cap) => !!user && (ROLE_CAPS[user.role] || []).includes(cap);

/** Người dùng có được gán vào bước này không? "Văn thư" khớp theo vai trò. */
export function isAssignee(step, user) {
  if (!step || !user) return false;
  const who = String(step.who || "");
  if (who.includes(user.name)) return true;
  if (user.role === "Văn thư" && (/văn thư/i.test(who) || step.kind === "publish")) return true;
  return false;
}

/** Bước đang chờ xử lý của văn bản. */
export const currentStep = (d) => d?.steps?.find((s) => s.state === "current") || null;

/** Văn bản này đang chờ chính người dùng xử lý? */
export function isMine(d, user) {
  if (!user) return false;
  const cur = currentStep(d);
  if (!cur) return false;
  if (["system", "ai", "sync"].includes(cur.kind)) return false;
  if (d.returned) return d.creator === user.name || can(user, "admin");
  // Admin theo dõi toàn bộ việc đang chờ xử lý của hệ thống
  if (can(user, "admin")) return true;
  return isAssignee(cur, user);
}

/** Hành động mà chính người dùng này được phép bấm ở bước hiện tại. */
export function actionsFor(d, user, allowed) {
  if (!user) return [];
  if (can(user, "admin")) return allowed;
  const cur = currentStep(d);
  if (!cur) return [];
  if (d.returned) return d.creator === user.name ? allowed.filter((a) => a === "resubmit") : [];
  if (!isAssignee(cur, user)) return [];
  const need = { approve: "approve", revise: "approve", reject: "approve", sign: "sign", publish: "publish", resubmit: "create" };
  return allowed.filter((a) => can(user, need[a] || "create"));
}
