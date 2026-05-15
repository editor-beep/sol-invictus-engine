import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  intention: z.string().min(1).max(300),
  planet: z.string(),
  planetDomain: z.string(),
  tarotName: z.string(),
  tarotMeaning: z.string(),
  sephira: z.string(),
  sephiraMeaning: z.string(),
  chakra: z.string(),
  bija: z.string(),
  numerologyRoot: z.number(),
});

export type IncantationOutput = {
  invocation: string;        // 4-8 lines, grimoire voice
  interpretation: string;    // 2-3 sentence reading
  charge: string;            // ritual charging note
};

export const generateIncantation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<IncantationOutput> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        invocation:
          "By star and stone and silent word,\nlet what is named be heard.\nThe seal is cut, the path is laid —\nso it is willed, so it is made.",
        interpretation:
          "The engine speaks without its breath today; the sigil itself remains true.",
        charge: "Hold the sigil before a candle for the duration of one slow breath.",
      };
    }

    const system = `You are the voice of an ancient grimoire — the Key of Solomon's living echo.
You speak in short, charged, archaic English. No modern slang. No emojis. No markdown.
You write incantations that feel real, breath-shaped, and singable.
Always respond using the provided tool exactly once.`;

    const user = `Compose for this invocation.

Intention: "${data.intention}"

Correspondences derived by the engine:
- Planet: ${data.planet} (${data.planetDomain})
- Tarot: ${data.tarotName} — ${data.tarotMeaning}
- Tree of Life sephira: ${data.sephira} — ${data.sephiraMeaning}
- Chakra: ${data.chakra}, bija mantra ${data.bija}
- Numerology root: ${data.numerologyRoot}

Return:
- invocation: 4 to 6 short lines, grimoire voice, weaving the planet, tarot, and bija. Plain text with line breaks.
- interpretation: 2 to 3 sentences naming why these correspondences answer the intention.
- charge: one sentence on how and when to charge the sigil (use planetary day or hour).`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "deliver_incantation",
                description: "Deliver the composed invocation, interpretation, and charging instruction.",
                parameters: {
                  type: "object",
                  properties: {
                    invocation: { type: "string" },
                    interpretation: { type: "string" },
                    charge: { type: "string" },
                  },
                  required: ["invocation", "interpretation", "charge"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "deliver_incantation" } },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("AI gateway error", res.status, text);
        if (res.status === 429) {
          return {
            invocation: "The veil is thick today. Rest, and approach again.",
            interpretation: "Too many called at this hour; the channel is taxed.",
            charge: "Wait, then return when the bell next chimes.",
          };
        }
        if (res.status === 402) {
          return {
            invocation: "The lamp is low — its oil must be replenished.",
            interpretation: "The workspace's invocation credits are spent.",
            charge: "Replenish AI credits in workspace settings to restore the voice.",
          };
        }
        throw new Error(`AI gateway ${res.status}`);
      }

      const json = await res.json();
      const call = json.choices?.[0]?.message?.tool_calls?.[0];
      if (call?.function?.arguments) {
        const parsed = JSON.parse(call.function.arguments);
        return {
          invocation: String(parsed.invocation ?? ""),
          interpretation: String(parsed.interpretation ?? ""),
          charge: String(parsed.charge ?? ""),
        };
      }
      const content = json.choices?.[0]?.message?.content ?? "";
      return {
        invocation: String(content),
        interpretation: "",
        charge: "",
      };
    } catch (err) {
      console.error("incantation error", err);
      return {
        invocation:
          "By star and stone and silent word,\nlet what is named be heard.\nThe seal is cut, the path is laid —\nso it is willed, so it is made.",
        interpretation: "The voice falters; the seal stands true.",
        charge: "Hold the sigil before a candle for one slow breath.",
      };
    }
  });
