
export interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  medical_history: string[];
  created_at: string;
}

export interface Appointment {
  _id: string;
  patient_id: string;
  patient_name?: string;
  scheduled_date: string;
  appointment_type: string;
  status: 'scheduled' | 'checked_in' | 'analysis_complete' | 'completed';
  ai_scheduled: boolean;
  symptoms?: string;
  notes?: string;
  created_at: string;
}

export interface AnalysisResult {
  _id: string;
  patient_id: string;
  appointment_id: string;
  diabetic_retinopathy: {
    detected: boolean;
    confidence: number;
    severity: 'mild' | 'moderate' | 'severe' | 'none';
  };
  glaucoma: {
    detected: boolean;
    confidence: number;
    risk_level: 'low' | 'medium' | 'high';
  };
  overall_risk: 'low' | 'medium' | 'high';
  recommendations: string[];
  analyzed_at: string;
  image_path: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  messageType?: 'text' | 'voice' | 'image' | 'appointment' | 'analysis';
  metadata?: {
    appointment?: Appointment;
    analysis?: AnalysisResult;
    imageUrl?: string;
    audioUrl?: string;
  };
}

export interface VoiceRecording {
  blob: Blob;
  url: string;
  duration: number;
}
