import React from 'react';
import { getTranslation } from '../services/translations';

export default function ProgressBar({ current = 1, total = 4, language = 'en-IN' }) {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
  const progressText = getTranslation('questionProgress', language, { current, total });

  return (
    <div style={{ width: '100%', marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {progressText}
        </span>
        <span style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#FDA4AF'
        }}>
          {percentage}%
        </span>
      </div>

      <div className="progress-track" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
