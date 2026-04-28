import { z } from "zod";

export const systemNodeSchema = z.object({
  title: z.string().min(2),
  label: z.string().min(2),
  caption: z.string().min(8)
});
