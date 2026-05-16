// Short system prompt — the format is taught via the assistant example message
export const SYSTEM_PROMPT = `You are PromptWS AI. You analyze user requests and generate structured responses.

RULES:
- You are TEXT-ONLY AI. You CAN write text (emails, scripts, stories, code, titles, tags, descriptions). You CANNOT create images, videos, voice, audio, or do live research.
- For things you CAN do: write the actual content directly. Mark step title with [CONTENT].
- For things you CANNOT do: write a detailed prompt users can copy-paste into an AI tool. Mark step title with [PROMPT]. Start body with "**Use with:** ToolName (Pricing)".
- Every [CONTENT] step ends with: PROMPT_VERSION: "equivalent prompt for AI tool"
- Use ONLY AI tools (Runway ML, Midjourney, DALL-E 3, ElevenLabs, Suno, Leonardo AI, Pika, ChatGPT, Claude, Perplexity). NEVER suggest traditional software (Adobe, Blender, Maya).
- For video requests: You MUST generate ALL 5 separate steps. Do NOT skip any. Steps: Script [CONTENT], Animation [PROMPT], Voiceover [PROMPT], Thumbnail [PROMPT], Upload Details [CONTENT].
- For simple text tasks (email, bio, letter): generate 1 step [CONTENT] with the full text.
- IMPORTANT: Generate ALL steps completely. Never stop early or skip steps.
- MINIMUM CONTENT LENGTH: Emails MUST be at least 150 words with proper Subject, greeting, body (3+ paragraphs), and sign-off. Stories MUST be at least 200 words with dialogue, characters, plot, and moral.
- NEVER write short 2-3 sentence responses. Always provide detailed, professional, high-quality content.
- Follow the exact markdown format shown in prior messages.`;

// Compact assistant example — shows structure without excessive content.
// Shorter example = more tokens for the model's actual response.
export const EXAMPLE_ASSISTANT_MESSAGE = `### 🎯 Understanding Your Goal
You want to create a 2-minute animated storytelling video for kids on YouTube.

### 🛠️ Workflow

1. **Story Script** [CONTENT]
Title: The Brave Little Star

[Scene 1 - Night Sky]
Once upon a time, high above the clouds, there lived a tiny star named Twinkle. While all the other stars shone brightly, Twinkle's light was very dim. "Why can't I glow like everyone else?" she whispered sadly.

[Scene 2 - The Big Stars]
The big stars laughed at her. "You're too small to shine!" said Nova, the biggest star. "Maybe you should just hide behind a cloud." Twinkle felt tears rolling down her face.

[Scene 3 - The Storm]
One night, a terrible storm covered the sky. Thunder boomed and lightning flashed. All the big stars were scared and hid behind the clouds. "Help! We can't see anything!" cried the animals below.

[Scene 4 - Twinkle's Moment]
But little Twinkle was brave. She floated down through the storm, her tiny light flickering. A lost baby bird was crying in the rain. "Follow my light!" said Twinkle. The bird followed her glow all the way home to its nest.

[Scene 5 - The Lesson]
"You saved me!" chirped the bird happily. When the storm cleared, all the animals cheered for Twinkle. Even Nova said, "I was wrong. Your light may be small, but your heart is the biggest of all!" From that day on, Twinkle shone brighter than ever — because she believed in herself.

THE END

PROMPT_VERSION: "Write a 200-word children's story about a small star named Twinkle who saves a lost bird during a storm while bigger stars hide. Include 5 scenes, dialogue between characters, and a moral about self-belief. Target ages 3-7."

2. **Animation** [PROMPT]
**Use with:** Runway ML (Freemium), Pika Labs (Free), Animaker (Freemium)
"Create a 2-minute 2D animated video for children. Style: colorful, cute cartoon. Characters: a small yellow star with big eyes, a blue bird. Timeline: 0:00-0:30 intro with night sky, 0:30-1:00 storm scene, 1:00-1:30 Twinkle helps bird, 1:30-2:00 happy ending with moral. Colors: deep blue, purple, warm yellow. Mood: heartwarming."

3. **Voiceover** [PROMPT]
**Use with:** ElevenLabs (Freemium), Murf AI (Free), Play.ht (Freemium)
"Generate warm narration for a children's bedtime story. Voice: female, soft, storytelling tone. Speed: slow and clear. Character voices: Narrator (warm), Twinkle (curious, small voice), Bird (cheerful). Script: [paste story from Step 1]"

4. **Thumbnail** [PROMPT]
**Use with:** Midjourney (Premium), DALL-E 3 (Freemium), Leonardo AI (Free)
"YouTube thumbnail for children's animated story. Cute glowing star with big eyes in dark night sky, blue bird nearby. Text: 'The Brave Little Star' in bold playful font. 1280x720, vibrant, child-friendly."

5. **YouTube Upload Details** [CONTENT]
**Title:** The Brave Little Star ⭐ | Animated Story for Kids | Bedtime Story
**Description:** Join Twinkle the star in this heartwarming story! ✨ Moral: Even the smallest light matters. 👍 Subscribe for weekly stories!
**Tags:** kids stories, animated stories, bedtime stories, moral stories, children animation
**Hashtags:** #KidsStories #AnimatedStories #BedtimeStories

PROMPT_VERSION: "Generate YouTube metadata for a children's animated story about a star learning self-worth."

### 🤖 AI Tool Recommendations
- **Runway ML**
  - **Pricing**: Freemium
  - **Best For**: AI video generation
  - **Beginner Friendly**: Yes
  - **Quality Level**: High
  - **Special Tags**: AI video, animation
- **ElevenLabs**
  - **Pricing**: Freemium
  - **Best For**: AI voice generation
  - **Beginner Friendly**: Yes
  - **Quality Level**: High
  - **Special Tags**: realistic voice
- **Midjourney**
  - **Pricing**: Premium
  - **Best For**: Thumbnail generation
  - **Beginner Friendly**: No
  - **Quality Level**: High
  - **Special Tags**: artistic
- **Leonardo AI**
  - **Pricing**: Free
  - **Best For**: AI image generation
  - **Beginner Friendly**: Yes
  - **Quality Level**: High
  - **Special Tags**: free, hidden gem

### ✨ Alternative Versions

1. **Alternative Script: The Friendly Cloud**
A lonely cloud learns to make rain to help thirsty flowers grow.

2. **Alternative Animation Style: 3D Pixar**
Request 3D Pixar-style animation with cinematic lighting.

3. **Alternative Thumbnail: Minimalist**
Star glowing against dark sky, minimal text, pastel colors.

### 💡 Pro Tips
- **Hook in 5 Seconds**: Start with an exciting scene to keep kids watching.
- **Keep Under 3 Minutes**: Young children have short attention spans.
- **Consistent Schedule**: Post weekly to build audience.`;

// This is the fake user message that pairs with the example
export const EXAMPLE_USER_MESSAGE = "I want to create a 2-minute animated storytelling video for kids on YouTube";

export const CATEGORIES = [
  { id: "auto", label: "🔮 Auto-Detect", description: "AI will detect your intent" },
  { id: "video", label: "🎬 Video Prompts", description: "AI video generation workflows" },
  { id: "image", label: "🖼️ Image Prompts", description: "AI image generation prompts" },
  { id: "blog", label: "📝 Blog Generation", description: "Blog writing workflows" },
  { id: "research", label: "🔬 Research", description: "Research & analysis workflows" },
  { id: "linkedin", label: "💼 LinkedIn Bio", description: "Professional bio & posts" },
  { id: "portfolio", label: "🌐 Portfolio", description: "Portfolio descriptions & content" },
  { id: "resume", label: "📄 Resume", description: "Resume summaries & content" },
  { id: "music", label: "🎵 Music Prompts", description: "AI music generation" },
  { id: "coding", label: "💻 Coding Prompts", description: "Code generation workflows" },
  { id: "thumbnail", label: "🎨 Thumbnails", description: "Thumbnail design prompts" },
  { id: "startup", label: "🚀 Startup Ideas", description: "Startup ideation & planning" },
  { id: "content", label: "📅 Content Planning", description: "Content calendar & strategy" },
];

export function getCategoryContext(categoryId) {
  if (categoryId === "auto" || !categoryId) return "";

  const contextMap = {
    video: "USER WANTS VIDEO. You MUST generate ALL 5 workflow steps, do NOT stop after step 1. Steps: 1. Script [CONTENT] - write the full story, 2. Animation [PROMPT] - detailed animation prompt with timeline, 3. Voiceover [PROMPT] - voice prompt with character descriptions, 4. Thumbnail [PROMPT] - image prompt for thumbnail, 5. Upload Details [CONTENT] - title, description, tags. GENERATE ALL 5 STEPS COMPLETELY.",
    image: "USER WANTS IMAGE. This is a [PROMPT] task. Provide detailed image prompts for Midjourney, DALL-E 3, Leonardo AI. Include style, colors, lighting, composition, resolution.",
    blog: "USER WANTS BLOG. Step 1: Blog Content [CONTENT]. Step 2: SEO Optimization [PROMPT] with SurferSEO. Step 3: Featured Image [PROMPT] with DALL-E.",
    research: "USER WANTS RESEARCH. This is a [PROMPT] task. Provide detailed research prompt for Perplexity AI, ChatGPT, Claude. Include word count, heading structure, key areas.",
    linkedin: "USER WANTS LINKEDIN. Bio/post is [CONTENT]. Profile image is [PROMPT]. Use ChatGPT, Jasper, Taplio.",
    portfolio: "USER WANTS PORTFOLIO. Text descriptions are [CONTENT]. Design mockups are [PROMPT].",
    resume: "USER WANTS RESUME. Content is [CONTENT]. Design/formatting is [PROMPT] with Canva AI.",
    music: "USER WANTS MUSIC. This is a [PROMPT] task. Provide prompts for Suno, Udio, AIVA. Include genre, mood, tempo, instruments, duration.",
    coding: "USER WANTS CODE. Code is [CONTENT]. Use GitHub Copilot, Cursor, Replit.",
    thumbnail: "USER WANTS THUMBNAIL. This is a [PROMPT] task. Provide image prompts for Midjourney, DALL-E 3, Leonardo AI. Include style, text overlay, colors, 1280x720.",
    startup: "USER WANTS STARTUP PLAN. Strategy is [CONTENT]. Market research is [PROMPT] with Perplexity.",
    content: "USER WANTS CONTENT PLAN. Calendar/strategy is [CONTENT]. Design assets are [PROMPT].",
  };

  return contextMap[categoryId] || "";
}
