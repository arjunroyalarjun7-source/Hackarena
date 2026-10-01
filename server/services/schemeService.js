import { getDemoScheme } from '../data/schemes.js';

export class SchemeService {
  static getScheme() {
    return getDemoScheme();
  }

  static getQuestion(stepNumber, language = 'en-IN') {
    const scheme = getDemoScheme();
    const langKey = language.startsWith('ta') ? 'ta' : language.startsWith('te') ? 'te' : 'en';
    const stepData = scheme.eligibilitySteps.find(s => s.step === stepNumber);
    
    if (!stepData) return null;

    return {
      step: stepData.step,
      id: stepData.id,
      question: stepData.question[langKey] || stepData.question.en,
      simpleExplanation: stepData.simpleExplanation[langKey] || stepData.simpleExplanation.en,
      options: stepData.options[langKey] || stepData.options.en
    };
  }

  static getTotalSteps() {
    const scheme = getDemoScheme();
    return scheme.eligibilitySteps.length;
  }

  static getDocuments() {
    const scheme = getDemoScheme();
    return scheme.documents;
  }

  static getApplicationSteps() {
    const scheme = getDemoScheme();
    return scheme.applicationSteps;
  }
}
