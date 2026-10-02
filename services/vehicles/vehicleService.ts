/**
 * Vehicles client — calls nexus-fleet-service's real
 * `GET /api/v1/vehicles/vehicles` through the gateway.
 *
 * Replaces the old `listFleetAssets()` demo stub (hardcoded vehicle rows
 * that nothing in app/(workspace)/vehicles actually imported) with the
 * platform's real vehicle ledger built in the write-endpoints round
 * (app/services/fleet/vehicle_write_service.py on the backend).
 */
import { getJSON } from "@/lib/apiClient";

export type VehicleStatus = "in_service" | "in_maintenance" | "decommissioned";

export type VehicleRecord = {
  id: string;
  tenantId: string;
  vehicleClass: string;
  registrationNumber: string;
  makeModel: string;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
};

type VehicleRecordBody = {
  id: string;
  tenant_id: string;
  vehicle_class: string;
  registration_number: string;
  make_model: string;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
};

export async function listVehicles(token: string, tenantId: string): Promise<VehicleRecord[]> {
  const body = await getJSON<VehicleRecordBody[]>("/api/v1/vehicles/vehicles", { token, tenantId });

  return body.map((vehicle) => ({
    id: vehicle.id,
    tenantId: vehicle.tenant_id,
    vehicleClass: vehicle.vehicle_class,
    registrationNumber: vehicle.registration_number,
    makeModel: vehicle.make_model,
    status: vehicle.status,
    createdAt: vehicle.created_at,
    updatedAt: vehicle.updated_at,
  }));
}
