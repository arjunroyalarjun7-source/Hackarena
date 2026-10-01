import React from 'react';
import { CheckCircle2, FileText, Compass, HelpCircle } from 'lucide-react';
import { getTranslation } from '../services/translations';

const ACTION_CONFIGS = {
  eligibility: {
    icon: CheckCircle2,
    gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
    iconColor: '#FB7185',
    translationKey: 'checkEligibility',
    descKey: 'en: Answer 4 simple questions in your own language.'
  },
  documents: {
    icon: FileText,
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    iconColor: '#818CF8',
    translationKey: 'documents',
    descKey: 'en: Learn which basic papers you need to prepare.'
  },
  apply: {
    icon: Compass,
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    iconColor: '#34D399',
    translationKey: 'howToApply',
    descKey: 'en: Step-by-step roadmap to apply without agent fees.'
  },
  help: {
    icon: HelpCircle,
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    iconColor: '#FBBF24',
    translationKey: 'iDontKnow',
    descKey: 'en: Unsure? Say "I don\'t know" anytime and Sakhi simplifies.'
  }
};

export default function QuickAction({ type = 'eligibility', onClick, currentLanguage = 'en-IN' }) {
  const config = ACTION_CONFIGS[type] || ACTION_CONFIGS.eligibility;
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className="glass-panel"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${config.borderColor}`,
        background: config.gradient,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'var(--transition-smooth)',
        width: '100%',
        color: 'inherit'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = config.borderColor;
      }}
    >
      <div style={{
        width: '46px',
        height: '46px',
        borderRadius: '14px',
        background: 'rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={24} color={config.iconColor} />
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px', color: '#FFFFFF' }}>
          {getTranslation(config.translationKey, currentLanguage)}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
          {type === 'eligibility' && (
            currentLanguage.startsWith('ta') ? 'உங்கள் சொந்த மொழியில் 4 எளிய கேள்விகளுக்கு பதிலளிக்கவும்.' :
            currentLanguage.startsWith('te') ? 'మీ స్వంత భాషలో 4 సాధారణ ప్రశ్నలకు సమాధానం ఇవ్వండి.' :
            'Answer 4 simple questions in your own language.'
          )}
          {type === 'documents' && (
            currentLanguage.startsWith('ta') ? 'நீங்கள் தயார் செய்ய வேண்டிய அடிப்படை ஆவணங்களை அறியவும்.' :
            currentLanguage.startsWith('te') ? 'మీరు సిద్ధం చేసుకోవాల్సిన ప్రాథమిక పత్రాలను తెలుసుకోండి.' :
            'Learn which basic papers you need to prepare.'
          )}
          {type === 'apply' && (
            currentLanguage.startsWith('ta') ? 'இடைத்தரகர்கள் இன்றி விண்ணப்பிக்க படிப்படியான வழிகாட்டுதல்.' :
            currentLanguage.startsWith('te') ? 'మధ్యవర్తులు లేకుండా దరఖాస్తు చేసుకోవడానికి దశలవారీ మార్గం.' :
            'Step-by-step roadmap to apply without broker fees.'
          )}
          {type === 'help' && (
            currentLanguage.startsWith('ta') ? 'சந்தேகமா? எப்போது வேண்டுமானாலும் "தெரியாது" என்று சொல்லலாம்.' :
            currentLanguage.startsWith('te') ? 'సందేహమా? ఎప్పుడైనా "తెలియదు" అని చెప్పండి, సఖీ సులభతరం చేస్తుంది.' :
            'Unsure? Say "I don\'t know" anytime and Sakhi simplifies.'
          )}
        </p>
      </div>
    </button>
  );
}
