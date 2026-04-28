import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  summary: z.string().min(12),
  tags: z.array(z.string()).min(1)
});
