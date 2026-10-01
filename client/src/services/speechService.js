/**
 * Web Speech API Utility for Sakhi AI
 * Handles SpeechRecognition (STT) and SpeechSynthesis (TTS)
 */

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && Boolean(
    window.SpeechRecognition ||
    window.webkitSpeechRecognition
  );
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export class SpeechHandler {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
  }

  /**
   * Start listening for voice input
   * @param {string} language - 'en-IN' | 'ta-IN' | 'te-IN'
   * @param {Function} onTranscript - Callback with (transcript, isFinal)
   * @param {Function} onError - Callback with (error)
   * @param {Function} onEnd - Callback when recognition stops
   */
  startListening(language = 'en-IN', onTranscript, onError, onEnd) {
    if (!isSpeechRecognitionSupported()) {
      if (onError) onError(new Error("Voice input isn't available in this browser. You can type instead."));
      return;
    }

    // Stop ongoing speech synthesis when user begins talking
    this.stopSpeaking();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = language;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = false;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const transcript = results.map(r => r[0].transcript).join('');
      const isFinal = results[0]?.isFinal || false;
      if (onTranscript) onTranscript(transcript, isFinal);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      console.warn('Speech recognition event error:', event.error);
      if (onError) onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn('Recognition start error:', err);
      this.isListening = false;
      if (onError) onError(err);
    }
  }

  /**
   * Stop speech recognition listening
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
    }
    this.isListening = false;
  }

  /**
   * Speak response aloud using speechSynthesis
   * @param {string} text
   * @param {string} language
   * @param {Function} onStart
   * @param {Function} onEnd
   */
  speak(text, language = 'en-IN', onStart, onEnd) {
    if (!this.synth || !text) {
      if (onEnd) onEnd();
      return;
    }

    this.stopSpeaking();

    // Clean any markdown or emoji formatting for clearer speech
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language;
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.05; // Friendly, warm pitch

    // Attempt to pick matching regional voice
    const voices = this.synth.getVoices();
    const langPrefix = language.split('-')[0];
    const matchedVoice = voices.find(v => v.lang === language || v.lang.startsWith(langPrefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis error:', err);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /**
   * Stop active speech synthesis
   */
  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
}

export const speechHandler = new SpeechHandler();
