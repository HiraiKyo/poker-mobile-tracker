import { z } from "zod";

export const stakeSchema = z.object({
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.union([z.date(), z.null()]),
  stakes_code: z.number().int(),
  stakes_name: z.string(),
  sb: z.number().positive(),
  bb: z.number().positive(),
  provider: z.string(),
});

type Stake = z.infer<typeof stakeSchema>;

export { Stake };
