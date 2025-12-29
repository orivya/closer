import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OnboardingAvatar } from "../OnboardingAvatar";
import { ContinueButton } from "../ContinueButton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AccountStepProps {
  name: string;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onComplete: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function AccountStep({
  name,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onComplete,
  isLoading = false,
  error = null,
}: AccountStepProps) {
  const [messageVisible, setMessageVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);

  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6;
  const isValid = isEmailValid && isPasswordValid;

  useEffect(() => {
    const timers = [
      setTimeout(() => setMessageVisible(true), 200),
      setTimeout(() => setEmailVisible(true), 400),
      setTimeout(() => setPasswordVisible(true), 550),
      setTimeout(() => setButtonVisible(true), 700),
      setTimeout(() => setTermsVisible(true), 850),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && !isLoading) {
      onComplete();
    }
  };

  return (
    <div className="step-content max-w-[520px] w-full text-center">
      <OnboardingAvatar
        glowVisible
        glowPulsing
        bodyVisible
        breathing
        eyesVisible
        eyesOpen
        blinking
        className="mb-8"
      />
      <p
        className={cn(
          "text-[26px] font-normal leading-relaxed text-muted-foreground mb-8 transition-all duration-[800ms]",
          messageVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        Let's save your progress, <span className="text-sage-light font-medium">{name}</span>.
      </p>
      <div className="flex flex-col gap-3 max-w-[360px] mx-auto mb-6">
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Email"
          autoComplete="email"
          autoFocus
          className={cn(
            "w-full py-4 px-5 h-auto bg-elevated border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted focus:border-sage/40 focus:ring-2 focus:ring-sage/10 transition-all duration-[600ms]",
            emailVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Password (min 6 characters)"
          autoComplete="new-password"
          className={cn(
            "w-full py-4 px-5 h-auto bg-elevated border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted focus:border-sage/40 focus:ring-2 focus:ring-sage/10 transition-all duration-[600ms]",
            passwordVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive mb-4">{error}</p>
      )}
      <ContinueButton
        onClick={onComplete}
        disabled={!isValid || isLoading}
        visible={buttonVisible}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </ContinueButton>
      <p
        className={cn(
          "text-[13px] text-text-muted mt-4 transition-opacity duration-[600ms]",
          termsVisible ? "opacity-100" : "opacity-0"
        )}
      >
        By continuing, you agree to our{" "}
        <Link to="/terms" className="text-sage hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-sage hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
