import React, { useState } from 'react';
import { RotateCcw, Wrench } from 'lucide-react';

export const RagTroubleshooter: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [contextFound, setContextFound] = useState<boolean | null>(null);
  const [rankedTop3, setRankedTop3] = useState<boolean | null>(null);
  const [answerAccurate, setAnswerAccurate] = useState<boolean | null>(null);

  const reset = () => {
    setStep(1);
    setContextFound(null);
    setRankedTop3(null);
    setAnswerAccurate(null);
  };

  const getDiagnosis = () => {
    if (contextFound === false) {
      return {
        title: "Retrieval Ingestion & Chunking Failure",
        explanation: "The ground-truth fact does not exist in the retrieved chunks at all.",
        solution: "Inspect your chunking strategy: Did chunk boundaries split markdown tables or sentences? Check embedding model domain coverage or add BM25 Keyword Hybrid Search for exact keyword error codes.",
        metricToTrack: "Context Recall & Hit Rate@10"
      };
    }
    if (contextFound === true && rankedTop3 === false) {
      return {
        title: "Ranking & Embedding Precision Failure",
        explanation: "The relevant fact is in the vector store, but it was ranked too low (e.g. 15th position) and got pushed out of the LLM prompt.",
        solution: "Add a Cross-Encoder Re-ranker (like BGE-reranker or Cohere) as a second retrieval stage, or implement parent-document chunking.",
        metricToTrack: "Context Precision & Mean Reciprocal Rank (MRR@10)"
      };
    }
    if (contextFound === true && rankedTop3 === true && answerAccurate === false) {
      return {
        title: "Generator Hallucination / Prompt Constraint Failure",
        explanation: "The correct context was fed right into the LLM prompt, but the model still hallucinated false facts or contradicted the document.",
        solution: "Lower temperature to 0.0, strengthen system prompt constraint ('Answer ONLY using the provided context chunks. If uncertain, say unknown.'), and test with structured Pydantic schemas.",
        metricToTrack: "Ragas Faithfulness & DeepEval Hallucination Score"
      };
    }
    return {
      title: "RAG Pipeline is Healthy!",
      explanation: "Context is retrieved, ranked in top positions, and the LLM produces faithful answers.",
      solution: "Add automated regression tests with DeepEval/Ragas in GitHub Actions to lock in this accuracy for future model upgrades.",
      metricToTrack: "Answer Relevancy & Latency"
    };
  };

  const diagnosis = (step === 4 || contextFound === false || (rankedTop3 !== null && answerAccurate !== null)) ? getDiagnosis() : null;

  return (
    <div className="card" style={{ padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-primary)'
          }}>
            <Wrench size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>
              Interactive RAG Bug Diagnostic Troubleshooter
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Pinpoint in 3 clicks whether your RAG hallucination is a Chunking, Embedding, Ranking, or Generator issue.
            </p>
          </div>
        </div>

        <button onClick={reset} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <RotateCcw size={13} />
          <span>Reset Diagnostic</span>
        </button>
      </div>

      {/* Step Flow */}
      {!diagnosis ? (
        <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
          {step === 1 && (
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Step 1: Check Retrieved Context Chunks
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Is the ground-truth fact or answer present inside the retrieved chunks?
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => { setContextFound(true); setStep(2); }}
                  className="btn btn-primary btn-sm"
                >
                  Yes, it was retrieved
                </button>
                <button
                  onClick={() => { setContextFound(false); setStep(4); }}
                  className="btn btn-secondary btn-sm"
                >
                  No, chunk is missing completely
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Step 2: Check Ranking Position
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Did the relevant chunk appear in the Top-3 highest ranked positions?
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => { setRankedTop3(true); setStep(3); }}
                  className="btn btn-primary btn-sm"
                >
                  Yes, it was in Top 3
                </button>
                <button
                  onClick={() => { setRankedTop3(false); setAnswerAccurate(false); setStep(4); }}
                  className="btn btn-secondary btn-sm"
                >
                  No, it was buried further down (Position 4+)
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Step 3: Check LLM Final Answer
              </div>
              <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Did the LLM answer match the retrieved fact, or did it invent something false?
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => { setAnswerAccurate(true); setStep(4); }}
                  className="btn btn-primary btn-sm"
                >
                  Matched accurately
                </button>
                <button
                  onClick={() => { setAnswerAccurate(false); setStep(4); }}
                  className="btn btn-secondary btn-sm"
                >
                  It hallucinated / made up facts
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Diagnosis Result Box */
        <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-strong)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-inverted">
              DIAGNOSIS
            </span>
            <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
              {diagnosis.title}
            </h4>
          </div>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
            {diagnosis.explanation}
          </p>

          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-xs)', borderLeft: '3px solid var(--text-primary)', marginBottom: '1rem' }}>
            <strong style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
              Recommended QE Fix:
            </strong>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              {diagnosis.solution}
            </p>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            <strong>Metric to evaluate:</strong> <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{diagnosis.metricToTrack}</span>
          </div>
        </div>
      )}
    </div>
  );
};
