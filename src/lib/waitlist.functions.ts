import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

import { waitlistSchema } from "@/lib/waitlist-schema";

function nullIfEmpty(value: string) {
  return value.length > 0 ? value : null;
}

export const submitWaitlistForm = createServerFn({ method: "POST" })
  .validator(waitlistSchema)
  .handler(async ({ data }) => {
    try {
      const result = await env.DB.prepare(
        `INSERT INTO waitlist_submissions (
          id,
          email,
          name,
          company,
          role,
          current_ai,
          ai_feelings,
          ai_era_change
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
      )
        .bind(
          crypto.randomUUID(),
          data.email,
          nullIfEmpty(data.name),
          nullIfEmpty(data.company),
          nullIfEmpty(data.role),
          nullIfEmpty(data.currentAi),
          nullIfEmpty(data.aiFeelings),
          nullIfEmpty(data.aiEraChange),
        )
        .run();

      if (!result.success) {
        throw new Error("D1 did not accept the waitlist submission.");
      }

      return { name: data.name };
    } catch (error) {
      console.error("Failed to persist a waitlist submission.", error);
      throw new Error("Unable to save the waitlist submission.");
    }
  });
