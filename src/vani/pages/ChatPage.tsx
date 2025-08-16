// src/vani/pages/ChatPage.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { VaNiStatusBadge } from '../components/shared';
import { 
  sampleChatConversations,
  chatUtils,
  type ChatConversation,
  type ChatMessage,
  type ChatParticipant
} from '../types/chat.types';
import { 
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  Filter,
  Archive,
  Star,
  Mail,
  MessageSquare,
  Smartphone,
  Bell,
  Monitor,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Building,
  FileText,
  DollarSign,
  Calendar,
  Activity,
  ExternalLink,
  AlertCircle,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // State
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(
    conversationId ? chatUtils.getConversation(conversationId) : null
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showSidebar, setShowSidebar] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return sampleChatConversations.filter(conv => {
      // Text search
      if (searchTerm && !conv.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !conv.businessContext.customerName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filterStatus !== 'all' && conv.status !== filterStatus) {
        return false;
      }
      
      return true;
    });
  }, [searchTerm, filterStatus]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  // Channel icons
  const getChannelIcon = (channel: string, size = 'w-4 h-4') => {
    switch (channel) {
      case 'sms': return <Smartphone className={size} />;
      case 'email': return <Mail className={size} />;
      case 'whatsapp': return <MessageSquare className={size} />;
      case 'push': return <Bell className={size} />;
      case 'widget': return <Monitor className={size} />;
      default: return <MessageSquare className={size} />;
    }
  };

  // Status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'read':
        return <CheckCircle className="w-3 h-3" style={{ color: colors.semantic.success }} />;
      case 'failed':
        return <XCircle className="w-3 h-3" style={{ color: colors.semantic.error }} />;
      case 'sent':
      case 'pending':
        return <Clock className="w-3 h-3" style={{ color: colors.semantic.warning }} />;
      default:
        return null;
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-IN', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  // Handle conversation selection
  const handleConversationSelect = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    navigate(`/vani/chat/${conversation.id}`);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // This would normally send to API
    toast.success('Message functionality would be implemented here', {
      style: { background: colors.semantic.success, color: '#FFF' }
    });
    
    setNewMessage('');
  };

  // Handle business actions
  const handleBusinessAction = (action: any) => {
    toast.success(`Business action: ${action.type}`, {
      style: { background: colors.brand.primary, color: '#FFF' }
    });
  };

  // Navigation handlers
  const handleViewContract = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/vani/events/${eventId}`);
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/vani/jobs/${jobId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ 
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20` 
        }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/vani/dashboard')}
            className="flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.primaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to VaNi</span>
          </button>
          
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.utility.primaryText }}>
              Business Communications
            </h1>
            <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
              Customer conversations across all channels
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: `${colors.utility.primaryText}20`,
              backgroundColor: colors.utility.primaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        {showSidebar && (
          <div 
            className="w-80 border-r flex flex-col"
            style={{ 
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.utility.primaryText}20` 
            }}
          >
            {/* Search and Filter */}
            <div className="p-4 border-b" style={{ borderColor: `${colors.utility.primaryText}20` }}>
              <div className="relative mb-3">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: colors.utility.secondaryText }}
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText,
                    '--tw-ring-color': colors.brand.primary
                  } as React.CSSProperties}
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border rounded-lg"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                <option value="all">All Conversations</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const latestMessage = chatUtils.getLatestMessage(conversation.id);
                const isSelected = selectedConversation?.id === conversation.id;
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className="p-4 border-b cursor-pointer transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: isSelected 
                        ? `${colors.brand.primary}15` 
                        : colors.utility.primaryBackground,
                      borderColor: `${colors.utility.primaryText}10`
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${colors.brand.primary}20` }}
                      >
                        <User className="w-6 h-6" style={{ color: colors.brand.primary }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-1">
                          <h3 
                            className="font-medium truncate"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {conversation.businessContext.customerName}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {conversation.stats.unreadCount > 0 && (
                              <span 
                                className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: colors.semantic.error,
                                  color: '#FFF'
                                }}
                              >
                                {conversation.stats.unreadCount}
                              </span>
                            )}
                            <span 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              {formatTime(conversation.lastMessageAt)}
                            </span>
                          </div>
                        </div>

                        {/* Contract Info */}
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-3 h-3" style={{ color: colors.brand.secondary }} />
                          <span 
                            className="text-xs truncate"
                            style={{ color: colors.brand.secondary }}
                          >
                            {conversation.businessContext.contractId}
                          </span>
                          <VaNiStatusBadge status={conversation.status as any} size="sm" />
                        </div>

                        {/* Latest Message Preview */}
                        {latestMessage && (
                          <div className="flex items-center space-x-2">
                            {getChannelIcon(latestMessage.channel, 'w-3 h-3')}
                            <p 
                              className="text-sm truncate"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              {latestMessage.senderType === 'system' ? 'VaNi: ' : ''}
                              {latestMessage.content.length > 50 
                                ? latestMessage.content.substring(0, 50) + '...'
                                : latestMessage.content
                              }
                            </p>
                          </div>
                        )}

                        {/* Business Context Tags */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${colors.semantic.info}20`,
                              color: colors.semantic.info
                            }}
                          >
                            {conversation.category}
                          </span>
                          {conversation.priority === 'high' && (
                            <span 
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: `${colors.semantic.error}20`,
                                color: colors.semantic.error
                              }}
                            >
                              High Priority
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div 
                className="p-4 border-b flex items-center justify-between"
                style={{ 
                  backgroundColor: colors.utility.secondaryBackground,
                  borderColor: `${colors.utility.primaryText}20` 
                }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.brand.primary}20` }}
                  >
                    <User className="w-5 h-5" style={{ color: colors.brand.primary }} />
                  </div>
                  
                  <div>
                    <h2 className="font-semibold" style={{ color: colors.utility.primaryText }}>
                      {selectedConversation.businessContext.customerName}
                    </h2>
                    <div className="flex items-center space-x-2 text-sm" style={{ color: colors.utility.secondaryText }}>
                      <span>{selectedConversation.title}</span>
                      <span>•</span>
                      <span>Contract {selectedConversation.businessContext.contractId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewContract(selectedConversation.businessContext.contractId)}
                    className="p-2 border rounded-lg transition-colors hover:opacity-80"
                    style={{
                      borderColor: `${colors.brand.primary}40`,
                      backgroundColor: `${colors.brand.primary}10`,
                      color: colors.brand.primary
                    }}
                    title="View Contract"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  
                  <button
                    className="p-2 border rounded-lg transition-colors hover:opacity-80"
                    style={{
                      borderColor: `${colors.utility.primaryText}20`,
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Business Context Bar */}
              <div 
                className="p-3 border-b"
                style={{ 
                  backgroundColor: `${colors.brand.primary}05`,
                  borderColor: `${colors.utility.primaryText}20` 
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Building className="w-4 h-4" style={{ color: colors.brand.primary }} />
                      <span style={{ color: colors.utility.primaryText }}>
                        {selectedConversation.businessContext.serviceType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" style={{ color: colors.semantic.success }} />
                      <span style={{ color: colors.utility.primaryText }}>
                        ₹{selectedConversation.businessContext.totalValue?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                      <span style={{ color: colors.utility.secondaryText }}>
                        Avg response: {selectedConversation.stats.responseTime}min
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {selectedConversation.businessContext.relatedEvents.map(eventId => (
                      <button
                        key={eventId}
                        onClick={() => handleViewEvent(eventId)}
                        className="text-xs px-2 py-1 border rounded transition-colors hover:opacity-80"
                        style={{
                          borderColor: `${colors.brand.secondary}40`,
                          backgroundColor: `${colors.brand.secondary}10`,
                          color: colors.brand.secondary
                        }}
                      >
                        View Event
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ backgroundColor: colors.utility.primaryBackground }}
              >
                {selectedConversation.messages.map((message) => {
                  const isSystem = message.senderType === 'system';
                  const isCustomer = message.senderType === 'customer';
                  
                  return (
                    <div 
                      key={message.id}
                      className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${isCustomer ? 'order-2' : 'order-1'}`}>
                        {/* Message Header */}
                        <div className={`flex items-center space-x-2 mb-1 ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                          <div className="flex items-center space-x-2">
                            {getChannelIcon(message.channel, 'w-3 h-3')}
                            <span 
                              className="text-xs font-medium"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              {message.senderName}
                            </span>
                            <span 
                              className="text-xs"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              {formatTime(message.sentAt)}
                            </span>
                            {getStatusIcon(message.metadata.deliveryStatus)}
                          </div>
                        </div>

                        {/* Message Bubble */}
                        <div 
                          className={`p-3 rounded-lg ${
                            isCustomer 
                              ? 'rounded-br-none' 
                              : 'rounded-bl-none'
                          }`}
                          style={{
                            backgroundColor: isCustomer 
                              ? colors.brand.primary 
                              : isSystem 
                                ? `${colors.semantic.info}20`
                                : colors.utility.secondaryBackground,
                            color: isCustomer ? '#FFF' : colors.utility.primaryText,
                            border: `1px solid ${
                              isCustomer 
                                ? colors.brand.primary 
                                : `${colors.utility.primaryText}20`
                            }`
                          }}
                        >
                          {/* Email Subject */}
                          {message.metadata.subject && (
                            <div 
                              className="text-sm font-medium mb-2 pb-2 border-b"
                              style={{ 
                                borderColor: isCustomer ? '#FFFFFF40' : `${colors.utility.primaryText}20`
                              }}
                            >
                              Subject: {message.metadata.subject}
                            </div>
                          )}

                          {/* Message Content */}
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>

                          {/* Business Context Tags */}
                          {message.businessContext.eventType && (
                            <div className="mt-2 pt-2 border-t flex items-center space-x-2" style={{ borderColor: isCustomer ? '#FFFFFF40' : `${colors.utility.primaryText}20` }}>
                              <Activity className="w-3 h-3" />
                              <span className="text-xs">
                                {message.businessContext.eventType.replace('_', ' ')}
                              </span>
                              {message.businessContext.jobId && (
                                <button
                                  onClick={() => handleViewJob(message.businessContext.jobId!)}
                                  className="text-xs hover:underline"
                                >
                                  View Job →
                                </button>
                              )}
                            </div>
                          )}

                          {/* Template Info */}
                          {message.messageType === 'template' && (
                            <div className="mt-2 pt-2 border-t text-xs" style={{ borderColor: isCustomer ? '#FFFFFF40' : `${colors.utility.primaryText}20` }}>
                              <div className="flex items-center space-x-2">
                                <Zap className="w-3 h-3" />
                                <span>Auto-generated from template</span>
                                {message.metadata.cost && (
                                  <span>• Cost: ₹{message.metadata.cost}</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Available Actions */}
                          {message.availableActions && message.availableActions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.availableActions.map((action) => (
                                <button
                                  key={action.id}
                                  onClick={() => handleBusinessAction(action.businessAction)}
                                  className="block w-full p-2 text-sm border rounded transition-colors hover:opacity-80"
                                  style={{
                                    borderColor: isCustomer ? '#FFFFFF40' : `${colors.brand.primary}40`,
                                    backgroundColor: isCustomer ? '#FFFFFF20' : `${colors.brand.primary}10`,
                                    color: isCustomer ? '#FFF' : colors.brand.primary
                                  }}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Message Responses */}
                        {message.responses && message.responses.length > 0 && (
                          <div className="mt-2 text-xs" style={{ color: colors.semantic.success }}>
                            ✓ Customer responded: {message.responses[0].responseType}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div 
                className="p-4 border-t"
                style={{ 
                  backgroundColor: colors.utility.secondaryBackground,
                  borderColor: `${colors.utility.primaryText}20` 
                }}
              >
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 transition-colors hover:opacity-80"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                  />
                  
                  <button 
                    className="p-2 transition-colors hover:opacity-80"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      backgroundColor: colors.brand.primary
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // No conversation selected
            <div 
              className="flex-1 flex items-center justify-center"
              style={{ backgroundColor: colors.utility.primaryBackground }}
            >
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: colors.utility.secondaryText }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.utility.primaryText }}>
                  Select a Conversation
                </h3>
                <p style={{ color: colors.utility.secondaryText }}>
                  Choose a conversation from the sidebar to view the complete communication history
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;