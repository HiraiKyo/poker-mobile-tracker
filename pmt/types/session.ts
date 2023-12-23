import { z } from "zod";
import { Stake } from "./stake";

export const sessionSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.union([z.string(), z.null()]),
  session_at: z.string(),
  hands_amount: z.number(),
  stakes_code: z.number(),
  win_amount: z.number(),
});

type Session = z.infer<typeof sessionSchema>;

type SessionWithStake = Session &
  Omit<Stake, "created_at" | "updated_at" | "deleted_at">;
export { Session, SessionWithStake };
