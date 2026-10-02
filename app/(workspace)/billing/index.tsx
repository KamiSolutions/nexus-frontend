/**
 * Subscription & Billing screen.
 *
 * Previously showed hardcoded "Enterprise plan, 290/500 seats, R84k next
 * invoice" — entirely fabricated. There is no billing service anywhere in
 * the polyrepo (no nexus-billing-service, no billing endpoint on any
 * existing service), so per the project's core rule this now states that
 * honestly instead of inventing subscription numbers.
 */
import { NotAvailablePanel } from "@/components/dashboard/NotAvailablePanel";
import React from "react";

export default function BillingRoute() {
  return (
    <NotAvailablePanel
      title="Subscription & Billing"
      subtitle="Plan management, trials, invoices, usage limits, workspace billing, and enterprise licensing controls."
      reason="No billing service exists yet anywhere in the Nexus Portal backend — there's nothing real to show here until one is built."
    />
  );
}
