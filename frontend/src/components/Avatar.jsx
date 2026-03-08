import React from 'react';

export default function Avatar({ 
    src, 
    size = 'md', 
    online = false, 
    story = false,
    className = ''
}) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`
                ${sizeClasses[size]}
                rounded-full overflow-hidden
                ${story ? 'p-[2px] bg-gradient-to-tr from-[#F4A261] to-[#FF6B35]' : ''}
            `}>
                <div className="w-full h-full rounded-full border-2 border-[var(--color-bg)] overflow-hidden bg-gray-200">
                    {src ? (
                        <img 
                            src={src} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                             <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
            
            {online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--color-bg)] rounded-full"></span>
            )}
        </div>
    );
}
