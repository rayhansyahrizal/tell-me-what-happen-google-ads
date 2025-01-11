'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { Upload, Image as ImageIcon, FileSpreadsheet } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { cn } from '@/lib/utils'

type AnalysisResult = {
  extractedText?: string
  analysis?: string
  rawData?: string
  csvAnalysis?: {
    overview?: string
    comparison?: string
    metrics?: string
    recommendations?: string
  }
}

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'csv' | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setFile(file)
    
    // Determine file type
    if (file.type.startsWith('image/')) {
      setFileType('image')
      // Create preview URL for images
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setFileType('csv')
      setPreview(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  return (
    <div className="w-full space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="space-y-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-[400px] mx-auto rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-500">Click or drag to replace</p>
          </div>
        ) : file && fileType === 'csv' ? (
          <div className="space-y-4">
            <FileSpreadsheet className="h-12 w-12 mx-auto text-blue-500" />
            <p className="text-lg font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">Click or drag to replace</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              {isDragActive ? (
                <ImageIcon className="h-12 w-12 text-blue-500" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your Google Ads report'}
              </p>
              <p className="text-sm text-gray-500">Upload image or CSV file</p>
            </div>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-4 flex justify-center">
          <Button 
            onClick={async () => {
              if (!file) return
              
              setAnalyzing(true)
              try {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('fileType', fileType || '')

                const response = await fetch('/api/analyze', {
                  method: 'POST',
                  body: formData,
                })

                if (!response.ok) {
                  throw new Error('Analysis failed')
                }

                const data = await response.json()
                setAnalysisResults(data)
              } catch (error) {
                console.error('Error analyzing file:', error)
                // You might want to show an error message to the user here
              } finally {
                setAnalyzing(false)
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={analyzing}
          >
            {analyzing ? 'Analyzing...' : 'Analyze Report'}
          </Button>
        </div>
      )}

      {analysisResults && (
        <Tabs defaultValue={fileType === 'csv' ? 'overview' : 'extracted'} className="w-full">
          <TabsList className="w-full justify-start">
            {fileType === 'image' && (
              <>
                <TabsTrigger value="extracted">Extracted Text</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </>
            )}
            {fileType === 'csv' && (
              <>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </>
            )}
          </TabsList>
          
          {fileType === 'image' && (
            <>
              <TabsContent value="extracted" className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Extracted Text:</h3>
                  <p className="text-sm whitespace-pre-wrap">{analysisResults.extractedText}</p>
                </div>
              </TabsContent>
              <TabsContent value="analysis" className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Analysis:</h3>
                  <p className="text-sm whitespace-pre-wrap">{analysisResults.analysis}</p>
                </div>
              </TabsContent>
            </>
          )}
          
          {fileType === 'csv' && (
            <>
              <TabsContent value="raw" className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Raw CSV Data:</h3>
                  <p className="text-sm whitespace-pre-wrap font-mono">{analysisResults.rawData}</p>
                </div>
              </TabsContent>
              <TabsContent value="overview" className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-1 bg-blue-500 rounded"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Campaign Summary</h3>
                  </div>
                  <div className="pl-3">
                    <p className="text-gray-700 leading-relaxed">{analysisResults.csvAnalysis?.overview}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="comparison" className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-1 bg-green-500 rounded"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
                  </div>
                  <div className="pl-3">
                    <p className="text-gray-700 leading-relaxed">{analysisResults.csvAnalysis?.comparison}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="metrics" className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-1 bg-purple-500 rounded"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Key Metrics Analysis</h3>
                  </div>
                  <div className="pl-3 space-y-4">
                    {analysisResults.csvAnalysis?.metrics?.split('•')?.filter(Boolean).map((metric, index) => {
                      if (!metric.trim()) return null;
                      return (
                        <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                          <p className="text-gray-700 leading-relaxed">{metric.trim()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="recommendations" className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-1 bg-orange-500 rounded"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
                  </div>
                  <div className="pl-3 space-y-4">
                    {analysisResults.csvAnalysis?.recommendations.split('•').map((recommendation, index) => {
                      if (!recommendation.trim()) return null;
                      const [action, outcome, priority] = recommendation.split('\n').map(r => r.trim());
                      if (!action) return null;
                      
                      let priorityColor = 'bg-yellow-100';
                      if (priority?.toLowerCase().includes('high')) priorityColor = 'bg-red-100';
                      if (priority?.toLowerCase().includes('low')) priorityColor = 'bg-green-100';
                      
                      return (
                        <div key={index} className="bg-white p-4 rounded-md shadow-sm space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="text-gray-900 font-medium">{action}</p>
                            {priority && (
                              <span className={`${priorityColor} text-xs px-2 py-1 rounded-full`}>
                                {priority.replace('[Priority level: ', '').replace(']', '')}
                              </span>
                            )}
                          </div>
                          {outcome && (
                            <p className="text-gray-600 text-sm">{outcome}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      )}
    </div>
  )
}
