import { NextResponse } from 'next/server'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import OpenAI from 'openai'
import { parse } from 'csv-parse/sync'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const vision = new ImageAnnotatorClient({
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
  },
})

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const fileType = data.get('fileType')

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (fileType === 'image') {
      // Handle image analysis
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')

      const [result] = await vision.textDetection({
        image: { content: base64 }
      })

      const detections = result.textAnnotations
      if (!detections || detections.length === 0) {
        return NextResponse.json(
          { error: 'No text detected in image' },
          { status: 400 }
        )
      }

      const extractedText = detections[0].description

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: "You are an expert in Google Ads analysis. Analyze the following performance data and provide insights and recommendations. Focus on metrics that showed in the image and overall performance trends. Pay special attention to period-over-period comparisons and highlight significant changes."
          },
          {
            role: "user",
            content: `Analyze this Google Ads performance data:\n${extractedText}`
          }
        ],
      })

      const analysis = completion.choices[0].message.content

      return NextResponse.json({
        success: true,
        extractedText,
        analysis,
      })
    } else if (fileType === 'csv') {
      // Handle CSV analysis
      const text = await file.text()
      const records = parse(text, {
        columns: true,
        skip_empty_lines: true
      })

      // Format CSV data for display
      const formattedCsv = records.map((row: any) => {
        // Convert row object to array of values for better display
        return Object.entries(row).map(([key, value]) => `${key}: ${value}`).join('\n')
      }).join('\n\n')

      // Analyze CSV data with OpenAI
      const csvDataStr = JSON.stringify(records, null, 2)
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `You are an expert in Google Ads analysis. Analyze the provided data and return the analysis in a clear, professional format.

Important formatting rules:
- Write in a natural, business-friendly tone
- Focus on insights that matter to business owners
- Use clear, concise language
- Format metrics in clear sections with bullet points
- Make recommendations specific and actionable

For CSV data, structure your response in these sections:

1. Overview: A concise summary of overall campaign performance

2. Trends: Key changes and trends compared to the previous period

3. Metrics Analysis:
• Click-Through Rate (CTR): [Analysis]
• Cost Per Click (CPC): [Analysis]
• Impressions: [Analysis]
• Conversions: [Analysis]
(Include specific numbers and dates where relevant)

4. Recommendations:
• [Specific action item 1]
• [Expected outcome]
• [Priority level: High/Medium/Low]

[Repeat format for each recommendation]

Keep each section focused and actionable.`
          },
          {
            role: "user",
            content: `Analyze this Google Ads CSV data:\n${csvDataStr}`
          }
        ],
      })

      const analysis = completion.choices[0].message.content

      if (!analysis) {
        return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 })
      }

      // Split on ### or double newlines to separate major sections
      const sections = analysis
        .split(/(?=###)|(?:\n\n+)/)
        .map(section => {
          return section
            .replace(/^###\s*/, '') // Remove section markers
            .replace(/^\d+[\)\.]\s*/, '') // Remove numbered lists
            .replace(/\*\*/g, '') // Remove bold markers
            .replace(/^(Overview|Trends|Metrics Analysis|Recommendations):\s*/i, '') // Remove section headers
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean)
            .join('\n')
            .trim();
        })
        .filter(section => section.length > 0); // Remove empty sections

      const csvAnalysis = {
        overview: sections[0] || '',
        comparison: sections[1] || '',
        metrics: sections[2] || '',
        recommendations: sections[3] || ''
      }

      return NextResponse.json({
        success: true,
        rawData: formattedCsv,
        csvAnalysis
      })
    }

    return NextResponse.json(
      { error: 'Invalid file type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}
