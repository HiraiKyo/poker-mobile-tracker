import { z } from "zod";

export const stakeSchema = z.object({
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.union([z.string(), z.null()]),
  stakes_code: z.number(),
  stakes_name: z.string(),
  sb: z.number(),
  bb: z.number(),
  provider: z.string(),
});

type Stake = z.infer<typeof stakeSchema>;

export { Stake };
