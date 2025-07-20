// src/components/dashboard/UpcomingAppointments.tsx
import React from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Appointment {
  id: string | number;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  client: {
    name: string;
    avatar?: string;
  };
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface UpcomingAppointmentsProps {
  className?: string;
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ className = '' }) => {
  // Mock appointment data
  const appointments: Appointment[] = [
    {
      id: 1,
      title: 'Quarterly HVAC Maintenance',
      date: 'Today',
      time: '2:00 PM',
      duration: '1 hour',
      location: 'Acme Corp HQ',
      client: { name: 'Acme Corporation' },
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Server Equipment Inspection',
      date: 'Tomorrow',
      time: '10:30 AM',
      duration: '2 hours',
      location: 'DataTech Server Room',
      client: { name: 'DataTech Inc.' },
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Contract Review Meeting',
      date: 'Apr 18, 2025',
      time: '1:00 PM',
      duration: '45 minutes',
      location: 'Virtual Meeting',
      client: { name: 'GlobalTech Industries' },
      status: 'scheduled'
    },
    {
      id: 4,
      title: 'Annual Security System Check',
      date: 'Apr 20, 2025',
      time: '9:00 AM',
      duration: '3 hours',
      location: 'SecureTech Building',
      client: { name: 'SecureTech' },
      status: 'scheduled'
    }
  ];

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium">Scheduled</span>;
      case 'confirmed':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium">Confirmed</span>;
      case 'completed':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">Completed</span>;
      case 'cancelled':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-medium">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="font-medium">Upcoming Appointments</h3>
      </div>
      
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-2">No upcoming appointments</p>
            <Link 
              to="/appointments/new" 
              className="text-primary hover:underline mt-2 inline-block px-4 py-2 rounded-md border border-primary/20 hover:bg-primary/5 transition-colors"
            >
              Schedule an appointment
            </Link>
          </div>
        ) : (
          appointments.map((appointment) => (
            <Link 
              key={appointment.id} 
              to={`/appointments/${appointment.id}`}
              className="block p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{appointment.title}</h4>
                {getStatusBadge(appointment.status)}
              </div>
              
              <div className="mb-3 p-3 bg-muted/30 rounded-md space-y-2">
                <div className="flex items-center">
                  <Calendar size={14} className="text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">{appointment.date}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock size={14} className="text-muted-foreground mr-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{appointment.time} ({appointment.duration})</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin size={14} className="text-muted-foreground mr-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{appointment.location}</span>
                </div>
                
                <div className="flex items-center">
                  <User size={14} className="text-muted-foreground mr-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{appointment.client.name}</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="flex items-center text-xs text-primary">
                  <span>View details</span>
                  <ChevronRight size={14} className="ml-1" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-border bg-muted/10">
        <Link to="/appointments" className="text-sm text-primary hover:bg-muted/50 block text-center py-1 rounded-md transition-colors">
          View all appointments
        </Link>
      </div>
    </div>
  );
};

export default UpcomingAppointments;