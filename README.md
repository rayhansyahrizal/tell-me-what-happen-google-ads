# Tell Me What Happened - Google Ads!

Upload your Google Ads performance reports and get AI-powered insights instantly. Built with Next.js, Google Cloud Vision, and OpenAI.

## Features

- Upload Google Ads report images or csv
- Extract data using Google Cloud Vision OCR
- Get AI analysis and recommendations
- Simple, modern UI built with Next.js and Tailwind

## Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/tell-me-what-happen-google-ads.git
   cd tell-me-what-happen-google-ads
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_CLOUD_CLIENT_EMAIL=your_service_account_email
   GOOGLE_CLOUD_PRIVATE_KEY=your_service_account_private_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## API Setup

### OpenAI
1. Get API key from [OpenAI Platform](https://platform.openai.com/account/api-keys)

### Google Cloud
1. Create project and enable Vision API
2. Create service account and download JSON key
3. Copy `client_email` and `private_key` to `.env`

## License

MIT
