import React from 'react';

export default function Button({
    children,
    variant = 'primary', // primary, secondary, ghost, danger
    size = 'md', // sm, md, lg
    disabled = false,
    loading = false,
    onClick,
    className = '',
    type = 'button'
}) {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 active:scale-[0.98] outline-none focus:ring-2 focus:ring-offset-1';
    
    // Variant styles mapping exactly to CSS Custom Properties per PRD
    const variantClasses = {
        primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white focus:ring-[var(--color-primary)]',
        secondary: 'bg-[var(--color-secondary)] hover:bg-[#204d39] text-white focus:ring-[var(--color-secondary)]',
        ghost: 'bg-transparent hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)] focus:ring-[var(--color-border)]',
        danger: 'bg-[var(--color-danger)] hover:bg-red-600 text-white focus:ring-[var(--color-danger)]',
    };

    // Size utility classes
    const sizeClasses = {
        sm: 'py-1.5 px-3 text-xs',
        md: 'py-2 px-4 text-sm',
        lg: 'py-3 px-6 text-base tracking-wide',
    };

    // If disabled or loading, dim opacity and disable pointer
    const stateClasses = (disabled || loading) ? 'opacity-60 cursor-not-allowed active:scale-100' : 'cursor-pointer';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${stateClasses} ${className}`}
        >
            {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
}
