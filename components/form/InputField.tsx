import React from 'react'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { Label } from '@radix-ui/react-label'

function InputField({ name,label, placeholder, type = "text", disabled, error, validation, value, register }: FormInputProps) {
    return (
        <div className='space-y-2'>
         <Label htmlFor={name} className="form-label">
                {label}
            </Label>
            <Input
                id={name}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                value={value}
                className={cn('form-input', { 'opacity-50  cursor-not-allowed': disabled })}
                {...register(name, validation)}
            />
            {error && <p className='text-sm text-red-500'>{error.message}</p>}

            
        </div   >
    )
}

export default InputField
