
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/types/medical';
import { ChatMessageComponent } from './ChatMessage';
import { VoiceRecorder } from './VoiceRecorder';
import { ImageUpload } from './ImageUpload';
import { medicalApi } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

export const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Medical Assistant. I can help you schedule appointments, analyze retinal images, and answer your health-related questions. How can I assist you today?',
      timestamp: new Date(),
      messageType: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleTextMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    addMessage({
      type: 'user',
      content: userMessage,
      messageType: 'text'
    });

    setIsLoading(true);
    try {
      const response = await medicalApi.chatWithAI(userMessage);
      
      // Add AI response
      addMessage({
        type: 'assistant',
        content: response,
        messageType: 'text'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceRecording = async (recording: any) => {
    // Add user voice message
    addMessage({
      type: 'user',
      content: 'Voice message recorded',
      messageType: 'voice',
      metadata: { audioUrl: recording.url }
    });

    setIsLoading(true);
    try {
      const result = await medicalApi.processVoiceScheduling(recording.blob);
      
      // Add transcription message
      addMessage({
        type: 'assistant',
        content: `I heard: "${result.transcription}"`,
        messageType: 'text'
      });

      // If appointment was created, add appointment message
      if (result.appointment) {
        addMessage({
          type: 'assistant',
          content: 'I\'ve successfully scheduled your appointment! Here are the details:',
          messageType: 'appointment',
          metadata: { appointment: result.appointment }
        });
        
        toast({
          title: 'Appointment Scheduled',
          description: 'Your appointment has been successfully scheduled.',
        });
      } else {
        addMessage({
          type: 'assistant',
          content: 'I understand your request. Could you please provide more specific details about the appointment you\'d like to schedule?',
          messageType: 'text'
        });
      }
    } catch (error) {
      console.error('Error processing voice:', error);
      toast({
        title: 'Error',
        description: 'Failed to process voice message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageAnalysis = async (result: any) => {
    // Add analysis result message
    addMessage({
      type: 'assistant',
      content: 'I\'ve completed the retinal image analysis. Here are the results:',
      messageType: 'analysis',
      metadata: { analysis: result }
    });

    toast({
      title: 'Analysis Complete',
      description: 'Retinal image analysis has been completed successfully.',
    });
  };

  const handlePlayAudio = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudio(null);
    } else {
      // Play new audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingAudio(audioUrl);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-medical-blue rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Medical Assistant</h1>
            <p className="text-sm text-gray-600">Voice • Text • Image Analysis • Scheduling</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessageComponent
                key={message.id}
                message={message}
                onPlayAudio={handlePlayAudio}
                isPlayingAudio={playingAudio === message.metadata?.audioUrl}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-center">
                <Card className="p-4 bg-white border">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="text">Text Chat</TabsTrigger>
                <TabsTrigger value="voice">Voice Recording</TabsTrigger>
                <TabsTrigger value="image">Image Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message here... (Press Enter to send)"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleTextMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-medical-blue hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="voice" className="space-y-4">
                <VoiceRecorder
                  onRecordingComplete={handleVoiceRecording}
                  disabled={isLoading}
                />
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <ImageUpload
                  onAnalysisComplete={handleImageAnalysis}
                  disabled={isLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingAudio(null)}
        className="hidden"
      />
    </div>
  );
};
