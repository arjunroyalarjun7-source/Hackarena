import React from 'react';
import { Volume2, VolumeX, User } from 'lucide-react';

export default function ChatBubble({
  role = 'sakhi', // 'sakhi' | 'user'
  text,
  onSpeak,
  isSpeakingThis = false
}) {
  const isSakhi = role === 'sakhi' || role === 'model';

  return (
    <div
      className={`animate-slide-up ${isSakhi ? 'bubble-sakhi' : 'bubble-user'}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: isSakhi ? '#FDA4AF' : '#FDE047'
          }}>
            {isSakhi ? '🌸 Sakhi AI' : '👤 You'}
          </span>
        </div>

        {/* Audio speech button for Sakhi bubbles */}
        {isSakhi && onSpeak && (
          <button
            onClick={() => onSpeak(text)}
            style={{
              background: isSpeakingThis ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-full)',
              color: isSpeakingThis ? '#FDA4AF' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              transition: 'all 0.2s ease'
            }}
            title={isSpeakingThis ? 'Stop speaking' : 'Read aloud'}
            aria-label="Read message aloud"
          >
            {isSpeakingThis ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isSpeakingThis ? 'Stop' : 'Listen'}</span>
          </button>
        )}
      </div>

      <div style={{
        fontSize: '1.05rem',
        lineHeight: 1.55,
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap'
      }}>
        {text}
      </div>
    </div>
  );
}
