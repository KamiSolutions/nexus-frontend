/**
 * Employees client — calls nexus-hr-service's real
 * `GET /api/v1/hr/employees` through the gateway.
 *
 * Replaces the old `listLeaveRequests()` demo stub (hardcoded leave rows
 * that nothing in app/(workspace)/hr actually imported) with the
 * platform's real employee ledger built in the write-endpoints round
 * (app/services/hr/employee_write_service.py on the backend). Used by the
 * Employees & Access screen (app/(workspace)/employees/index.tsx) — the
 * HR Workspace landing page itself (leave/contracts workflow) has no
 * backend entity yet, see that screen's own honest "not available" panel.
 */
import { getJSON } from "@/lib/apiClient";

export type EmployeeStatus = "active" | "on_leave" | "terminated";

export type EmployeeRecord = {
  id: string;
  tenantId: string;
  fullName: string;
  department: string;
  jobTitle: string;
  monthlySalary: number;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
};

type EmployeeRecordBody = {
  id: string;
  tenant_id: string;
  full_name: string;
  department: string;
  job_title: string;
  monthly_salary: number;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
};

export async function listEmployees(token: string, tenantId: string): Promise<EmployeeRecord[]> {
  const body = await getJSON<EmployeeRecordBody[]>("/api/v1/hr/employees", { token, tenantId });

  return body.map((employee) => ({
    id: employee.id,
    tenantId: employee.tenant_id,
    fullName: employee.full_name,
    department: employee.department,
    jobTitle: employee.job_title,
    monthlySalary: employee.monthly_salary,
    status: employee.status,
    createdAt: employee.created_at,
    updatedAt: employee.updated_at,
  }));
}
