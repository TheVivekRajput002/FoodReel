import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockData } from '../../hooks/useMockData';
import TopBar from '../../components/TopBar';
import Avatar from '../../components/Avatar';
import MessageBubble from '../../components/MessageBubble';

export default function ChatThread() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { data, loading, error } = useMockData('messages');
    
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // Load initial messages from mock data once it's available
    useEffect(() => {
        if (data && data.threads[conversationId]) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMessages(data.threads[conversationId]);
        }
    }, [data, conversationId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading chat...</div>;
    if (error) return <div className="p-8 text-[var(--color-danger)] text-center">Error loading chat</div>;

    const conversationDetails = data?.conversations.find(c => c.id === conversationId);
    if (!conversationDetails) return <div className="p-8 text-center text-[var(--color-text-muted)]">Chat not found</div>;

    const partner = conversationDetails.partner;

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsgObj = {
            id: `msg_tmp_${Date.now()}`,
            text: newMessage,
            isOwn: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            seen: false
        };

        setMessages([...messages, newMsgObj]);
        setNewMessage('');
    };

    const headerContent = (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/partner/${partner.id}`)}>
            <Avatar src={partner.avatar} size="sm" online={partner.isOnline} />
            <div className="flex flex-col">
                <span className="font-bold text-sm text-[var(--color-text-primary)] leading-tight">{partner.name}</span>
                <span className="text-[10px] text-[var(--color-text-muted)] leading-tight">
                    {partner.isOnline ? 'Active now' : 'Offline'}
                </span>
            </div>
        </div>
    );

    const videoCallIcon = (
        <button className="p-2 text-[var(--color-primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        </button>
    );

    return (
        <div className="flex flex-col h-[100dvh] bg-[var(--color-bg)] w-full">
            <TopBar title={headerContent} showBack={true} rightElement={videoCallIcon} />

            {/* Conversation Messages */}
            <main className="flex-1 overflow-y-auto p-4 flex flex-col hide-scrollbar">
                {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        // Only show timestamp if it differs from previous message or is the last message
                        const prevMsg = index > 0 ? messages[index - 1] : null;
                        const showTime = !prevMsg || prevMsg.timestamp !== msg.timestamp || index === messages.length - 1;
                        
                        return (
                            <MessageBubble 
                                key={msg.id}
                                text={msg.text}
                                isOwn={msg.isOwn}
                                seen={msg.seen}
                                timestamp={showTime ? msg.timestamp : ''}
                            />
                        );
                    })
                ) : (
                    <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)] text-sm">
                        Start a conversation with {partner.name}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Quick Emoji Bar */}
            <div className="px-2 py-2 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                {['🍕', '🔥', '😍', '👨‍🍳', '👍', '💖', '🤤'].map(emoji => (
                    <button 
                        key={emoji}
                        onClick={() => setNewMessage(prev => prev + emoji)}
                        className="text-2xl hover:scale-125 transition-transform px-2"
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[var(--color-surface)] flex gap-2 items-center">
                <button type="button" className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                />
                <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className={`p-2 rounded-full transition-colors ${
                        newMessage.trim() 
                        ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] cursor-pointer' 
                        : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] cursor-not-allowed'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
