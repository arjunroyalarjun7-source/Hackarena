/**
 * DEMO GOVERNMENT SERVICE DATA
 * 
 * IMPORTANT DISCLAIMER:
 * This is DEMO DATA designed for demonstration and hackathon evaluation.
 * Do not use for real government applications without consulting official portals.
 * "Verify important information with the official government service before applying."
 */

export const DEMO_SCHEMES = [
  {
    id: "demo-service",
    name: "Demo Women Livelihood & Support Service",
    badge: "DEMO DATA",
    tagline: "Empowering women with livelihood grants, skill development, and financial assistance.",
    disclaimer: "Verify important information with the official government service before applying.",
    description: "A demonstration public welfare initiative to assist women in starting home businesses, acquiring vocational toolkits, and accessing bank-linked interest subventions.",
    officialUrl: "https://example.gov.in",
    source: "Demo Government Service Portal",
    lastVerified: "Demo data - October 2026",
    
    // Core eligibility questions (4 questions total)
    eligibilitySteps: [
      {
        step: 1,
        id: "age_check",
        question: {
          en: "Are you a woman aged 18 years or older?",
          ta: "நீங்கள் 18 வயது அல்லது அதற்கு மேற்பட்ட பெண்ணாக உள்ளீர்களா?",
          te: "మీరు 18 సంవత్సరాలు లేదా అంతకంటే ఎక్కువ వయస్సు ఉన్న మహిళా?"
        },
        simpleExplanation: {
          en: "This service is open to adult women across India to support independent livelihoods.",
          ta: "சுயதொழில் தொடங்க உதவும் வகையில் 18 வயது நிரம்பிய பெண்களுக்கு இந்த சேவை வழங்கப்படுகிறது.",
          te: "ఈ సేవ స్వతంత్ర జీవనోపాధిని ప్రారంభించడానికి 18 ఏళ్లు పైబడిన మహిళలకు అందుబాటులో ఉంది."
        },
        options: {
          en: ["Yes, 18 or older", "No, under 18", "I don't know"],
          ta: ["ஆம், 18 அல்லது அதற்கு மேல்", "இல்லை, 18க்கு கீழ்", "எனக்குத் தெரியாது"],
          te: ["అవును, 18 లేదా అంతకంటే ఎక్కువ", "కాదు, 18 లోపు", "నాకు తెలియదు"]
        }
      },
      {
        step: 2,
        id: "residence_check",
        question: {
          en: "Do you have valid proof of residence, like an Aadhaar Card or Voter ID?",
          ta: "ஆதார் அட்டை அல்லது வாக்காளர் அடையாள அட்டை போன்ற இருப்பிடச் சான்று உங்களிடம் உள்ளதா?",
          te: "మీ వద్ద ఆధార్ కార్డు లేదా ఓటర్ ఐడీ వంటి నివాస రుజువు ఉందా?"
        },
        simpleExplanation: {
          en: "Any government photo ID that shows your home address can be used.",
          ta: "உங்கள் வீட்டு முகவரியைக் காட்டும் எந்தவொரு அரசு அடையாள அட்டையும் போதும்.",
          te: "మీ ఇంటి చిరునామాను చూపించే ఏదైనా ప్రభుత్వ గుర్తింపు కార్డు ఉంటే సరిపోతుంది."
        },
        options: {
          en: ["Yes, I have it", "No, I don't have it", "I don't know"],
          ta: ["ஆம், என்னிடம் உள்ளது", "இல்லை, என்னிடம் இல்லை", "எனக்குத் தெரியாது"],
          te: ["అవును, నా వద్ద ఉంది", "లేదు, నా వద్ద లేదు", "నాకు తెలియదు"]
        }
      },
      {
        step: 3,
        id: "income_or_shg_check",
        question: {
          en: "Is your annual family income below ₹3 Lakhs, OR are you a Self-Help Group (SHG) member?",
          ta: "உங்கள் குடும்ப ஆண்டு வருமானம் ₹3 லட்சத்திற்கு குறைவாக உள்ளதா, அல்லது நீங்கள் மகளிர் சுயஉதவிக் குழு உறுப்பினரா?",
          te: "మీ కుటుంబ వార్షిక ఆదాయం ₹3 లక్షల లోపు ఉందా, లేదా మీరు స్వయం సహాయక సంఘం (SHG) సభ్యురాలా?"
        },
        simpleExplanation: {
          en: "This ensures the support reaches families who need it most or active women groups.",
          ta: "மிகவும் தேவைப்படும் குடும்பங்கள் அல்லது மகளிர் குழுக்களுக்கு உதவி சென்றடைவதை இது உறுதி செய்கிறது.",
          te: "ఇది అత్యంత అవసరమైన కుటుంబాలకు లేదా మహిళా సంఘాలకు సహాయం చేరేలా చూస్తుంది."
        },
        options: {
          en: ["Yes, eligible", "No, above ₹3 Lakhs", "I don't know"],
          ta: ["ஆம், தகுதியானது", "இல்லை, ₹3 லட்சத்திற்கு மேல்", "எனக்குத் தெரியாது"],
          te: ["అవును, అర్హత ఉంది", "లేదు, ₹3 లక్షలకు పైగా", "నాకు తెలియదు"]
        }
      },
      {
        step: 4,
        id: "employment_check",
        question: {
          en: "Are you free from any permanent government employment?",
          ta: "நீங்கள் நிரந்தர அரசு வேலையில் இல்லாதவரா?",
          te: "మీరు శాశ్వత ప్రభుత్వ ఉద్యోగంలో లేరా?"
        },
        simpleExplanation: {
          en: "Permanent government employees are not eligible for this welfare grant.",
          ta: "நிரந்தர அரசு ஊழியர்களுக்கு இந்த நலத்திட்ட உதவி பொருந்தாது.",
          te: "శాశ్వత ప్రభుత్వ ఉద్యోగులకు ఈ సంక్షేమ గ్రాంట్ వర్తించదు."
        },
        options: {
          en: ["Yes, not in govt job", "No, I have govt job", "I don't know"],
          ta: ["ஆம், அரசு வேலை இல்லை", "இல்லை, அரசு வேலை உள்ளது", "எனக்குத் தெரியாது"],
          te: ["అవును, ప్రభుత్వ ఉద్యోగం లేదు", "లేదు, ప్రభుత్వ ఉద్యోగం ఉంది", "నాకు తెలియదు"]
        }
      },
      {
        step: 5,
        id: "priority_category_check",
        question: {
          en: "Do you belong to a priority welfare category, such as a single mother, widow, person with disability, or SHG leader?",
          ta: "நீங்கள் தனித்து வாழும் தாய், விதவை, மாற்றுத்திறனாளி அல்லது சுயஉதவிக் குழு தலைவி போன்ற முன்னுரிமைப் பிரிவைச் சேர்ந்தவரா?",
          te: "మీరు ఒంటరి తల్లి, వితంతువు, దివ్యాంగురాలు లేదా స్వయం సహాయక సంఘం (SHG) నాయకురాలు వంటి ప్రాధాన్యతా వర్గానికి చెందినవారా?"
        },
        simpleExplanation: {
          en: "Special financial subsidies and faster processing are prioritized for women in these categories.",
          ta: "இப்பிரிவினருக்கு சிறப்பு மானியம் மற்றும் முன்னுரிமை செயலாக்கம் வழங்கப்படுகிறது.",
          te: "ఈ వర్గాల మహిళలకు ప్రత్యేక ఆర్థిక సబ్సిడీ మరియు ప్రాధాన్యత లభిస్తుంది."
        },
        options: {
          en: ["Yes, priority category", "General category", "I don't know"],
          ta: ["ஆம், முன்னுரிமை பிரிவு", "பொதுப் பிரிவு", "எனக்குத் தெரியாது"],
          te: ["అవును, ప్రాధాన్యత వర్గం", "సాధారణ వర్గం", "నాకు తెలియదు"]
        }
      }
    ],

    // Required documents list
    documents: [
      {
        id: "aadhaar",
        title: "Aadhaar Card",
        description: "Official identity card showing name, photo, and address.",
        icon: "FileCheck"
      },
      {
        id: "bank_passbook",
        title: "Bank Account Passbook",
        description: "Active bank passbook linked with Aadhaar (DBT enabled) for direct grant transfer.",
        icon: "CreditCard"
      },
      {
        id: "income_proof",
        title: "Income Certificate or SHG Member Card",
        description: "Issued by local Tehsildar/Revenue office or Village/Ward SHG federation.",
        icon: "FileText"
      },
      {
        id: "photo",
        title: "Passport Size Photographs",
        description: "2 recent color passport-sized photos for the application form.",
        icon: "Image"
      }
    ],

    // Application Roadmap / Steps
    applicationSteps: [
      {
        number: "01",
        title: "Prepare Documents",
        description: "Keep original and photocopies of Aadhaar, Bank Passbook, Income/SHG proof, and 2 photos ready."
      },
      {
        number: "02",
        title: "Open Official Service",
        description: "Visit the official government portal (https://example.gov.in) or your nearest Gram Panchayat / CSC centre."
      },
      {
        number: "03",
        title: "Complete Application",
        description: "Fill the free basic form with assistance if needed. No registration fee is charged."
      },
      {
        number: "04",
        title: "Keep Acknowledgement",
        description: "Note down the reference/application tracking number for verification and status updates."
      }
    ]
  }
];

export function getDemoScheme() {
  return DEMO_SCHEMES[0];
}
