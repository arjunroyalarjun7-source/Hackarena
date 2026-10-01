import React from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { getTranslation } from '../services/translations';

export default function VoiceOrb({
  voiceState = 'ready', // 'ready' | 'listening' | 'processing' | 'speaking'
  onClick,
  currentLanguage = 'en-IN',
  size = 'large', // 'large' | 'compact'
  disabled = false
}) {
  const isListening = voiceState === 'listening';
  const isSpeaking = voiceState === 'speaking';
  const isProcessing = voiceState === 'processing';

  const getStatusText = () => {
    switch (voiceState) {
      case 'listening':
        return getTranslation('listening', currentLanguage);
      case 'processing':
        return getTranslation('processing', currentLanguage);
      case 'speaking':
        return getTranslation('speaking', currentLanguage);
      default:
        return getTranslation('tapAndSpeak', currentLanguage);
    }
  };

  const orbSizePx = size === 'large' ? 140 : 80;
  const iconSize = size === 'large' ? 44 : 26;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`orb-container ${isListening ? 'orb-listening' : ''} ${isSpeaking ? 'orb-speaking' : ''}`}
        aria-label={getStatusText()}
        style={{
          position: 'relative',
          padding: size === 'large' ? '28px' : '12px',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        {/* Animated outer sound wave rings */}
        <div className="orb-ring orb-ring-1" style={{
          width: size === 'large' ? '180px' : '100px',
          height: size === 'large' ? '180px' : '100px',
        }} />
        <div className="orb-ring orb-ring-2" style={{
          width: size === 'large' ? '220px' : '120px',
          height: size === 'large' ? '220px' : '120px',
        }} />

        {/* Central Orb Core */}
        <div
          className="orb-core"
          style={{
            width: `${orbSizePx}px`,
            height: `${orbSizePx}px`,
          }}
        >
          {isProcessing ? (
            <Loader2 size={iconSize} color="#FFFFFF" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          ) : isSpeaking ? (
            <Volume2 size={iconSize} color="#FFFFFF" />
          ) : (
            <Mic size={iconSize} color="#FFFFFF" />
          )}
        </div>
      </button>

      {/* Status Label */}
      <div style={{
        marginTop: size === 'large' ? '10px' : '4px',
        textAlign: 'center'
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: size === 'large' ? '1.05rem' : '0.85rem',
          fontWeight: 700,
          color: isListening ? '#FDA4AF' : isSpeaking ? '#C4B5FD' : '#FFFFFF',
          textShadow: isListening ? '0 0 12px rgba(244, 63, 94, 0.6)' : 'none'
        }}>
          {isListening && (
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              display: 'inline-block',
              animation: 'pulseGlow 1s infinite'
            }} />
          )}
          {getStatusText()}
        </span>
      </div>
    </div>
  );
}
