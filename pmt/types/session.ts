import { z } from "zod";
import { Stake, stakeSchema } from "./stake";

// ここでform validationを実装する

const sessionSchema = z.object({
  id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.union([z.date(), z.null()]),
  session_at: z.date(),
  hands_amount: z.number().positive().int(),
  stakes_code: z.number().int(),
  win_amount: z.number(),
});

type Session = z.infer<typeof sessionSchema>;

const sessionWithStakeSchema = sessionSchema.merge(stakeSchema);

type SessionWithStake = Session &
  Omit<Stake, "created_at" | "updated_at" | "deleted_at">;

export { sessionSchema, sessionWithStakeSchema, Session, SessionWithStake };
