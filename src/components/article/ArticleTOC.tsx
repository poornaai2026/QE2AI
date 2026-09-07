import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export const ArticleTOC: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('section-what');

  const items = [
    { id: 'section-what', label: '1. WHAT? (Why it exists)' },
    { id: 'section-how', label: '2. HOW? (Under the hood)' },
    { id: 'section-build', label: '3. BUILD (Implementation)' },
    { id: 'section-fail', label: '4. FAIL (Failure modes)' },
    { id: 'section-test', label: '5. TEST (QE Strategy)' },
    { id: 'section-production', label: '6. PRODUCTION (Scale)' },
    { id: 'section-interview', label: '7. INTERVIEW (Q&A)' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (let i = items.length - 1; i >= 0; i--) {
        const element = document.getElementById(items[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(items[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside style={{ position: 'sticky', top: '5.5rem', width: '260px', flexShrink: 0 }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
          <List size={14} />
          <span>Table of Contents</span>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {items.map(item => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      display: 'block',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-xs)',
                      background: isActive ? 'var(--accent-cyan-subtle)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
