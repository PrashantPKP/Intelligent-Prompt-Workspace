'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import styles from './ResponseDisplay.module.css';
import { lookupTool, extractToolsFromText } from '@/lib/aiToolsDb';

/* ─── Section Parser ─── */
function parseResponse(md) {
  if (!md) return [];
  const parts = md.split(/^### /gm);
  const sections = [];

  // If no ### headers found (flat response like a direct email)
  if (parts.length <= 1 && md.trim()) {
    const trimmed = md.trim();
    // Check if it starts with [CONTENT] marker
    if (/^\[CONTENT\]/i.test(trimmed)) {
      const content = trimmed.replace(/^\[CONTENT\]\s*/i, '');
      // Try to extract a title from the first line
      const firstLine = content.split('\n')[0].trim();
      const isSubjectLine = /^Subject:/i.test(firstLine);
      const title = isSubjectLine ? firstLine.replace(/^Subject:\s*/i, '').trim() : 'Generated Content';
      sections.push({ title: '📌 ' + title, content, type: 'content' });
      return sections;
    }
    // Check if this looks like a direct email/letter/bio
    const looksLikeEmail = /\b(dear|subject:|sincerely|regards|hi |hello )/i.test(trimmed);
    const looksLikeBio = /\b(professional|experienced|passionate|skilled)\b/i.test(trimmed) && trimmed.length < 800;
    if (looksLikeEmail || looksLikeBio) {
      const firstLine = trimmed.split('\n')[0].trim();
      const title = firstLine.length < 80 ? firstLine : 'Generated Content';
      sections.push({ title: '📌 ' + title, content: trimmed, type: 'content' });
      return sections;
    }
    // Fallback: treat as generic
    sections.push({ title: '📌 Response', content: trimmed, type: 'generic' });
    return sections;
  }

  for (const part of parts) {
    if (!part.trim()) continue;
    const nl = part.indexOf('\n');
    if (nl === -1) {
      sections.push({ title: part.trim(), content: '', type: detectType(part.trim()) });
      continue;
    }
    const title = part.substring(0, nl).trim();
    const content = part.substring(nl + 1).trim();
    sections.push({ title, content, type: detectType(title) });
  }
  return sections;
}

function detectType(title) {
  const t = title.toLowerCase();
  if (t.includes('goal') || t.includes('understanding')) return 'goal';
  if (t.includes('email') || t.includes('letter') || t.includes('bio')) return 'content';
  if (t.includes('here') && t.includes('content')) return 'content';
  if (t.includes('[content]')) return 'content';
  if (t.includes('[prompt]')) return 'content';
  if (t.includes('alternative')) return 'alternatives';
  if (t.includes('workflow')) return 'workflow';
  if (t.includes('tool recommendation') || t.includes('ai tool')) return 'tools';
  if (t.includes('prompt') && !t.includes('[prompt]')) return 'prompts';
  if (t.includes('tip')) return 'tips';
  return 'generic';
}

function extractEmoji(title) {
  const match = title.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)/u);
  return match ? match[0] : '📌';
}

function cleanTitle(title) {
  return title.replace(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*/u, '').replace(/\s*\[(CONTENT|PROMPT)\]\s*/gi, '').trim();
}

/* ─── Sub-parsers ─── */
function parseWorkflowSteps(content) {
  const steps = [];

  // NORMALIZE: The AI sometimes omits newlines between steps.
  let normalized = content
    .replace(/([^\n])(\d+\.\s+\*\*)/g, '$1\n\n$2')   // Inject \n before "2. **"
    .replace(/\\?"(\d+\.\s+\*\*)/g, '"\n\n$1')         // Fix escaped quote before step
    .replace(/"(\d+\.\s+\*\*)/g, '"\n\n$1');            // Fix quote directly before step

  // SPLIT at step boundaries: "1. **", "2. **", etc.
  const parts = normalized.split(/(?=\d+\.\s+\*\*)/);

  for (const part of parts) {
    // Match: "1. **Title** [CONTENT]\n...body..."
    const pm = part.match(/^(\d+)\.\s+\*\*(.+?)\*\*(.*)\n([\s\S]*)/);
    if (!pm) continue;

    const stepNum = parseInt(pm[1]);
    const rawTitle = pm[2].trim();
    const afterTitle = pm[3].trim(); // Text after ** like "[CONTENT]"
    const body = pm[4].trim();

    // Detect [CONTENT] or [PROMPT] marker (can be in rawTitle or afterTitle)
    const fullTitle = rawTitle + ' ' + afterTitle;
    let mode = 'auto';
    let title = rawTitle;
    if (/\[CONTENT\]/i.test(fullTitle)) { mode = 'content'; title = rawTitle.replace(/\s*\[CONTENT\]\s*/i, '').trim(); }
    else if (/\[PROMPT\]/i.test(fullTitle)) { mode = 'prompt'; title = rawTitle.replace(/\s*\[PROMPT\]\s*/i, '').trim(); }

    // Extract PROMPT_VERSION from content steps
    const pvMatch = body.match(/PROMPT_VERSION:\s*\\?"?([\s\S]*?)(?:\\?"|$)/i);
    const promptVersion = pvMatch ? pvMatch[1].trim().replace(/^\\?"|\\?"$/g, '').replace(/^"|"$/g, '') : '';

    // Extract "Use with:" tools for prompt steps
    const useWithMatch = body.match(/\*\*Use with:\*\*\s*(.+)/i);
    const useWithTools = useWithMatch ? useWithMatch[1].trim() : '';

    // Legacy tool extraction
    const toolMatch = body.match(/\*\*Recommended AI Tool\(s\):\*\*\s*(.+)/i);
    const tools = useWithTools || (toolMatch ? toolMatch[1].trim() : '');

    // Get main body content (strip meta lines)
    let bodyContent = body
      .replace(/^.*\*\*Use with:\*\*.*/gim, '')
      .replace(/^.*\*\*Recommended AI Tool\(s\):\*\*.*/gim, '')
      .replace(/^.*\*\*Optimized Prompt:\*\*.*/gim, '')
      .replace(/PROMPT_VERSION:\s*\\?"?[\s\S]*?\\?"?\s*$/gim, '')
      .replace(/^Here'?s?.*:$/gim, '')
      .trim();
    bodyContent = bodyContent.split('\n').map(l => l.replace(/^\s*-\s*/, '').trim()).filter(Boolean).join('\n');

    // Auto-detect mode if not marked
    if (mode === 'auto') {
      const titleLower = title.toLowerCase();
      const promptKeywords = ['animation', 'animate', 'thumbnail', 'voiceover', 'voice', 'audio', 'music', 'sound', 'image', 'illustration', 'graphic', 'video edit', 'motion'];
      const isPromptByTitle = promptKeywords.some(k => titleLower.includes(k));
      const isPromptByBody = useWithTools || /^"/.test(bodyContent) || /^\\?"/.test(bodyContent) || /^create\s+(a|an)\s/i.test(bodyContent);
      mode = (isPromptByTitle || isPromptByBody || (!bodyContent && tools)) ? 'prompt' : 'content';
    }

    steps.push({ number: stepNum, title, mode, body: bodyContent, tools, promptVersion });
  }
  return steps;
}

function parseToolCards(content) {
  const tools = [];
  const blocks = content.split(/^- \*\*/gm).filter(Boolean);
  for (const block of blocks) {
    const nameMatch = block.match(/^(.+?)\*\*/);
    if (!nameMatch) continue;
    const g = (key) => { const m = block.match(new RegExp(`\\*\\*${key}:\\*\\*\\s*(.+)`, 'i')); return m ? m[1].trim() : ''; };
    tools.push({
      name: nameMatch[1].trim(),
      pricing: g('Pricing'),
      bestFor: g('Best For'),
      beginnerFriendly: g('Beginner Friendly'),
      qualityLevel: g('Quality Level'),
      tags: g('Special Tags'),
    });
  }
  return tools;
}

function parsePromptItems(content) {
  const prompts = [];
  const re = /(\d+)\.\s+\*\*(.+?)[:\s]*\*\*[:\s]*"?([\s\S]*?)"?\s*(?=\n\d+\.\s+\*\*|$)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    prompts.push({ number: parseInt(m[1]), type: m[2].trim(), text: m[3].trim().replace(/^"|"$/g, '') });
  }
  return prompts;
}

function parseTipItems(content) {
  const tips = [];
  const re = /^-\s+\*\*(.+?):\*\*\s*(.+)$/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    tips.push({ title: m[1].trim(), desc: m[2].trim() });
  }
  return tips;
}

/* ─── Inline Markdown ─── */
function inlineMd(text) {
  if (!text) return '';
  // Strip internal markers before rendering
  let h = text.replace(/\[CONTENT\]/gi, '').replace(/\[PROMPT\]/gi, '');
  h = h.replace(/PROMPT_VERSION:[\s\S]*$/im, '');
  h = h.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  h = h.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  h = h.replace(/\n/g, '<br>');
  return h;
}

/* ─── Copy Hook ─── */
function useCopy() {
  const [copiedId, setCopiedId] = useState(null);
  const copy = useCallback(async (text, id) => {
    try { await navigator.clipboard.writeText(text); } catch { /* fallback */ const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);
  return { copiedId, copy };
}

/* ─── Section Components ─── */

function GoalCard({ section, isActive }) {
  return (
    <div className={`${styles.sectionCard} ${styles.goalCard} ${isActive ? styles.cardActive : ''}`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
        <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
      </div>
      <div className={styles.goalContent} dangerouslySetInnerHTML={{ __html: inlineMd(section.content) }} />
    </div>
  );
}

/* ─── Content Card (Mode A — full email/bio/letter) ─── */
function ContentCard({ section, isActive }) {
  const { copiedId, copy } = useCopy();
  const [showPrompt, setShowPrompt] = useState(false);

  // Extract hidden prompt version
  const pvMatch = section.content.match(/PROMPT_VERSION:\s*"?([\s\S]*?)(?:"|$)/i);
  const promptVersion = pvMatch ? pvMatch[1].trim().replace(/^"|"$/g, '') : '';
  const cleanContent = section.content.replace(/PROMPT_VERSION:[\s\S]*$/im, '').trim();

  return (
    <div className={`${styles.sectionCard} ${styles.contentCard} ${isActive ? styles.cardActive : ''}`}>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderLeft}>
          <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
          <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
          <span className={styles.modeBadgeContent}>✅ Generated</span>
        </div>
        <button
          className={`${styles.contentCopyBtn} ${copiedId === 'content-main' ? styles.copyBtnDone : ''}`}
          onClick={() => copy(cleanContent, 'content-main')}
        >
          {copiedId === 'content-main' ? '✓ Copied!' : '📋 Copy Content'}
        </button>
      </div>
      <div className={styles.contentBody} dangerouslySetInnerHTML={{ __html: inlineMd(cleanContent) }} />
      {promptVersion && (
        <div className={styles.contentFooter}>
          <button className={styles.promptToggleBtn} onClick={() => setShowPrompt(!showPrompt)}>
            {showPrompt ? '✕ Hide Prompt' : '🔗 Need Prompt Instead?'}
          </button>
          {showPrompt && (
            <div className={styles.promptVersionBox}>
              <p className={styles.promptVersionText}>"{promptVersion}"</p>
              <button
                className={`${styles.copyBtn} ${copiedId === 'pv-content' ? styles.copyBtnDone : ''}`}
                onClick={() => copy(promptVersion, 'pv-content')}
              >
                {copiedId === 'pv-content' ? '✓ Copied' : '📋 Copy Prompt'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Clickable Tool Badge ─── */
function ToolBadge({ name }) {
  const info = lookupTool(name);
  if (info?.url) {
    return (
      <a href={info.url} target="_blank" rel="noopener noreferrer" className={styles.toolLink}>
        <span className={styles.toolLinkIcon}>{info.icon}</span>
        <span>{name}</span>
        <span className={styles.toolLinkArrow}>↗</span>
      </a>
    );
  }
  return <span className={styles.toolLinkNoUrl}>{name}</span>;
}

/* ─── Render tools text as clickable badges ─── */
function ToolBadgesFromText({ text }) {
  const tools = useMemo(() => extractToolsFromText(text), [text]);
  if (tools.length === 0) return <span>{text}</span>;
  return (
    <div className={styles.toolBadgesRow}>
      {tools.map((t, i) => (
        <span key={i} className={styles.toolBadgeWrap}>
          <ToolBadge name={t.name} />
          {t.pricing && <span className={`${styles.pricingBadgeSm} ${t.pricing.toLowerCase() === 'free' ? styles.badgeFree : t.pricing.toLowerCase() === 'premium' ? styles.badgePremium : styles.badgeFreemium}`}>{t.pricing}</span>}
        </span>
      ))}
    </div>
  );
}

function ToolsGrid({ section, isActive }) {
  const tools = useMemo(() => parseToolCards(section.content), [section.content]);

  const pricingClass = (p) => {
    const l = p.toLowerCase();
    if (l === 'free') return styles.badgeFree;
    if (l === 'premium') return styles.badgePremium;
    return styles.badgeFreemium;
  };

  const qualityDots = (q) => {
    const l = q.toLowerCase();
    if (l === 'high') return 3;
    if (l === 'medium') return 2;
    return 1;
  };

  if (tools.length === 0) {
    return (
      <div className={`${styles.sectionCard} ${isActive ? styles.cardActive : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
          <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
        </div>
        <div className={styles.genericContent} dangerouslySetInnerHTML={{ __html: inlineMd(section.content) }} />
      </div>
    );
  }

  return (
    <div className={`${styles.toolsSection} ${isActive ? styles.cardActive : ''}`}>
      <div className={styles.toolsSectionHeader}>
        <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
        <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
      </div>
      <div className={styles.toolsGrid}>
        {tools.map((tool, i) => {
          const dbInfo = lookupTool(tool.name);
          return (
            <div key={i} className={styles.toolCard} style={{ animationDelay: `${i * 80}ms` }}>
              <div className={styles.toolHeader}>
                {dbInfo?.url ? (
                  <a href={dbInfo.url} target="_blank" rel="noopener noreferrer" className={styles.toolNameLink}>
                    <span className={styles.toolNameIcon}>{dbInfo.icon}</span>
                    <h3 className={styles.toolName}>{tool.name}</h3>
                    <span className={styles.toolVisitArrow}>↗</span>
                  </a>
                ) : (
                  <h3 className={styles.toolName}>{tool.name}</h3>
                )}
                {tool.pricing && <span className={`${styles.pricingBadge} ${pricingClass(tool.pricing)}`}>{tool.pricing}</span>}
              </div>
              {tool.bestFor && <p className={styles.toolBestFor}>{tool.bestFor}</p>}
              <div className={styles.toolMeta}>
                {tool.qualityLevel && (
                  <div className={styles.toolMetaItem}>
                    <span className={styles.toolMetaLabel}>Quality</span>
                    <span className={styles.qualityDots}>
                      {[1, 2, 3].map((d) => (
                        <span key={d} className={`${styles.dot} ${d <= qualityDots(tool.qualityLevel) ? styles.dotFilled : ''}`} />
                      ))}
                    </span>
                  </div>
                )}
                {tool.beginnerFriendly && (
                  <div className={styles.toolMetaItem}>
                    <span className={styles.toolMetaLabel}>Beginner</span>
                    <span className={tool.beginnerFriendly.toLowerCase() === 'yes' ? styles.metaYes : styles.metaNo}>
                      {tool.beginnerFriendly.toLowerCase() === 'yes' ? '✓' : '✗'}
                    </span>
                  </div>
                )}
              </div>
              {tool.tags && (
                <div className={styles.toolTags}>
                  {tool.tags.split(',').map((tag, j) => (
                    <span key={j} className={styles.toolTag}>{tag.trim()}</span>
                  ))}
                </div>
              )}
              {dbInfo?.url && (
                <a href={dbInfo.url} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>
                  Visit {tool.name} ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Individual Step Item (needs its own state for prompt toggle) ─── */
function StepItem({ step, i, totalSteps, copiedId, copy }) {
  const isContent = step.mode === 'content';
  const [showPromptVersion, setShowPV] = useState(false);
  return (
    <div className={styles.stepCard} style={{ animationDelay: `${i * 100}ms` }}>
      <div className={styles.stepNumberCol}>
        <div className={`${styles.stepNumber} ${isContent ? styles.stepNumContent : styles.stepNumPrompt}`}>{step.number}</div>
        {i < totalSteps - 1 && <div className={styles.stepLine} />}
      </div>
      <div className={`${styles.stepBody} ${isContent ? styles.stepBodyContent : styles.stepBodyPrompt}`}>
        <div className={styles.stepTitleRow}>
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <span className={isContent ? styles.modeBadgeContent : styles.modeBadgePrompt}>
            {isContent ? '✅ Generated' : '🔗 AI Tool Needed'}
          </span>
        </div>
        {!isContent && step.tools && (
          <div className={styles.stepToolsRow}>
            <span className={styles.stepToolsLabel}>Use with:</span>
            <div className={styles.stepToolsValue}><ToolBadgesFromText text={step.tools} /></div>
          </div>
        )}
        {step.body && (
          <div className={isContent ? styles.stepContentBox : styles.stepPromptBox}>
            {!isContent && <div className={styles.stepPromptHeader}><span className={styles.stepPromptLabel}>Copy this prompt</span></div>}
            <div className={isContent ? styles.stepContentText : styles.stepPromptText} dangerouslySetInnerHTML={{ __html: inlineMd(step.body) }} />
            <button className={`${styles.copyBtn} ${styles.copyBtnInline} ${copiedId === `body-${i}` ? styles.copyBtnDone : ''}`} onClick={() => copy(step.body, `body-${i}`)}>
              {copiedId === `body-${i}` ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        )}
        {isContent && step.tools && (
          <div className={styles.stepToolsRow}>
            <span className={styles.stepToolsLabel}>🛠️ Tools:</span>
            <div className={styles.stepToolsValue}><ToolBadgesFromText text={step.tools} /></div>
          </div>
        )}
        {isContent && step.promptVersion && (
          <div className={styles.promptToggle}>
            <button className={styles.promptToggleBtn} onClick={() => setShowPV(!showPromptVersion)}>
              {showPromptVersion ? '✕ Hide Prompt' : '🔗 Need Prompt Instead?'}
            </button>
            {showPromptVersion && (
              <div className={styles.promptVersionBox}>
                <p className={styles.promptVersionText}>"{step.promptVersion}"</p>
                <button className={`${styles.copyBtn} ${copiedId === `pv-${i}` ? styles.copyBtnDone : ''}`} onClick={() => copy(step.promptVersion, `pv-${i}`)}>
                  {copiedId === `pv-${i}` ? '✓ Copied' : '📋 Copy Prompt'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkflowSteps({ section, isActive }) {
  const steps = useMemo(() => parseWorkflowSteps(section.content), [section.content]);
  const { copiedId, copy } = useCopy();

  if (steps.length === 0) {
    return (
      <div className={`${styles.sectionCard} ${isActive ? styles.cardActive : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
          <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
        </div>
        <div className={styles.genericContent} dangerouslySetInnerHTML={{ __html: inlineMd(section.content) }} />
      </div>
    );
  }

  return (
    <div className={`${styles.workflowSection} ${isActive ? styles.cardActive : ''}`}>
      <div className={styles.workflowHeader}>
        <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
        <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
      </div>
      <div className={styles.stepsTimeline}>
        {steps.map((step, i) => (
          <StepItem key={i} step={step} i={i} totalSteps={steps.length} copiedId={copiedId} copy={copy} />
        ))}
      </div>
    </div>
  );
}

function PromptsSection({ section, isActive }) {
  const prompts = useMemo(() => parsePromptItems(section.content), [section.content]);
  const { copiedId, copy } = useCopy();

  const introMatch = section.content.match(/^(.+?)(?=\n\d+\.\s+\*\*)/s);
  const intro = introMatch ? introMatch[1].trim() : '';

  if (prompts.length === 0) {
    return (
      <div className={`${styles.sectionCard} ${isActive ? styles.cardActive : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
          <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
        </div>
        <div className={styles.genericContent} dangerouslySetInnerHTML={{ __html: inlineMd(section.content) }} />
      </div>
    );
  }

  return (
    <div className={`${styles.promptsSection} ${isActive ? styles.cardActive : ''}`}>
      <div className={styles.promptsSectionHeader}>
        <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
        <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
      </div>
      {intro && <p className={styles.promptsIntro} dangerouslySetInnerHTML={{ __html: inlineMd(intro) }} />}
      <div className={styles.promptsGrid}>
        {prompts.map((p, i) => (
          <div key={i} className={styles.promptCard} style={{ animationDelay: `${i * 80}ms` }}>
            <div className={styles.promptCardHeader}>
              <span className={styles.promptType}>{p.type}</span>
              <button
                className={`${styles.copyBtn} ${copiedId === `prompt-${i}` ? styles.copyBtnDone : ''}`}
                onClick={() => copy(p.text, `prompt-${i}`)}
              >
                {copiedId === `prompt-${i}` ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <p className={styles.promptText}>"{p.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TipsSection({ section, isActive }) {
  const tips = useMemo(() => parseTipItems(section.content), [section.content]);

  if (tips.length === 0) {
    return (
      <div className={`${styles.sectionCard} ${isActive ? styles.cardActive : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
          <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
        </div>
        <div className={styles.genericContent} dangerouslySetInnerHTML={{ __html: inlineMd(section.content) }} />
      </div>
    );
  }

  return (
    <div className={`${styles.tipsSection} ${isActive ? styles.cardActive : ''}`}>
      <div className={styles.tipsSectionHeader}>
        <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
        <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
      </div>
      <div className={styles.tipsGrid}>
        {tips.map((tip, i) => (
          <div key={i} className={styles.tipCard} style={{ animationDelay: `${i * 80}ms` }}>
            <div className={styles.tipIcon}>💡</div>
            <div>
              <h4 className={styles.tipTitle}>{tip.title}</h4>
              <p className={styles.tipDesc}>{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericSection({ section, isActive }) {
  return (
    <div className={`${styles.sectionCard} ${isActive ? styles.cardActive : ''}`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEmoji}>{extractEmoji(section.title)}</span>
        <h2 className={styles.sectionTitle}>{cleanTitle(section.title)}</h2>
      </div>
      <div className={styles.genericContent} dangerouslySetInnerHTML={{ __html: inlineMd(section.content) }} />
    </div>
  );
}

/* ─── Main Component ─── */
export default function ResponseDisplay({ response, isStreaming, error, onNewResponse }) {
  const { copiedId, copy } = useCopy();
  const sections = useMemo(() => parseResponse(response), [response]);

  const handleDownload = () => {
    const blob = new Blob([response], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptws-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className={styles.errorCard} id="error-display">
        <div className={styles.errorIcon}>⚠️</div>
        <div className={styles.errorTitle}>Something went wrong</div>
        <div className={styles.errorMessage}>{error}</div>
        <button className={styles.retryBtn} onClick={onNewResponse} id="retry-button">
          <span>↻</span> Try Again
        </button>
      </div>
    );
  }

  if (!response) return null;

  const sectionRenderers = {
    goal: GoalCard,
    content: ContentCard,
    alternatives: PromptsSection,
    workflow: WorkflowSteps,
    tools: ToolsGrid,
    prompts: PromptsSection,
    tips: TipsSection,
    generic: GenericSection,
  };

  return (
    <div className={styles.responseWrapper} id="response-display">
      {/* Streaming indicator */}
      {isStreaming && (
        <div className={styles.streamingBanner}>
          <div className={styles.streamingDots}>
            <span /><span /><span />
          </div>
          <span>AI is generating your workflow...</span>
        </div>
      )}

      {/* Render each section as its own card */}
      <div className={styles.sectionsContainer}>
        {sections.map((section, i) => {
          const isLast = i === sections.length - 1;
          const sectionStreaming = isStreaming && isLast;
          const Renderer = sectionRenderers[section.type] || GenericSection;
          return (
            <div key={i} className={styles.sectionAnim} style={{ animationDelay: `${i * 120}ms` }}>
              <Renderer section={section} isActive={sectionStreaming} />
              {sectionStreaming && <div className={styles.streamingCursor} />}
            </div>
          );
        })}
      </div>

      {/* Action bar */}
      {!isStreaming && response && (
        <div className={styles.actionsBar}>
          <button
            className={`${styles.actionBtn} ${copiedId === 'full' ? styles.actionBtnDone : ''}`}
            onClick={() => copy(response, 'full')}
            id="copy-button"
          >
            <span>{copiedId === 'full' ? '✓' : '📋'}</span>
            <span>{copiedId === 'full' ? 'Copied!' : 'Copy All'}</span>
          </button>
          <button className={styles.actionBtn} onClick={handleDownload} id="download-button">
            <span>⬇</span>
            <span>Download</span>
          </button>
          <button className={styles.newBtn} onClick={onNewResponse} id="new-response-button">
            <span>+</span>
            <span>New Response</span>
          </button>
        </div>
      )}
    </div>
  );
}
