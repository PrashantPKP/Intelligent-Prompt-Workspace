'use client';

import { CATEGORIES } from '@/lib/systemPrompt';
import styles from './CategorySelector.module.css';

export default function CategorySelector({ selected, onSelect }) {
  return (
    <div className={styles.wrapper} id="category-selector">
      <div className={styles.label}>Category</div>
      <div className={styles.grid}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.chip} ${selected === cat.id ? styles.chipActive : ''}`}
            onClick={() => onSelect(cat.id)}
            title={cat.description}
            id={`category-${cat.id}`}
          >
            <span className={styles.chipEmoji}>{cat.label.split(' ')[0]}</span>
            <span>{cat.label.split(' ').slice(1).join(' ')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
