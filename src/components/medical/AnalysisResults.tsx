
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { AnalysisResult } from '@/types/medical';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'medium': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="h-6 w-6 text-medical-blue" />
        <h3 className="text-xl font-semibold">Analysis Results</h3>
        <Badge variant="outline" className="ml-auto">
          {new Date(result.analyzed_at).toLocaleDateString()}
        </Badge>
      </div>

      {/* Overall Risk Assessment */}
      <Alert className={`border-l-4 ${
        result.overall_risk === 'high' ? 'border-red-500 bg-red-50' :
        result.overall_risk === 'medium' ? 'border-yellow-500 bg-yellow-50' :
        'border-green-500 bg-green-50'
      }`}>
        <div className="flex items-center gap-2">
          {getRiskIcon(result.overall_risk)}
          <AlertDescription className="flex-1">
            <span className="font-semibold">Overall Risk Assessment: </span>
            <span className={`font-bold ${getRiskColor(result.overall_risk)}`}>
              {result.overall_risk.toUpperCase()}
            </span>
          </AlertDescription>
        </div>
      </Alert>

      {/* Diabetic Retinopathy Analysis */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <div className="w-3 h-3 bg-medical-blue rounded-full" />
          Diabetic Retinopathy
        </h4>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Detection Status:</span>
            <Badge className={result.diabetic_retinopathy.detected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {result.diabetic_retinopathy.detected ? 'Detected' : 'Not Detected'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Confidence Level:</span>
              <span className="font-medium">{(result.diabetic_retinopathy.confidence * 100).toFixed(1)}%</span>
            </div>
            <Progress value={result.diabetic_retinopathy.confidence * 100} className="h-2" />
          </div>

          {result.diabetic_retinopathy.detected && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Severity:</span>
              <Badge className={getSeverityColor(result.diabetic_retinopathy.severity)}>
                {result.diabetic_retinopathy.severity}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Glaucoma Analysis */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <div className="w-3 h-3 bg-medical-green rounded-full" />
          Glaucoma
        </h4>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Detection Status:</span>
            <Badge className={result.glaucoma.detected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {result.glaucoma.detected ? 'Detected' : 'Not Detected'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Confidence Level:</span>
              <span className="font-medium">{(result.glaucoma.confidence * 100).toFixed(1)}%</span>
            </div>
            <Progress value={result.glaucoma.confidence * 100} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Risk Level:</span>
            <Badge className={getSeverityColor(result.glaucoma.risk_level)}>
              {result.glaucoma.risk_level}
            </Badge>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold">Recommendations</h4>
          <div className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-medical-blue mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analyzed Image */}
      {result.image_path && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold">Analyzed Image</h4>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={result.image_path}
              alt="Analyzed retinal scan"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      )}
    </Card>
  );
};
