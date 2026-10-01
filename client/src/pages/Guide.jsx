import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, AlertTriangle, ArrowLeft, Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import VoiceOrb from '../components/VoiceOrb';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import SourceBadge from '../components/SourceBadge';
import { getTranslation } from '../services/translations';

export default function Guide({
  session,
  messages = [],
  currentStep = 1,
  totalSteps = 4,
  currentQuestion = '',
  options = ['Yes', 'No', "I don't know"],
  isThinking = false,
  isListening = false,
  isSpeaking = false,
  currentLanguage = 'en-IN',
  onSendMessage,
  onStartVoice,
  onStopVoice,
  onSpeakText,
  onStopSpeaking,
  onBackToHome,
  configError = null
}) {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg);
  };

  const handleOptionClick = (opt) => {
    if (isThinking) return;
    onSendMessage(opt);
  };

  return (
    <div style={{
      maxWidth: '860px',
      margin: '0 auto',
      padding: '24px 16px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Top Navigation & Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          onClick={onBackToHome}
          className="btn-sakhi btn-secondary"
          style={{ padding: '8px 16px', minHeight: '38px', fontSize: '0.85rem', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>{getTranslation('back', currentLanguage)}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.82rem',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)'
          }}>
            🗣️ {currentLanguage}
          </span>
          <SourceBadge isDemo={true} />
        </div>
      </div>

      {/* Config Error Banner (e.g. Gemini key not set) */}
      {configError && (
        <div className="glass-panel" style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          background: 'rgba(245, 158, 11, 0.12)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          color: '#FEF3C7'
        }}>
          <AlertTriangle size={20} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#FDE68A', marginBottom: '2px' }}>
              {configError}
            </strong>
            <span style={{ fontSize: '0.85rem', color: '#FEF3C7' }}>
              Add <code>GEMINI_API_KEY=your_key</code> in <code>server/.env</code> and restart backend to enable live AI responses.
            </span>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <ProgressBar current={currentStep} total={totalSteps} language={currentLanguage} />

        {/* Large Prominent Active Question */}
        <div style={{ textAlign: 'center', margin: '16px 0 24px' }}>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#FDA4AF',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            🌸 Sakhi Asks
          </span>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 3.5vw, 2.1rem)',
            fontWeight: 800,
            lineHeight: 1.3,
            color: '#FFFFFF'
          }}>
            {currentQuestion || 'Welcome! How can Sakhi help you today?'}
          </h2>
        </div>

        {/* Quick Decision Buttons (YES, NO, I DON'T KNOW) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginTop: '20px'
        }}>
          {options.map((opt, idx) => {
            const isNo = opt.toLowerCase().includes('no') || opt.includes('இல்லை') || opt.includes('లేదు');
            const isDontKnow = opt.toLowerCase().includes("don't know") || opt.toLowerCase().includes('not sure') || opt.includes('தெரியாது') || opt.includes('తెలియదు');
            const isYes = !isNo && !isDontKnow;

            let btnStyle = {
              padding: '16px 20px',
              fontSize: '1.05rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: isThinking ? 'not-allowed' : 'pointer',
              transition: 'var(--transition-smooth)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#FFFFFF'
            };

            if (isYes) {
              btnStyle.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
              btnStyle.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.35)';
            } else if (isNo) {
              btnStyle.background = 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)';
              btnStyle.boxShadow = '0 4px 16px rgba(225, 29, 72, 0.35)';
            } else {
              btnStyle.background = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
              btnStyle.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.3)';
            }

            return (
              <button
                key={idx}
                disabled={isThinking}
                onClick={() => handleOptionClick(opt)}
                style={btnStyle}
                onMouseEnter={(e) => { if (!isThinking) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { if (!isThinking) e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {isDontKnow && <HelpCircle size={18} />}
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Interaction Centerpiece */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0'
      }}>
        <VoiceOrb
          size="compact"
          voiceState={isListening ? 'listening' : isThinking ? 'processing' : isSpeaking ? 'speaking' : 'ready'}
          onClick={isListening ? onStopVoice : onStartVoice}
          currentLanguage={currentLanguage}
          disabled={isThinking}
        />
        <p style={{
          fontSize: '0.85rem',
          color: isListening ? '#FDA4AF' : 'var(--text-muted)',
          marginTop: '6px',
          fontWeight: 500
        }}>
          {isListening
            ? getTranslation('listening', currentLanguage)
            : isSpeaking
            ? getTranslation('speaking', currentLanguage)
            : getTranslation('ready', currentLanguage)}
        </p>
      </div>

      {/* Chat History & Conversation Flow */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxHeight: '420px',
        overflowY: 'auto'
      }}>
        {messages.map((msg, idx) => (
          <ChatBubble
            key={idx}
            role={msg.role}
            text={msg.text}
            onSpeak={onSpeakText}
          />
        ))}

        {isThinking && (
          <TypingIndicator label={getTranslation('processing', currentLanguage)} />
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Text Input Fallback Bar */}
      <form
        onSubmit={handleFormSubmit}
        style={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          position: 'relative'
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={getTranslation('typePlaceholder', currentLanguage)}
          disabled={isThinking}
          style={{
            flex: 1,
            padding: '16px 20px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(18, 26, 47, 0.9)',
            border: '1px solid var(--border-subtle)',
            color: '#FFFFFF',
            fontSize: '1rem',
            outline: 'none',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
          aria-label="Spoken or typed response"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="btn-sakhi btn-primary"
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '12px 24px',
            minHeight: '52px',
            opacity: !inputText.trim() || isThinking ? 0.5 : 1,
            cursor: !inputText.trim() || isThinking ? 'not-allowed' : 'pointer'
          }}
          aria-label="Send message"
        >
          <Send size={18} />
          <span>{getTranslation('send', currentLanguage)}</span>
        </button>
      </form>
    </div>
  );
}
