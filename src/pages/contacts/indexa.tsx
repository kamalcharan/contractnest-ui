// src/pages/contacts/index.tsx - Improved Version
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Building2,
  User,
  Mail,
  Phone,
  Eye,
  FileText,
  DollarSign,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  Grid3X3,
  List
} from 'lucide-react';

// Types
interface Contact {
  id: string;
  type: 'individual' | 'corporate';
  name: string;
  company?: string;
  email: string;
  phone: string;
  classification: ('buyer' | 'partner' | 'service_provider')[];
  avatar: string;
  address: string;
  lastContact: string;
  status: 'active' | 'inactive' | 'lead' | 'archived';
  billingStatus: 'current' | 'overdue' | 'due_next_week' | 'due_next_month' | 'no_billing';
  serviceStatus: 'active_services' | 'service_renewal_due' | 'completed_projects' | 'pending_proposals' | 'no_services';
  outstandingAmount?: number;
  lastBillingDate?: string;
  nextServiceRenewal?: string;
}

// Mock data (same as before)
const mockContacts: Contact[] = [
  {
    id: '1',
    type: 'individual',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+91 98765 43210',
    classification: ['buyer'],
    avatar: 'JS',
    address: 'Mumbai, Maharashtra',
    lastContact: '2024-01-15',
    status: 'active',
    billingStatus: 'overdue',
    serviceStatus: 'active_services',
    outstandingAmount: 25000,
    lastBillingDate: '2024-01-01',
    nextServiceRenewal: '2024-03-15'
  },
  {
    id: '2',
    type: 'corporate',
    name: 'Acme Corporation',
    company: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+91 99887 76543',
    classification: ['partner', 'buyer'],
    avatar: 'AC',
    address: 'Delhi, India',
    lastContact: '2024-01-12',
    status: 'active',
    billingStatus: 'due_next_week',
    serviceStatus: 'service_renewal_due',
    outstandingAmount: 75000,
    lastBillingDate: '2024-01-10',
    nextServiceRenewal: '2024-02-01'
  }
];

type ActiveTab = 'status' | 'billing' | 'services';
type ViewType = 'grid' | 'list';

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('status'); // Default to status
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [showVideoHelp, setShowVideoHelp] = useState<boolean>(false);
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  const itemsPerPage = 8; // Increased for more compact cards

  // Tab configurations with horizontal layout
  const tabConfigs = {
    status: {
      label: 'STATUS',
      filters: [
        { id: 'all', label: 'All', count: mockContacts.length },
        { id: 'active', label: 'Active', count: mockContacts.filter(c => c.status === 'active').length },
        { id: 'leads', label: 'Leads', count: mockContacts.filter(c => c.status === 'lead').length },
        { id: 'inactive', label: 'Inactive', count: mockContacts.filter(c => c.status === 'inactive').length },
        { id: 'archived', label: 'Archived', count: mockContacts.filter(c => c.status === 'archived').length }
      ]
    },
    billing: {
      label: 'BILLING',
      filters: [
        { id: 'all', label: 'All', count: mockContacts.length },
        { id: 'overdue', label: 'Overdue', count: mockContacts.filter(c => c.billingStatus === 'overdue').length },
        { id: 'due_next_week', label: 'Due next week', count: mockContacts.filter(c => c.billingStatus === 'due_next_week').length },
        { id: 'due_next_month', label: 'Due next month', count: mockContacts.filter(c => c.billingStatus === 'due_next_month').length },
        { id: 'due_anytime', label: 'Due anytime', count: mockContacts.filter(c => c.billingStatus !== 'no_billing').length }
      ]
    },
    services: {
      label: 'SERVICES',
      filters: [
        { id: 'all', label: 'All', count: mockContacts.length },
        { id: 'active_services', label: 'Active services', count: mockContacts.filter(c => c.serviceStatus === 'active_services').length },
        { id: 'service_renewal_due', label: 'Renewal due', count: mockContacts.filter(c => c.serviceStatus === 'service_renewal_due').length },
        { id: 'completed_projects', label: 'Completed', count: mockContacts.filter(c => c.serviceStatus === 'completed_projects').length },
        { id: 'pending_proposals', label: 'Pending proposals', count: mockContacts.filter(c => c.serviceStatus === 'pending_proposals').length }
      ]
    }
  };

  // Theme-aware button colors - Fix theme integration
  const getButtonColor = (type: 'primary' | 'view' | 'contract' | 'billing' | 'service') => {
    // For now, we'll use a simple theme-aware approach
    // This should be replaced with actual theme context integration
    const baseColors = {
      primary: '#2563eb', // Blue
      view: '#6b7280',    // Gray  
      contract: '#059669', // Green
      billing: '#dc2626',  // Red
      service: '#7c3aed'   // Purple
    };
    
    // If you have theme context available, replace with:
    // const theme = useTheme();
    // return theme.colors.primary (or appropriate theme color)
    
    return baseColors[type];
  };

  // Filter contacts
  const filteredContacts = mockContacts.filter(contact => {
    let matchesTabFilter = true;
    if (activeFilter !== 'all') {
      switch (activeTab) {
        case 'status':
          matchesTabFilter = contact.status === activeFilter;
          break;
        case 'billing':
          matchesTabFilter = contact.billingStatus === activeFilter;
          break;
        case 'services':
          matchesTabFilter = contact.serviceStatus === activeFilter;
          break;
      }
    }

    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesTabFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'lead': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const currentFilters = tabConfigs[activeTab].filters;

  return (
    <div className="p-4 md:p-6 bg-muted/20 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Contacts
            <button
              onClick={() => setShowVideoHelp(true)}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              title="Help & tutorials"
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </button>
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Import/Export with Proper Theme Colors */}
          <div className="flex gap-2">
            <button 
              className="flex items-center px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm border"
              style={{ 
                borderColor: getButtonColor('primary'),
                color: getButtonColor('primary')
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button 
              className="flex items-center px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm border"
              style={{ 
                borderColor: getButtonColor('primary'),
                color: getButtonColor('primary')
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
          
          {/* New Contact Button with Theme Color */}
          <button 
            onClick={() => navigate('/contacts/create')}
            className="flex items-center px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
            style={{ backgroundColor: getButtonColor('primary') }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </button>
        </div>
      </div>

      {/* Space-Efficient Tab Layout */}
      <div className="bg-card rounded-lg shadow-sm border border-border mb-6">
        {/* Compact Main Tabs */}
        <div className="px-4 pt-4">
          <div className="flex gap-6 border-b border-border">
            {Object.entries(tabConfigs).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key as ActiveTab);
                  setActiveFilter('all');
                  setCurrentPage(1);
                }}
                className={`
                  pb-3 font-medium text-sm transition-colors relative
                  ${activeTab === key
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {config.label}
                {activeTab === key && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: getButtonColor('primary') }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Sub Filters & Search */}
        <div className="p-4 space-y-3">
          {/* Sub-filter Pills */}
          <div className="flex flex-wrap gap-2">
            {currentFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setCurrentPage(1);
                }}
                className={`
                  px-3 py-1.5 rounded-full text-sm transition-colors
                  ${activeFilter === filter.id
                    ? 'text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
                style={{
                  backgroundColor: activeFilter === filter.id ? getButtonColor('primary') : undefined
                }}
              >
                {filter.label} {filter.count}
              </button>
            ))}
          </div>

          {/* Single Search Row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            
            {/* Compact Controls */}
            <div className="flex items-center gap-2">
              <div className="flex bg-muted/50 rounded-lg p-0.5">
                <button 
                  onClick={() => setViewType('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewType === 'grid' ? 'bg-background shadow-sm' : ''}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewType === 'list' ? 'bg-background shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <button 
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                title="More filters"
              >
                <Filter className="h-4 w-4" />
              </button>
              
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredContacts.length} results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Contact Cards */}
      <div>
        {paginatedContacts.length === 0 ? (
          <div className="bg-card rounded-lg shadow-sm border border-border p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No contacts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "No contacts match your search criteria. Try adjusting your search or filters."
                : "You haven't added any contacts yet. Create your first contact to get started."
              }
            </p>
            <button 
              onClick={() => navigate('/contacts/create')}
              className="flex items-center px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors mx-auto"
              style={{ backgroundColor: getButtonColor('primary') }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Contact
            </button>
          </div>
        ) : (
          <div className={`
            ${viewType === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
              : 'space-y-2'
            }
          `}>
            {paginatedContacts.map((contact) => (
              viewType === 'grid' ? (
                // GRID VIEW - Compact 4-row cards
                <div key={contact.id} className="bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-all duration-200 p-4">
                  {/* Row 1: Name + Avatar + Status (Horizontal Layout) */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0 border border-primary/20">
                        {contact.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base truncate">{contact.name}</h3>
                          {contact.type === 'corporate' ? (
                            <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(contact.status)}`}>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </div>
                  
                  {/* Row 2: Email + Phone (Side by Side) */}
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{contact.phone}</span>
                    </div>
                  </div>
                  
                  {/* Row 3: Classification Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {contact.classification.map((cls) => (
                      <span
                        key={cls}
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          cls === 'buyer' ? 'bg-green-50 text-green-700 border-green-200' :
                          cls === 'partner' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {cls === 'service_provider' ? 'Service Provider' : cls.charAt(0).toUpperCase() + cls.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  {/* Row 4: Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                        className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                        style={{ backgroundColor: getButtonColor('view') }}
                        title="View contact details"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => navigate(`/contracts/create?contactId=${contact.id}`)}
                        className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                        style={{ backgroundColor: getButtonColor('contract') }}
                        title="Create new contract"
                      >
                        <FileText className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => navigate(`/contacts/${contact.id}?tab=contracts`)}
                        className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                        style={{ backgroundColor: getButtonColor('contract') }}
                        title="View all contracts"
                      >
                        <FileText className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => navigate(`/contacts/${contact.id}?tab=billing`)}
                        className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                        style={{ backgroundColor: getButtonColor('billing') }}
                        title="View billing schedule"
                      >
                        <DollarSign className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => navigate(`/contacts/${contact.id}?tab=services`)}
                        className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                        style={{ backgroundColor: getButtonColor('service') }}
                        title="View service schedule"
                      >
                        <Settings className="h-3 w-3" />
                      </button>
                    </div>
                    <button 
                      className="p-1 rounded-md hover:bg-muted transition-colors"
                      title="More options"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                // LIST VIEW - Single horizontal row (like your reference)
                <div key={contact.id} className="bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-all duration-200 p-3">
                  <div className="flex items-center justify-between">
                    {/* Left: Avatar + Name + Status */}
                    <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0 border border-primary/20">
                        {contact.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base truncate">{contact.name}</h3>
                          {contact.type === 'corporate' ? (
                            <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Email */}
                    <div className="flex items-center gap-2 text-muted-foreground min-w-0 flex-1 px-4">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-sm">{contact.email}</span>
                    </div>

                    {/* Middle-Right: Phone */}
                    <div className="flex items-center gap-2 text-muted-foreground min-w-0 flex-shrink-0 px-4">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>

                    {/* Right: Classification + Action Buttons */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Classification Tags */}
                      <div className="flex flex-wrap gap-1">
                        {contact.classification.map((cls) => (
                          <span
                            key={cls}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              cls === 'buyer' ? 'bg-green-50 text-green-700 border-green-200' :
                              cls === 'partner' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
                            {cls === 'service_provider' ? 'Service Provider' : cls.charAt(0).toUpperCase() + cls.slice(1)}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        <button 
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                          className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                          style={{ backgroundColor: getButtonColor('view') }}
                          title="View contact details"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => navigate(`/contracts/create?contactId=${contact.id}`)}
                          className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                          style={{ backgroundColor: getButtonColor('contract') }}
                          title="Create new contract"
                        >
                          <FileText className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => navigate(`/contacts/${contact.id}?tab=contracts`)}
                          className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                          style={{ backgroundColor: getButtonColor('contract') }}
                          title="View all contracts"
                        >
                          <FileText className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => navigate(`/contacts/${contact.id}?tab=billing`)}
                          className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                          style={{ backgroundColor: getButtonColor('billing') }}
                          title="View billing schedule"
                        >
                          <DollarSign className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => navigate(`/contacts/${contact.id}?tab=services`)}
                          className="p-1.5 rounded-md hover:opacity-80 transition-colors text-white text-xs"
                          style={{ backgroundColor: getButtonColor('service') }}
                          title="View service schedule"
                        >
                          <Settings className="h-3 w-3" />
                        </button>
                        <button 
                          className="p-1 rounded-md hover:bg-muted transition-colors"
                          title="More options"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'text-white'
                            : 'hover:bg-muted'
                        }`}
                        style={{
                          backgroundColor: currentPage === page ? getButtonColor('primary') : undefined
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;