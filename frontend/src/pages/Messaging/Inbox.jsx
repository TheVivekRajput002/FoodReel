import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../hooks/useMockData';
import TopBar from '../../components/TopBar';
import ConversationRow from '../../components/ConversationRow';
import InputField from '../../components/InputField';

export default function Inbox() {
    const { data, loading, error } = useMockData('messages');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    if (loading) return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading messages...</div>;
    if (error) return <div className="p-8 text-[var(--color-danger)] text-center">Error: {error.message}</div>;

    const conversations = data?.conversations || [];
    
    const filteredConversations = conversations.filter(conv => 
        conv.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const composeIcon = (
        <button className="p-2 text-[var(--color-primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        </button>
    );

    const searchIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );

    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-bg)] w-full">
            <TopBar title="Messages" showBack={true} rightElement={composeIcon} />
            
            <div className="px-4 pt-4">
                <InputField 
                    placeholder="Search messages..." 
                    icon={searchIcon}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <main className="flex-1 overflow-y-auto px-4 pb-4">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map(conv => (
                        <ConversationRow 
                            key={conv.id}
                            avatar={conv.partner.avatar}
                            name={conv.partner.name}
                            lastMessage={conv.lastMessage}
                            time={conv.time}
                            unreadCount={conv.unreadCount}
                            isOnline={conv.partner.isOnline}
                            onClick={() => navigate(`/messages/${conv.id}`)}
                        />
                    ))
                ) : (
                    <div className="text-center mt-10 text-[var(--color-text-muted)]">
                        No conversations found.
                    </div>
                )}
            </main>
        </div>
    );
}
