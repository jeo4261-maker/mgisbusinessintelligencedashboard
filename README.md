# Competitive Intelligence Dashboard

A professional business intelligence dashboard that tracks real-time stock performance for major technology companies. Built for deployment on Vercel with serverless functions.

## 🎯 Features

- **Real-time Stock Data**: Tracks Apple (AAPL), Microsoft (MSFT), Google (GOOGL), Meta (META), and Amazon (AMZN)
- **Professional Design**: High-contrast, accessible interface optimized for business presentations
- **Export Functionality**: Download data as CSV for reports and presentations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG AA compliant with keyboard shortcuts and screen reader support
- **Loading States**: Clear visual feedback during data fetching
- **Error Handling**: Graceful error messages with retry functionality

## 🚀 Deployment on Vercel

### Prerequisites
- A Vercel account ([sign up here](https://vercel.com/signup))
- An API key from [API Ninjas](https://api-ninjas.com/)

### Step 1: Get Your API Key
1. Visit [API Ninjas](https://api-ninjas.com/)
2. Sign up for a free account
3. Navigate to your profile to find your API key

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel

# Add your API key as an environment variable
vercel env add API_KEY

# Deploy to production
vercel --prod
```

#### Option B: Deploy via Vercel Dashboard
1. Push this repository to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variable:
   - **Name**: `API_KEY`
   - **Value**: Your API Ninjas API key
6. Click "Deploy"

### Step 3: Verify Deployment
Once deployed, visit your Vercel URL. The dashboard should load automatically and display current stock prices.

## 📁 Project Structure

```
/
├── api/
│   └── stocks.js          # Serverless function for API calls
├── index.html             # Main dashboard interface
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

## 🔧 Technical Details

### API Function (`/api/stocks.js`)
- Fetches stock data from API Ninjas Stock Price endpoint
- Runs as a Vercel serverless function
- Secure API key management via environment variables
- Parallel requests for optimal performance
- Comprehensive error handling

### Dashboard (`index.html`)
- Vanilla JavaScript (no dependencies)
- Professional gradient design with dark theme
- Responsive CSS Grid and Flexbox layout
- Accessibility features:
  - ARIA labels and roles
  - Keyboard shortcuts (Ctrl+R to refresh, Ctrl+E to export)
  - High contrast mode support
  - Reduced motion support
- CSV export with metadata

## 🎨 Design Features

- **High Contrast**: Minimum WCAG AA compliance for readability
- **Visual Indicators**: Green highlights for highest price, red for lowest
- **Smooth Animations**: Fade-in effects and loading spinners
- **Professional Typography**: System fonts optimized for readability
- **Status Indicators**: Clear visual feedback for market position

## 🔒 Security

- API keys stored securely in environment variables
- CORS headers configured for security
- HTML escaping to prevent XSS attacks
- No client-side API key exposure

## 🛠️ Customization

### Adding More Companies
Edit the `TRACKED_COMPANIES` array in `/api/stocks.js`:

```javascript
const TRACKED_COMPANIES = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'YOUR_TICKER', name: 'Your Company Name' },
  // Add more companies here
];
```

### Changing Colors
Modify CSS variables in `index.html`:

```css
:root {
  --primary-bg: #0a0e27;
  --accent-blue: #3b82f6;
  --success-green: #10b981;
  --danger-red: #ef4444;
}
```

### Auto-refresh
Uncomment this line in `index.html` to enable automatic data refresh every 5 minutes:

```javascript
// setInterval(fetchStockData, 5 * 60 * 1000);
```

## 📊 Business Use Cases

- **Competitive Analysis**: Track competitor valuations in real-time
- **Board Presentations**: Export data for executive reports
- **Market Monitoring**: Keep pulse on technology sector performance
- **Investment Research**: Compare relative market positions

## 🐛 Troubleshooting

### "Unable to load data" Error
- Verify your API_KEY environment variable is set in Vercel
- Check that your API Ninjas account has available API calls
- Ensure the API key has proper permissions

### Data Not Updating
- Click the "Refresh Data" button
- Check browser console for errors
- Verify the `/api/stocks` endpoint is accessible

### Export Not Working
- Ensure data has been loaded successfully first
- Check browser's download permissions
- Try using a different browser

## 📝 API Rate Limits

API Ninjas free tier includes:
- 10,000 API calls per month
- Sufficient for ~2,000 dashboard refreshes (5 stocks per refresh)

## 🤝 Contributing

This is a production-ready template. Feel free to fork and customize for your needs.

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 🔗 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [API Ninjas Documentation](https://api-ninjas.com/api)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Built for business professionals who need fast, reliable competitive intelligence.**