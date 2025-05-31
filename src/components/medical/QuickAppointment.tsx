
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Stethoscope } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { medicalApi } from '@/utils/api';

const QuickAppointment: React.FC = () => {
  const [isScheduling, setIsScheduling] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const appointmentTypes = [
    { type: 'General Consultation', duration: '30 mins', icon: Stethoscope },
    { type: 'Retinal Screening', duration: '45 mins', icon: Calendar },
    { type: 'Follow-up Visit', duration: '20 mins', icon: Clock },
  ];

  const handleQuickSchedule = async (appointmentType: string) => {
    if (!user) return;
    
    setIsScheduling(true);
    
    try {
      // Schedule for next available slot (tomorrow at 2 PM for demo)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);

      const newAppointment = {
        patient_id: user.id,
        patient_name: user.name,
        scheduled_date: tomorrow.toISOString(),
        appointment_type: appointmentType,
        status: 'scheduled' as const,
        ai_scheduled: true,
        symptoms: 'Quick scheduled appointment',
        notes: 'Auto-scheduled via quick appointment feature'
      };

      await medicalApi.createAppointment(newAppointment);

      toast({
        title: 'Appointment Scheduled!',
        description: `Your ${appointmentType} is scheduled for ${tomorrow.toLocaleDateString()} at 2:00 PM`,
      });

    } catch (error) {
      toast({
        title: 'Scheduling Failed',
        description: 'Unable to schedule appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsScheduling(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-medical-blue" />
          Quick Appointment Scheduling
        </CardTitle>
        <p className="text-sm text-gray-600">
          Schedule your next appointment with just one click
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {appointmentTypes.map((appointment) => {
            const IconComponent = appointment.icon;
            return (
              <Button
                key={appointment.type}
                onClick={() => handleQuickSchedule(appointment.type)}
                disabled={isScheduling}
                variant="outline"
                className="h-auto p-4 text-left justify-start hover:bg-blue-50 hover:border-medical-blue"
              >
                <div className="flex items-center gap-3 w-full">
                  <IconComponent className="h-5 w-5 text-medical-blue" />
                  <div className="flex-1">
                    <div className="font-medium">{appointment.type}</div>
                    <div className="text-sm text-gray-500">{appointment.duration}</div>
                  </div>
                  <div className="text-sm text-medical-blue font-medium">
                    Schedule Now
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Next available:</strong> Tomorrow at 2:00 PM
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAppointment;
