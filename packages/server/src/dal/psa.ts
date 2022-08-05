import { Psa } from "utils";
import prisma from "../init/db";

export async function get(): Promise<Psa[]> {
  return await prisma.psa.findMany();
}
