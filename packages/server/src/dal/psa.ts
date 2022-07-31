import { PSA as IPSA } from "utils";
import { PSA } from "../models/psa";

export async function get(): Promise<IPSA[]> {
  return await PSA.find({});
}
