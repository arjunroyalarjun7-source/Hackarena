import React from 'react';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { getTranslation } from '../services/translations';

export default function PrivacyCard({ currentLanguage = 'en-IN' }) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px 24px',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(13, 21, 39, 0.6) 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'rgba(244, 63, 94, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <ShieldCheck size={24} color="#FB7185" />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <strong style={{ fontSize: '0.98rem', color: '#FFFFFF', fontWeight: 700 }}>
            {getTranslation('privacy', currentLanguage)}
          </strong>
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34D399',
            fontWeight: 600
          }}>
            Safe & Private
          </span>
        </div>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          margin: 0,
          lineHeight: '1.45'
        }}>
          🛡️ <strong>{getTranslation('privacyNotice', currentLanguage)}</strong> Sakhi will never ask for your bank password, UPI PIN, or government login.
        </p>
      </div>
    </div>
  );
}
