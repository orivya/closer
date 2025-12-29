
import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import Layout from './components/Layout';
import LandingPage from './views/LandingPage';
import Auth from './views/Auth';
import Onboarding from './views/Onboarding';
import Home from './views/Home';
import Journal from './views/Journal';
import Editor from './views/Editor';
import Explore from './views/Explore';
import Insights from './views/Insights';
import Settings from './views/Settings';
import SettingsProfile from './views/SettingsProfile';
import SettingsSecurity from './views/SettingsSecurity';
import SettingsData from './views/SettingsData';
import ThreadDetail from './views/ThreadDetail';
import JourneyDetail from './views/JourneyDetail';
import Session from './views/Session';
import PromptList from './views/PromptList';
import Pricing from './views/Pricing';
import Privacy from './views/Privacy';
import Terms from './views/Terms';
import Blog from './views/Blog';
import BlogCategory from './views/BlogCategory';
import BlogPost from './views/BlogPost';
import Tools from './views/Tools';
import Mirror from './views/spaces/Mirror';
import LifeDashboard from './views/spaces/LifeDashboard';
import DecisionLab from './views/spaces/DecisionLab';
import TimeVault from './views/spaces/TimeVault';
import Intentions from './views/spaces/Intentions';
import { DreamJournal } from './components/toolbox';
import NotFound from './views/NotFound';
import { ViewState } from './types';
import { Toaster } from './components/ui/toaster';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function App() {
  const { user, isLoading: authLoading, refreshSubscription } = useAuth();
  const getInitialView = (): { view: ViewState; data?: any } => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);

    // Handle parameterized routes first
    if (segments[0] === 'entry') {
      if (segments[1] === 'new') {
        return { view: ViewState.EDITOR };
      }
      if (segments[1]) {
        return { view: ViewState.EDITOR, data: { entryId: segments[1] } };
      }
    }
    if (segments[0] === 'thread' && segments[1]) {
      return { view: ViewState.THREAD_DETAIL, data: { id: segments[1] } };
    }
    if (segments[0] === 'journey' && segments[1]) {
      // /journey/:id/session
      if (segments[2] === 'session') {
        return { view: ViewState.JOURNEY_SESSION, data: { journeyId: segments[1] } };
      }
      return { view: ViewState.JOURNEY_DETAIL, data: { id: segments[1] } };
    }
    if (segments[0] === 'blog') {
      // /blog/category/:categoryId
      if (segments[1] === 'category') {
        if (segments[2]) {
          return { view: ViewState.BLOG_CATEGORY, data: { categoryId: segments[2] } };
        }
        return { view: ViewState.BLOG };
      }

      // /blog/:postId
      if (segments[1]) {
        return { view: ViewState.BLOG_POST, data: { postId: segments[1] } };
      }
    }
    if (segments[0] === 'prompts' && segments[1]) {
      return { view: ViewState.PROMPT_LIST, data: { categoryId: segments[1] } };
    }

    // Static routes
    const pathToView: Record<string, ViewState> = {
      '/settings': ViewState.SETTINGS,
      '/settings/profile': ViewState.SETTINGS_PROFILE,
      '/settings/security': ViewState.SETTINGS_SECURITY,
      '/settings/data': ViewState.SETTINGS_DATA,
      '/pricing': ViewState.PRICING,
      '/privacy': ViewState.PRIVACY,
      '/terms': ViewState.TERMS,
      '/journal': ViewState.JOURNAL,
      '/explore': ViewState.EXPLORE,
      '/insights': ViewState.INSIGHTS,
      '/home': ViewState.HOME,
      '/blog': ViewState.BLOG,
      '/tools': ViewState.TOOLS,
      '/login': ViewState.AUTH,
      '/signup': ViewState.AUTH,
      '/onboarding': ViewState.ONBOARDING,
      '/404': ViewState.NOT_FOUND,
    };

    // Return mapped view or NOT_FOUND for unknown paths
    if (pathToView[path]) {
      return { view: pathToView[path] };
    }

    // Root path defaults to HOME (handled by showLanding logic)
    if (path === '/' || path === '') {
      return { view: ViewState.HOME };
    }

    // Unknown path → Not Found
    return { view: ViewState.NOT_FOUND };
  };

  const getUrlForView = (view: ViewState, data?: any): string => {
    switch (view) {
      case ViewState.HOME: return '/home';
      case ViewState.JOURNAL: return '/journal';
      case ViewState.EXPLORE: return '/explore';
      case ViewState.INSIGHTS: return '/insights';
      case ViewState.SETTINGS: return '/settings';
      case ViewState.SETTINGS_PROFILE: return '/settings/profile';
      case ViewState.SETTINGS_SECURITY: return '/settings/security';
      case ViewState.SETTINGS_DATA: return '/settings/data';
      case ViewState.PRICING: return '/pricing';
      case ViewState.PRIVACY: return '/privacy';
      case ViewState.TERMS: return '/terms';
      case ViewState.BLOG: return '/blog';
      case ViewState.TOOLS: return '/tools';
      case ViewState.AUTH: return data?.isSignUp ? '/signup' : '/login';
      case ViewState.ONBOARDING: return '/onboarding';
      case ViewState.EDITOR:
        return data?.entryId ? `/entry/${data.entryId}` : '/entry/new';
      case ViewState.THREAD_DETAIL:
        return data?.id ? `/thread/${data.id}` : '/journal';
      case ViewState.JOURNEY_DETAIL:
        return data?.id ? `/journey/${data.id}` : '/explore';
      case ViewState.JOURNEY_SESSION:
        return data?.journeyId ? `/journey/${data.journeyId}/session` : '/explore';
      case ViewState.PROMPT_LIST:
        return data?.categoryId ? `/prompts/${data.categoryId}` : '/explore';
      case ViewState.BLOG_POST:
        return data?.postId ? `/blog/${data.postId}` : '/blog';
      case ViewState.BLOG_CATEGORY:
        return data?.categoryId ? `/blog/category/${data.categoryId}` : '/blog';
      case ViewState.NOT_FOUND:
        return '/404';
      default: return '/home';
    }
  };

  const [showLanding, setShowLanding] = useState(() => {
    const path = window.location.pathname;
    // Only show landing if exact match root '/'
    // Other paths like /login, /signup, /home etc. should NOT show landing
    return path === '/';
  });

  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(false);

  const initialState = getInitialView();
  const [currentView, setCurrentView] = useState<ViewState>(initialState.view);
  const [viewData, setViewData] = useState<any>(initialState.data || null);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const path = window.location.pathname;

      // If navigating back to root '/', show landing page
      if (path === '/') {
        setShowLanding(true);
        return;
      }

      // Otherwise, hide landing and show appropriate view
      setShowLanding(false);

      if (event.state?.view) {
        setCurrentView(event.state.view);
        setViewData(event.state.data || null);
      } else {
        // Fallback: parse URL
        const { view, data } = getInitialView();
        setCurrentView(view);
        setViewData(data || null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle deep links (Stripe returns) on mount only or when params indicate special action
  useEffect(() => {
    if (authLoading) return;

    const params = new URLSearchParams(window.location.search);

    // Stripe query params → refresh subscription and clean the URL.
    const success = params.get('success');
    const canceled = params.get('canceled');
    if (success === 'true') {
      refreshSubscription();
      // Navigate to Settings if coming back from Stripe
      if (currentView !== ViewState.SETTINGS && currentView !== ViewState.PRICING) {
        setCurrentView(ViewState.SETTINGS);
      }
    }

    if ((success === 'true' || canceled === 'true')) {
      const path = window.location.pathname;
      window.history.replaceState({}, '', path);
    }
  }, [authLoading, refreshSubscription]); // Removed user/showLanding to prevent "random" redirects

  // Guard: core app views require login.
  useEffect(() => {
    if (authLoading) return;

    const publicViews = new Set<ViewState>([
      ViewState.AUTH,
      ViewState.ONBOARDING,
      ViewState.PRICING,
      ViewState.PRIVACY,
      ViewState.TERMS,
      ViewState.BLOG,
      ViewState.BLOG_CATEGORY,
      ViewState.BLOG_POST,
      ViewState.TOOLS,
      ViewState.NOT_FOUND,
    ]);

    if (!showLanding && !user && !isDemoMode && !publicViews.has(currentView)) {
      setCurrentView(ViewState.AUTH);
      setViewData(null);
    }
  }, [authLoading, currentView, showLanding, user, isDemoMode]);

  const handleChangeView = (view: ViewState, data?: any) => {
    setCurrentView(view);
    setViewData(data || null);

    // Update URL with pushState
    const url = getUrlForView(view, data);
    window.history.pushState({ view, data }, '', url);

    // Scroll to top for new view
    window.scrollTo(0, 0);
  };

  const handleStartApp = () => {
    setShowLanding(false);
    // If not signed in, start with signup/login first.
    const nextView = user ? ViewState.HOME : ViewState.AUTH;
    setCurrentView(nextView);
    const url = getUrlForView(nextView, { isSignUp: true });
    window.history.pushState({ view: nextView }, '', url);
  };

  const handleLogin = () => {
    setShowLanding(false);
    setCurrentView(ViewState.AUTH);
    window.history.pushState({ view: ViewState.AUTH }, '', '/login');
  };

  const handleOnboarding = () => {
    setShowLanding(false);
    setCurrentView(ViewState.ONBOARDING);
    window.history.pushState({ view: ViewState.ONBOARDING }, '', '/onboarding');
  };

  const handleDemoLogin = () => {
    setIsDemoMode(true);
    setShowLanding(false);
    setCurrentView(ViewState.HOME);
    setViewData({ userName: 'Guest' });
    window.history.pushState({ view: ViewState.HOME }, '', '/home');
  };

  const getTitle = () => {
    switch (currentView) {
      case ViewState.HOME:
        return 'Home';
      case ViewState.JOURNAL:
        return 'Journal';
      case ViewState.EXPLORE:
        return 'Explore';
      case ViewState.INSIGHTS:
        return 'Insights';
      case ViewState.EDITOR:
        return 'New Entry';
      case ViewState.THREAD_DETAIL:
        return viewData?.title || 'Thread';
      case ViewState.JOURNEY_DETAIL:
        return viewData?.title || 'Journey';
      case ViewState.JOURNEY_SESSION:
        return 'Session';
      case ViewState.PROMPT_LIST:
        return viewData?.title || 'Prompts';
      case ViewState.SETTINGS:
        return 'Profile';
      case ViewState.PRICING:
        return 'Pricing';
      case ViewState.PRIVACY:
        return 'Privacy Policy';
      case ViewState.TERMS:
        return 'Terms of Service';

      // Settings Sub-Pages
      case ViewState.SETTINGS_PROFILE:
        return 'Personal Information';
      case ViewState.SETTINGS_SECURITY:
        return 'Privacy & Security';
      case ViewState.SETTINGS_DATA:
        return 'Data & Export';

      // Blog & Content
      case ViewState.BLOG:
        return 'Blog';
      case ViewState.BLOG_CATEGORY:
        return viewData?.title || 'Category';
      case ViewState.BLOG_POST:
        return viewData?.title || 'Article';

      // Tools Hub
      case ViewState.TOOLS:
        return 'Journaling Tools';

      // Tools
      case ViewState.SPACE_MIRROR:
        return 'The Mirror';
      case ViewState.SPACE_INSIGHT_ENGINE:
        return 'The Insight Engine';
      case ViewState.SPACE_DASHBOARD:
        return 'Life Dashboard';
      case ViewState.SPACE_DECISION:
        return 'Decision Lab';
      case ViewState.SPACE_VAULT:
        return 'The Vault';
      case ViewState.SPACE_INTENTIONS:
        return 'Intentions';
      case ViewState.SPACE_DREAM_JOURNAL:
        return 'Dream Journal';
      default:
        return 'Meadow';
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <Home onChangeView={handleChangeView} userName={viewData?.userName} userIntent={viewData?.userIntent} />;
      case ViewState.JOURNAL:
        return <Journal onChangeView={handleChangeView} />;
      case ViewState.EDITOR:
        return <Editor onChangeView={handleChangeView} initialData={viewData} />;
      case ViewState.EXPLORE:
        return <Explore onChangeView={handleChangeView} />;
      case ViewState.INSIGHTS:
        return <Insights onChangeView={handleChangeView} />;
      case ViewState.THREAD_DETAIL:
        return <ThreadDetail onChangeView={handleChangeView} threadId={viewData?.id} />;
      case ViewState.JOURNEY_DETAIL:
        return <JourneyDetail onChangeView={handleChangeView} journeyId={viewData?.id} />;
      case ViewState.JOURNEY_SESSION:
        return <Session onChangeView={handleChangeView} step={viewData?.step} journeyId={viewData?.journeyId} stepIndex={viewData?.stepIndex} />;
      case ViewState.PROMPT_LIST:
        return <PromptList onChangeView={handleChangeView} categoryId={viewData?.categoryId} />;
      case ViewState.SETTINGS:
        return <Settings onChangeView={handleChangeView} />;
      case ViewState.PRICING:
        return <Pricing onChangeView={handleChangeView} />;
      case ViewState.PRIVACY:
        return <Privacy onChangeView={handleChangeView} />;
      case ViewState.TERMS:
        return <Terms onChangeView={handleChangeView} />;

      // Settings Sub-Pages
      case ViewState.SETTINGS_PROFILE:
        return <SettingsProfile onChangeView={handleChangeView} />;
      case ViewState.SETTINGS_SECURITY:
        return <SettingsSecurity onChangeView={handleChangeView} />;
      case ViewState.SETTINGS_DATA:
        return <SettingsData onChangeView={handleChangeView} />;

      // Blog & Content
      case ViewState.BLOG:
        return <Blog onChangeView={handleChangeView} />;
      case ViewState.BLOG_CATEGORY:
        return <BlogCategory onChangeView={handleChangeView} categoryId={viewData?.categoryId} />;
      case ViewState.BLOG_POST:
        return <BlogPost onChangeView={handleChangeView} postId={viewData?.postId} categoryId={viewData?.categoryId} />;

      // Tools Hub
      case ViewState.TOOLS:
        return <Tools onChangeView={handleChangeView} />;

      // Tools
      case ViewState.SPACE_MIRROR:
        return <Mirror onChangeView={handleChangeView} />;
      case ViewState.SPACE_INSIGHT_ENGINE:
        return <Mirror onChangeView={handleChangeView} />;
      case ViewState.SPACE_DASHBOARD:
        return <LifeDashboard onChangeView={handleChangeView} />;
      case ViewState.SPACE_DECISION:
        return <DecisionLab onChangeView={handleChangeView} />;
      case ViewState.SPACE_VAULT:
        return <TimeVault onChangeView={handleChangeView} />;
      case ViewState.SPACE_INTENTIONS:
        return <Intentions onChangeView={handleChangeView} />;
      case ViewState.SPACE_DREAM_JOURNAL:
        return <DreamJournal onChangeView={handleChangeView} />;

      // Error States
      case ViewState.NOT_FOUND:
        return <NotFound onChangeView={handleChangeView} />;

      default:
        return <Home onChangeView={handleChangeView} />;
    }
  };

  // Handler for navigating to public pages from landing
  const handleLandingNavigate = (path: string) => {
    const pathToView: Record<string, ViewState> = {
      '/pricing': ViewState.PRICING,
      '/privacy': ViewState.PRIVACY,
      '/terms': ViewState.TERMS,
      '/blog': ViewState.BLOG,
      '/tools': ViewState.TOOLS,
    };

    const view = pathToView[path];
    if (view) {
      setShowLanding(false);
      setCurrentView(view);
      setViewData(null);
      window.history.pushState({ view }, '', path);
    } else {
      // Fallback for unknown paths
      window.location.href = path;
    }
  };

  if (showLanding) {
    return (
      <>
        <Toaster />
        <LandingPage onEnterApp={handleOnboarding} onLogin={handleLogin} onNavigate={handleLandingNavigate} />
      </>
    );
  }

  // Handler to go back to landing page
  const handleBackToLanding = () => {
    setShowLanding(true);
    setCurrentView(ViewState.HOME);
    setViewData(null);
    window.history.pushState({}, '', '/');
  };

  // Full Screen Views (No Layout)
  if (currentView === ViewState.AUTH) {
    return (
      <>
        <Toaster />
        <Auth onChangeView={handleChangeView} onClose={handleBackToLanding} />
      </>
    );
  }

  if (currentView === ViewState.ONBOARDING) {
    return (
      <>
        <Toaster />
        <Onboarding onChangeView={handleChangeView} onClose={handleBackToLanding} />
      </>
    );
  }

  if (currentView === ViewState.JOURNEY_SESSION) {
    return (
      <>
        <Toaster />
        <Session onChangeView={handleChangeView} step={viewData?.step} journeyId={viewData?.journeyId} stepIndex={viewData?.stepIndex} />
      </>
    );
  }

  // Public content pages (No Layout chrome)
  if (
    currentView === ViewState.BLOG ||
    currentView === ViewState.BLOG_CATEGORY ||
    currentView === ViewState.BLOG_POST ||
    currentView === ViewState.NOT_FOUND
  ) {
    return (
      <>
        <Toaster />
        {renderView()}
      </>
    );
  }

  const showBack =
    currentView !== ViewState.HOME &&
    currentView !== ViewState.EXPLORE &&
    currentView !== ViewState.JOURNAL &&
    currentView !== ViewState.SETTINGS;

  return (
    <>
      <Toaster />
      <div className="flex h-screen bg-[#faf9f7] overflow-hidden font-sans text-text-primary selection:bg-sage-subtle selection:text-sage-dark animate-fade-up">
        <Layout currentView={currentView} onChangeView={handleChangeView} title={getTitle()} showBack={showBack}>
          {renderView()}
        </Layout>
      </div>
    </>
  );
}

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryFallback } from './components/ui/ErrorState';

// App wrapper that applies theme classes
const ThemedApp = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-stone-900 text-stone-100' : 'bg-[#faf9f7] text-text-primary'}`}>
      <App />
    </div>
  );
};

// Wrapper component that provides auth context, theme context, and global error handling
const AppWithAuth = () => (
  <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={() => window.location.reload()}>
    <ThemeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default AppWithAuth;
