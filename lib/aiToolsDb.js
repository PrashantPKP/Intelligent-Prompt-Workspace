// Comprehensive AI Tools Database — name (lowercase) → { url, icon }
// When the AI mentions a tool name, we match it here and link to the real URL.

const AI_TOOLS = {
  // ─── Image Generation ───
  "midjourney":        { url: "https://www.midjourney.com",         icon: "🖼️" },
  "dall-e":            { url: "https://openai.com/dall-e-3",        icon: "🖼️" },
  "dall·e":            { url: "https://openai.com/dall-e-3",        icon: "🖼️" },
  "dalle":             { url: "https://openai.com/dall-e-3",        icon: "🖼️" },
  "stable diffusion":  { url: "https://stability.ai",              icon: "🖼️" },
  "leonardo ai":       { url: "https://leonardo.ai",               icon: "🖼️" },
  "leonardo":          { url: "https://leonardo.ai",               icon: "🖼️" },
  "ideogram":          { url: "https://ideogram.ai",               icon: "🖼️" },
  "playground ai":     { url: "https://playground.com",            icon: "🖼️" },
  "nightcafe":         { url: "https://nightcafe.studio",          icon: "🖼️" },
  "craiyon":           { url: "https://www.craiyon.com",           icon: "🖼️" },
  "adobe firefly":     { url: "https://firefly.adobe.com",         icon: "🖼️" },
  "firefly":           { url: "https://firefly.adobe.com",         icon: "🖼️" },
  "canva":             { url: "https://www.canva.com",             icon: "🎨" },
  "canva ai":          { url: "https://www.canva.com",             icon: "🎨" },
  "bing image creator":{ url: "https://www.bing.com/images/create",icon: "🖼️" },
  "clipdrop":          { url: "https://clipdrop.co",               icon: "🖼️" },
  "freepik ai":        { url: "https://www.freepik.com/ai/image-generator", icon: "🖼️" },
  "flux":              { url: "https://flux-ai.io",                icon: "🖼️" },
  "flux ai":           { url: "https://flux-ai.io",                icon: "🖼️" },
  "krea":              { url: "https://www.krea.ai",               icon: "🖼️" },
  "krea ai":           { url: "https://www.krea.ai",               icon: "🖼️" },
  "getimg.ai":         { url: "https://getimg.ai",                 icon: "🖼️" },
  "pixlr":             { url: "https://pixlr.com",                 icon: "🖼️" },
  "photosonic":        { url: "https://writesonic.com/photosonic",  icon: "🖼️" },
  "deep dream generator": { url: "https://deepdreamgenerator.com", icon: "🖼️" },
  "artbreeder":        { url: "https://www.artbreeder.com",        icon: "🖼️" },
  "starryai":          { url: "https://starryai.com",              icon: "🖼️" },
  "dreamstudio":       { url: "https://dreamstudio.ai",            icon: "🖼️" },
  "bluewillow":        { url: "https://www.bluewillow.ai",         icon: "🖼️" },
  "tensor.art":        { url: "https://tensor.art",                icon: "🖼️" },

  // ─── Video Generation ───
  "runway":            { url: "https://runwayml.com",              icon: "🎬" },
  "runway ml":         { url: "https://runwayml.com",              icon: "🎬" },
  "synthesia":         { url: "https://www.synthesia.io",          icon: "🎬" },
  "heygen":            { url: "https://www.heygen.com",            icon: "🎬" },
  "pika":              { url: "https://pika.art",                  icon: "🎬" },
  "pika labs":         { url: "https://pika.art",                  icon: "🎬" },
  "luma ai":           { url: "https://lumalabs.ai",               icon: "🎬" },
  "luma":              { url: "https://lumalabs.ai",               icon: "🎬" },
  "invideo":           { url: "https://invideo.io",                icon: "🎬" },
  "invideo ai":        { url: "https://ai.invideo.io",             icon: "🎬" },
  "pictory":           { url: "https://pictory.ai",                icon: "🎬" },
  "pictory ai":        { url: "https://pictory.ai",                icon: "🎬" },
  "lumen5":            { url: "https://lumen5.com",                icon: "🎬" },
  "flexclip":          { url: "https://www.flexclip.com",          icon: "🎬" },
  "kapwing":           { url: "https://www.kapwing.com",           icon: "🎬" },
  "veed":              { url: "https://www.veed.io",               icon: "🎬" },
  "veed.io":           { url: "https://www.veed.io",               icon: "🎬" },
  "descript":          { url: "https://www.descript.com",           icon: "🎬" },
  "opus clip":         { url: "https://www.opus.pro",              icon: "🎬" },
  "raw shorts":        { url: "https://www.rawshorts.com",         icon: "🎬" },
  "rawshorts":         { url: "https://www.rawshorts.com",         icon: "🎬" },
  "animaker":          { url: "https://www.animaker.com",          icon: "🎬" },
  "renderforest":      { url: "https://www.renderforest.com",      icon: "🎬" },
  "fliki":             { url: "https://fliki.ai",                  icon: "🎬" },
  "fliki ai":          { url: "https://fliki.ai",                  icon: "🎬" },
  "steve ai":          { url: "https://www.steve.ai",              icon: "🎬" },
  "colossyan":         { url: "https://www.colossyan.com",         icon: "🎬" },
  "d-id":              { url: "https://www.d-id.com",              icon: "🎬" },
  "magisto":           { url: "https://www.magisto.com",           icon: "🎬" },
  "wibbitz":           { url: "https://www.wibbitz.com",           icon: "🎬" },
  "kling ai":          { url: "https://klingai.com",               icon: "🎬" },
  "kling":             { url: "https://klingai.com",               icon: "🎬" },
  "sora":              { url: "https://openai.com/sora",           icon: "🎬" },
  "haiper":            { url: "https://haiper.ai",                 icon: "🎬" },
  "kaiber":            { url: "https://kaiber.ai",                 icon: "🎬" },
  "genmo":             { url: "https://www.genmo.ai",              icon: "🎬" },
  "vidu":              { url: "https://www.vidu.studio",           icon: "🎬" },

  // ─── Writing / Text ───
  "chatgpt":           { url: "https://chat.openai.com",           icon: "💬" },
  "openai":            { url: "https://openai.com",                icon: "💬" },
  "claude":            { url: "https://claude.ai",                 icon: "💬" },
  "gemini":            { url: "https://gemini.google.com",         icon: "💬" },
  "google gemini":     { url: "https://gemini.google.com",         icon: "💬" },
  "perplexity":        { url: "https://www.perplexity.ai",         icon: "🔍" },
  "perplexity ai":     { url: "https://www.perplexity.ai",         icon: "🔍" },
  "jasper":            { url: "https://www.jasper.ai",             icon: "📝" },
  "jasper ai":         { url: "https://www.jasper.ai",             icon: "📝" },
  "copy.ai":           { url: "https://www.copy.ai",              icon: "📝" },
  "writesonic":        { url: "https://writesonic.com",            icon: "📝" },
  "rytr":              { url: "https://rytr.me",                   icon: "📝" },
  "grammarly":         { url: "https://www.grammarly.com",         icon: "📝" },
  "quillbot":          { url: "https://quillbot.com",              icon: "📝" },
  "wordtune":          { url: "https://www.wordtune.com",          icon: "📝" },
  "notion ai":         { url: "https://www.notion.so/product/ai",  icon: "📝" },
  "ai writer":         { url: "https://ai-writer.com",             icon: "📝" },
  "hyperwrite":        { url: "https://www.hyperwriteai.com",      icon: "📝" },
  "sudowrite":         { url: "https://www.sudowrite.com",         icon: "📝" },
  "anyword":           { url: "https://anyword.com",               icon: "📝" },
  "peppertype":        { url: "https://www.peppertype.ai",         icon: "📝" },
  "longshot ai":       { url: "https://www.longshot.ai",           icon: "📝" },
  "scalenut":          { url: "https://www.scalenut.com",          icon: "📝" },
  "frase":             { url: "https://www.frase.io",              icon: "📝" },
  "surfer seo":        { url: "https://surferseo.com",             icon: "📝" },
  "koala":             { url: "https://koala.sh",                  icon: "📝" },
  "koala ai":          { url: "https://koala.sh",                  icon: "📝" },
  "longshort story":   { url: "https://longshort.ai",              icon: "📝" },
  "longshortstory":    { url: "https://longshort.ai",              icon: "📝" },

  // ─── Music / Audio ───
  "suno":              { url: "https://suno.com",                  icon: "🎵" },
  "suno ai":           { url: "https://suno.com",                  icon: "🎵" },
  "udio":              { url: "https://www.udio.com",              icon: "🎵" },
  "aiva":              { url: "https://www.aiva.ai",               icon: "🎵" },
  "soundraw":          { url: "https://soundraw.io",               icon: "🎵" },
  "boomy":             { url: "https://boomy.com",                 icon: "🎵" },
  "mubert":            { url: "https://mubert.com",                icon: "🎵" },
  "amper music":       { url: "https://www.ampermusic.com",        icon: "🎵" },
  "beatoven":          { url: "https://www.beatoven.ai",           icon: "🎵" },
  "beatoven.ai":       { url: "https://www.beatoven.ai",           icon: "🎵" },
  "loudly":            { url: "https://www.loudly.com",            icon: "🎵" },
  "musicfy":           { url: "https://musicfy.lol",               icon: "🎵" },
  "soundful":          { url: "https://soundful.com",              icon: "🎵" },
  "ecrett music":      { url: "https://ecrettmusic.com",           icon: "🎵" },

  // ─── Voice / TTS ───
  "elevenlabs":        { url: "https://elevenlabs.io",             icon: "🗣️" },
  "eleven labs":       { url: "https://elevenlabs.io",             icon: "🗣️" },
  "murf":              { url: "https://murf.ai",                   icon: "🗣️" },
  "murf ai":           { url: "https://murf.ai",                   icon: "🗣️" },
  "play.ht":           { url: "https://play.ht",                   icon: "🗣️" },
  "speechify":         { url: "https://speechify.com",             icon: "🗣️" },
  "resemble ai":       { url: "https://www.resemble.ai",           icon: "🗣️" },
  "wellsaid labs":     { url: "https://wellsaidlabs.com",          icon: "🗣️" },
  "natural reader":    { url: "https://www.naturalreaders.com",    icon: "🗣️" },
  "lovo":              { url: "https://lovo.ai",                   icon: "🗣️" },
  "lovo ai":           { url: "https://lovo.ai",                   icon: "🗣️" },
  "typecast":          { url: "https://typecast.ai",               icon: "🗣️" },
  "listnr":            { url: "https://listnr.tech",               icon: "🗣️" },
  "uberduck":          { url: "https://uberduck.ai",               icon: "🗣️" },

  // ─── Code / Dev ───
  "github copilot":    { url: "https://github.com/features/copilot", icon: "💻" },
  "copilot":           { url: "https://github.com/features/copilot", icon: "💻" },
  "cursor":            { url: "https://cursor.sh",                 icon: "💻" },
  "cursor ai":         { url: "https://cursor.sh",                 icon: "💻" },
  "replit":            { url: "https://replit.com",                icon: "💻" },
  "replit ai":         { url: "https://replit.com",                icon: "💻" },
  "tabnine":           { url: "https://www.tabnine.com",           icon: "💻" },
  "codeium":           { url: "https://codeium.com",               icon: "💻" },
  "sourcegraph":       { url: "https://sourcegraph.com",           icon: "💻" },
  "blackbox ai":       { url: "https://www.blackbox.ai",           icon: "💻" },
  "cody":              { url: "https://sourcegraph.com/cody",      icon: "💻" },
  "devin":             { url: "https://devin.ai",                  icon: "💻" },
  "v0":                { url: "https://v0.dev",                    icon: "💻" },
  "bolt":              { url: "https://bolt.new",                  icon: "💻" },
  "bolt.new":          { url: "https://bolt.new",                  icon: "💻" },

  // ─── Research / Productivity ───
  "scispace":          { url: "https://typeset.io",                icon: "🔬" },
  "elicit":            { url: "https://elicit.com",                icon: "🔬" },
  "consensus":         { url: "https://consensus.app",             icon: "🔬" },
  "semantic scholar":  { url: "https://www.semanticscholar.org",   icon: "🔬" },
  "connected papers":  { url: "https://www.connectedpapers.com",   icon: "🔬" },
  "scholarai":         { url: "https://scholar-ai.net",            icon: "🔬" },
  "research rabbit":   { url: "https://www.researchrabbit.ai",     icon: "🔬" },
  "otter.ai":          { url: "https://otter.ai",                  icon: "📋" },
  "otter ai":          { url: "https://otter.ai",                  icon: "📋" },
  "fireflies":         { url: "https://fireflies.ai",              icon: "📋" },
  "fireflies.ai":      { url: "https://fireflies.ai",              icon: "📋" },
  "mem":               { url: "https://mem.ai",                    icon: "📋" },

  // ─── Design / UI ───
  "figma":             { url: "https://www.figma.com",             icon: "🎨" },
  "figma ai":          { url: "https://www.figma.com",             icon: "🎨" },
  "framer":            { url: "https://www.framer.com",            icon: "🎨" },
  "uizard":            { url: "https://uizard.io",                icon: "🎨" },
  "looka":             { url: "https://looka.com",                 icon: "🎨" },
  "brandmark":         { url: "https://brandmark.io",              icon: "🎨" },
  "designs.ai":        { url: "https://designs.ai",                icon: "🎨" },
  "khroma":            { url: "https://www.khroma.co",             icon: "🎨" },
  "remove.bg":         { url: "https://www.remove.bg",             icon: "🎨" },
  "photoroom":         { url: "https://www.photoroom.com",         icon: "🎨" },

  // ─── SEO / Marketing ───
  "semrush":           { url: "https://www.semrush.com",           icon: "📊" },
  "ahrefs":            { url: "https://ahrefs.com",                icon: "📊" },
  "vidiq":             { url: "https://vidiq.com",                 icon: "📊" },
  "tubebuddy":         { url: "https://www.tubebuddy.com",         icon: "📊" },
  "hootsuite":         { url: "https://www.hootsuite.com",         icon: "📊" },
  "buffer":            { url: "https://buffer.com",                icon: "📊" },
  "later":             { url: "https://later.com",                 icon: "📊" },

  // ─── Presentation ───
  "tome":              { url: "https://tome.app",                  icon: "📊" },
  "tome ai":           { url: "https://tome.app",                  icon: "📊" },
  "gamma":             { url: "https://gamma.app",                 icon: "📊" },
  "gamma ai":          { url: "https://gamma.app",                 icon: "📊" },
  "beautiful.ai":      { url: "https://www.beautiful.ai",          icon: "📊" },
  "slidesgo":          { url: "https://slidesgo.com",              icon: "📊" },
  "decktopus":         { url: "https://www.decktopus.com",         icon: "📊" },

  // ─── Resume / Career ───
  "resume.io":         { url: "https://resume.io",                 icon: "📄" },
  "kickresume":        { url: "https://www.kickresume.com",        icon: "📄" },
  "teal":              { url: "https://www.tealhq.com",            icon: "📄" },
  "jobscan":           { url: "https://www.jobscan.co",            icon: "📄" },
  "rezi":              { url: "https://www.rezi.ai",               icon: "📄" },
  "enhancv":           { url: "https://enhancv.com",               icon: "📄" },

  // ─── Thumbnail / Graphics ───
  "snappa":            { url: "https://snappa.com",                icon: "🎨" },
  "placeit":           { url: "https://placeit.net",               icon: "🎨" },
  "thumbnail ai":      { url: "https://thumbnail.ai",             icon: "🎨" },
  "thumbly":           { url: "https://thumbly.ai",                icon: "🎨" },
};

/**
 * Look up an AI tool by name (case-insensitive).
 * Returns { url, icon } or null.
 */
export function lookupTool(name) {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  return AI_TOOLS[key] || null;
}

/**
 * Given a text string like "Pictory (Premium), or Raw Shorts (Freemium)",
 * extract individual tool names and return an array of { name, url, icon, pricing }.
 */
export function extractToolsFromText(text) {
  if (!text) return [];
  
  const results = [];
  // Split by common separators: comma, "or", "and", "|", "/"
  const parts = text.split(/,|\bor\b|\band\b|\||\//).map(p => p.trim()).filter(Boolean);
  
  for (const part of parts) {
    // Extract tool name and optional pricing: "Pictory (Premium)" or "Pictory"
    const match = part.match(/^(.+?)(?:\s*\(([^)]+)\)\s*)?$/);
    if (!match) continue;
    
    let toolName = match[1].trim();
    const pricing = match[2]?.trim() || '';
    
    // Remove leading/trailing markdown artifacts
    toolName = toolName.replace(/^\*\*|\*\*$/g, '').replace(/^`|`$/g, '').trim();
    
    const info = lookupTool(toolName);
    results.push({
      name: toolName,
      url: info?.url || null,
      icon: info?.icon || '🔗',
      pricing,
    });
  }
  
  return results;
}

export default AI_TOOLS;
