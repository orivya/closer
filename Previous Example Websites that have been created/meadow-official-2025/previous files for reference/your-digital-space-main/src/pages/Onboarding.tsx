import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AmbientBackground } from "@/components/onboarding/AmbientBackground";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { HelloStep } from "@/components/onboarding/steps/HelloStep";
import { IntroductionStep } from "@/components/onboarding/steps/IntroductionStep";
import { PhilosophyStep } from "@/components/onboarding/steps/PhilosophyStep";
import { NameStep } from "@/components/onboarding/steps/NameStep";
import { PersonalityStep, Personality } from "@/components/onboarding/steps/PersonalityStep";
import { ContinuityStep } from "@/components/onboarding/steps/ContinuityStep";
import { FirstQuestionStep } from "@/components/onboarding/steps/FirstQuestionStep";
import { PreviewStep } from "@/components/onboarding/steps/PreviewStep";
import { AccountStep } from "@/components/onboarding/steps/AccountStep";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 9;

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [ambientVisible, setAmbientVisible] = useState(false);

  // User data
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState<Personality>("balanced");
  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize ambient background
  useState(() => {
    setTimeout(() => setAmbientVisible(true), 300);
  });

  const goToStep = useCallback((step: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: name,
            personality,
            first_question: question,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      // Navigate to chat with welcome params
      navigate(`/chat?welcome=true&name=${encodeURIComponent(name)}&personality=${encodeURIComponent(personality)}`);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <HelloStep onComplete={() => goToStep(2)} />;
      case 2:
        return <IntroductionStep onComplete={() => goToStep(3)} />;
      case 3:
        return <PhilosophyStep onComplete={() => goToStep(4)} />;
      case 4:
        return (
          <NameStep
            value={name}
            onChange={setName}
            onComplete={() => goToStep(5)}
          />
        );
      case 5:
        return (
          <PersonalityStep
            value={personality}
            onChange={setPersonality}
            onComplete={() => goToStep(6)}
          />
        );
      case 6:
        return <ContinuityStep onComplete={() => goToStep(7)} />;
      case 7:
        return (
          <FirstQuestionStep
            value={question}
            onChange={setQuestion}
            onComplete={() => goToStep(8)}
          />
        );
      case 8:
        return (
          <PreviewStep
            question={question}
            personality={personality}
            onComplete={() => goToStep(9)}
          />
        );
      case 9:
        return (
          <AccountStep
            name={name}
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onComplete={handleComplete}
            isLoading={isLoading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AmbientBackground visible={ambientVisible} />

      <div className="relative z-10 h-screen">
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center px-6 py-10 transition-all duration-[600ms]",
            isTransitioning ? "opacity-0 -translate-y-5" : "opacity-100 translate-y-0"
          )}
        >
          {renderStep()}
        </div>
      </div>

      <ProgressDots
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        visible={ambientVisible}
      />
    </div>
  );
}
