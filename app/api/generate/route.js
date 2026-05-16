import { getGroqClient, rotateKey, getTotalKeys } from "@/lib/groqClient";
import { SYSTEM_PROMPT, EXAMPLE_USER_MESSAGE, EXAMPLE_ASSISTANT_MESSAGE, getCategoryContext } from "@/lib/systemPrompt";

export const runtime = "nodejs";

// Models to try in order — if the primary model is rate-limited, fall back
const MODELS = [
  "llama-3.3-70b-versatile",    // Primary: best quality
  "meta-llama/llama-4-scout-17b-16e-instruct",  // Fallback: Llama 4 Scout
  "qwen/qwen3-32b",             // Fallback: Qwen3 32B  
  "llama-3.1-8b-instant",       // Last resort: fast but less capable
];

export async function POST(request) {
  try {
    const { message, category } = await request.json();

    if (!message || !message.trim()) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Auto-detect category from message keywords when set to "auto"
    let effectiveCategory = category;
    if (!category || category === "auto") {
      const msg = message.toLowerCase();
      if (/\b(video|youtube|animation|animated|animate)\b/.test(msg)) effectiveCategory = "video";
      else if (/\b(image|picture|photo|illustration|portrait|logo|banner|poster)\b/.test(msg)) effectiveCategory = "image";
      else if (/\b(thumbnail)\b/.test(msg)) effectiveCategory = "thumbnail";
      else if (/\b(music|song|beat|melody|track|audio)\b/.test(msg)) effectiveCategory = "music";
      else if (/\b(research|analyze|analysis|study)\b/.test(msg)) effectiveCategory = "research";
      else if (/\b(blog|article|post)\b/.test(msg)) effectiveCategory = "blog";
      else if (/\b(resume|cv)\b/.test(msg)) effectiveCategory = "resume";
      else if (/\b(linkedin)\b/.test(msg)) effectiveCategory = "linkedin";
    }

    const categoryContext = getCategoryContext(effectiveCategory);
    const fullSystemPrompt = categoryContext
      ? `${SYSTEM_PROMPT}\n\n## CATEGORY CONTEXT:\n${categoryContext}`
      : SYSTEM_PROMPT;

    // Build message list: system → example exchange → real user message
    const messages = [
      { role: "system", content: fullSystemPrompt },
      { role: "user", content: EXAMPLE_USER_MESSAGE },
      { role: "assistant", content: EXAMPLE_ASSISTANT_MESSAGE },
      { role: "user", content: message },
    ];

    let lastError = null;

    // Try each model with key rotation
    for (const model of MODELS) {
      const maxAttempts = Math.min(getTotalKeys(), 12);
      
      // For small models, skip the example to avoid "request too large"
      const isSmallModel = model.includes("8b");
      const modelMessages = isSmallModel
        ? [
            { role: "system", content: fullSystemPrompt },
            { role: "user", content: message },
          ]
        : messages;
      const modelMaxTokens = isSmallModel ? 4096 : 8192;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const groq = getGroqClient();

          const stream = await groq.chat.completions.create({
            model,
            messages: modelMessages,
            temperature: 0.65,
            max_tokens: modelMaxTokens,
            stream: true,
          });

          // Create a ReadableStream for the response
          const encoder = new TextEncoder();
          const readable = new ReadableStream({
            async start(controller) {
              try {
                for await (const chunk of stream) {
                  const content = chunk.choices[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                }
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
              } catch (streamError) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`
                  )
                );
                controller.close();
              }
            },
          });

          return new Response(readable, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            },
          });
        } catch (error) {
          lastError = error;
          const isRateLimit = error.message?.includes("429") || error.message?.includes("rate_limit");
          console.error(`[${model}] Key ${attempt + 1}/${maxAttempts} failed:`, error.message?.substring(0, 120));
          rotateKey();
          
          // If rate limited, skip remaining keys for this model (all keys share same org limit)
          if (isRateLimit) {
            console.log(`[${model}] Rate limited — switching to next model`);
            break;
          }
        }
      }
    }

    return Response.json(
      { error: "All API keys and models exhausted. Please try again later." },
      { status: 503 }
    );
  } catch (error) {
    console.error("Generate API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
