import { Counter, Histogram } from "prom-client";
import { Result, Saved } from "../../types";

const auth = new Counter({
  name: "api_request_auth_total",
  help: "Counts authentication events",
  labelNames: ["type"]
});

const result = new Counter({
  name: "result_saved_total",
  help: "Counts result saves",
  labelNames: ["session"]
});

const resultSession = new Counter({
  name: "result_session_total",
  help: "Counts scramble types",
  labelNames: ["session"]
});

const resultTime = new Histogram({
  name: "result_time_seconds",
  help: "Time to solve a scramble",
  buckets: [
    1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000,
    100000, 200000, 500000, 1000000
  ]
});

export function incrementAuth(type: "Bearer" | "ApiKey" | "None"): void {
  auth.inc({ type });
}

export function incrementResult(res: Saved<Result>): void {
  result.inc({
    session: res.session
  });

  resultSession.inc({
    session: res.session
  });

  resultTime.observe(res.time);
}

const clientVersionsCounter = new Counter({
  name: "api_client_versions",
  help: "Records frequency of client versions",
  labelNames: ["version"]
});

export function recordClientVersion(version: string): void {
  clientVersionsCounter.inc({ version });
}

const serverVersionCounter = new Counter({
  name: "api_server_version",
  help: "The server's current version",
  labelNames: ["version"]
});

export function recordServerVersion(serverVersion: string): void {
  serverVersionCounter.inc({ version: serverVersion });
}
