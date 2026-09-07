import React, { useState } from 'react';
import { Calculator, Sparkles } from 'lucide-react';

interface ModelPricing {
  name: string;
  provider: string;
  inputPer1M: number;  // USD per 1M input tokens
  outputPer1M: number; // USD per 1M output tokens
}

export const TokenCostCalculator: React.FC = () => {
  const models: ModelPricing[] = [
    { name: 'GPT-4o-mini', provider: 'OpenAI', inputPer1M: 0.15, outputPer1M: 0.60 },
    { name: 'Gemini 1.5 Flash', provider: 'Google', inputPer1M: 0.075, outputPer1M: 0.30 },
    { name: 'GPT-4o', provider: 'OpenAI', inputPer1M: 2.50, outputPer1M: 10.00 },
    { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputPer1M: 3.00, outputPer1M: 15.00 },
    { name: 'Gemini 1.5 Pro', provider: 'Google', inputPer1M: 1.25, outputPer1M: 5.00 }
  ];

  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const [inputTokensPerRun, setInputTokensPerRun] = useState<number>(1200);
  const [outputTokensPerRun, setOutputTokensPerRun] = useState<number>(400);
  const [testCasesCount, setTestCasesCount] = useState<number>(100);
  const [ciRunsPerMonth, setCiRunsPerMonth] = useState<number>(30);

  const model = models[selectedModelIndex];

  // Calculations
  const costPerSingleTest = 
    (inputTokensPerRun / 1_000_000) * model.inputPer1M + 
    (outputTokensPerRun / 1_000_000) * model.outputPer1M;

  const costPerTestSuite = costPerSingleTest * testCasesCount;
  const monthlyCost = costPerTestSuite * ciRunsPerMonth;

  return (
    <div className="card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-cyan-subtle)', color: 'var(--accent-cyan)' }}>
          <Calculator size={20} />
        </div>
        <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
          Interactive AI Test Suite Token & Cost Estimator
        </h3>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
        Calculate exact API costs for running automated LLM evaluations and AI test case generation across different foundation models in CI/CD.
      </p>

      {/* Inputs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Model Selector */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Model Selection
          </label>
          <select
            value={selectedModelIndex}
            onChange={e => setSelectedModelIndex(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
          >
            {models.map((m, idx) => (
              <option key={m.name} value={idx}>
                {m.name} ({m.provider}) - ${m.inputPer1M}/M in, ${m.outputPer1M}/M out
              </option>
            ))}
          </select>
        </div>

        {/* Avg Input Tokens per Test */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Avg Prompt Input Tokens
          </label>
          <input
            type="number"
            min={100}
            step={100}
            value={inputTokensPerRun}
            onChange={e => setInputTokensPerRun(Math.max(0, Number(e.target.value)))}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
          />
        </div>

        {/* Avg Output Tokens per Test */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Avg Output Tokens Generated
          </label>
          <input
            type="number"
            min={50}
            step={50}
            value={outputTokensPerRun}
            onChange={e => setOutputTokensPerRun(Math.max(0, Number(e.target.value)))}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
          />
        </div>

        {/* Test Cases Count */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Test Cases in Suite
          </label>
          <input
            type="number"
            min={10}
            step={10}
            value={testCasesCount}
            onChange={e => setTestCasesCount(Math.max(1, Number(e.target.value)))}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
          />
        </div>

        {/* CI Runs per Month */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            CI/CD Runs per Month
          </label>
          <input
            type="number"
            min={1}
            step={5}
            value={ciRunsPerMonth}
            onChange={e => setCiRunsPerMonth(Math.max(1, Number(e.target.value)))}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Calculated Results Summary Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        padding: '1.5rem',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Cost per Single Test Case
          </div>
          <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
            ${costPerSingleTest.toFixed(5)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Cost per Test Suite Run ({testCasesCount} tests)
          </div>
          <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            ${costPerTestSuite.toFixed(3)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Estimated Monthly CI/CD Bill ({ciRunsPerMonth} runs)
          </div>
          <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            ${monthlyCost.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <Sparkles size={13} style={{ color: 'var(--accent-cyan)' }} />
        <span><strong>Pro Tip for QA Engineers:</strong> Using lightweight models like GPT-4o-mini or Gemini Flash for automated evaluation suites cuts monthly test costs by ~90% while maintaining 94%+ judge agreement.</span>
      </div>
    </div>
  );
};
