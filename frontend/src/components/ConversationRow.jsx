import React from 'react';
import Avatar from './Avatar';

export default function ConversationRow({
    avatar,
    name,
    lastMessage,
    time,
    unreadCount = 0,
    isOnline = false,
    onClick
}) {
    return (
        <div 
            onClick={onClick}
            className={`flex items-center gap-4 p-4 mb-2 rounded-2xl cursor-pointer transition-all active:scale-[0.98] ${
                unreadCount > 0 
                ? 'bg-[var(--color-surface)] shadow-sm border border-[var(--color-border)]' 
                : 'hover:bg-[var(--color-surface-2)]'
            }`}
        >
            <Avatar src={avatar} size="lg" online={isOnline} />
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${unreadCount > 0 ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                        {name}
                    </h3>
                    <span className={`text-xs whitespace-nowrap ml-2 ${unreadCount > 0 ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-text-muted)]'}`}>
                        {time}
                    </span>
                </div>
                
                <p className={`text-sm truncate ${unreadCount > 0 ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-secondary)]'}`}>
                    {lastMessage}
                </p>
            </div>

            {unreadCount > 0 && (
                <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {unreadCount}
                </div>
            )}
        </div>
    );
}
