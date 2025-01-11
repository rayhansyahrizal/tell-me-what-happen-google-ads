'use client'

import { FileUpload } from '@/components/FileUpload'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-white">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Google Ads Analyzer</h1>
          <p className="text-lg text-gray-600">
            Upload your Google Ads performance report and get AI-powered insights
          </p>
        </div>
        
        <FileUpload />
        
        {/* Results section will be added here */}
      </div>
    </main>
  )
}
