import React from 'react'
import { Controller } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '../ui/label'

function SelectField({ name, placeholder, label, control, error, required = false, options }: SelectFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="form-label">
                {label}
            </Label>
           <Controller
                name={name}
                control={control}
                rules={{ required: required ? `please select ${label.toLowerCase()} ` : false }}
                render={({ field }) => (
                    
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="select-trigger w-full">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent className='bg-gray-800 border-gray-600 text-white'>
                            <SelectGroup>
                                {options.map((option)=>(
                                    
                                    <SelectItem value={option.value} key={option.value} className='focus:bg-gray-600 focus:text-white'>{option.value}</SelectItem>
                                ))}
                                

                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            />
           
        </div>
    )
}

export default SelectField
