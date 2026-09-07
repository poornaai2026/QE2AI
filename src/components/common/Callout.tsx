import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'danger' | 'qe' | 'success';
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  title,
  children
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />;
      case 'danger':
        return <AlertCircle size={18} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />;
      case 'qe':
        return <Sparkles size={18} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />;
      case 'success':
        return <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />;
      case 'info':
      default:
        return <Info size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />;
    }
  };

  const defaultTitles = {
    info: 'Key Concept',
    warning: 'Potential Pitfall',
    danger: 'Critical Failure Mode',
    qe: 'QE Perspective',
    success: 'Best Practice'
  };

  return (
    <div className={`callout callout-${type}`}>
      {getIcon()}
      <div style={{ flex: 1 }}>
        <div className="callout-title">{title || defaultTitles[type]}</div>
        <div className="callout-content">{children}</div>
      </div>
    </div>
  );
};
