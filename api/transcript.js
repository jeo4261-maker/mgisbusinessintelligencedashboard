/**
 * Serverless Function: Earnings Transcript API
 *
 * This function fetches earnings transcript data for companies
 * from the API Ninjas Earnings Transcript endpoint. It's designed to run as a Vercel
 * serverless function, keeping API keys secure on the backend.
 *
 * Available Companies:
 * - Apple (AAPL)
 * - Microsoft (MSFT)
 * - Google (GOOGL)
 * - Meta (META)
 * - Amazon (AMZN)
 */

// Define the companies available for transcript lookup
const AVAILABLE_COMPANIES = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corporation' },
  { ticker: 'GOOGL', name: 'Alphabet Inc. (Google)' },
  { ticker: 'META', name: 'Meta Platforms, Inc.' },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.' }
];

/**
 * Fetches earnings transcript data for a ticker symbol
 * @param {string} ticker - Stock ticker symbol (e.g., 'AAPL')
 * @param {string} apiKey - API Ninjas API key
 * @returns {Promise<Object>} Transcript data object
 */
async function fetchEarningsTranscript(ticker, apiKey) {
  const url = `https://api.api-ninjas.com/v1/earningstranscript?ticker=${ticker}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Check if the API request was successful
    if (!response.ok) {
      throw new Error(`API request failed for ${ticker}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate that we received transcript data
    if (!data || !data.ticker) {
      throw new Error(`Invalid data received for ${ticker}`);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching transcript for ${ticker}:`, error.message);
    throw error;
  }
}

/**
 * Generates mock earnings transcript data for development/testing
 * @param {string} ticker - Stock ticker symbol
 * @returns {Object} Mock transcript data
 */
function getMockTranscript(ticker) {
  const companyMap = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'META': 'Meta Platforms, Inc.',
    'AMZN': 'Amazon.com, Inc.'
  };

  const companyName = companyMap[ticker] || ticker;

  return {
    "date": "2024-01-30",
    "timestamp": 1706653800,
    "ticker": ticker,
    "cik": ticker === 'MSFT' ? '789019' : '000000',
    "year": "2024",
    "quarter": "2",
    "earnings_timing": "after_market",
    "transcript": `Operator: Greetings, and welcome to the ${companyName} Fiscal Year 2024 Second Quarter Earnings Conference Call. At this time, all participants are in a listen-only mode. A question-and-answer session will follow the formal presentation. [Operator Instructions] As a reminder, this conference is being recorded...`,
    "participants": [
      {
        "name": "Operator",
        "role": "Operator",
        "company": companyName
      },
      {
        "name": "Investor Relations",
        "role": "Vice President of Investor Relations",
        "company": companyName
      },
      {
        "name": "CEO",
        "role": "Chief Executive Officer",
        "company": companyName
      },
      {
        "name": "CFO",
        "role": "Chief Financial Officer",
        "company": companyName
      }
    ],
    "transcript_split": [
      {
        "company": companyName,
        "role": "Operator",
        "text": `Greetings, and welcome to the ${companyName} Fiscal Year 2024 Second Quarter Earnings Conference Call. At this time, all participants are in a listen-only mode. A question-and-answer session will follow the formal presentation.`,
        "speaker": "Operator"
      },
      {
        "company": companyName,
        "role": "Vice President of Investor Relations",
        "text": "Good afternoon, and thank you for joining us today. On the call with me are our Chief Executive Officer and Chief Financial Officer. You can find our earnings press release and financial summary slide deck on our investor relations website.",
        "speaker": "Investor Relations"
      },
      {
        "company": companyName,
        "role": "Chief Executive Officer",
        "text": `Thank you for joining. It was a strong quarter for ${companyName}. We continue to see robust demand across all of our product lines and geographies. Our strategic investments in innovation and customer experience are paying off.`,
        "speaker": "CEO"
      },
      {
        "company": companyName,
        "role": "Chief Financial Officer",
        "text": `Thank you, and good afternoon everyone. This quarter, we delivered strong financial results with revenue growth driven by continued momentum in our core business segments. Let me walk you through the details.`,
        "speaker": "CFO"
      }
    ]
  };
}

/**
 * Main serverless function handler
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported'
    });
  }

  // Get ticker from query parameters
  const { ticker } = req.query;

  // If no ticker provided, return list of available companies
  if (!ticker) {
    return res.status(200).json({
      success: true,
      availableCompanies: AVAILABLE_COMPANIES,
      message: 'Please provide a ticker parameter (e.g., ?ticker=MSFT)'
    });
  }

  // Verify ticker is in our supported list
  const company = AVAILABLE_COMPANIES.find(c => c.ticker.toLowerCase() === ticker.toLowerCase());
  if (!company) {
    return res.status(400).json({
      error: 'Invalid ticker',
      message: `Ticker ${ticker} is not supported. Available tickers: ${AVAILABLE_COMPANIES.map(c => c.ticker).join(', ')}`
    });
  }

  // Verify API key is configured
  const apiKey = process.env.API_KEY;

  // If API key is not configured, return mock data for development/testing
  if (!apiKey) {
    console.warn('API_KEY environment variable is not configured. Using mock data.');

    return res.status(200).json({
      success: true,
      data: getMockTranscript(company.ticker),
      note: 'Using mock data - API key not configured'
    });
  }

  try {
    // Fetch earnings transcript data
    const transcriptData = await fetchEarningsTranscript(company.ticker, apiKey);

    // Return successful results
    return res.status(200).json({
      success: true,
      data: transcriptData
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);

    // Return mock data as fallback if API fails
    return res.status(200).json({
      success: true,
      data: getMockTranscript(company.ticker),
      note: 'Using mock data - API request failed',
      error: error.message
    });
  }
}
