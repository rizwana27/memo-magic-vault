
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface NewResourceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewResourceForm = ({ onSubmit, onCancel }: NewResourceFormProps) => {
  const [formData, setFormData] = React.useState({
    full_name: '',
    email_address: '',
    phone_number: '',
    department: '',
    role: '',
    availability: [80],
    active_status: true,
    join_date: undefined as Date | undefined,
  });

  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const availableSkills = ['React', 'Node.js', 'Python', 'Project Management', 'UI/UX Design', 'DevOps', 'Database', 'Mobile Development'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.full_name.trim()) {
      alert('Full name is required');
      return;
    }
    
    if (!formData.email_address.trim()) {
      alert('Email address is required');
      return;
    }
    
    if (!formData.department) {
      alert('Department is required');
      return;
    }
    
    if (!formData.role) {
      alert('Role is required');
      return;
    }

    const submitData = {
      full_name: formData.full_name.trim(),
      email_address: formData.email_address.trim(),
      phone_number: formData.phone_number.trim() || null,
      department: formData.department,
      role: formData.role,
      availability: formData.availability[0],
      active_status: formData.active_status,
      join_date: formData.join_date ? formData.join_date.toISOString().split('T')[0] : null,
      skills: selectedSkills.length > 0 ? selectedSkills : null,
    };

    console.log('Submitting resource data:', submitData);
    onSubmit(submitData);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white text-2xl">Add New Resource</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-gray-300">Full Name *</Label>
            <Input
              id="full_name"
              required
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email_address" className="text-gray-300">Email Address *</Label>
            <Input
              id="email_address"
              type="email"
              required
              value={formData.email_address}
              onChange={(e) => setFormData(prev => ({ ...prev, email_address: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-gray-300">Phone Number</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-gray-300">Department *</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="project-management">Project Management</SelectItem>
                <SelectItem value="qa">Quality Assurance</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-300">Role *</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="senior-developer">Senior Developer</SelectItem>
                <SelectItem value="project-manager">Project Manager</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="qa-engineer">QA Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Join Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white",
                    !formData.join_date && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.join_date ? format(formData.join_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.join_date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, join_date: date }))}
                  initialFocus
                  className="bg-gray-800 border-gray-600"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Skills</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableSkills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={selectedSkills.includes(skill)}
                  onCheckedChange={() => toggleSkill(skill)}
                />
                <Label htmlFor={skill} className="text-sm text-gray-300">{skill}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Availability: {formData.availability[0]}%</Label>
          <Slider
            value={formData.availability}
            onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active_status"
            checked={formData.active_status}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active_status: checked }))}
          />
          <Label htmlFor="active_status" className="text-gray-300">Active Status</Label>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Add Resource
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default NewResourceForm;
