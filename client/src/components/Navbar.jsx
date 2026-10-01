import React from 'react';
import { Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import SourceBadge from './SourceBadge';
import { getTranslation } from '../services/translations';

export default function Navbar({
  currentLanguage,
  onLanguageChange,
  currentPage,
  onNavigateHome,
  onResetSession
}) {
  return (
    <header className="navbar-container" style={{
      width: '100%',
      padding: '16px 24px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 11, 20, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand / Logo */}
        <button
          onClick={onNavigateHome}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}
          aria-label="Sakhi AI Home"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(244, 63, 94, 0.35)',
            fontSize: '1.4rem'
          }}>
            🌸
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Sakhi AI
              </span>
              <SourceBadge isDemo={true} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>
              {getTranslation('tagline', currentLanguage)}
            </p>
          </div>
        </button>

        {/* Right Actions: Language Selector & Restart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />

          {currentPage !== 'home' && (
            <button
              onClick={onResetSession}
              className="btn-sakhi btn-secondary"
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                minHeight: '38px',
                gap: '6px'
              }}
              title={getTranslation('startAgain', currentLanguage)}
            >
              <RotateCcw size={15} />
              <span>{getTranslation('startAgain', currentLanguage)}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
