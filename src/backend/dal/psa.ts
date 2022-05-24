import { PSA as IPSA } from "../../types/types";
import { PSA } from "../models/psa";

export async function get(): Promise<IPSA[]> {
  return await PSA.find({});
}
