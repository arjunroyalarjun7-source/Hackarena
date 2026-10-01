import React from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGES } from '../services/translations';

export default function LanguageSelector({ currentLanguage, onLanguageChange }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '4px',
      borderRadius: 'var(--radius-full)',
      border: '1px solid var(--border-subtle)'
    }}>
      <div style={{ paddingLeft: '8px', color: 'var(--color-violet)', display: 'flex', alignItems: 'center' }}>
        <Globe size={16} />
      </div>

      <div style={{ display: 'flex', gap: '3px' }}>
        {LANGUAGES.map((lang) => {
          const isSelected = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)'
                  : 'transparent',
                color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              aria-label={`Select language ${lang.name}`}
            >
              {lang.nativeName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
