/**
 * Real HTTP client for talking to nexus-api-gateway.
 *
 * Replaces the old `lib/api.ts` demo stub (`apiGet` that just echoed back
 * whatever data you handed it) for every call that actually needs to reach
 * a backend service. Per the project's core rule ("never present
 * mocked/demo data as if it came from a real integration"), this client
 * never fabricates a successful response: a missing API URL, a network
 * failure, or a non-2xx response all surface as a thrown `ApiError` that
 * the caller must handle explicitly, rather than silently falling back to
 * fake data.
 */
import { getApiUrl } from "@/lib/env";

export class ApiError extends Error {
  status: number | null;
  serviceName?: string;

  constructor(message: string, status: number | null = null, serviceName?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.serviceName = serviceName;
  }
}

type RequestOptions = {
  token?: string | null;
  tenantId?: string | null;
  signal?: AbortSignal;
};

function buildUrl(path: string): string {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    throw new ApiError(
      "No API URL is configured (EXPO_PUBLIC_API_URL is unset) — the app has no gateway to talk to.",
    );
  }

  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

function buildHeaders(options: RequestOptions, hasBody: boolean): HeadersInit {
  const headers: Record<string, string> = {};

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  if (options.tenantId) {
    headers["X-Tenant-ID"] = options.tenantId;
  }

  return headers;
}

async function parseErrorBody(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.detail === "string") {
      return body.detail;
    }
    return JSON.stringify(body);
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }
}

async function request<T>(method: "GET" | "POST", path: string, body: unknown, options: RequestOptions): Promise<T> {
  const url = buildUrl(path);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: buildHeaders(options, body !== undefined),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options.signal,
    });
  } catch (error) {
    // Network failure (service down, DNS, offline, gateway unreachable) —
    // surfaced honestly rather than swallowed.
    throw new ApiError(
      `Could not reach the gateway at ${url}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    const detail = await parseErrorBody(response);
    throw new ApiError(`${method} ${path} failed: ${detail}`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getJSON<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return request<T>("GET", path, undefined, options);
}

export function postJSON<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  return request<T>("POST", path, body, options);
}
