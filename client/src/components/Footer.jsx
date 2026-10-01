import React from 'react';
import { Heart, Shield } from 'lucide-react';
import { getTranslation } from '../services/translations';

export default function Footer({ currentLanguage = 'en-IN' }) {
  return (
    <footer style={{
      width: '100%',
      padding: '40px 24px 32px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(7, 11, 20, 0.95)',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🌸</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>Sakhi AI</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {getTranslation('tagline', currentLanguage)}
          </span>
        </div>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-dim)',
          maxWidth: '650px',
          lineHeight: '1.6',
          margin: 0
        }}>
          {getTranslation('demoDisclaimer', currentLanguage)}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.82rem',
          color: 'var(--text-dim)'
        }}>
          <span>Built with</span>
          <Heart size={14} color="#F43F5E" fill="#F43F5E" />
          <span>for digital inclusion and women empowerment in India</span>
        </div>
      </div>
    </footer>
  );
}
