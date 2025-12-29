
import React, { useState } from 'react';
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
import ThreadDetail from './views/ThreadDetail';
import JourneyDetail from './views/JourneyDetail';
import Session from './views/Session';
import PromptList from './views/PromptList';
import Mirror from './views/spaces/Mirror';
import LifeDashboard from './views/spaces/LifeDashboard';
import DecisionLab from './views/spaces/DecisionLab';
import VoiceMemos from './views/spaces/VoiceMemos';
import TimeVault from './views/spaces/TimeVault'; 
import Intentions from './views/spaces/Intentions';
import { ViewState } from './types';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [viewData, setViewData] = useState<any>(null);

  const handleChangeView = (view: ViewState, data?: any) => {
    setCurrentView(view);
    if (data) setViewData(data);
  };

  const handleStartApp = () => {
    setShowLanding(false);
    // New User Flow: Go to Onboarding
    setCurrentView(ViewState.ONBOARDING);
  };

  const handleDemoLogin = () => {
    setShowLanding(false);
    // Demo Mode: Skip onboarding, go straight to Home (Dashboard)
    setCurrentView(ViewState.HOME);
  };

  const getTitle = () => {
    switch(currentView) {
      case ViewState.HOME: return 'Home';
      case ViewState.JOURNAL: return 'Journal';
      case ViewState.EXPLORE: return 'Explore';
      case ViewState.INSIGHTS: return 'Insights';
      case ViewState.EDITOR: return 'New Entry';
      case ViewState.THREAD_DETAIL: return viewData?.title || 'Thread';
      case ViewState.JOURNEY_DETAIL: return viewData?.title || 'Journey';
      case ViewState.JOURNEY_SESSION: return 'Session';
      case ViewState.PROMPT_LIST: return viewData?.title || 'Prompts';
      case ViewState.SETTINGS: return 'Profile';
      
      // Tools
      case ViewState.SPACE_MIRROR: return 'The Mirror';
      case ViewState.SPACE_DASHBOARD: return 'Life Dashboard';
      case ViewState.SPACE_DECISION: return 'Decision Lab';
      case ViewState.SPACE_VOICE: return 'Voice Memos';
      case ViewState.SPACE_VAULT: return 'The Vault';
      case ViewState.SPACE_INTENTIONS: return 'Intentions';
      default: return 'Meadow';
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME: return <Home onChangeView={handleChangeView} userName={viewData?.userName} userIntent={viewData?.userIntent} />;
      case ViewState.JOURNAL: return <Journal onChangeView={handleChangeView} />;
      case ViewState.EDITOR: return <Editor onChangeView={handleChangeView} initialData={viewData} />;
      case ViewState.EXPLORE: return <Explore onChangeView={handleChangeView} />;
      case ViewState.INSIGHTS: return <Insights onChangeView={handleChangeView} />;
      case ViewState.THREAD_DETAIL: return <ThreadDetail onChangeView={handleChangeView} threadId={viewData?.id} />;
      case ViewState.JOURNEY_DETAIL: return <JourneyDetail onChangeView={handleChangeView} journeyId={viewData?.id} />;
      case ViewState.JOURNEY_SESSION: return <Session onChangeView={handleChangeView} step={viewData?.step} journeyId={viewData?.journeyId} />;
      case ViewState.PROMPT_LIST: return <PromptList onChangeView={handleChangeView} categoryId={viewData?.categoryId} />;
      case ViewState.SETTINGS: return <Settings onChangeView={handleChangeView} />;
      
      // Tools
      case ViewState.SPACE_MIRROR: return <Mirror onChangeView={handleChangeView} />;
      case ViewState.SPACE_DASHBOARD: return <LifeDashboard onChangeView={handleChangeView} />;
      case ViewState.SPACE_DECISION: return <DecisionLab onChangeView={handleChangeView} />;
      case ViewState.SPACE_VOICE: return <VoiceMemos onChangeView={handleChangeView} />;
      case ViewState.SPACE_VAULT: return <TimeVault onChangeView={handleChangeView} />;
      case ViewState.SPACE_INTENTIONS: return <Intentions onChangeView={handleChangeView} />;
      default: return <Home onChangeView={handleChangeView} />;
    }
  };

  if (showLanding) {
      return <LandingPage onEnterApp={handleStartApp} onDemoLogin={handleDemoLogin} />;
  }

  // Full Screen Views (No Layout)
  if (currentView === ViewState.AUTH) {
      return <Auth onChangeView={handleChangeView} />;
  }

  if (currentView === ViewState.ONBOARDING) {
      return <Onboarding onChangeView={handleChangeView} />;
  }

  if (currentView === ViewState.JOURNEY_SESSION) {
     return <Session onChangeView={handleChangeView} step={viewData?.step} journeyId={viewData?.journeyId} />;
  }

  const showBack = currentView !== ViewState.HOME && currentView !== ViewState.EXPLORE && currentView !== ViewState.JOURNAL && currentView !== ViewState.SETTINGS;

  return (
    <div className="flex h-screen bg-[#faf9f7] overflow-hidden font-sans text-text-primary selection:bg-sage-subtle selection:text-sage-dark animate-fade-up">
       <Layout 
          currentView={currentView} 
          onChangeView={handleChangeView}
          title={getTitle()}
          showBack={showBack}
       >
         {renderView()}
       </Layout>
    </div>
  );
}

export default App;
