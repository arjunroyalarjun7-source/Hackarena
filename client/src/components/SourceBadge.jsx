import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function SourceBadge({ isDemo = true, label = 'DEMO DATA' }) {
  if (!isDemo) return null;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.72rem',
        fontWeight: 800,
        letterSpacing: '0.06em',
        padding: '3px 8px',
        borderRadius: '6px',
        background: 'rgba(245, 158, 11, 0.15)',
        color: '#FBBF24',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        textTransform: 'uppercase',
        verticalAlign: 'middle',
        userSelect: 'none'
      }}
      title="This is demonstration data for hackathon evaluation."
    >
      <AlertCircle size={11} />
      <span>{label}</span>
    </span>
  );
}
