
import axios from 'axios';
import { Patient, Appointment, AnalysisResult } from '@/types/medical';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development
const mockPatients: Patient[] = [
  {
    _id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+92-300-1234567',
    age: 45,
    medical_history: ['Diabetes Type 2', 'Hypertension'],
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Fatima Khan',
    email: 'fatima@example.com',
    phone: '+92-321-9876543',
    age: 38,
    medical_history: ['Family history of glaucoma'],
    created_at: '2024-02-20T14:30:00Z'
  }
];

const mockAppointments: Appointment[] = [
  {
    _id: '1',
    patient_id: '1',
    patient_name: 'Ahmed Hassan',
    scheduled_date: '2024-12-02T09:00:00Z',
    appointment_type: 'Retinal Screening',
    status: 'scheduled',
    ai_scheduled: true,
    symptoms: 'Blurred vision, eye strain',
    created_at: '2024-11-28T10:00:00Z'
  },
  {
    _id: '2',
    patient_id: '2',
    patient_name: 'Fatima Khan',
    scheduled_date: '2024-12-03T14:00:00Z',
    appointment_type: 'Follow-up Consultation',
    status: 'analysis_complete',
    ai_scheduled: false,
    symptoms: 'Regular checkup',
    created_at: '2024-11-25T15:20:00Z'
  }
];

const mockAnalysisResults: AnalysisResult[] = [
  {
    _id: '1',
    patient_id: '2',
    appointment_id: '2',
    diabetic_retinopathy: {
      detected: true,
      confidence: 0.85,
      severity: 'mild'
    },
    glaucoma: {
      detected: false,
      confidence: 0.15,
      risk_level: 'low'
    },
    overall_risk: 'medium',
    recommendations: [
      'Continue current diabetes management',
      'Schedule follow-up in 6 months',
      'Monitor blood sugar levels regularly'
    ],
    analyzed_at: '2024-11-29T16:45:00Z',
    image_path: '/mock-retinal-scan.jpg'
  }
];

export const medicalApi = {
  // Patients
  getPatients: async (): Promise<Patient[]> => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      console.log('Using mock data for patients');
      return mockPatients;
    }
  },

  createPatient: async (patient: Omit<Patient, '_id' | 'created_at'>): Promise<Patient> => {
    try {
      const response = await api.post('/patients', patient);
      return response.data;
    } catch (error) {
      console.log('Using mock data for create patient');
      const newPatient: Patient = {
        ...patient,
        _id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      mockPatients.push(newPatient);
      return newPatient;
    }
  },

  // Appointments
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (error) {
      console.log('Using mock data for appointments');
      return mockAppointments;
    }
  },

  createAppointment: async (appointment: Omit<Appointment, '_id' | 'created_at'>): Promise<Appointment> => {
    try {
      const response = await api.post('/appointments', appointment);
      return response.data;
    } catch (error) {
      console.log('Using mock data for create appointment');
      const newAppointment: Appointment = {
        ...appointment,
        _id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    }
  },

  // Analysis
  getAnalysisResults: async (): Promise<AnalysisResult[]> => {
    try {
      const response = await api.get('/analysis');
      return response.data;
    } catch (error) {
      console.log('Using mock data for analysis results');
      return mockAnalysisResults;
    }
  },

  analyzeRetinalImage: async (imageFile: File, appointmentId: string): Promise<AnalysisResult> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('appointment_id', appointmentId);
      
      const response = await api.post('/analyze-retinal-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.log('Using mock data for retinal analysis');
      const mockResult: AnalysisResult = {
        _id: Math.random().toString(36).substr(2, 9),
        patient_id: '1',
        appointment_id: appointmentId,
        diabetic_retinopathy: {
          detected: Math.random() > 0.5,
          confidence: Math.random() * 0.4 + 0.6,
          severity: ['mild', 'moderate', 'severe'][Math.floor(Math.random() * 3)] as any
        },
        glaucoma: {
          detected: Math.random() > 0.7,
          confidence: Math.random() * 0.3 + 0.1,
          risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
        },
        overall_risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        recommendations: [
          'Regular monitoring recommended',
          'Lifestyle modifications suggested',
          'Follow-up in 3-6 months'
        ],
        analyzed_at: new Date().toISOString(),
        image_path: URL.createObjectURL(imageFile)
      };
      return mockResult;
    }
  },

  // AI Chat
  processVoiceScheduling: async (audioBlob: Blob): Promise<{ transcription: string; appointment: Appointment | null }> => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await api.post('/process-voice-scheduling', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.log('Using mock data for voice processing');
      return {
        transcription: "I'd like to schedule an appointment for next Tuesday at 2 PM for an eye checkup.",
        appointment: {
          _id: Math.random().toString(36).substr(2, 9),
          patient_id: '1',
          patient_name: 'Ahmed Hassan',
          scheduled_date: '2024-12-03T14:00:00Z',
          appointment_type: 'Eye Examination',
          status: 'scheduled',
          ai_scheduled: true,
          symptoms: 'Routine checkup',
          created_at: new Date().toISOString()
        }
      };
    }
  },

  chatWithAI: async (message: string, context?: any): Promise<string> => {
    try {
      const response = await api.post('/chat', { message, context });
      return response.data.response;
    } catch (error) {
      console.log('Using mock data for AI chat');
      return `I understand you're asking about "${message}". As your AI medical assistant, I'm here to help with scheduling appointments, analyzing medical images, and providing general health guidance. How can I assist you today?`;
    }
  }
};
