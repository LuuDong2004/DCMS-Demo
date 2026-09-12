// DCMS business-flow engine (mock). All document state transitions go through here.
import { WORKFLOWS } from "./mock";

export const SYNC_SOURCES = ["ERP", "CRM", "HRM", "Kế toán"];

const HEADS = {
  "Phòng Kinh doanh": "Nguyễn Văn B",
  "Phòng Pháp chế": "Trần Thị C",
  "Phòng Tài chính": "Hoàng Văn F",
  "Phòng Hành chính – Nhân sự": "Phạm Thị E",
  "Phòng Đào tạo": "Phạm Thị E",
  "Phòng IT": "Lê Văn C",
  "Ban Giám đốc": "Lê Văn D",
};

const pad = (n) => String(n).padStart(2, "0");
export const fmtDate = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
export const nowStr = () => { const d = new Date(); return `${fmtDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
export const nowFull = () => { const d = new Date(); return `${nowStr()}:${pad(d.getSeconds())}`; };
export const inDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return fmtDate(d); };
export const parseAmount = (a) => (a ? Number(String(a).replace(/\D/g, "")) || 0 : 0);

function inferKind(name) {
  if (/tạo văn bản/i.test(name)) return "system";
  if (/ai phân tích|đề xuất xử lý/i.test(name)) return "ai";
  if (/ký số/i.test(name)) return "sign";
  if (/đồng bộ/i.test(name)) return "sync";
  if (/hoàn tất|phát hành/i.test(name)) return "publish";
  return "approve";
}

/** Guess document type from its title when the user did not pick one. */
export function guessType(title = "", dir = "out") {
  const t = title.toLowerCase();
  if (/hợp đồng/.test(t)) return "Hợp đồng";
  if (/quyết định/.test(t)) return "Quyết định";
  if (/báo cáo/.test(t)) return "Báo cáo";
  if (/kế hoạch/.test(t)) return "Kế hoạch";
  if (/tờ trình|đề nghị|đề xuất/.test(t)) return "Tờ trình";
  return dir === "in" ? "Công văn đến" : "Công văn đi";
}

/** Pick the configured workflow (config decides, AI only suggests). */
export function resolveWorkflow({ type, amount, aiType }) {
  const t = aiType && /mua sắm|thanh toán/i.test(aiType) ? "Tờ trình" : type;
  const active = WORKFLOWS.filter((w) => w.active);
  let wf;
  if (t === "Hợp đồng") wf = active.find((w) => w.name === (parseAmount(amount) >= 1e9 ? "Hợp đồng ≥ 1 tỷ" : "Hợp đồng < 1 tỷ"));
  else wf = active.find((w) => w.type === t);
  return wf || { name: "Mặc định", type: t, steps: ["Trưởng phòng", "Giám đốc"], mode: "Tuần tự" };
}

function stepFor(label, dept) {
  switch (label) {
    case "Trưởng phòng":
    case "Trưởng phòng phụ trách": return { name: `Trưởng phòng ${dept.replace(/^Phòng /, "")}`, who: HEADS[dept] || "Trưởng phòng", kind: "approve" };
    case "Trưởng phòng HCNS": return { name: "Trưởng phòng HCNS", who: HEADS["Phòng Hành chính – Nhân sự"], kind: "approve" };
    case "Trưởng phòng + Kế toán trưởng": return { name: "Trưởng phòng & Kế toán trưởng", who: `${HEADS[dept] || "Trưởng phòng"}, Hoàng Văn F`, kind: "approve" };
    case "Pháp chế": return { name: "Phòng Pháp chế", who: HEADS["Phòng Pháp chế"], kind: "approve" };
    case "Tài chính": return { name: "Phòng Tài chính", who: HEADS["Phòng Tài chính"], kind: "approve" };
    case "Giám đốc": return { name: "Giám đốc", who: HEADS["Ban Giám đốc"], kind: "approve" };
    case "Ký số": return { name: "Giám đốc ký số", who: HEADS["Ban Giám đốc"], kind: "sign" };
    default: return { name: label, who: label, kind: "approve" };
  }
}

export function buildSteps({ dir, dept, source, creator }, wf, now) {
  const steps = [
    { name: "Tạo văn bản", who: creator, kind: "system", state: "done", time: now },
    { name: "AI phân tích", who: "AI Agent", kind: "ai", state: "current", time: "" },
    ...wf.steps.map((l) => ({ ...stepFor(l, dept), state: "wait", time: "" })),
    dir === "out"
      ? { name: "Phát hành & lưu trữ", who: "Văn thư", kind: "publish", state: "wait", time: "" }
      : { name: "Hoàn tất & lưu trữ", who: "Hệ thống", kind: "publish", state: "wait", time: "" },
  ];
  if (SYNC_SOURCES.includes(source)) steps.push({ name: `Đồng bộ ${source}`, who: "Integration Layer", kind: "sync", state: "wait", time: "" });
  return steps;
}

export function statusOf(d) {
  if (d.steps.some((s) => s.state === "rejected")) return "rejected";
  const cur = d.steps.find((s) => s.state === "current");
  if (!cur) return d.dir === "out" ? "published" : "done";
  if (d.returned) return "returned";
  return { ai: "processing", approve: "pending", sign: "signing", publish: "signed", sync: "processing", system: "processing" }[cur.kind] || "pending";
}

export function normalize(d) {
  const steps = d.steps.map((s) => ({ ...s, kind: s.kind || inferKind(s.name) }));
  const doc = { ...d, steps, returned: d.returned || null, workflowName: d.workflowName || resolveWorkflow({ type: d.type, amount: d.amount, aiType: d.ai?.type }).name };
  return { ...doc, status: statusOf(doc) };
}

/** Which actions the current step allows (used by the detail page). */
export function allowedActions(d) {
  const cur = d.steps.find((s) => s.state === "current");
  if (!cur || d.status === "rejected") return [];
  if (d.returned) return ["resubmit"];
  if (cur.kind === "approve") return ["approve", "revise", "reject"];
  if (cur.kind === "sign") return ["sign", "reject"];
  if (cur.kind === "publish") return ["publish"];
  return [];
}

const LOG_ACTION = { approve: "APPROVE", sign: "SIGN", publish: "PUBLISH", reject: "REJECT", revise: "REVISE", resubmit: "RESUBMIT", ai: "ANALYZE" };

/**
 * Apply an action to a document. Returns { doc, logs, synced } where synced is the
 * external source that received a status webhook (for the integration counters).
 */
export function advance(doc, action, { note = "", actor = "Hệ thống" } = {}) {
  const now = nowStr();
  const d = { ...doc, steps: doc.steps.map((s) => ({ ...s })) };
  const logs = [];
  let synced = null;
  const log = (who, act, detail) => logs.push({ time: nowFull(), actor: who, action: act, target: d.id, detail });
  let i = d.steps.findIndex((s) => s.state === "current");
  const next = () => { if (i + 1 < d.steps.length) { d.steps[i + 1].state = "current"; } i += 1; };

  if (i < 0 && action !== "resubmit") return { doc: d, logs, synced };

  if (["approve", "sign", "publish", "ai"].includes(action)) {
    const st = d.steps[i];
    d.steps[i] = { ...st, state: "done", time: now, note: note || (st.note && !/^Yêu cầu chỉnh sửa/.test(st.note) ? st.note : undefined) };
    const who = action === "ai" ? "AI Agent" : actor;
    const detail = action === "ai"
      ? `Phân loại: ${d.ai?.type || d.type} · Độ tin cậy ${d.ai?.confidence || 0}% · Workflow: ${d.workflowName || "—"}`
      : action === "sign" ? `${st.name} · Chứng thư hợp lệ` : `${st.name}${note ? ` · ${note}` : ""}`;
    log(who, LOG_ACTION[action], detail);
    next();
  } else if (action === "reject") {
    d.steps[i] = { ...d.steps[i], state: "rejected", time: now, note };
    log(actor, "REJECT", `${d.steps[i].name} · ${note}`);
  } else if (action === "revise") {
    d.returned = { note, by: actor, step: d.steps[i].name, time: now };
    d.steps[i] = { ...d.steps[i], note: `Yêu cầu chỉnh sửa: ${note}` };
    log(actor, "REVISE", `${d.steps[i].name} · ${note}`);
  } else if (action === "resubmit") {
    log(actor, "RESUBMIT", `Trình lại sau chỉnh sửa${note ? ` · ${note}` : ""}`);
    d.returned = null;
  }

  // auto-run steps that need no human: sync, and "Hoàn tất" of incoming documents
  let cur = d.steps[i];
  while (cur && cur.state === "current" && (cur.kind === "sync" || (cur.kind === "publish" && d.dir !== "out"))) {
    d.steps[i] = { ...cur, state: "done", time: now };
    if (cur.kind === "sync") {
      const src = cur.name.replace(/^Đồng bộ /, "");
      const final = d.dir === "out" ? "PUBLISHED" : "APPROVED";
      d.sync = { source: src, status: final, time: now };
      synced = src;
      log("Integration", "WEBHOOK_OUT", `Đồng bộ ${src}: status = ${final}`);
    } else {
      log("System", "COMPLETE", "Hoàn tất & lưu trữ");
    }
    next();
    cur = d.steps[i];
  }
  d.status = statusOf(d);
  return { doc: d, logs, synced };
}

let seq = 0;
export function nextId(docs) {
  const max = docs.reduce((m, d) => Math.max(m, Number(d.id.split("-").pop()) || 0), 0);
  seq = Math.max(seq, max) + 1;
  return `VB-2026-${String(seq).padStart(4, "0")}`;
}

/** Templates used to simulate documents arriving from external systems. */
export const INGEST = {
  ERP: { title: "Đề nghị mua sắm máy chủ dự phòng", type: "Tờ trình", dir: "in", dept: "Phòng IT", amount: "1.200.000.000 ₫", priority: "Cao", ref: "PO-2026-014",
    summary: "Đề nghị mua 2 máy chủ dự phòng và thiết bị lưu trữ cho hệ thống lõi, tổng dự toán 1,2 tỷ đồng.", aiType: "Đề nghị mua sắm", fields: [["Mã ERP", "PO-2026-014"], ["Giá trị", "1.200.000.000 ₫"], ["Số lượng", "2 máy chủ + 1 SAN"]] },
  CRM: { title: "Hợp đồng dịch vụ bảo trì năm 2027", type: "Hợp đồng", dir: "out", dept: "Phòng Kinh doanh", amount: "650.000.000 ₫", priority: "Thường", ref: "HD-2026-027",
    summary: "Hợp đồng bảo trì hệ thống cho Công ty XYZ năm 2027, giá trị 650 triệu đồng, thanh toán theo quý.", aiType: "Hợp đồng", fields: [["Đối tác", "Công ty XYZ"], ["Giá trị", "650.000.000 ₫"], ["Mã CRM", "HD-2026-027"]] },
  HRM: { title: "Quyết định tuyển dụng kỹ sư phần mềm", type: "Quyết định", dir: "out", dept: "Phòng Hành chính – Nhân sự", amount: null, priority: "Thường", ref: "HR-2026-088",
    summary: "Quyết định tuyển dụng 3 kỹ sư phần mềm cho Phòng IT, bắt đầu làm việc từ 01/10/2026.", aiType: "Quyết định", fields: [["Mã HRM", "HR-2026-088"], ["Số lượng", "3 nhân sự"], ["Hiệu lực", "01/10/2026"]] },
  "Kế toán": { title: "Đề nghị thanh toán hợp đồng ABC đợt 1", type: "Tờ trình", dir: "in", dept: "Phòng Tài chính", amount: "400.000.000 ₫", priority: "Cao", ref: "TT-2026-031",
    summary: "Đề nghị thanh toán đợt 1 (20%) hợp đồng cung cấp thiết bị với Công ty ABC.", aiType: "Đề nghị thanh toán", fields: [["Mã chứng từ", "TT-2026-031"], ["Giá trị", "400.000.000 ₫"], ["Đối tác", "Công ty ABC"]] },
  Email: { title: "Công văn mời hợp tác chuyển đổi số", type: "Công văn đến", dir: "in", dept: "Phòng Kinh doanh", amount: null, priority: "Thường", ref: "045/CV-XYZ",
    summary: "Công ty XYZ gửi công văn mời hợp tác triển khai giải pháp chuyển đổi số, đề nghị phản hồi trước ngày hạn.", aiType: "Công văn đến", fields: [["Đơn vị gửi", "Công ty XYZ"], ["Số hiệu", "045/CV-XYZ"], ["Lĩnh vực", "Chuyển đổi số"]] },
};

/** Create a new document (manual or ingested) with the configured workflow. */
export function makeDoc({ id, title, type, dir, dept, amount = null, priority = "Thường", deadline, source = "Nhập tay", creator, summary, aiType, confidence, fields = [] }) {
  const now = nowStr();
  const wf = resolveWorkflow({ type, amount, aiType });
  const doc = {
    id, title, type, dir, status: "processing", date: now, creator, dept, source, priority, deadline: deadline || inDays(3), amount,
    summary: summary || title, workflowName: wf.name, returned: null,
    ai: { type: aiType || type, dept, workflow: wf.steps.join(" → "), confidence: confidence || 88 + Math.floor(Math.random() * 10), fields: fields.length ? fields : [["Người tạo", creator], ["Phòng ban", dept]] },
    steps: buildSteps({ dir, dept, source, creator }, wf, now),
  };
  doc.status = statusOf(doc);
  return doc;
}
