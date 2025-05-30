
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, User, Calendar, Eye, Mic, Play, Pause } from 'lucide-react';
import { ChatMessage } from '@/types/medical';
import { AnalysisResults } from './AnalysisResults';

interface ChatMessageProps {
  message: ChatMessage;
  onPlayAudio?: (audioUrl: string) => void;
  isPlayingAudio?: boolean;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ 
  message, 
  onPlayAudio, 
  isPlayingAudio 
}) => {
  const isUser = message.type === 'user';
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getMessageIcon = () => {
    switch (message.messageType) {
      case 'voice': return <Mic className="h-4 w-4" />;
      case 'image': return <Eye className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <Avatar className="flex-shrink-0">
        <AvatarFallback className={isUser ? 'bg-medical-blue text-white' : 'bg-medical-green text-white'}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-600">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          {message.messageType && (
            <Badge variant="outline" className="text-xs">
              {getMessageIcon()}
              {message.messageType}
            </Badge>
          )}
          <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
        </div>

        <Card className={`p-4 ${isUser ? 'bg-medical-blue text-white' : 'bg-white border'}`}>
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">{message.content}</p>

            {/* Voice Audio Playback */}
            {message.messageType === 'voice' && message.metadata?.audioUrl && onPlayAudio && (
              <Button
                onClick={() => onPlayAudio(message.metadata!.audioUrl!)}
                variant={isUser ? "secondary" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                {isPlayingAudio ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {isPlayingAudio ? 'Pause' : 'Play'} Recording
              </Button>
            )}

            {/* Image Display */}
            {message.messageType === 'image' && message.metadata?.imageUrl && (
              <div className="mt-2">
                <img
                  src={message.metadata.imageUrl}
                  alt="Uploaded medical image"
                  className="max-w-full h-32 object-cover rounded border"
                />
              </div>
            )}

            {/* Appointment Information */}
            {message.messageType === 'appointment' && message.metadata?.appointment && (
              <div className="mt-2 p-3 bg-black/10 rounded border border-white/20">
                <div className="text-sm space-y-1">
                  <p><strong>Patient:</strong> {message.metadata.appointment.patient_name}</p>
                  <p><strong>Date:</strong> {new Date(message.metadata.appointment.scheduled_date).toLocaleString()}</p>
                  <p><strong>Type:</strong> {message.metadata.appointment.appointment_type}</p>
                  <p><strong>Status:</strong> {message.metadata.appointment.status}</p>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {message.messageType === 'analysis' && message.metadata?.analysis && (
              <div className="mt-2">
                <AnalysisResults result={message.metadata.analysis} />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
