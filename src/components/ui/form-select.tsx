import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface FormSelectProps {
  id?: string;
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}

const FormSelect = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  FormSelectProps
>(({ id, name, value, onValueChange, disabled, placeholder, children, ...props }, ref) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled} name={name} {...props}>
      <SelectTrigger ref={ref} id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  );
});

FormSelect.displayName = "FormSelect";

export { FormSelect, SelectItem }; 