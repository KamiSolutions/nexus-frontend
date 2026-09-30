/**
 * Shared tone/label mapping for `ServiceStatusLevel` (Operational /
 * Attention Required / Unknown) — extracted out of
 * `components/dashboard/CommandCentreStatus.tsx`'s original inline maps
 * so every screen that renders a real backend status (Companies, Admin,
 * Analytics, Reports, plus Command Centre itself) uses the exact same
 * badge tone and label for the same status, rather than each screen
 * re-deciding what "Attention Required" should look like.
 */
import type { ServiceStatusLevel } from "@/services/platform/overviewService";

export const TONE_BY_STATUS: Record<ServiceStatusLevel, "emerald" | "rose" | "slate"> = {
  operational: "emerald",
  attention_required: "rose",
  unknown: "slate",
};

export const LABEL_BY_STATUS: Record<ServiceStatusLevel, string> = {
  operational: "Operational",
  attention_required: "Attention required",
  unknown: "Unknown",
};
