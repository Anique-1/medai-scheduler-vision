
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Eye, Loader2 } from 'lucide-react';
import { medicalApi } from '@/utils/api';
import { AnalysisResult } from '@/types/medical';

interface ImageUploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  appointmentId?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onAnalysisComplete, 
  appointmentId = '1',
  disabled 
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await medicalApi.analyzeRetinalImage(selectedImage, appointmentId);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5 text-medical-blue" />
          <h3 className="text-lg font-semibold">Retinal Image Analysis</h3>
        </div>

        {!previewUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-medical-blue bg-blue-50' 
                : 'border-gray-300 hover:border-medical-blue'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">
              Upload Retinal Image
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop an image here, or click to select
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              id="image-upload"
              disabled={disabled}
            />
            <Button
              onClick={() => document.getElementById('image-upload')?.click()}
              variant="outline"
              disabled={disabled}
              className="border-medical-blue text-medical-blue hover:bg-blue-50"
            >
              Select Image
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Retinal scan preview"
                className="w-full h-64 object-cover rounded-lg border"
              />
              <Button
                onClick={clearImage}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                disabled={isAnalyzing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={analyzeImage}
                disabled={isAnalyzing || disabled}
                className="flex-1 bg-medical-blue hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Image'
                )}
              </Button>
            </div>

            {selectedImage && (
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>File:</strong> {selectedImage.name}</p>
                <p><strong>Size:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Type:</strong> {selectedImage.type}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
