//src/pages/misc/ComingSoonPage.tsx

    import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Bell, ArrowLeft } from 'lucide-react';
import MiscPageLayout from '../../components/misc/MiscPageLayout';
import { analyticsService } from '../../services/analytics.service';
import toast from 'react-hot-toast';

interface ComingSoonPageProps {
  feature?: string;
  estimatedDate?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ 
  feature = 'This feature',
  estimatedDate
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    analyticsService.trackMiscPageView('coming-soon', 'Coming Soon', { feature });
  }, [feature]);

  const handleGoBack = () => {
    analyticsService.trackMiscPageAction('coming-soon', 'go_back_clicked');
    navigate(-1);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    analyticsService.trackMiscPageAction('coming-soon', 'subscribe_clicked', { feature });
    
    // In a real app, this would call an API
    setSubscribed(true);
    toast.success('You\'ll be notified when this feature launches!');
  };

  return (
    <MiscPageLayout
      icon={<Rocket className="h-16 w-16" />}
      title={`${feature} is Coming Soon!`}
      description="We're working hard to bring you this exciting new feature."
      illustration="coming-soon"
      actions={[
        {
          label: 'Go Back',
          onClick: handleGoBack,
          variant: 'outline',
          icon: <ArrowLeft className="h-4 w-4" />
        }
      ]}
    >
      <div className="mt-8 max-w-md mx-auto">
        {estimatedDate && (
          <p className="text-sm text-muted-foreground text-center mb-6">
            Expected launch: <strong>{estimatedDate}</strong>
          </p>
        )}
        
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Get notified when it's ready</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Notify Me
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-4 bg-primary/10 rounded-md">
            <p className="text-sm text-primary font-medium">
              ✓ You're on the list! We'll notify you at {email}
            </p>
          </div>
        )}
      </div>
    </MiscPageLayout>
  );
};

export default ComingSoonPage;