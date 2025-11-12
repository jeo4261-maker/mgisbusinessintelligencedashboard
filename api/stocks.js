/**
 * Serverless Function: Stock Price API
 *
 * This function fetches real-time stock prices for major technology companies
 * from the API Ninjas Stock Price endpoint. It's designed to run as a Vercel
 * serverless function, keeping API keys secure on the backend.
 *
 * Tracked Companies:
 * - Apple (AAPL)
 * - Microsoft (MSFT)
 * - Google (GOOGL)
 * - Meta (META)
 * - Amazon (AMZN)
 */

// Define the companies we're tracking with their ticker symbols
const TRACKED_COMPANIES = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corporation' },
  { ticker: 'GOOGL', name: 'Alphabet Inc. (Google)' },
  { ticker: 'META', name: 'Meta Platforms, Inc.' },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.' }
];

/**
 * Fetches stock price data for a single ticker symbol
 * @param {string} ticker - Stock ticker symbol (e.g., 'AAPL')
 * @param {string} apiKey - API Ninjas API key
 * @returns {Promise<Object>} Stock data object with price and timestamp
 */
async function fetchStockPrice(ticker, apiKey) {
  const url = `https://api.api-ninjas.com/v1/stockprice?ticker=${ticker}`;

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

    // Validate that we received price data
    if (!data || typeof data.price === 'undefined') {
      throw new Error(`Invalid data received for ${ticker}`);
    }

    return {
      ticker: data.ticker || ticker,
      price: data.price,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error.message);
    throw error;
  }
}

/**
 * Generates mock stock prices for development/testing
 * @param {string} ticker - Stock ticker symbol
 * @returns {number} Mock price for the ticker
 */
function getMockPrice(ticker) {
  // Base prices for realistic mock data (approximate real values)
  const basePrices = {
    'AAPL': 175.50,
    'MSFT': 380.25,
    'GOOGL': 140.75,
    'META': 485.60,
    'AMZN': 178.30
  };

  // Add some random variation (+/- 5%) to make it look more realistic
  const basePrice = basePrices[ticker] || 100;
  const variation = (Math.random() - 0.5) * 0.1; // -5% to +5%
  const mockPrice = basePrice * (1 + variation);

  return parseFloat(mockPrice.toFixed(2));
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

  // Verify API key is configured
  const apiKey = process.env.API_KEY;

  // If API key is not configured, return mock data for development/testing
  if (!apiKey) {
    console.warn('API_KEY environment variable is not configured. Using mock data.');

    // Generate mock stock data with realistic prices
    const mockResults = TRACKED_COMPANIES.map(company => ({
      ticker: company.ticker,
      name: company.name,
      price: getMockPrice(company.ticker),
      timestamp: new Date().toISOString(),
      success: true
    }));

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: mockResults,
      summary: {
        total: mockResults.length,
        successful: mockResults.length,
        failed: 0
      },
      note: 'Using mock data - API key not configured'
    });
  }

  try {
    // Fetch stock data for all tracked companies in parallel
    const stockPromises = TRACKED_COMPANIES.map(company =>
      fetchStockPrice(company.ticker, apiKey)
        .then(stockData => ({
          ticker: company.ticker,
          name: company.name,
          price: stockData.price,
          timestamp: stockData.timestamp,
          success: true
        }))
        .catch(error => ({
          ticker: company.ticker,
          name: company.name,
          price: null,
          error: error.message,
          success: false
        }))
    );

    // Wait for all requests to complete
    const results = await Promise.all(stockPromises);

    // Check if at least one request was successful
    const successfulResults = results.filter(r => r.success);
    if (successfulResults.length === 0) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to fetch stock data from API provider',
        details: results
      });
    }

    // Return successful results with metadata
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: results,
      summary: {
        total: results.length,
        successful: successfulResults.length,
        failed: results.length - successfulResults.length
      }
    });

  } catch (error) {
    console.error('Unexpected error in handler:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
}
