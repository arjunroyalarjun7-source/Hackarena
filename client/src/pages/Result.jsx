import React from 'react';
import { Volume2, VolumeX, RotateCcw, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import JourneyCard from '../components/JourneyCard';
import SourceBadge from '../components/SourceBadge';
import { getTranslation } from '../services/translations';

export default function Result({
  journeyData,
  currentLanguage = 'en-IN',
  isSpeaking = false,
  onReadAloud,
  onStopSpeaking,
  onStartAgain
}) {
  const officialUrl = journeyData?.source?.url || 'https://example.gov.in';

  return (
    <div style={{
      maxWidth: '920px',
      margin: '0 auto',
      padding: '36px 20px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* Top Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34D399',
          fontSize: '0.85rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={16} />
          <span>Journey Completed Successfully</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          color: '#FFFFFF'
        }}>
          {getTranslation('yourJourney', currentLanguage)}
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-muted)',
          maxWidth: '640px',
          lineHeight: '1.5',
          margin: '0 auto'
        }}>
          {journeyData?.reply || getTranslation('eligibilitySummary', currentLanguage)}
        </p>

        {/* Action Buttons Row: Read Aloud, Start Again, Official Service */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '12px'
        }}>
          <button
            onClick={isSpeaking ? onStopSpeaking : onReadAloud}
            className="btn-sakhi btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{isSpeaking ? getTranslation('stopSpeaking', currentLanguage) : getTranslation('readAloud', currentLanguage)}</span>
          </button>

          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sakhi btn-secondary"
            style={{ padding: '12px 24px', fontSize: '0.95rem', textDecoration: 'none' }}
          >
            <span>{getTranslation('officialService', currentLanguage)}</span>
            <ExternalLink size={16} />
          </a>

          <button
            onClick={onStartAgain}
            className="btn-sakhi btn-secondary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <RotateCcw size={16} />
            <span>{getTranslation('startAgain', currentLanguage)}</span>
          </button>
        </div>
      </div>

      {/* Main Journey Details & Roadmap */}
      <JourneyCard
        journeyData={journeyData}
        currentLanguage={currentLanguage}
        onStartAgain={onStartAgain}
      />
    </div>
  );
}
