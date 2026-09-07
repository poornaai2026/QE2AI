export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ArticleCategory =
  | 'Python for AI'
  | 'AI Fundamentals'
  | 'Transformers'
  | 'LLMs'
  | 'Tokens'
  | 'Embeddings'
  | 'Attention'
  | 'Prompt Engineering'
  | 'Structured Output'
  | 'Function Calling'
  | 'Tool Calling'
  | 'RAG'
  | 'Vector Databases'
  | 'Agents'
  | 'LangChain'
  | 'LangGraph'
  | 'MCP'
  | 'AI Evaluation'
  | 'Automation'
  | 'Career';

export interface CodeSnippet {
  language: string;
  filename?: string;
  code: string;
}

export interface ExternalResource {
  type: 'youtube' | 'website' | 'github' | 'course' | 'doc';
  title: string;
  url: string;
  authorOrSource: string;
  description: string;
  durationOrLevel?: string;
  isFree: boolean;
}

export interface QA2AISixQuestions {
  what: string;           // Why does this exist in plain English?
  how: string;            // How does it actually work?
  build: {
    description: string;
    snippets: CodeSnippet[];
  };
  fail: string[];         // Where it usually breaks in real life
  test: {
    strategy: string;     // How a tester should test it
    testCases: string[];
    metrics?: string[];
  };
  production: string[];   // What changes moving from a script to production
  interview: {
    question: string;
    answer: string;
  }[];
}

export interface Article {
  slug: string;
  title: string;
  summary: string;
  category: ArticleCategory;
  difficulty: DifficultyLevel;
  readingTime: string;
  publishedDate: string;
  tags: string[];
  prerequisites: string[];
  sixQuestions: QA2AISixQuestions;
  recommendedResources?: ExternalResource[];
  relatedArticles?: string[];
  relatedProject?: string;
  githubUrl?: string;
  phaseId?: number;
}

export interface RoadmapPhase {
  id: number;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  iconName: string;
  prerequisites: string[];
  keyConcepts: string[];
  handsOnLabs: string[];
  failureModesToMaster: string[];
  deliverableProject: {
    title: string;
    description: string;
    slug?: string;
  };
  articles: string[];
  interviewFocus: string[];
  recommendedResources: ExternalResource[];
}

export interface ProjectArchitectureStep {
  step: number;
  title: string;
  description: string;
  component: string;
}

export interface FlagshipProject {
  slug: string;
  title: string;
  tagline: string;
  problemStatement: string;
  businessUseCase: string;
  badge: string;
  badgeColor?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  techStack: string[];
  architectureDiagramText: string;
  architectureSteps: ProjectArchitectureStep[];
  repositoryUrl: string;
  implementationHighlights: string[];
  testingStrategy: {
    deterministicTesting: string[];
    probabilisticTesting: string[];
    qualityGates: string[];
  };
  evaluationMetrics: {
    name: string;
    threshold: string;
    tool: string;
    description: string;
  }[];
  ciCdWorkflow: string[];
  productionConsiderations: string[];
  lessonsLearned: string[];
  recommendedResources?: ExternalResource[];
}

export interface InterviewQuestionItem {
  id: string;
  category: 'LLM & Prompt' | 'RAG & Vector' | 'Agents & MCP' | 'AI Quality & Evaluation' | 'System Design & Career';
  difficulty: DifficultyLevel;
  question: string;
  qeContext: string;
  answerExplanation: string;
  keyPoints: string[];
  sampleFollowUp: string;
}

export interface JourneyMilestone {
  year: string;
  role: string;
  title: string;
  description: string;
  keyShift: string;
  takeaway: string;
}
