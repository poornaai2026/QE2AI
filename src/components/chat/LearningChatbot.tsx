import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  RotateCcw, 
  Minus, 
  ArrowUpRight, 
  ExternalLink,
  Bot,
  BookOpen,
  HelpCircle,
  Layers,
  ShieldCheck,
  Tv
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  type ChatMessage, 
  type ChatLinkAction, 
  INITIAL_BOT_MESSAGE, 
  generateBotResponse 
} from '../../utils/chatbotEngine';

export const LearningChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(1);
  const [hasOpenedOnce, setHasOpenedOnce] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setUnreadCount(0);
      setHasOpenedOnce(true);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Natural simulated conversational response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_BOT_MESSAGE]);
    setInputQuery('');
    setIsTyping(false);
  };

  const handleLinkClick = (link: ChatLinkAction) => {
    if (link.url.startsWith('http')) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link.url);
      // On mobile screens, close or minimize chat on navigation
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    }
  };

  const getLinkIcon = (category: ChatLinkAction['category']) => {
    switch (category) {
      case 'project': return <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />;
      case 'interview': return <HelpCircle size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />;
      case 'roadmap': return <Layers size={14} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />;
      case 'article': return <BookOpen size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />;
      case 'resource': return <Tv size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />;
      default: return <ExternalLink size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />;
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 90 }}>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Learning Assistant Chatbot"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.75rem 1.15rem',
              background: 'var(--accent-primary)',
              color: 'var(--accent-primary-text)',
              border: '1px solid var(--border-strong)',
              borderRadius: '9999px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.45)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.45)';
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} />
              {unreadCount > 0 && !hasOpenedOnce && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  width: '9px',
                  height: '9px',
                  background: '#10b981',
                  borderRadius: '50%',
                  border: '2px solid var(--bg-primary)'
                }} />
              )}
            </div>
            <span>Learning Assistant</span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.15rem 0.4rem',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '9999px',
              letterSpacing: '0.04em'
            }}>
              AI
            </span>
          </button>
        </div>
      )}

      {/* Expandable Chatbot Window */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: isMinimized ? '1.5rem' : '1.5rem',
            right: '1.5rem',
            width: 'calc(100vw - 3rem)',
            maxWidth: '420px',
            height: isMinimized ? 'auto' : '600px',
            maxHeight: 'calc(100vh - 5rem)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75)',
            zIndex: 95,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.15rem',
              background: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '1.85rem',
                height: '1.85rem',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--accent-primary)',
                color: 'var(--accent-primary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                <Bot size={15} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  QE2AI Assistant
                  <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Ask what to learn & explore
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <button 
                onClick={handleResetChat} 
                className="icon-btn" 
                title="Reset conversation"
                style={{ width: '1.75rem', height: '1.75rem', padding: 0 }}
              >
                <RotateCcw size={13} />
              </button>
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="icon-btn" 
                title={isMinimized ? "Maximize" : "Minimize"}
                style={{ width: '1.75rem', height: '1.75rem', padding: 0 }}
              >
                <Minus size={13} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="icon-btn" 
                title="Close chat"
                style={{ width: '1.75rem', height: '1.75rem', padding: 0 }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Stream */}
              <div 
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  background: 'var(--bg-secondary)'
                }}
              >
                {messages.map(msg => (
                  <div 
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      maxWidth: '88%'
                    }}>
                      {msg.sender === 'bot' && (
                        <div style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          borderRadius: '50%',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '2px',
                          flexShrink: 0
                        }}>
                          <Bot size={11} style={{ color: 'var(--text-primary)' }} />
                        </div>
                      )}

                      <div style={{
                        padding: '0.75rem 0.95rem',
                        borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                        color: msg.sender === 'user' ? 'var(--accent-primary-text)' : 'var(--text-primary)',
                        border: '1px solid',
                        borderColor: msg.sender === 'user' ? 'transparent' : 'var(--border-subtle)',
                        fontSize: '0.815rem',
                        lineHeight: '1.5',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-line'
                      }}>
                        {msg.text}
                      </div>
                    </div>

                    {/* Action Link Cards in Bot Message */}
                    {msg.links && msg.links.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        width: '100%',
                        maxWidth: '88%',
                        paddingLeft: msg.sender === 'bot' ? '2rem' : '0'
                      }}>
                        {msg.links.map((link, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleLinkClick(link)}
                            style={{
                              padding: '0.55rem 0.75rem',
                              background: 'var(--bg-primary)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-xs)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.5rem',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = 'var(--border-strong)';
                              e.currentTarget.style.transform = 'translateX(2px)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = 'var(--border-subtle)';
                              e.currentTarget.style.transform = 'none';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', overflow: 'hidden' }}>
                              <div style={{ marginTop: '2px' }}>{getLinkIcon(link.category)}</div>
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {link.title}
                                </div>
                                {link.description && (
                                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {link.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <ArrowUpRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestion Follow-up Chips (Only for latest bot message) */}
                    {msg.sender === 'bot' && msg.suggestions && msg === messages[messages.length - 1] && !isTyping && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.35rem',
                        paddingLeft: '2rem',
                        marginTop: '0.25rem'
                      }}>
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            style={{
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.72rem',
                              fontWeight: 500,
                              background: 'var(--bg-tertiary)',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '9999px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              textAlign: 'left'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = 'var(--border-strong)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = 'var(--border-subtle)';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            💬 {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Bot size={11} style={{ color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '12px 12px 12px 2px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span className="typing-dot" style={{ width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'bounce 1s infinite 0.1s' }} />
                      <span className="typing-dot" style={{ width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                      <span className="typing-dot" style={{ width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'bounce 1s infinite 0.3s' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Field */}
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-primary)',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask what to learn (e.g. LangGraph, RAG, Playwright)..."
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  aria-label="Send message"
                  style={{
                    width: '2.1rem',
                    height: '2.1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: inputQuery.trim() && !isTyping ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: inputQuery.trim() && !isTyping ? 'var(--accent-primary-text)' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputQuery.trim() && !isTyping ? 'pointer' : 'default',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Send size={13} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
