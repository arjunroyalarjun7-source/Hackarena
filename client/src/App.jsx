import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Guide from './pages/Guide';
import Result from './pages/Result';
import { createSession, sendGuideMessage } from './services/api';
import { speechHandler, isSpeechRecognitionSupported } from './services/speechService';
import { getTranslation, getStepData } from './services/translations';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'guide' | 'result'
  const [language, setLanguage] = useState('en-IN');
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['Yes', 'No', "I don't know"]);
  const [journeyData, setJourneyData] = useState(null);
  const [voiceState, setVoiceState] = useState('ready'); // 'ready' | 'listening' | 'processing' | 'speaking'
  const [configError, setConfigError] = useState(null);

  // Sync language change
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const stepData = getStepData(currentStep, newLang);
    if (stepData) {
      setCurrentQuestion(stepData.question);
      setOptions(stepData.options);
    } else if (newLang.startsWith('ta')) {
      setOptions(['ஆம் (Yes)', 'இல்லை (No)', 'எனக்குத் தெரியாது (Don\'t Know)']);
    } else if (newLang.startsWith('te')) {
      setOptions(['అవును (Yes)', 'లేదు (No)', 'నాకు తెలియదు (Don\'t Know)']);
    } else {
      setOptions(['Yes', 'No', "I don't know"]);
    }
  };

  // Start new Guide journey
  const handleStartGuide = async ({ triggerVoice = false } = {}) => {
    try {
      setConfigError(null);
      setVoiceState('processing');
      const sessionData = await createSession(language);
      
      const newSession = { id: sessionData.sessionId };
      setSession(newSession);
      setCurrentStep(1);
      setTotalSteps(sessionData.progress?.total || 4);

      const firstQ = sessionData.initialQuestion?.question || 'Are you a woman aged 18 years or older?';
      const initialOptions = sessionData.initialQuestion?.options || ['Yes', 'No', "I don't know"];
      
      setCurrentQuestion(firstQ);
      setOptions(initialOptions);

      const initialMessage = {
        role: 'sakhi',
        text: `${firstQ}\n\n${sessionData.initialQuestion?.simpleExplanation || ''}`.trim()
      };

      setMessages([initialMessage]);
      setPage('guide');
      setVoiceState('ready');

      // Speak initial question aloud for accessible first impression
      speechHandler.speak(
        initialMessage.text,
        language,
        () => setVoiceState('speaking'),
        () => {
          setVoiceState('ready');
          if (triggerVoice && isSpeechRecognitionSupported()) {
            startVoiceListening(newSession.id);
          }
        }
      );
    } catch (err) {
      console.error('Error starting guide:', err);
      setVoiceState('ready');
      if (err.isConfigError) {
        setConfigError(err.message);
      } else {
        setConfigError('Could not connect to Sakhi AI backend. Ensure server is running on port 5000.');
      }
      setPage('guide');
    }
  };

  // Quick action launcher
  const handleStartWithAction = async (actionType) => {
    let initialPrompt = 'Hello Sakhi, please guide me.';
    if (actionType === 'eligibility') {
      initialPrompt = 'I want to check my eligibility.';
    } else if (actionType === 'documents') {
      initialPrompt = 'What documents do I need to prepare?';
    } else if (actionType === 'apply') {
      initialPrompt = 'How do I apply for this service?';
    } else if (actionType === 'help') {
      initialPrompt = "I don't know much about government schemes. Please explain simply.";
    }

    try {
      setConfigError(null);
      setVoiceState('processing');
      const sessionData = await createSession(language);
      setSession({ id: sessionData.sessionId });
      setCurrentStep(1);
      setTotalSteps(sessionData.progress?.total || 4);
      setPage('guide');

      await sendMessageInternal(sessionData.sessionId, initialPrompt);
    } catch (err) {
      console.error('Error in quick action:', err);
      setVoiceState('ready');
      if (err.isConfigError) {
        setConfigError(err.message);
      }
      setPage('guide');
    }
  };

  // Send message to backend and receive Gemini response
  const sendMessageInternal = async (sessId, text) => {
    if (!sessId || !text) return;

    // Add user message to UI chat
    setMessages(prev => [...prev, { role: 'user', text }]);
    setVoiceState('processing');

    try {
      const response = await sendGuideMessage({
        sessionId: sessId,
        message: text,
        language,
        action: 'continue'
      });

      const data = response.data;
      const sakhiReply = data.reply || '';
      const nextQ = data.nextQuestion;
      const fullTextToSpeak = nextQ ? `${sakhiReply} ${nextQ}` : sakhiReply;

      // Update question and options
      if (nextQ) {
        setCurrentQuestion(nextQ);
      }
      if (data.options && data.options.length > 0) {
        setOptions(data.options);
      }
      if (data.progress) {
        setCurrentStep(data.progress.current);
        setTotalSteps(data.progress.total);
      }

      // Add Sakhi reply to messages
      setMessages(prev => [...prev, { role: 'sakhi', text: fullTextToSpeak }]);

      // Check if journey is completed
      if (data.journeyComplete || data.nextAction === 'view_result') {
        setJourneyData(data);
        setPage('result');
      }

      // Read response aloud
      speechHandler.speak(
        fullTextToSpeak,
        language,
        () => setVoiceState('speaking'),
        () => setVoiceState('ready')
      );

    } catch (err) {
      console.error('Send message error:', err);
      setVoiceState('ready');
      if (err.isConfigError) {
        setConfigError(err.message);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'sakhi',
            text: err.message || 'I had trouble processing that. Please try speaking or typing again.'
          }
        ]);
      }
    }
  };

  const handleSendMessage = (text) => {
    if (!session?.id) {
      handleStartGuide().then(() => {
        if (session?.id) sendMessageInternal(session.id, text);
      });
    } else {
      sendMessageInternal(session.id, text);
    }
  };

  // Voice Recognition Control
  const startVoiceListening = (activeSessionId = session?.id) => {
    speechHandler.stopSpeaking();
    setVoiceState('listening');

    speechHandler.startListening(
      language,
      (transcript, isFinal) => {
        if (isFinal && transcript.trim()) {
          setVoiceState('ready');
          sendMessageInternal(activeSessionId, transcript.trim());
        }
      },
      (err) => {
        console.warn('Voice recognition error:', err);
        setVoiceState('ready');
      },
      () => {
        if (voiceState === 'listening') {
          setVoiceState('ready');
        }
      }
    );
  };

  const stopVoiceListening = () => {
    speechHandler.stopListening();
    setVoiceState('ready');
  };

  const handleSpeakText = (text) => {
    speechHandler.speak(
      text,
      language,
      () => setVoiceState('speaking'),
      () => setVoiceState('ready')
    );
  };

  const handleStopSpeaking = () => {
    speechHandler.stopSpeaking();
    setVoiceState('ready');
  };

  const handleReadAloudResult = () => {
    const summary = journeyData?.reply || 'Based on your answers, you may meet the listed criteria.';
    const stepsText = journeyData?.journeyCard?.steps?.map(s => `${s.title}: ${s.description}`).join('. ') || '';
    const fullAudioText = `${summary}. Application steps: ${stepsText}`;
    handleSpeakText(fullAudioText);
  };

  const handleResetSession = () => {
    speechHandler.stopSpeaking();
    speechHandler.stopListening();
    setSession(null);
    setMessages([]);
    setCurrentStep(1);
    setJourneyData(null);
    setVoiceState('ready');
    setConfigError(null);
    setPage('home');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        currentPage={page}
        onNavigateHome={() => setPage('home')}
        onResetSession={handleResetSession}
      />

      <main style={{ flex: 1 }}>
        {page === 'home' && (
          <Home
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
            onStartGuide={handleStartGuide}
            onStartWithAction={handleStartWithAction}
            voiceState={voiceState}
          />
        )}

        {page === 'guide' && (
          <Guide
            session={session}
            messages={messages}
            currentStep={currentStep}
            totalSteps={totalSteps}
            currentQuestion={currentQuestion}
            options={options}
            isThinking={voiceState === 'processing'}
            isListening={voiceState === 'listening'}
            isSpeaking={voiceState === 'speaking'}
            currentLanguage={language}
            onSendMessage={handleSendMessage}
            onStartVoice={() => startVoiceListening(session?.id)}
            onStopVoice={stopVoiceListening}
            onSpeakText={handleSpeakText}
            onStopSpeaking={handleStopSpeaking}
            onBackToHome={() => setPage('home')}
            configError={configError}
          />
        )}

        {page === 'result' && (
          <Result
            journeyData={journeyData}
            currentLanguage={language}
            isSpeaking={voiceState === 'speaking'}
            onReadAloud={handleReadAloudResult}
            onStopSpeaking={handleStopSpeaking}
            onStartAgain={handleResetSession}
          />
        )}
      </main>

      <Footer currentLanguage={language} />
    </div>
  );
}
