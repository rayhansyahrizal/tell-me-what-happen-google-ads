'use client'

import { Card } from './ui/card'

interface AnalysisResultsProps {
  extractedText: string
  analysis: string
  isLoading?: boolean
}

export function AnalysisResults({ extractedText, analysis, isLoading }: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Extracted Data</h2>
        <pre className="whitespace-pre-wrap text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          {extractedText}
        </pre>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: analysis }} />
        </div>
      </Card>
    </div>
  )
}
