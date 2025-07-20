// src/pages/settings/LOV/AddNewValueModal.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { ColorPicker } from '../../../components/ui/color-picker'; // You may need to create this component

interface AddNewValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: any) => void;
  categoryId: string;
  existingValues: string[];
}

const AddNewValueModal = ({ isOpen, onClose, onSubmit, categoryId, existingValues }: AddNewValueModalProps) => {
  const [formData, setFormData] = useState({
    SubCatName: '',
    DisplayName: '',
    hexcolor: '#40E0D0',
    Sequence_no: '',
    Description: '',
    is_active: true,
    is_deletable: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is changed
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleColorChange = (color: string) => {
    setFormData({ ...formData, hexcolor: color });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.SubCatName) {
      newErrors.SubCatName = 'Name is required';
    } else if (existingValues.includes(formData.SubCatName)) {
      newErrors.SubCatName = 'This name already exists';
    }
    
    if (!formData.DisplayName) {
      newErrors.DisplayName = 'Display Name is required';
    }
    
    if (!formData.Sequence_no) {
      newErrors.Sequence_no = 'Sequence number is required';
    } else if (isNaN(Number(formData.Sequence_no))) {
      newErrors.Sequence_no = 'Sequence must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit({
      ...formData,
      Sequence_no: Number(formData.Sequence_no),
      category_id: categoryId
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Value</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="SubCatName">Name</Label>
              <Input
                id="SubCatName"
                name="SubCatName"
                value={formData.SubCatName}
                onChange={handleChange}
                className={errors.SubCatName ? "border-red-500" : ""}
              />
              {errors.SubCatName && (
                <p className="text-sm text-red-500">{errors.SubCatName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="DisplayName">Display Name</Label>
              <Input
                id="DisplayName"
                name="DisplayName"
                value={formData.DisplayName}
                onChange={handleChange}
                className={errors.DisplayName ? "border-red-500" : ""}
              />
              {errors.DisplayName && (
                <p className="text-sm text-red-500">{errors.DisplayName}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hexcolor">Color</Label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: formData.hexcolor }}></div>
                <Input
                  id="hexcolor"
                  name="hexcolor"
                  value={formData.hexcolor}
                  onChange={handleChange}
                  type="text"
                />
                {/* If you have a color picker component, use it here */}
                {/* <ColorPicker color={formData.hexcolor} onChange={handleColorChange} /> */}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="Sequence_no">Sequence</Label>
              <Input
                id="Sequence_no"
                name="Sequence_no"
                value={formData.Sequence_no}
                onChange={handleChange}
                type="number"
                className={errors.Sequence_no ? "border-red-500" : ""}
              />
              {errors.Sequence_no && (
                <p className="text-sm text-red-500">{errors.Sequence_no}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="Description">Description</Label>
            <Textarea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Value
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewValueModal;