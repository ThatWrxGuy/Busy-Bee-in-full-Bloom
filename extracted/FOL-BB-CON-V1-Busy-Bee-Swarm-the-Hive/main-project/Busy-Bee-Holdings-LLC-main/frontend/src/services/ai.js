import axios from 'axios';
import { recordUsage, USAGE_TYPES } from './usage';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

/**
 * AI Service for Busy Bee
 * Handles all OpenAI API calls for the application
 * 
 * IMPORTANT: The API key never expires but has usage limits.
 * Rate limits: 500 requests/minute (gpt-4o-mini)
 */

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add auth interceptor
openai.interceptors.request.use((config) => {
  if (OPENAI_API_KEY) {
    config.headers.Authorization = `Bearer ${OPENAI_API_KEY}`;
  }
  return config;
});

// Retry logic for failed requests
openai.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Retry once on rate limit or network errors
    if (!originalRequest._retry && (error.code === 'ECONNABORTED' || error.response?.status === 429)) {
      originalRequest._retry = true;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return openai(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generate an executive brief using AI
 * @param {Object} data - Data to include in the brief
 * @returns {Promise<string>} AI-generated summary
 */
export async function generateExecutiveBrief(data) {
  // Record usage before making API call
  const usageResult = recordUsage(USAGE_TYPES.EXECUTIVE_BRIEF);
  if (!usageResult.success) {
    throw new Error(usageResult.error);
  }

  const prompt = `You are an executive AI assistant for Busy Bee, a personal development and business intelligence platform. 
Generate a strategic executive brief based on the following data:

Goals Progress: ${data.goalsCompleted}/${data.goalsTotal} completed
Current Streak: ${data.streak} days
Overall Score: ${data.score}/100
Life Domains: ${data.domains?.map(d => `${d.name}: ${d.progress}%`).join(', ') || 'N/A'}

Generate a concise strategic summary (2-3 sentences) that:
1. Highlights key wins and achievements
2. Identifies areas needing attention
3. Provides actionable insights

Format the response as a professional executive summary.`;

  try {
    const response = await openai.post('/chat/completions', {
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an executive AI assistant that generates strategic business summaries.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate executive brief');
  }
}

/**
 * Generate AI suggestions for a specific domain
 * @param {string} domain - Domain name (e.g., 'Career', 'Health')
 * @param {number} progress - Current progress percentage
 * @returns {Promise<string[]>} Array of AI suggestions
 */
export async function generateDomainSuggestions(domain, progress) {
  // Record usage
  const usageResult = recordUsage(USAGE_TYPES.DOMAIN_SUGGESTIONS);
  if (!usageResult.success) {
    throw new Error(usageResult.error);
  }

  const prompt = `As a life coach AI, provide 3 actionable suggestions to improve in the "${domain}" area which is currently at ${progress}% progress.

Format as a JSON array of strings, e.g.:
["Suggestion 1", "Suggestion 2", "Suggestion 3"]`;

  try {
    const response = await openai.post('/chat/completions', {
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful life coach AI that provides actionable suggestions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate suggestions');
  }
}

/**
 * Analyze a goal and provide AI feedback
 * @param {Object} goal - Goal object with title, description, progress
 * @returns {Promise<Object>} AI feedback with analysis and suggestions
 */
export async function analyzeGoal(goal) {
  // Record usage
  const usageResult = recordUsage(USAGE_TYPES.GOAL_ANALYSIS);
  if (!usageResult.success) {
    throw new Error(usageResult.error);
  }

  const prompt = `Analyze this goal and provide feedback:

Title: ${goal.title}
Description: ${goal.description || 'No description'}
Current Progress: ${goal.progress}%

Provide a JSON response with:
{
  "analysis": "Brief analysis of the goal",
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "encouragement": "Motivational message"
}`;

  try {
    const response = await openai.post('/chat/completions', {
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an AI that analyzes personal goals and provides constructive feedback.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze goal');
  }
}

/**
 * Check if OpenAI API key is configured
 * @returns {boolean}
 */
export function isAIConfigured() {
  return !!OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here';
}

/**
 * Get OpenAI configuration status
 * @returns {Object} Configuration status
 */
export function getAIStatus() {
  const configured = isAIConfigured();
  return {
    configured,
    model: OPENAI_MODEL,
    message: configured
      ? 'AI features are ready'
      : 'OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file.',
  };
}

export default {
  generateExecutiveBrief,
  generateDomainSuggestions,
  analyzeGoal,
  isAIConfigured,
  getAIStatus,
};
