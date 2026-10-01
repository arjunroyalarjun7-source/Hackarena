import React from 'react';
import { Sparkles } from 'lucide-react';

export default function TypingIndicator({ label = 'Sakhi is thinking...' }) {
  return (
    <div className="animate-slide-up" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 16px',
      background: 'rgba(30, 41, 69, 0.65)',
      backdropFilter: 'blur(8px)',
      borderRadius: 'var(--radius-full)',
      border: '1px solid var(--border-subtle)',
      width: 'fit-content'
    }}>
      <Sparkles size={14} color="#FB7185" />
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {label}
      </span>
      <div className="typing-dots" style={{ padding: '0 4px', background: 'transparent', border: 'none' }}>
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}
