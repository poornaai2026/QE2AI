import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface ModelPricing {
  name: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
}

export const TokenCostCalculator: React.FC = () => {
  const models: ModelPricing[] = [
    { name: 'Gemini 1.5 Flash', provider: 'Google', inputPer1M: 0.075, outputPer1M: 0.30 },
    { name: 'GPT-4o-mini', provider: 'OpenAI', inputPer1M: 0.15, outputPer1M: 0.60 },
    { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputPer1M: 3.00, outputPer1M: 15.00 },
    { name: 'GPT-4o', provider: 'OpenAI', inputPer1M: 2.50, outputPer1M: 10.00 },
    { name: 'Gemini 1.5 Pro', provider: 'Google', inputPer1M: 1.25, outputPer1M: 5.00 }
  ];

  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const [inputTokensPerRun, setInputTokensPerRun] = useState<number>(1200);
  const [outputTokensPerRun, setOutputTokensPerRun] = useState<number>(400);
  const [testCasesCount, setTestCasesCount] = useState<number>(100);
  const [ciRunsPerMonth, setCiRunsPerMonth] = useState<number>(30);

  const model = models[selectedModelIndex];

  const costPerSingleTest = 
    (inputTokensPerRun / 1_000_000) * model.inputPer1M + 
    (outputTokensPerRun / 1_000_000) * model.outputPer1M;

  const costPerTestSuite = costPerSingleTest * testCasesCount;
  const monthlyCost = costPerTestSuite * ciRunsPerMonth;

  return (
    <div className="card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <div style={{
          padding: '0.4rem',
          borderRadius: 'var(--radius-xs)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-strong)',
          color: 'var(--text-primary)'
        }}>
          <Calculator size={18} />
        </div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
          Interactive AI Test Suite Token & Cost Estimator
        </h3>
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
        Calculate exact API costs for running automated LLM evaluations and AI test case generation across different foundation models in CI/CD.
      </p>

      {/* Inputs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Model Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Model Selection
          </label>
          <select
            value={selectedModelIndex}
            onChange={e => setSelectedModelIndex(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              outline: 'none'
            }}
          >
            {models.map((m, idx) => (
              <option key={m.name} value={idx}>
                {m.name} ({m.provider})
              </option>
            ))}
          </select>
        </div>

        {/* Avg Input Tokens */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Input Tokens / Test
          </label>
          <input
            type="number"
            min={100}
            step={100}
            value={inputTokensPerRun}
            onChange={e => setInputTokensPerRun(Math.max(0, Number(e.target.value)))}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              outline: 'none'
            }}
          />
        </div>

        {/* Avg Output Tokens */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Output Tokens / Test
          </label>
          <input
            type="number"
            min={50}
            step={50}
            value={outputTokensPerRun}
            onChange={e => setOutputTokensPerRun(Math.max(0, Number(e.target.value)))}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              outline: 'none'
            }}
          />
        </div>

        {/* Test Cases Count */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tests in Suite
          </label>
          <input
            type="number"
            min={10}
            step={10}
            value={testCasesCount}
            onChange={e => setTestCasesCount(Math.max(1, Number(e.target.value)))}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              outline: 'none'
            }}
          />
        </div>

        {/* CI Runs per Month */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CI Runs / Month
          </label>
          <input
            type="number"
            min={1}
            step={5}
            value={ciRunsPerMonth}
            onChange={e => setCiRunsPerMonth(Math.max(1, Number(e.target.value)))}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
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
        padding: '1.25rem',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xs)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Cost per Single Test Case
          </div>
          <div style={{ fontSize: '1.3rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${costPerSingleTest.toFixed(5)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Cost per Test Suite Run ({testCasesCount} tests)
          </div>
          <div style={{ fontSize: '1.3rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${costPerTestSuite.toFixed(3)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Estimated Monthly CI/CD Bill ({ciRunsPerMonth} runs)
          </div>
          <div style={{ fontSize: '1.3rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--text-primary)' }}>
            ${monthlyCost.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
