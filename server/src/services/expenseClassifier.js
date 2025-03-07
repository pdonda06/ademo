import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Tesseract from 'tesseract.js';
import { preprocessImage, extractReceiptArea, enhanceText } from './imagePreprocessing.js';

dotenv.config();

const HUGGING_FACE_TOKEN = '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';
// Using a more reliable text classification model
const MODEL_URL = "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions";

// Fallback classification rules
const fallbackRules = {
  keywords: {
    Transportation: ['uber', 'lyft', 'taxi', 'train', 'flight', 'bus', 'transport'],
    'Business Expense': ['office', 'supplies', 'software', 'equipment', 'subscription'],
    Education: ['course', 'training', 'workshop', 'seminar', 'conference'],
    Healthcare: ['medical', 'health', 'doctor', 'pharmacy', 'hospital'],
    Personal: ['restaurant', 'cafe', 'entertainment', 'movie', 'dining']
  }
};

const indianExpenseRules = {
  keywords: {
    'Travel and Conveyance': ['travel', 'ticket', 'fare', 'uber', 'ola', 'taxi', 'petrol', 'diesel', 'railway'],
    'Office Supplies': ['stationary', 'paper', 'printer', 'cartridge', 'office'],
    'Professional Services': ['legal', 'consulting', 'professional', 'audit', 'ca ', 'chartered accountant'],
    'Rent and Utilities': ['rent', 'electricity', 'water', 'maintenance', 'internet', 'broadband'],
    'IT and Software': ['software', 'subscription', 'domain', 'hosting', 'computer'],
    'Marketing': ['advertising', 'promotion', 'marketing', 'campaign', 'sponsored']
  },
  
  gstKeywords: {
    'eligible': ['gst', 'cgst', 'sgst', 'igst', 'tax', 'invoice'],
    'blocked': ['food', 'restaurant', 'personal', 'gift']
  }
};

function fallbackClassification(description, companyName) {
  const text = `${description} ${companyName}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(fallbackRules.keywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return {
        category,
        confidence: 0.7,
        isDeductible: ['Business Expense', 'Education', 'Healthcare', 'Transportation'].includes(category)
      };
    }
  }
  
  return {
    category: 'Uncategorized',
    confidence: 0.5,
    isDeductible: false
  };
}

async function extractTextFromImage(imageBuffer) {
  try {
    // Process image in stages
    const receiptArea = await extractReceiptArea(imageBuffer);
    const preprocessed = await preprocessImage(receiptArea);
    const enhanced = await enhanceText(preprocessed);
    
    // Perform OCR with enhanced settings
    const { data: { text } } = await Tesseract.recognize(enhanced, 'eng+hin', {
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,₹/-: ',
      tessedit_pageseg_mode: '6', // Assume uniform text block
    });
    
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    return null;
  }
}

async function detectGSTDetails(text) {
  const gstPattern = /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/i;
  const gstMatch = text.match(gstPattern);
  
  return {
    gstNumber: gstMatch ? gstMatch[0] : null,
    hasGST: !!gstMatch,
    isValidFormat: gstMatch ? validateGSTNumber(gstMatch[0]) : false
  };
}

async function classifyWithAI(text) {
  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: text,
        options: {
          wait_for_model: true,
          use_cache: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API response: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format from API");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("AI Classification error:", error.message);
    return null;
  }
}

async function classifyExpense(text, amount) {
  try {
    // First try AI classification
    const aiResult = await classifyWithAI(text);
    
    if (aiResult) {
      // Map AI classification to our categories
      const category = mapAIResultToCategory(aiResult);
      const gstDetails = await detectGSTDetails(text);
      
      return {
        category,
        isITCEligible: determineITCEligibility(category, gstDetails),
        gstDetails,
        confidence: aiResult[0]?.score || 0.7,
        section: gstDetails.hasGST ? 'Section 16' : 'Not Applicable'
      };
    }

    // Fallback to rule-based classification
    return ruleBasedClassification(text);
  } catch (error) {
    console.error('Classification error:', error);
    return ruleBasedClassification(text);
  }
}

function ruleBasedClassification(text) {
  const lowerText = text.toLowerCase();
  
  // Check against Indian expense rules first
  for (const [category, keywords] of Object.entries(indianExpenseRules.keywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      const gstDetails = {
        hasGST: lowerText.includes('gst') || lowerText.includes('igst') || lowerText.includes('cgst'),
        gstNumber: extractGSTNumber(text)
      };
      
      return {
        category,
        isITCEligible: !indianExpenseRules.gstKeywords.blocked
          .some(keyword => lowerText.includes(keyword)),
        gstDetails,
        confidence: 0.8,
        section: gstDetails.hasGST ? 'Section 16' : 'Not Applicable'
      };
    }
  }
  
  return {
    category: 'Other',
    isITCEligible: false,
    gstDetails: { hasGST: false, gstNumber: null },
    confidence: 0.5,
    section: 'Not Applicable'
  };
}

function mapAIResultToCategory(aiResult) {
  // Map emotion/sentiment to business expense categories
  const emotionToCategory = {
    neutral: 'Other',
    positive: 'Business Expense',
    negative: 'Other',
    // Add more mappings as needed
  };
  
  const topEmotion = aiResult[0]?.label;
  return emotionToCategory[topEmotion] || 'Other';
}

export async function processExpenseDocument(file, metadata) {
  const text = await extractTextFromImage(file.buffer);
  if (!text) {
    throw new Error('Could not extract text from image');
  }

  const classification = await classifyExpense(text, metadata.amount);
  return {
    ...classification,
    extractedText: text
  };
}

export { classifyExpense };

export async function classifyTransaction(description, companyName) {
  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `${description} from ${companyName}`,
        parameters: { 
          candidate_labels: Object.keys(fallbackRules.keywords).concat(['Uncategorized'])
        }
      })
    });

    const result = await response.json();
    
    if (result.error) {
      console.log("Falling back to rule-based classification due to API error");
      return fallbackClassification(description, companyName);
    }

    const category = result.labels[0];
    const confidence = result.scores[0];
    const isDeductible = ['Business Expense', 'Education', 'Healthcare', 'Transportation'].includes(category);

    return { category, confidence, isDeductible };
  } catch (error) {
    console.log("Falling back to rule-based classification due to:", error.message);
    return fallbackClassification(description, companyName);
  }
}
