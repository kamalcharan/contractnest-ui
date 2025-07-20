// src/pages/contacts/index.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Grid, List, Plus, Upload, Download, 
  MessageCircle, Settings, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ContactList from '@/components/contacts/ContactList';
import ContactEmptyState from '@/components/contacts/ContactEmptyState';
import ContactTypesSidebar from '@/components/contacts/ContactTypesSidebar';

import { ContactSummary, ContactTypeConfig } from '@/models/contacts/types';
import { 
  fakeContacts, 
  fakeContactTypes, 
  getContactsByType,
  getPaginatedContacts 
} from '@/utils/fakejson/contacts';

const ContactsPage = () => {
  const navigate = useNavigate();
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<ContactSummary[]>([]);
  const [contactTypes, setContactTypes] = useState<ContactTypeConfig[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<any>({
    status: 'all',
    billing: null
  });
  
  // Debug mode
  const [debugMode, setDebugMode] = useState(false);
  const [forceEmptyState, setForceEmptyState] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        setContactTypes(fakeContactTypes);
        
        if (!forceEmptyState) {
          const result = getPaginatedContacts(currentPage, 12);
          setContacts(result.data);
          setTotalContacts(result.total);
        } else {
          setContacts([]);
          setTotalContacts(0);
        }
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentPage, forceEmptyState]);

  // Handlers
  const handleCreateContact = () => {
    if (selectedType) {
      const type = contactTypes.find(t => t.id === selectedType);
      if (type) {
        sessionStorage.setItem('selected_contact_type', type.id);
        navigate('/contacts/create');
      }
    }
  };

  const handleContactTypeSelect = (typeId: string) => {
    const type = contactTypes.find(t => t.id === typeId);
    if (type) {
      sessionStorage.setItem('selected_contact_type', type.id);
      navigate('/contacts/create');
    }
  };

  const handleTypeFilter = (typeId: string | null) => {
    setSelectedType(typeId);
    if (typeId) {
      const filtered = getContactsByType(typeId);
      setContacts(filtered);
      setTotalContacts(filtered.length);
    } else {
      const result = getPaginatedContacts(currentPage, 12);
      setContacts(result.data);
      setTotalContacts(result.total);
    }
  };

  const getTypeCount = (typeId: string) => {
    return fakeContacts.filter(c => c.types.some(t => t.id === typeId)).length;
  };

  // Filter counts
  const getFilterCount = (tab: string) => {
    switch (tab) {
      case 'status':
        return filters.statusFilters ? Object.keys(filters.statusFilters).length : 0;
      case 'service':
        return filters.serviceFilters ? Object.keys(filters.serviceFilters).length : 0;
      case 'billing':
        return filters.billingFilters ? Object.keys(filters.billingFilters).length : 0;
      default:
        return 0;
    }
  };

  const totalActiveFilters = getFilterCount('status') + getFilterCount('service') + getFilterCount('billing');

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <p className="text-sm text-muted-foreground">Manage your contacts and relationships</p>
        </div>
        
        {/* Filter Tabs and Controls */}
        <div className="border-b">
          <div className="px-6">
            <div className="flex items-center justify-between">
              {/* Left side - Tabs */}
              <Tabs defaultValue="status" className="flex-1">
                <div className="flex items-center gap-4">
                  <TabsList className="h-10">
                    <TabsTrigger value="status">Status</TabsTrigger>
                    <TabsTrigger value="service">Service</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                  </TabsList>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9 h-9 w-64"
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tab Content - Filter Options */}
                <div className="py-3">
                  <TabsContent value="status" className="mt-0">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={filters.status === 'all' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, status: 'all'})}
                      >
                        All
                      </Button>
                      <Button 
                        variant={filters.status === 'active' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, status: 'active'})}
                      >
                        Active
                      </Button>
                      <Button 
                        variant={filters.status === 'inactive' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, status: 'inactive'})}
                      >
                        Inactive
                      </Button>
                      <Button 
                        variant={filters.status === 'archived' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, status: 'archived'})}
                      >
                        Archived
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="service" className="mt-0">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={filters.service === 'all' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, service: 'all'})}
                      >
                        All
                      </Button>
                      <Button 
                        variant={filters.service === 'missed' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, service: 'missed'})}
                      >
                        Missed
                      </Button>
                      <Button 
                        variant={filters.service === 'due_next_week' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, service: 'due_next_week'})}
                      >
                        Due Next Week
                      </Button>
                      <Button 
                        variant={filters.service === 'due_next_month' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, service: 'due_next_month'})}
                      >
                        Due Next Month
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="billing" className="mt-0">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={filters.billing === 'all' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, billing: 'all'})}
                      >
                        All
                      </Button>
                      <Button 
                        variant={filters.billing === 'overdue' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, billing: 'overdue'})}
                      >
                        Overdue
                      </Button>
                      <Button 
                        variant={filters.billing === 'due_next_week' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, billing: 'due_next_week'})}
                      >
                        Due Next Week
                      </Button>
                      <Button 
                        variant={filters.billing === 'due_next_month' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, billing: 'due_next_month'})}
                      >
                        Due Next Month
                      </Button>
                      <Button 
                        variant={filters.billing === 'due_anytime' ? 'default' : 'outline'} 
                        size="sm" 
                        className="h-8"
                        onClick={() => setFilters({...filters, billing: 'due_anytime'})}
                      >
                        Due Anytime
                      </Button>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

              {/* Right side - Action buttons */}
              <div className="flex items-center gap-2 ml-4">
                {/* View Mode */}
                <div className="flex border rounded-md">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-r-none h-9 px-3"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-l-none h-9 px-3"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <div className="h-9 w-px bg-border" />

                {/* Import */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9"
                  onClick={() => navigate('/contacts/import')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                
                {/* Export */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                
                {/* Add Contact */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="h-9 bg-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {contactTypes.map(type => (
                      <DropdownMenuItem
                        key={type.id}
                        onClick={() => handleContactTypeSelect(type.id)}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: type.color }}
                        />
                        New {type.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-9 w-px bg-border" />

                {/* Chat */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                
                {/* Settings */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={() => setDebugMode(!debugMode)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Controls */}
      {debugMode && (
        <div className="bg-yellow-50 px-6 py-2 border-b flex items-center gap-4">
          <span className="text-sm font-medium">Debug Mode:</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setForceEmptyState(!forceEmptyState)}
            className="h-7 text-xs"
          >
            {forceEmptyState ? 'Show Contacts' : 'Force Empty State'}
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ContactTypesSidebar
          contactTypes={contactTypes}
          selectedType={selectedType}
          onTypeSelect={handleTypeFilter}
          getTypeCount={getTypeCount}
          isCollapsed={false}
          onToggleCollapse={() => {}}
          isLoading={isLoading}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-white rounded-lg border animate-pulse" />
              ))}
            </div>
          ) : contacts.length === 0 || forceEmptyState ? (
            <ContactEmptyState
              selectedType={selectedType ? contactTypes.find(t => t.id === selectedType) : undefined}
              onCreateContact={handleCreateContact}
              onImportContacts={() => navigate('/contacts/import')}
            />
          ) : (
            <ContactList
              contacts={contacts}
              viewMode={viewMode}
              onContactClick={(contact) => navigate(`/contacts/${contact.id}`)}
              currentPage={currentPage}
              totalPages={Math.ceil(totalContacts / 12)}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;