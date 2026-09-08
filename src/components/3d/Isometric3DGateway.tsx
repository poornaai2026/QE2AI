import React, { useState } from 'react';
import { ShieldCheck, Cpu, GitMerge, CheckCircle, Zap } from 'lucide-react';

export const Isometric3DGateway: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const stages = [
    {
      id: 0,
      title: '01. Traditional QA Layer',
      subtitle: 'Deterministic Assertions & Locators',
      icon: <ShieldCheck size={20} />,
      badge: 'Input Stream',
      points: ['Pytest / Playwright Suites', 'DOM Selectors & XPath', 'Static Test Matrices', 'Regression CI Runs'],
      color: '#71717a',
    },
    {
      id: 1,
      title: '02. QE2AI Neural Bridge',
      subtitle: 'Model Context Protocol & LangGraph',
      icon: <Cpu size={20} />,
      badge: 'Agentic Core',
      points: ['FastMCP Tool Protocol', 'Cyclic Reflection Loops', 'ChromaDB PRD Embeddings', 'Instructor Typed JSON'],
      color: '#000000',
    },
    {
      id: 2,
      title: '03. Evaluated AI Production',
      subtitle: 'Ragas Quality Gates & Guardrails',
      icon: <GitMerge size={20} />,
      badge: 'Production Gate',
      points: ['Faithfulness Score >= 0.90', 'Self-Healing Locator Repair', 'Redis Semantic Caching', 'Cloud Run Auto-Deploy'],
      color: '#16a34a',
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 15, y: y * -15 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        perspective: '1400px',
        padding: '2rem 1rem',
        position: 'relative',
      }}
    >
      {/* 3D Stage Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(stage.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: `1px solid ${activeStage === stage.id ? '#000000' : 'rgba(0,0,0,0.1)'}`,
              background: activeStage === stage.id ? '#000000' : '#ffffff',
              color: activeStage === stage.id ? '#ffffff' : '#71717a',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            {activeStage === stage.id && <Zap size={14} style={{ color: '#22c55e' }} />}
            <span>{stage.title}</span>
          </button>
        ))}
      </div>

      {/* 3D Isometric Stack Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${10 + mouseOffset.y}deg) rotateY(${-12 + mouseOffset.x}deg) rotateZ(2deg)`,
          transition: 'transform 0.2s ease-out',
          maxWidth: '1080px',
          margin: '0 auto',
        }}
      >
        {stages.map((stage) => {
          const isSelected = activeStage === stage.id;
          const zDepth = isSelected ? 45 : 0;

          return (
            <div
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              style={{
                transform: `translateZ(${zDepth}px) scale(${isSelected ? 1.04 : 0.98})`,
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                background: '#ffffff',
                border: `2px solid ${isSelected ? '#000000' : 'rgba(0, 0, 0, 0.12)'}`,
                borderRadius: '12px',
                padding: '1.75rem',
                boxShadow: isSelected
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {/* Top Accent Ribbon */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: isSelected ? '#000000' : 'rgba(0,0,0,0.05)',
                    color: isSelected ? '#ffffff' : '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stage.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    background: isSelected ? '#22c55e' : 'rgba(0,0,0,0.06)',
                    color: isSelected ? '#ffffff' : '#71717a',
                  }}
                >
                  {stage.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem', color: '#000000' }}>
                {stage.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '1.25rem' }}>
                {stage.subtitle}
              </p>

              {/* Feature Checkpoints */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {stage.points.map((pt, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.82rem',
                      color: isSelected ? '#000000' : '#52525b',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <CheckCircle
                      size={14}
                      style={{
                        color: isSelected ? '#16a34a' : '#a1a1aa',
                        flexShrink: 0,
                      }}
                    />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
