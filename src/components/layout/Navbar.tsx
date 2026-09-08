import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  BookOpen, 
  FolderGit2, 
  ShieldCheck, 
  Tv, 
  CheckSquare, 
  User, 
  Sun, 
  Moon, 
  Search, 
  HelpCircle,
  Menu, 
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { GithubIcon } from '../common/Icons';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Tracks', path: '/tracks', icon: BookOpen },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'AI Quality Engineering', path: '/ai-qe', icon: ShieldCheck },
    { name: 'Interview Prep', path: '/interview-prep', icon: HelpCircle },
    { name: 'Free Resources', path: '/resources', icon: Tv },
    { name: 'Progress Tracker', path: '/tracker', icon: CheckSquare },
    { name: 'About Author', path: '/about', icon: User }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          <div style={{
            width: '1.85rem',
            height: '1.85rem',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--accent-primary)',
            color: 'var(--accent-primary-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '0.85rem',
            letterSpacing: '-0.05em'
          }}>
            QE
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>QE<span style={{ opacity: 0.65 }}>2AI</span></span>
          <span className="brand-badge">PRO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav>
          <ul className="nav-links">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-item-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={14} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="nav-actions">
          <button
            onClick={onOpenSearch}
            className="search-trigger-btn"
            aria-label="Search curriculum"
          >
            <Search size={14} />
            <span>Search</span>
            <span className="kbd-shortcut">⌘K</span>
          </button>

          <a
            href="https://github.com/poornaai2026/QE2AI"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            title="View QE2AI on GitHub"
            aria-label="GitHub Repository"
          >
            <GithubIcon size={16} />
          </a>

          <button
            onClick={toggleTheme}
            className="icon-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="icon-btn mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-primary)',
          zIndex: 49,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          overflowY: 'auto'
        }}>
          {/* Mobile Search Button */}
          <button
            onClick={() => {
              closeMobileMenu();
              onOpenSearch();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-default)',
              fontWeight: 500,
              fontSize: 'var(--text-sm)',
              marginBottom: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Search size={16} />
              <span>Search everything...</span>
            </div>
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>⌘K</span>
          </button>

          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                  border: `1px solid ${isActive ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)'
                }}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <a
              href="https://github.com/poornaai2026/QE2AI"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                background: 'var(--accent-primary)',
                color: 'var(--accent-primary-text)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: 'var(--text-sm)'
              }}
            >
              <GithubIcon size={16} />
              <span>View GitHub Repo</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
