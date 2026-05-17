'use client';

import { useState, useRef } from 'react';
import styles from './PromptInput.module.css';

export default function PromptInput({ onSubmit, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to create... e.g., 'I want to create AI-generated YouTube videos' or 'Generate a professional LinkedIn bio for a software engineer'"
          disabled={isLoading}
          id="prompt-input"
          rows={4}
        />
        <div className={styles.inputFooter}>
          <span className={styles.charCount}>{input.length} chars</span>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            id="submit-button"
          >
            {isLoading ? (
              <>Generating...</>
            ) : (
              <>
                <span>Forge Prompt</span>
                <span className={styles.submitIcon}>→</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className={styles.hint}>
        <span className={styles.hintKey}>Ctrl</span>
        <span>+</span>
        <span className={styles.hintKey}>Enter</span>
        <span>to submit</span>
      </div>
    </div>
  );
}
