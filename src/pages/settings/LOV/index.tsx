// src/pages/settings/LOV/index.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/ServiceURLs';
import { analyticsService } from '@/services/analytics.service';
import { captureException } from '@/utils/sentry';

// Define interfaces for the component
interface CategoryMaster {
  id: string;
  CategoryName: string;
  DisplayName: string;
  is_active: boolean;
  Description: string | null;
  icon_name: string | null;
  order_sequence: number | null;
  tenantid: string;
  created_at: string;
}

interface CategoryDetail {
  id: string;
  SubCatName: string;
  DisplayName: string;
  category_id: string;
  hexcolor: string | null;
  icon_name: string | null;
  tags: string[] | null;
  tool_tip: string | null;
  is_active: boolean;
  Sequence_no: number | null;
  Description: string | null;
  tenantid: string;
  is_deletable: boolean;
  form_settings: any | null;
  created_at: string;
}

interface DetailFormData {
  SubCatName: string;
  DisplayName: string;
  hexcolor: string;
  Sequence_no: number | null;
  Description: string;
}

const ListOfValuesPage = () => {
  const navigate = useNavigate();
  const { currentTenant } = useAuth();
  const { isDarkMode } = useTheme();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryMaster[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetail[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newDetail, setNewDetail] = useState<DetailFormData>({
    SubCatName: '',
    DisplayName: '',
    hexcolor: '#40E0D0',
    Sequence_no: null,
    Description: ''
  });
  const [editedValues, setEditedValues] = useState<Record<string, Partial<CategoryDetail>>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('settings/configure/lovs', 'List of Values');
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!currentTenant?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching categories for tenant:", currentTenant.id);
        
        // Call your backend API using the centralized endpoint
        const response = await api.get(
          `${API_ENDPOINTS.MASTERDATA.CATEGORIES}?tenantId=${currentTenant.id}`
        );
        
        const data = response.data;
        console.log("Categories data received:", data);
        setCategories(data);
        
        // Select first category by default
        if (data.length > 0 && !selectedCategory) {
          console.log("Auto-selecting first category:", data[0].id);
          setSelectedCategory(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        captureException(error, {
          tags: { component: 'ListOfValuesPage', action: 'fetchCategories' },
          extra: { tenantId: currentTenant?.id }
        });
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load categories"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentTenant?.id, toast]);

  // Fetch category details when category changes
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!currentTenant?.id || !selectedCategory) return;

      try {
        console.log("Fetching details for category:", selectedCategory);
        
        // Call your backend API using the centralized endpoint
        const response = await api.get(
          `${API_ENDPOINTS.MASTERDATA.CATEGORY_DETAILS}?categoryId=${selectedCategory}&tenantId=${currentTenant.id}`
        );
        
        const data = response.data;
        console.log("Category details received:", data);
        setCategoryDetails(data);

        // Get next sequence number for new items
        const seqResponse = await api.get(
          `${API_ENDPOINTS.MASTERDATA.NEXT_SEQUENCE}?categoryId=${selectedCategory}&tenantId=${currentTenant.id}`
        );
        
        // Update form with next sequence number
        setNewDetail(prev => ({
          ...prev,
          Sequence_no: seqResponse.data.nextSequence
        }));
      } catch (error) {
        console.error('Error fetching category details:', error);
        captureException(error, {
          tags: { component: 'ListOfValuesPage', action: 'fetchCategoryDetails' },
          extra: { categoryId: selectedCategory, tenantId: currentTenant?.id }
        });
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load category details"
        });
      }
    };

    if (selectedCategory) {
      fetchCategoryDetails();
      // Reset add form when category changes
      setIsAdding(false);
    }
  }, [currentTenant?.id, selectedCategory, toast]);

  const handleCategoryChange = (categoryId: string) => {
    console.log("Changing category to:", categoryId);
    setSelectedCategory(categoryId);
    setIsAdding(false);  
    setEditingId(null);
    
    try {
      analyticsService.trackPageView(`settings/configure/lovs/${categoryId}`, 'List of Values - Category Change');
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
    
    try {
      analyticsService.trackPageView('settings/configure/lovs/add', 'List of Values - Add New');
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const handleSaveNew = async () => {
    if (!validateForm() || !currentTenant?.id || !selectedCategory) return;
    
    setIsProcessing(true);
    try {
      const newValue = {
        ...newDetail,
        Sequence_no: Number(newDetail.Sequence_no),
        category_id: selectedCategory,
        tenantid: currentTenant.id,
        is_active: true,
        is_deletable: true,
        tags: null,
        tool_tip: null,
        icon_name: null
      };
      
      const response = await api.post(
        API_ENDPOINTS.MASTERDATA.CATEGORY_DETAILS,
        newValue,
        {
          headers: { 'x-tenant-id': currentTenant.id }
        }
      );
      
      // Add to state
      setCategoryDetails(prev => [...prev, response.data]);
      
      toast({
        title: "Success",
        description: "New value added successfully",
      });
      
      // Reset form and hide it
      setIsAdding(false);
      setNewDetail({
        SubCatName: '',
        DisplayName: '',
        hexcolor: '#40E0D0',
        Sequence_no: null,
        Description: ''
      });
      
      analyticsService.trackPageView('settings/configure/lovs/added', 'List of Values - Added Successfully');
    } catch (error) {
      console.error('Error adding new value:', error);
      captureException(error, {
        tags: { component: 'ListOfValuesPage', action: 'handleSaveNew' },
        extra: { categoryId: selectedCategory, tenantId: currentTenant?.id }
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add new value"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const validateForm = () => {
    // This is a simple validation
    if (!newDetail.SubCatName || !newDetail.DisplayName) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name and Display Name are required fields"
      });
      return false;
    }
    
    // Check for duplicates
    if (categoryDetails.some(d => 
      d.SubCatName.toLowerCase() === newDetail.SubCatName.toLowerCase() || 
      d.DisplayName.toLowerCase() === newDetail.DisplayName.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "A value with this Name or Display Name already exists"
      });
      return false;
    }
    
    return true;
  };

  const handleCancelAdd = () => {
    setNewDetail({
      SubCatName: '',
      DisplayName: '',
      hexcolor: '#40E0D0',
      Sequence_no: null,
      Description: ''
    });
    setIsAdding(false);
  };

  const handleInputChange = (id: string, field: keyof CategoryDetail, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveEdit = async (id: string) => {
    if (!currentTenant?.id) return;
    
    const updates = editedValues[id];
    if (!updates) return;
    
    // Validate
    if ((updates.SubCatName !== undefined && !updates.SubCatName) ||
        (updates.DisplayName !== undefined && !updates.DisplayName)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name and Display Name are required fields"
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      const response = await api.patch(
        `${API_ENDPOINTS.MASTERDATA.CATEGORY_DETAILS}/${id}`,
        {
          ...updates,
          tenantid: currentTenant.id
        },
        {
          headers: { 'x-tenant-id': currentTenant.id }
        }
      );
      
      setCategoryDetails(prev => prev.map(d => d.id === id ? response.data : d));
      setEditingId(null);
      setEditedValues(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      
      toast({
        title: "Success",
        description: "Value updated successfully"
      });
      
      analyticsService.trackPageView('settings/configure/lovs/edited', 'List of Values - Edited Successfully');
    } catch (error) {
      console.error('Error updating detail:', error);
      captureException(error, {
        tags: { component: 'ListOfValuesPage', action: 'handleSaveEdit' },
        extra: { id, categoryId: selectedCategory, tenantId: currentTenant?.id }
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update value"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentTenant?.id) return;
    
    setIsProcessing(true);
    try {
      await api.delete(
        `${API_ENDPOINTS.MASTERDATA.CATEGORY_DETAILS}/${id}?tenantId=${currentTenant.id}`,
        {
          headers: { 'x-tenant-id': currentTenant.id }
        }
      );
      
      setCategoryDetails(prev => prev.filter(d => d.id !== id));
      
      toast({
        title: "Success",
        description: "Value deleted successfully"
      });
      
      analyticsService.trackPageView('settings/configure/lovs/deleted', 'List of Values - Deleted Successfully');
    } catch (error) {
      console.error('Error deleting detail:', error);
      captureException(error, {
        tags: { component: 'ListOfValuesPage', action: 'handleDelete' },
        extra: { id, categoryId: selectedCategory, tenantId: currentTenant?.id }
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete value"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get selected category name
  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.DisplayName || '';

  return (
    <div className="p-6 bg-muted/20">
      {/* Header - Now without white background card as per Image 1 */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/settings/configure')}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            List of Values
          </h1>
          <p className="text-muted-foreground">
            Manage your custom values and categories
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Category list */}
        <div className="w-64 shrink-0">
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            {categories.length > 0 ? (
              categories.map((category, index) => {
                const isSelected = selectedCategory === category.id;
                const isFirst = index === 0;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left border-b border-border last:border-0 transition-colors",
                      isSelected 
                        ? "bg-primary text-primary-foreground font-medium" 
                        : "hover:bg-muted",
                      // Apply special styles for the first item (Lead Type in Image 2)
                      isFirst && !isSelected && "bg-muted/50"
                    )}
                  >
                    {category.DisplayName}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No categories found.
              </div>
            )}
          </div>
        </div>

        {/* Details Area */}
        <div className="flex-1">
          {selectedCategory ? (
            <div>
              {/* Category Title and Add Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {selectedCategoryName}
                </h2>
                {!isAdding && (
                  <Button 
                    onClick={handleAddClick}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isProcessing}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Value
                  </Button>
                )}
              </div>

              {/* Column Headers as in Image 3 */}
              <div className="bg-card rounded-lg shadow-sm border border-border mb-4">
                <div className="grid grid-cols-5 gap-4 px-4 py-3">
                  <div className="font-medium">Name</div>
                  <div className="font-medium">Display Name</div>
                  <div className="font-medium">Color</div>
                  <div className="font-medium">Sequence</div>
                  <div className="font-medium">Description</div>
                </div>
              </div>

              {/* Items List - Each as a separate card as in Image 3 */}
              <div className="space-y-4">
                {/* Existing Items */}
                {categoryDetails.map((detail) => (
                  <div
                    key={detail.id}
                    className="bg-card rounded-lg shadow-sm border border-border"
                  >
                    <div className="grid grid-cols-5 gap-4 px-4 py-3 items-center">
                      {editingId === detail.id ? (
                        // Edit Mode
                        <>
                          <Input
                            value={editedValues[detail.id]?.SubCatName ?? detail.SubCatName}
                            onChange={(e) => handleInputChange(detail.id, 'SubCatName', e.target.value)}
                            disabled={!detail.is_deletable || isProcessing}
                          />
                          <Input
                            value={editedValues[detail.id]?.DisplayName ?? detail.DisplayName}
                            onChange={(e) => handleInputChange(detail.id, 'DisplayName', e.target.value)}
                            disabled={isProcessing}
                          />
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-full" 
                              style={{ backgroundColor: editedValues[detail.id]?.hexcolor ?? detail.hexcolor ?? '#FFFFFF' }}
                            />
                            <Input
                              type="color"
                              value={editedValues[detail.id]?.hexcolor ?? detail.hexcolor ?? '#FFFFFF'}
                              onChange={(e) => handleInputChange(detail.id, 'hexcolor', e.target.value)}
                              disabled={isProcessing}
                              className="w-12 h-8 p-0"
                            />
                          </div>
                          <Input
                            type="number"
                            value={editedValues[detail.id]?.Sequence_no ?? detail.Sequence_no ?? ''}
                            onChange={(e) => handleInputChange(detail.id, 'Sequence_no', 
                              e.target.value ? parseInt(e.target.value) : null
                            )}
                            disabled={isProcessing}
                          />
                          <div className="flex items-center justify-between">
                            <Input
                              value={editedValues[detail.id]?.Description ?? detail.Description ?? ''}
                              onChange={(e) => handleInputChange(detail.id, 'Description', e.target.value)}
                              disabled={isProcessing}
                            />
                            <div className="flex items-center ml-2">
                              <Button
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                                disabled={isProcessing}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleSaveEdit(detail.id)}
                                disabled={isProcessing}
                                className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        // View Mode
                        <>
                          <div>{detail.SubCatName}</div>
                          <div>{detail.DisplayName}</div>
                          <div>
                            {detail.hexcolor && (
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: detail.hexcolor }}
                              />
                            )}
                          </div>
                          <div>{detail.Sequence_no}</div>
                          <div className="flex items-center justify-between">
                            <span className="truncate">
                              {detail.Description}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingId(detail.id)}
                                disabled={isProcessing}
                                className="text-primary hover:text-primary/80"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {detail.is_deletable && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(detail.id)}
                                  disabled={isProcessing}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Form */}
                {isAdding && (
                  <div className="bg-card rounded-lg shadow-sm border-2 border-primary">
                    <div className="grid grid-cols-5 gap-4 px-4 py-3 items-center">
                      <Input
                        placeholder="Name"
                        value={newDetail.SubCatName}
                        onChange={(e) => setNewDetail(prev => ({ ...prev, SubCatName: e.target.value }))}
                        disabled={isProcessing}
                      />
                      <Input
                        placeholder="Display Name"
                        value={newDetail.DisplayName}
                        onChange={(e) => setNewDetail(prev => ({ ...prev, DisplayName: e.target.value }))}
                        disabled={isProcessing}
                      />
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: newDetail.hexcolor || '#FFFFFF' }}
                        />
                        <Input
                          type="color"
                          value={newDetail.hexcolor || '#FFFFFF'}
                          onChange={(e) => setNewDetail(prev => ({ ...prev, hexcolor: e.target.value }))}
                          disabled={isProcessing}
                          className="w-12 h-8 p-0"
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Sequence"
                        value={newDetail.Sequence_no || ''}
                        onChange={(e) => setNewDetail(prev => ({ 
                          ...prev, 
                          Sequence_no: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                        disabled={isProcessing}
                      />
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Description"
                          value={newDetail.Description}
                          onChange={(e) => setNewDetail(prev => ({ ...prev, Description: e.target.value }))}
                          disabled={isProcessing}
                        />
                        <div className="flex items-center ml-2">
                          <Button
                            variant="ghost"
                            onClick={handleCancelAdd}
                            disabled={isProcessing}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveNew}
                            disabled={isProcessing}
                            className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {categoryDetails.length === 0 && !isAdding && (
                  <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
                    <p className="text-muted-foreground">
                      No values found for this category. Click "Add New Value" to create one.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
              <p className="text-muted-foreground">
                Select a category from the left to view its values.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListOfValuesPage;