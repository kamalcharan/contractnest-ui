// src/components/dashboard/UpcomingAppointments.tsx
import React from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

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
    const statusColors = {
      scheduled: {
        bg: colors.brand.primary + '10',
        text: colors.brand.primary
      },
      confirmed: {
        bg: colors.semantic.success + '10',
        text: colors.semantic.success
      },
      completed: {
        bg: colors.utility.secondaryText + '10',
        text: colors.utility.secondaryText
      },
      cancelled: {
        bg: colors.semantic.error + '10',
        text: colors.semantic.error
      }
    };

    const statusConfig = statusColors[status];
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span 
        className="text-xs px-2 py-0.5 rounded-full font-medium transition-colors"
        style={{
          backgroundColor: statusConfig.bg,
          color: statusConfig.text
        }}
      >
        {statusLabel}
      </span>
    );
  };

  return (
    <div 
      className={`rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      <div 
        className="p-4 border-b transition-colors"
        style={{ borderColor: colors.utility.secondaryText + '20' }}
      >
        <h3 
          className="font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Upcoming Appointments
        </h3>
      </div>
      
      <div 
        className="max-h-96 overflow-y-auto"
        style={{
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        {appointments.length === 0 ? (
          <div 
            className="p-8 text-center transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            <Calendar 
              className="h-12 w-12 mx-auto mb-3"
              style={{ color: colors.utility.secondaryText }}
            />
            <p 
              className="font-medium mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              No upcoming appointments
            </p>
            <Link 
              to="/appointments/new" 
              className="inline-block px-4 py-2 rounded-md border transition-colors hover:opacity-80"
              style={{
                color: colors.brand.primary,
                borderColor: colors.brand.primary + '20',
                backgroundColor: colors.brand.primary + '05'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.brand.primary + '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.brand.primary + '05';
              }}
            >
              Schedule an appointment
            </Link>
          </div>
        ) : (
          appointments.map((appointment, index) => (
            <div key={appointment.id}>
              <Link 
                to={`/appointments/${appointment.id}`}
                className="block p-4 transition-colors hover:opacity-80"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '05';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 
                    className="font-medium text-sm transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {appointment.title}
                  </h4>
                  {getStatusBadge(appointment.status)}
                </div>
                
                <div 
                  className="mb-3 p-3 rounded-md space-y-2 transition-colors"
                  style={{ backgroundColor: colors.utility.secondaryText + '05' }}
                >
                  <div className="flex items-center">
                    <Calendar 
                      size={14} 
                      className="mr-2 flex-shrink-0"
                      style={{ color: colors.brand.primary }}
                    />
                    <span 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {appointment.date}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock 
                      size={14} 
                      className="mr-2 flex-shrink-0"
                      style={{ color: colors.utility.secondaryText }}
                    />
                    <span 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {appointment.time} ({appointment.duration})
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin 
                      size={14} 
                      className="mr-2 flex-shrink-0"
                      style={{ color: colors.utility.secondaryText }}
                    />
                    <span 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {appointment.location}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <User 
                      size={14} 
                      className="mr-2 flex-shrink-0"
                      style={{ color: colors.utility.secondaryText }}
                    />
                    <span 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {appointment.client.name}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div 
                    className="flex items-center text-xs transition-colors"
                    style={{ color: colors.brand.primary }}
                  >
                    <span>View details</span>
                    <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </Link>
              {index < appointments.length - 1 && (
                <div 
                  className="border-t"
                  style={{ borderColor: colors.utility.secondaryText + '20' }}
                />
              )}
            </div>
          ))
        )}
      </div>
      
      <div 
        className="p-3 border-t transition-colors"
        style={{
          borderColor: colors.utility.secondaryText + '20',
          backgroundColor: colors.utility.secondaryText + '05'
        }}
      >
        <Link 
          to="/appointments" 
          className="text-sm block text-center py-1 rounded-md transition-colors hover:opacity-80"
          style={{
            color: colors.brand.primary,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          View all appointments
        </Link>
      </div>
    </div>
  );
};

export default UpcomingAppointments;