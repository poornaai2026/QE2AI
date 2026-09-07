import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  filename
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={14} style={{ color: 'var(--accent-cyan)' }} />
          {filename ? (
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {filename}
            </span>
          ) : (
            <span className="code-lang-tag">{language}</span>
          )}
        </div>
        <button onClick={handleCopy} className="copy-btn" aria-label="Copy code">
          {copied ? (
            <>
              <Check size={13} style={{ color: 'var(--accent-emerald)' }} />
              <span style={{ color: 'var(--accent-emerald)' }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-content">
        <code>{code}</code>
      </pre>
    </div>
  );
};
