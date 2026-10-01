import React, { useState } from 'react';
import { Mic, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import VoiceOrb from '../components/VoiceOrb';
import QuickAction from '../components/QuickAction';
import PrivacyCard from '../components/PrivacyCard';
import SourceBadge from '../components/SourceBadge';
import { getTranslation } from '../services/translations';
import { isSpeechRecognitionSupported } from '../services/speechService';

export default function Home({
  currentLanguage,
  onLanguageChange,
  onStartGuide,
  onStartWithAction,
  voiceState = 'ready'
}) {
  const hasVoice = isSpeechRecognitionSupported();

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '48px'
    }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        maxWidth: '800px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#FDA4AF',
          fontSize: '0.85rem',
          fontWeight: 700
        }}>
          <Sparkles size={14} color="#FB7185" />
          <span>India's Voice-First Citizen Assistant</span>
          <SourceBadge isDemo={true} />
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          textTransform: 'uppercase'
        }}>
          {currentLanguage === 'en-IN' ? (
            <>
              GOVERNMENT HELP, <br />
              <span className="gradient-text-rose">IN YOUR VOICE.</span>
            </>
          ) : (
            <span className="gradient-text-rose">{getTranslation('heroTitle', currentLanguage)}</span>
          )}
        </h1>

        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          lineHeight: '1.6',
          margin: '0 auto'
        }}>
          “{getTranslation('heroSubtitle', currentLanguage)}”
        </p>

        {/* Large Voice Orb Centerpiece */}
        <div style={{ margin: '20px 0' }}>
          <VoiceOrb
            size="large"
            voiceState={voiceState}
            onClick={() => onStartGuide({ triggerVoice: true })}
            currentLanguage={currentLanguage}
          />
        </div>

        {/* Tap & Speak CTA Button */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => onStartGuide({ triggerVoice: true })}
            className="btn-sakhi btn-primary"
            style={{ fontSize: '1.15rem', padding: '16px 36px' }}
          >
            <Mic size={22} />
            <span>{getTranslation('tapAndSpeak', currentLanguage)}</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Speech Fallback Alert if not supported in this browser */}
        {!hasVoice && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: '#FBBF24',
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(245, 158, 11, 0.25)'
          }}>
            <AlertCircle size={15} />
            <span>{getTranslation('speechNotSupported', currentLanguage)}</span>
          </div>
        )}
      </section>

      {/* Quick Actions Grid */}
      <section style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF' }}>
            {currentLanguage.startsWith('ta') ? 'விரைவு அணுகல் வழிகள்' :
             currentLanguage.startsWith('te') ? 'త్వరిత మార్గాలు' :
             'Choose How You Would Like to Begin'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {currentLanguage.startsWith('ta') ? 'உங்களுக்கு தேவையானதை ஒரு முறை தட்டவும்' :
             currentLanguage.startsWith('te') ? 'మీకు అవసరమైనదాన్ని ఒక్కసారి నొక్కండి' :
             'Tap any option to let Sakhi guide you step-by-step'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
          width: '100%'
        }}>
          <QuickAction
            type="eligibility"
            currentLanguage={currentLanguage}
            onClick={() => onStartWithAction('eligibility')}
          />
          <QuickAction
            type="documents"
            currentLanguage={currentLanguage}
            onClick={() => onStartWithAction('documents')}
          />
          <QuickAction
            type="apply"
            currentLanguage={currentLanguage}
            onClick={() => onStartWithAction('apply')}
          />
          <QuickAction
            type="help"
            currentLanguage={currentLanguage}
            onClick={() => onStartWithAction('help')}
          />
        </div>
      </section>

      {/* Privacy Notice Card */}
      <section style={{ width: '100%' }}>
        <PrivacyCard currentLanguage={currentLanguage} />
      </section>
    </div>
  );
}
