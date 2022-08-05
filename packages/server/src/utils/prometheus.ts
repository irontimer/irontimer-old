import { Counter, Histogram } from "prom-client";
import { Solve } from "utils";
import { getSession } from "../dal/session";

const auth = new Counter({
  name: "api_request_auth_total",
  help: "Counts authentication events",
  labelNames: ["type"]
});

const solve = new Counter({
  name: "solve_saved_total",
  help: "Counts solve saves",
  labelNames: ["session"]
});

const solveSession = new Counter({
  name: "solve_session_total",
  help: "Counts sessions",
  labelNames: ["session"]
});

const solveTime = new Histogram({
  name: "solve_time_seconds",
  help: "Time to solve a scramble",
  buckets: [
    1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000,
    100000, 200000, 500000, 1000000
  ]
});

export function incrementAuth(type: "Bearer" | "ApiKey" | "None"): void {
  auth.inc({ type });
}

export async function incrementSolve(res: Solve): Promise<void> {
  const session = await getSession(res.uid, res.sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  solve.inc({
    session: session.name
  });

  solveSession.inc({
    session: session.name
  });

  solveTime.observe(res.time);
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
