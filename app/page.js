'use client';

import { useState, useRef, useCallback } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header';
import CategorySelector from '@/components/CategorySelector';
import PromptInput from '@/components/PromptInput';
import LoadingAnimation from '@/components/LoadingAnimation';
import ResponseDisplay from '@/components/ResponseDisplay';

const EXAMPLE_PROMPTS = [
  { emoji: '🎬', text: 'Create AI-generated YouTube videos with scripts and thumbnails' },
  { emoji: '🖼️', text: 'Generate a hyper-realistic portrait with cinematic lighting' },
  { emoji: '📝', text: 'Write a viral blog post about AI trends in 2025' },
  { emoji: '💼', text: 'Craft a professional LinkedIn bio for a data scientist' },
  { emoji: '🎵', text: 'Compose an ambient lo-fi track for studying' },
  { emoji: '🚀', text: 'Generate a SaaS startup idea with a go-to-market plan' },
];

export default function Home() {
  const [category, setCategory] = useState('auto');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [hasResponded, setHasResponded] = useState(false);
  const abortControllerRef = useRef(null);

  const handleGenerate = useCallback(async (message) => {
    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setResponse('');
    setError(null);
    setIsLoading(true);
    setIsStreaming(false);
    setHasResponded(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, category }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }

      setIsLoading(false);
      setIsStreaming(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              setIsStreaming(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
                setResponse(fullResponse);
              }
              if (parsed.error) {
                setError(parsed.error);
                setIsStreaming(false);
                return;
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }

      setIsStreaming(false);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setIsLoading(false);
      setIsStreaming(false);
      setError(err.message || 'Failed to generate response. Please try again.');
    }
  }, [category]);

  const handleNewResponse = () => {
    setResponse('');
    setError(null);
    setHasResponded(false);
    setIsLoading(false);
    setIsStreaming(false);

    // Focus the input
    setTimeout(() => {
      const input = document.getElementById('prompt-input');
      if (input) input.focus();
    }, 100);
  };

  const handleExampleClick = (text) => {
    handleGenerate(text);
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Transform Ideas Into{' '}
            <span className={styles.heroGradient}>AI Workflows</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Describe what you want to create — get structured prompts, tool recommendations, and step-by-step workflows instantly.
          </p>
        </div>

        {/* Category Selector */}
        <div className={styles.inputSection}>
          <CategorySelector selected={category} onSelect={setCategory} />
        </div>

        {/* Prompt Input */}
        <div className={styles.inputSection}>
          <PromptInput onSubmit={handleGenerate} isLoading={isLoading || isStreaming} />
        </div>

        {/* Loading */}
        {isLoading && <LoadingAnimation />}

        {/* Response */}
        {(response || error) && (
          <div className={styles.responseSection}>
            <ResponseDisplay
              response={response}
              isStreaming={isStreaming}
              error={error}
              onNewResponse={handleNewResponse}
            />
          </div>
        )}

        {/* Example Prompts - only show when no response */}
        {!hasResponded && !isLoading && (
          <div className={styles.examplesSection}>
            <div className={styles.examplesLabel}>Try an example</div>
            <div className={styles.examplesGrid}>
              {EXAMPLE_PROMPTS.map((example, i) => (
                <button
                  key={i}
                  className={styles.exampleCard}
                  onClick={() => handleExampleClick(example.text)}
                  id={`example-prompt-${i}`}
                >
                  <span className={styles.exampleEmoji}>{example.emoji}</span>
                  <span className={styles.exampleText}>{example.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            Powered by <span className={styles.footerBrand}>PromptWS</span> — Your Modern AI Workspace
          </p>
        </footer>
      </main>
    </>
  );
}
