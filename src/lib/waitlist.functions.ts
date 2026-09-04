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
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
        ON CONFLICT(email) DO UPDATE SET
          name = COALESCE(excluded.name, waitlist_submissions.name),
          company = COALESCE(excluded.company, waitlist_submissions.company),
          role = COALESCE(excluded.role, waitlist_submissions.role),
          current_ai = COALESCE(excluded.current_ai, waitlist_submissions.current_ai),
          ai_feelings = COALESCE(excluded.ai_feelings, waitlist_submissions.ai_feelings),
          ai_era_change = COALESCE(excluded.ai_era_change, waitlist_submissions.ai_era_change),
          updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
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
