import { z } from "zod";

export const adminUserSchema = z.object({
  email: z.email(),
  role: z.enum(["OWNER", "EDITOR", "AUDITOR"]),
  displayName: z.string().min(2).max(80)
});
