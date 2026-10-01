import React from 'react';
import { CheckCircle, ExternalLink, FileText, ChevronRight, Award, AlertCircle } from 'lucide-react';
import SourceBadge from './SourceBadge';
import { getTranslation } from '../services/translations';

export default function JourneyCard({
  journeyData,
  currentLanguage = 'en-IN',
  onStartAgain
}) {
  const scheme = journeyData?.scheme || {};
  const journeyCard = journeyData?.journeyCard || {};
  const documents = journeyData?.documents || [];
  const source = journeyData?.source || { name: 'Demo Government Service', url: 'https://example.gov.in' };

  const defaultSteps = [
    {
      number: '01',
      title: 'Prepare Documents',
      description: 'Keep original and photocopies of Aadhaar, Bank Passbook, and 2 passport photos ready.'
    },
    {
      number: '02',
      title: 'Open Official Service',
      description: 'Visit the official government service portal or your nearest Common Service Centre (CSC).'
    },
    {
      number: '03',
      title: 'Complete Application',
      description: 'Fill the official form with your details. No application or service charge is needed.'
    },
    {
      number: '04',
      title: 'Keep Acknowledgement',
      description: 'Save your application tracking/reference number safely for verification and benefit disbursement.'
    }
  ];

  const steps = journeyCard?.steps?.length > 0
    ? journeyCard.steps.map((s, idx) => ({
        number: s.step || `0${idx + 1}`,
        title: s.title || `Step ${idx + 1}`,
        description: s.description || ''
      }))
    : defaultSteps;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* Top Status Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(13, 21, 39, 0.8) 100%)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <CheckCircle size={26} color="#34D399" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
              {journeyCard.status || 'Based on your answers, you may meet the listed criteria.'}
            </h2>
            <SourceBadge isDemo={true} />
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {getTranslation('demoDisclaimer', currentLanguage)}
          </p>
        </div>
      </div>

      {/* 4-Step Application Journey Roadmap */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Award size={22} color="#FB7185" />
          <span>{getTranslation('stepByStepRoadmap', currentLanguage)}</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#FB7185',
                background: 'rgba(244, 63, 94, 0.12)',
                padding: '6px 12px',
                borderRadius: '8px',
                flexShrink: 0
              }}>
                {step.number}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px', color: '#FFFFFF' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Needed */}
      {documents.length > 0 && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FileText size={22} color="#818CF8" />
            <span>{getTranslation('keyDocuments', currentLanguage)}</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px'
          }}>
            {documents.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#34D399' }}>✓</span>
                  <strong style={{ fontSize: '0.95rem', color: '#F8FAFC' }}>
                    {doc.title || doc.name || doc}
                  </strong>
                </div>
                {doc.description && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    {doc.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification & Source Badge Card */}
      <div className="glass-panel" style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {getTranslation('source', currentLanguage)}:
            </span>
            <strong style={{ fontSize: '0.9rem', color: '#FFFFFF' }}>
              {source.name || 'Demo Government Service'}
            </strong>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            {getTranslation('lastVerified', currentLanguage)}: Demo data (October 2026)
          </div>
        </div>

        <a
          href={source.url || 'https://example.gov.in'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sakhi btn-secondary"
          style={{
            padding: '10px 20px',
            fontSize: '0.9rem',
            minHeight: '44px',
            gap: '8px',
            textDecoration: 'none'
          }}
        >
          <span>{getTranslation('viewOfficialPortal', currentLanguage)}</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
