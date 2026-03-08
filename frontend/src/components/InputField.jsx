import React from 'react';

export default function InputField({
    label,
    placeholder,
    type = 'text',
    error,
    icon,
    value,
    onChange,
    name,
    required = false
}) {
    return (
        <div className="w-full mb-4">
            {label && (
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    {label} {required && <span className="text-[var(--color-danger)]">*</span>}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && (
                    <div className="absolute left-3 text-[var(--color-text-muted)] flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    className={`
                        w-full bg-[var(--color-surface-2)] text-[var(--color-text-primary)] 
                        border rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 transition-all
                        ${icon ? 'pl-10' : ''}
                        ${error 
                            ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' 
                            : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20'
                        }
                    `}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-[var(--color-danger)] animate-pulse" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
