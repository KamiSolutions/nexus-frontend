/**
 * Notifications Center screen.
 *
 * Previously showed hardcoded "14 unread / 3 mentions / 2 system" rows —
 * entirely fabricated. There is no notifications service anywhere in the
 * polyrepo, so per the project's core rule this now states that honestly
 * instead of inventing alert counts.
 */
import { NotAvailablePanel } from "@/components/dashboard/NotAvailablePanel";
import React from "react";

export default function NotificationsRoute() {
  return (
    <NotAvailablePanel
      title="Notifications Center"
      subtitle="Real-time alerts for approvals, mentions, system updates, compliance events, and workspace changes."
      reason="No notifications service exists yet anywhere in the Nexus Portal backend — there's nothing real to show here until one is built."
    />
  );
}
