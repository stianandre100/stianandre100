import * as https from "https";
import * as http from "http";

export type TripletexEnv = "test" | "production";

const BASE_URLS: Record<TripletexEnv, string> = {
  test: "https://api.tripletex.io/v2",
  production: "https://tripletex.no/v2",
};

export interface TripletexConfig {
  consumerToken: string;
  employeeToken: string;
  env?: TripletexEnv;
}

interface SessionResponse {
  value: {
    token: string;
    encryptionKey: string;
    expirationDate: string;
    tokenCustomer: { id: number };
    tokenEmployee: { id: number };
  };
}

export class TripletexClient {
  private baseUrl: string;
  private consumerToken: string;
  private employeeToken: string;
  private sessionToken: string | null = null;
  private sessionExpiry: Date | null = null;

  constructor(config: TripletexConfig) {
    this.baseUrl = BASE_URLS[config.env ?? "test"];
    this.consumerToken = config.consumerToken;
    this.employeeToken = config.employeeToken;
  }

  private async createSession(): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expirationDate = tomorrow.toISOString().split("T")[0];

    const url = `${this.baseUrl}/token/session/:create?consumerToken=${this.consumerToken}&employeeToken=${this.employeeToken}&expirationDate=${expirationDate}`;

    const data = await this.rawRequest("PUT", url, null, null);
    const response = data as SessionResponse;
    this.sessionToken = response.value.token;
    this.sessionExpiry = new Date(response.value.expirationDate);
  }

  private isSessionValid(): boolean {
    if (!this.sessionToken || !this.sessionExpiry) return false;
    return this.sessionExpiry > new Date();
  }

  private async ensureSession(): Promise<string> {
    if (!this.isSessionValid()) {
      await this.createSession();
    }
    return this.sessionToken!;
  }

  private rawRequest(
    method: string,
    url: string,
    auth: string | null,
    body: unknown,
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const isHttps = parsedUrl.protocol === "https:";
      const transport = isHttps ? https : http;

      const bodyStr = body ? JSON.stringify(body) : undefined;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (auth) {
        headers["Authorization"] = `Basic ${Buffer.from(auth).toString("base64")}`;
      }
      if (bodyStr) {
        headers["Content-Length"] = Buffer.byteLength(bodyStr).toString();
      }

      const options: http.RequestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method,
        headers,
      };

      const req = transport.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(
              new Error(
                `HTTP ${res.statusCode}: ${data.substring(0, 300)}`,
              ),
            );
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        });
      });

      req.on("error", reject);
      if (bodyStr) req.write(bodyStr);
      req.end();
    });
  }

  async request<T>(
    method: string,
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    body?: unknown,
  ): Promise<T> {
    const token = await this.ensureSession();
    const auth = `0:${token}`;

    let url = `${this.baseUrl}${path}`;
    if (params) {
      const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&");
      if (qs) url += `?${qs}`;
    }

    return this.rawRequest(method, url, auth, body) as Promise<T>;
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    return this.request<T>("GET", path, params);
  }
}
