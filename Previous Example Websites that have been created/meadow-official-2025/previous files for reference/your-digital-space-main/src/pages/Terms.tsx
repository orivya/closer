import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-background/85 backdrop-blur-xl border-b border-border-subtle z-50">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-6 relative">
            <div className="w-full h-full bg-gradient-to-br from-sage-light via-sage to-sage-dark rounded-[75%_25%_65%_35%/60%_40%_60%_40%] relative animate-[breathe_5s_ease-in-out_infinite]">
              <div className="absolute top-[38%] left-[42%] -translate-x-1/2 flex gap-1.5">
                <div className="w-[3px] h-[3px] bg-white/95 rounded-full" />
                <div className="w-[2.5px] h-[2.5px] bg-white/90 rounded-full opacity-90" />
              </div>
            </div>
          </div>
          <span className="text-[15px] font-semibold text-foreground tracking-wide">ORIVYA</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-transparent border border-border rounded-md text-[13px] text-muted-foreground hover:bg-surface hover:text-foreground transition-all duration-150 active:scale-[0.97]"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          Back
        </Link>
      </nav>

      {/* Main Content */}
      <main className="max-w-[720px] mx-auto px-6 pt-[120px] pb-20 max-sm:pt-[100px] max-sm:px-5 max-sm:pb-[60px]">
        <header className="mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-3 max-sm:text-[28px]">Terms of Service</h1>
          <p className="text-sm text-text-muted">Last updated: December 2025</p>
        </header>

        <div className="text-base leading-relaxed">
          {/* Highlight Box */}
          <div className="p-5 bg-sage-subtle border-l-[3px] border-sage rounded-r-[10px] my-6">
            <p className="text-foreground mb-0">
              <strong className="font-medium">Plain language summary:</strong> Orivya is a clarity companion — not a therapist, doctor, or financial advisor. Use it as a thinking partner, but always consult professionals for serious decisions.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">
            By accessing or using Orivya, you agree to be bound by these Terms of Service. If you disagree with any part, you may not access the service.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">2. Description of Service</h2>
          <p className="text-muted-foreground mb-4">
            Orivya is an AI-powered clarity companion designed to help you think through decisions, recognize patterns, and gain self-understanding. The service includes:
          </p>
          <ul className="text-muted-foreground mb-4 pl-6 list-disc">
            <li className="mb-2">Conversational AI interactions</li>
            <li className="mb-2">Pattern recognition and insights</li>
            <li className="mb-2">Personal library of reflections</li>
            <li className="mb-2">Decision tracking tools</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">3. Important Limitations</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">Orivya is NOT a substitute for:</h3>
          <ul className="text-muted-foreground mb-4 pl-6 list-disc">
            <li className="mb-2"><strong className="text-foreground font-medium">Mental health professionals:</strong> If you're experiencing mental health challenges, please consult a licensed therapist or counselor</li>
            <li className="mb-2"><strong className="text-foreground font-medium">Medical advice:</strong> For health concerns, always consult qualified medical professionals</li>
            <li className="mb-2"><strong className="text-foreground font-medium">Legal or financial counsel:</strong> Seek licensed professionals for legal or financial decisions</li>
            <li className="mb-2"><strong className="text-foreground font-medium">Emergency services:</strong> If you're in crisis, contact emergency services immediately</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">AI Limitations</h3>
          <p className="text-muted-foreground mb-4">While Orivya strives to be helpful, it may occasionally:</p>
          <ul className="text-muted-foreground mb-4 pl-6 list-disc">
            <li className="mb-2">Misunderstand context or nuance</li>
            <li className="mb-2">Provide perspectives that don't resonate with you</li>
            <li className="mb-2">Make observations that require human judgment to evaluate</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">4. User Responsibilities</h2>
          <p className="text-muted-foreground mb-4">You agree to:</p>
          <ul className="text-muted-foreground mb-4 pl-6 list-disc">
            <li className="mb-2">Provide accurate information when creating an account</li>
            <li className="mb-2">Maintain the security of your account credentials</li>
            <li className="mb-2">Use the service in accordance with applicable laws</li>
            <li className="mb-2">Not attempt to reverse-engineer or exploit the service</li>
            <li className="mb-2">Not use Orivya for any illegal or harmful purposes</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">5. Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">
            <strong className="text-foreground font-medium">Your content:</strong> You retain ownership of all personal reflections, notes, and content you create within Orivya.
          </p>
          <p className="text-muted-foreground mb-4">
            <strong className="text-foreground font-medium">Our content:</strong> The Orivya platform, including its design, features, and AI capabilities, is owned by Orivya and protected by intellectual property laws.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">6. Privacy</h2>
          <p className="text-muted-foreground mb-4">
            Your privacy is fundamental to our service. Please review our{" "}
            <Link to="/privacy" className="text-sage hover:underline">Privacy Policy</Link>{" "}
            for details on how we collect, use, and protect your data.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">7. Subscription & Payment</h2>
          <p className="text-muted-foreground mb-4">Certain features may require a paid subscription. By subscribing, you agree to:</p>
          <ul className="text-muted-foreground mb-4 pl-6 list-disc">
            <li className="mb-2">Pay all fees according to your selected plan</li>
            <li className="mb-2">Automatic renewal unless cancelled before the billing date</li>
            <li className="mb-2">Our refund policy as stated at time of purchase</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">8. Termination</h2>
          <p className="text-muted-foreground mb-4">
            You may terminate your account at any time through Settings. We may terminate or suspend access if you violate these terms. Upon termination, your right to use the service ceases, and we may delete your data according to our data retention policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">9. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground mb-4">
            Orivya is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or meet your specific expectations.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">10. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">
            To the fullest extent permitted by law, Orivya shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">11. Changes to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We may modify these terms at any time. Continued use of Orivya after changes constitutes acceptance. We will notify users of significant changes via email or in-app notification.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">12. Governing Law</h2>
          <p className="text-muted-foreground mb-4">
            These terms are governed by applicable laws. Any disputes shall be resolved through appropriate legal channels in the jurisdiction where Orivya operates.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">13. Contact</h2>
          <p className="text-muted-foreground mb-4">
            Questions about these terms? Contact us at{" "}
            <a href="mailto:legal@orivya.com" className="text-sage hover:underline">legal@orivya.com</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border-subtle text-center">
        <p className="text-[13px] text-text-muted">© 2025 Orivya. All rights reserved.</p>
        <div className="flex justify-center gap-5 mt-3">
          <Link to="/terms" className="text-[13px] text-tertiary-foreground hover:text-sage transition-colors duration-150">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-[13px] text-tertiary-foreground hover:text-sage transition-colors duration-150">
            Privacy Policy
          </Link>
          <Link to="/" className="text-[13px] text-tertiary-foreground hover:text-sage transition-colors duration-150">
            Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
