// src/pages/settings/LOV/index.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from "../../../context/AuthContext";

import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { masterdataService, CategoryMaster, CategoryDetail } from '@/services/masterdata';
import * as Sentry from "@sentry/react";

interface DetailFormData {
  SubCatName: string;
  DisplayName: string;
  hexcolor: string;
  Sequence_no: number | null;
  Description: string;
}

const ListOfValuesPage = () => {
    console.log("LOV page component rendering");

  const navigate = useNavigate();
const { user, currentcurrentcurrentTenant } = useAuth();
  const { currentTheme } = useTheme();
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
    hexcolor: '',
    Sequence_no: null,
    Description: ''
  });
  const [editedValues, setEditedValues] = useState<Record<string, Partial<CategoryDetail>>>({});
  const [isProcessing, setIsProcessing] = useState(false);

 

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user || !currentcurrentTenant?.id) return;

      try {
        setLoading(true);
        const data = await masterdataService.getCategories(user, currentcurrentTenant.id);
        setCategories(data);
        
        // Select first category by default
        if (data.length > 0 && !selectedCategory) {
          setSelectedCategory(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        Sentry.captureException(error);
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
  }, [user, currentcurrentTenant?.id, toast]);

  // Fetch category details when category changes
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!user || !currentcurrentTenant?.id || !selectedCategory) return;

      try {
        const data = await masterdataService.getCategoryDetails(
          user,
          selectedCategory,
          currentcurrentTenant.id
        );
        setCategoryDetails(data);
      } catch (error) {
        console.error('Error fetching category details:', error);
        Sentry.captureException(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load category details"
        });
      }
    };

    fetchCategoryDetails();
  }, [user, currentcurrentTenant?.id, selectedCategory, toast]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsAdding(false);  // Clear add form
    setEditingId(null);  // Exit edit mode
    try {
      analyticsService.trackWorkspaceEvent('category_selected', {
        category_id: categoryId,
        currentcurrentTenant_id: currentcurrentTenant?.id
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const validateDuplicates = (name: string, displayName: string, excludeId?: string): boolean => {
    return categoryDetails.some(detail => 
      detail.id !== excludeId && (
        detail.SubCatName.toLowerCase() === name.toLowerCase() ||
        detail.DisplayName.toLowerCase() === displayName.toLowerCase()
      )
    );
  };

  const handleAddClick = async () => {
    if (!user || !currentcurrentTenant?.id) return;

    try {
      const nextSequence = await masterdataService.getNextSequenceNumber(
        user,
        selectedCategory!,
        currentcurrentTenant.id
      );

      setNewDetail(prev => ({
        ...prev,
        Sequence_no: nextSequence
      }));
      setIsAdding(true);
    } catch (error) {
      console.error('Error preparing new detail:', error);
      Sentry.captureException(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to prepare new entry"
      });
    }
  };

  const handleSaveNew = async () => {
    if (!user || !currentcurrentTenant?.id || !selectedCategory) return;
    
    // Validate inputs
    if (!newDetail.SubCatName || !newDetail.DisplayName) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name and Display Name are required fields"
      });
      return;
    }
    
    // Check for duplicates
    if (validateDuplicates(newDetail.SubCatName, newDetail.DisplayName)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "A value with this name or display name already exists"
      });
      return;
    }
    
    setIsProcessing(true);

    try {
      const detail = await masterdataService.addCategoryDetail(user, {
        ...newDetail,
        category_id: selectedCategory,
        currentcurrentTenantid: currentcurrentTenant.id,
        is_active: true,
        is_deletable: true,
        tags: null,
        tool_tip: null,
        icon_name: null
      });

      // Immediately clear the form data
      const resetDetail = {
        SubCatName: '',
        DisplayName: '',
        hexcolor: '',
        Sequence_no: null,
        Description: ''
      };
      setNewDetail(resetDetail);
      setIsAdding(false);

      // Update the list
      setCategoryDetails(prev => [...prev, detail]);
      
      toast({
        title: "Success",
        description: "New value added successfully"
      });
    } catch (error) {
      console.error('Error adding new detail:', error);
      Sentry.captureException(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add new value"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAdd = () => {
    const resetDetail = {
      SubCatName: '',
      DisplayName: '',
      hexcolor: '',
      Sequence_no: null,
      Description: ''
    };
    setNewDetail(resetDetail);
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

  const handleCancelEdit = (id: string) => {
    setEditingId(null);
    // Remove any saved edits
    setEditedValues(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSaveEdit = async (id: string) => {
    if (!user || !currentcurrentTenant?.id) return;
    
    // Validate inputs
    const updates = editedValues[id];
    if (!updates) return;
    
    if ((updates.SubCatName !== undefined && updates.SubCatName === '') || 
        (updates.DisplayName !== undefined && updates.DisplayName === '')) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name and Display Name are required fields"
      });
      return;
    }
    
    // Check for duplicates if name or display name changed
    if ((updates.SubCatName || updates.DisplayName) && 
        validateDuplicates(
          updates.SubCatName || categoryDetails.find(d => d.id === id)!.SubCatName,
          updates.DisplayName || categoryDetails.find(d => d.id === id)!.DisplayName,
          id
        )) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "A value with this name or display name already exists"
      });
      return;
    }
    
    setIsProcessing(true);

    try {
      const updated = await masterdataService.updateCategoryDetail(user, id, {
        ...updates,
        currentcurrentTenantid: currentcurrentTenant.id
      });

      setCategoryDetails(prev => prev.map(d => d.id === id ? updated : d));
      setEditingId(null);
      setEditedValues(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      
      toast({
        title: "Success",
        description: "Value updated successfully"
      });
    } catch (error) {
      console.error('Error updating detail:', error);
      Sentry.captureException(error);
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
    if (!user || !currentcurrentTenant?.id) return;
    setIsProcessing(true);

    try {
      const result = await masterdataService.softDeleteCategoryDetail(user, id, currentcurrentTenant.id);
      
      if (result.success) {
        setCategoryDetails(prev => prev.filter(d => d.id !== id));
        
        toast({
          title: "Success",
          description: "Value deleted successfully"
        });
      } else {
        throw new Error("Delete operation returned false");
      }
    } catch (error) {
      console.error('Error deleting detail:', error);
      Sentry.captureException(error);
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings/configure')}
            className="text-brand-primary hover:text-brand-primary/90"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 
              className="text-2xl font-semibold"
              style={{ color: currentTheme.colors.utility.primaryText }}
            >
              List of Values
            </h1>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.utility.secondaryText }}
            >
              Manage your custom values and categories
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-brand-primary hover:text-brand-primary/90"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Vertical Tabs */}
        <div className="w-64 shrink-0">
          <div 
            className="flex flex-col gap-1 p-4 rounded-lg"
            style={{ backgroundColor: currentTheme.colors.utility.secondaryBackground }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "px-4 py-2 text-left rounded-lg transition-colors",
                  selectedCategory === category.id
                    ? "bg-brand-primary text-white"
                    : "hover:bg-gray-100"
                )}
                style={selectedCategory !== category.id ? { 
                  color: currentTheme.colors.utility.primaryText 
                } : undefined}
              >
                {category.DisplayName}
              </button>
            ))}
          </div>
        </div>

        {/* Details Area */}
        <div className="flex-1">
          {selectedCategory && (
            <div className="space-y-6">
              {/* Headers */}
              <div 
                className="grid grid-cols-5 gap-4 px-4 py-2 rounded-t-lg"
                style={{ backgroundColor: currentTheme.colors.utility.secondaryBackground }}
              >
                <div className="font-medium">Name</div>
                <div className="font-medium">Display Name</div>
                <div className="font-medium">Color</div>
                <div className="font-medium">Sequence</div>
                <div className="font-medium">Description</div>
              </div>

              {/* Details List */}
              <div className="space-y-4">
                {categoryDetails.map((detail) => (
                  <div
                    key={detail.id}
                    className="grid grid-cols-5 gap-4 px-4 py-3 bg-white rounded-lg shadow-sm items-center"
                  >
                    {editingId === detail.id ? (
                      <>
                        <Input
                          value={editedValues[detail.id]?.SubCatName ?? detail.SubCatName}
                          onChange={(e) => handleInputChange(detail.id, 'SubCatName', e.target.value)}
                          disabled={!detail.is_deletable}
                        />
                        <Input
                          value={editedValues[detail.id]?.DisplayName ?? detail.DisplayName}
                          onChange={(e) => handleInputChange(detail.id, 'DisplayName', e.target.value)}
                        />
                        <Input
                          type="color"
                          value={editedValues[detail.id]?.hexcolor ?? detail.hexcolor ?? '#000000'}
                          onChange={(e) => handleInputChange(detail.id, 'hexcolor', e.target.value)}
                        />
                        <Input
                          type="number"
                          value={editedValues[detail.id]?.Sequence_no ?? detail.Sequence_no ?? ''}
                          onChange={(e) => handleInputChange(detail.id, 'Sequence_no', 
                            e.target.value ? parseInt(e.target.value) : null
                          )}
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            value={editedValues[detail.id]?.Description ?? detail.Description ?? ''}
                            onChange={(e) => handleInputChange(detail.id, 'Description', e.target.value)}
                            maxLength={100}
                          />
                          <Button
                            variant="ghost"
                            onClick={() => handleCancelEdit(detail.id)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => handleSaveEdit(detail.id)}
                            className="bg-brand-primary text-white hover:bg-brand-primary/90"
                            disabled={isProcessing}
                          >
                            Save
                          </Button>
                        </div>
                      </>
                    ) : (
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
                          <span className="truncate">{detail.Description}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingId(detail.id)}
                              className="text-brand-primary hover:text-brand-primary/90"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {detail.is_deletable && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(detail.id)}
                                className="text-semantic-error hover:text-semantic-error/90"
                                disabled={isProcessing}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Add New Form */}
                {isAdding && (
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-white rounded-lg shadow-sm items-center">
                    <Input
                      placeholder="Name"
                      value={newDetail.SubCatName}
                      onChange={(e) => setNewDetail(prev => ({ ...prev, SubCatName: e.target.value }))}
                    />
                    <Input
                      placeholder="Display Name"
                      value={newDetail.DisplayName}
                      onChange={(e) => setNewDetail(prev => ({ ...prev, DisplayName: e.target.value }))}
                    />
                    <Input
                      type="color"
                      value={newDetail.hexcolor || '#000000'}
                      onChange={(e) => setNewDetail(prev => ({ ...prev, hexcolor: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Sequence"
                      value={newDetail.Sequence_no || ''}
                      onChange={(e) => setNewDetail(prev => ({ 
                        ...prev, 
                        Sequence_no: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Description"
                        value={newDetail.Description}
                        onChange={(e) => setNewDetail(prev => ({ ...prev, Description: e.target.value }))}
                        maxLength={100}
                      />
                      <Button
                        variant="ghost"
                        onClick={handleCancelAdd}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleSaveNew}
                        className="bg-brand-primary text-white hover:bg-brand-primary/90"
                        disabled={isProcessing}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Button */}
              {!isAdding && (
                <Button
                  onClick={handleAddClick}
                  className="mt-4 bg-brand-primary text-white hover:bg-brand-primary/90"
                  disabled={isProcessing}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Value
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListOfValuesPage;