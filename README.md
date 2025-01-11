# Google Ads Performance Analyzer

An AI-powered tool that analyzes Google Ads performance reports using computer vision and natural language processing.

## Features

- Image upload for Google Ads reports
- OCR-based data extraction
- AI-powered performance analysis
- Smart recommendations engine
- Modern, responsive UI

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Google Cloud Vision API
- OpenAI API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following:
   ```
   GOOGLE_CLOUD_VISION_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `GOOGLE_CLOUD_VISION_API_KEY`: API key for Google Cloud Vision
- `OPENAI_API_KEY`: API key for OpenAI services

## License

MIT
