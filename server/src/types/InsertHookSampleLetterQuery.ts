import { InsertResult } from "typeorm";

export type InsertHookSampleLetterQuery = (n: number, m: number) => Promise<InsertResult | void>