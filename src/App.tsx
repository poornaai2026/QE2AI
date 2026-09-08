import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';

// Core Pages
import { HomePage } from './pages/HomePage';
import { RoadmapPage } from './pages/RoadmapPage';
import { LearnIndexPage } from './pages/LearnIndexPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TestAIPage } from './pages/TestAIPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProgressTrackerPage } from './pages/ProgressTrackerPage';
import { AboutPage } from './pages/AboutPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
};

export const App: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <Navbar onOpenSearch={() => setSearchOpen(true)} />
          <main style={{ flex: 1, width: '100%' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              
              {/* Learning Tracks */}
              <Route path="/tracks" element={<LearnIndexPage />} />
              <Route path="/learn" element={<LearnIndexPage />} />
              
              {/* Projects */}
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/build" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              
              {/* AI Quality Engineering */}
              <Route path="/ai-qe" element={<TestAIPage />} />
              <Route path="/test-ai" element={<TestAIPage />} />

              {/* Interview Preparation Suite */}
              <Route path="/interview-prep" element={<InterviewPrepPage />} />
              <Route path="/interview" element={<InterviewPrepPage />} />
              
              {/* Resources & Tracker */}
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/tracker" element={<ProgressTrackerPage />} />
              <Route path="/career" element={<ProgressTrackerPage />} />
              
              {/* About Author */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/my-journey" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
