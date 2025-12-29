import React from 'react';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, Shield } from 'lucide-react';

interface PrivacyProps {
  onChangeView: (view: ViewState) => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onChangeView }) => {
  const { user } = useAuth();

  const handleBack = () => {
    if (user) {
      onChangeView(ViewState.SETTINGS);
    } else {
      // For non-logged-in users, go back in history or navigate to landing
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-[32px] border border-stone-200/60 shadow-sm p-8 md:p-12">
          <div className="flex items-start justify-between gap-6 mb-8 pb-8 border-b border-stone-200">
            <div>
              <h1 className="font-serif text-4xl text-text-primary mb-2">Privacy Policy</h1>
              <p className="text-text-secondary font-light">Last Updated: December 21, 2025</p>
              <p className="text-text-secondary font-light">Effective Date: December 21, 2025</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sage/10 text-sage flex items-center justify-center">
              <Shield size={22} />
            </div>
          </div>

          <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-text-primary prose-p:text-text-secondary prose-li:text-text-secondary prose-strong:text-text-primary">
            <div className="mb-8">
              <p className="text-lg font-medium text-text-primary mb-4">
                <strong>Meadow — Personal Journaling Application</strong>
              </p>
              <p className="text-sm text-text-secondary mb-4">
                Welcome to Meadow ("we," "our," "us," or the "Company"). Meadow is a personal journaling application designed to help you reflect, grow, and understand yourself better through writing and AI-assisted insights.
              </p>
              <p className="text-sm text-text-secondary mb-4">
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application, mobile application, and related services (collectively, the "Service"). We are committed to protecting your privacy and handling your personal data with the utmost care, particularly given the sensitive and personal nature of journaling.
              </p>
              <p className="text-sm font-semibold text-text-primary">
                <strong>Please read this Privacy Policy carefully.</strong> By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use the Service.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-serif text-text-primary mb-4">TABLE OF CONTENTS</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><a href="#information-we-collect" className="text-sage hover:underline">Information We Collect</a></li>
                <li><a href="#how-we-use" className="text-sage hover:underline">How We Use Your Information</a></li>
                <li><a href="#ai-processing" className="text-sage hover:underline">Artificial Intelligence and Data Processing</a></li>
                <li><a href="#data-storage" className="text-sage hover:underline">Data Storage and Security</a></li>
                <li><a href="#third-party-providers" className="text-sage hover:underline">Third-Party Service Providers</a></li>
                <li><a href="#data-sharing" className="text-sage hover:underline">Data Sharing and Disclosure</a></li>
                <li><a href="#your-rights" className="text-sage hover:underline">Your Rights and Choices</a></li>
                <li><a href="#data-retention" className="text-sage hover:underline">Data Retention</a></li>
                <li><a href="#international-transfers" className="text-sage hover:underline">International Data Transfers</a></li>
                <li><a href="#childrens-privacy" className="text-sage hover:underline">Children's Privacy</a></li>
                <li><a href="#cookies" className="text-sage hover:underline">Cookies and Tracking Technologies</a></li>
                <li><a href="#changes" className="text-sage hover:underline">Changes to This Privacy Policy</a></li>
                <li><a href="#contact" className="text-sage hover:underline">Contact Us</a></li>
              </ol>
            </div>

            <section id="information-we-collect" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">1. INFORMATION WE COLLECT</h2>
              <p>We collect information that you provide directly to us, information collected automatically, and information from third-party sources.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">1.1 Information You Provide Directly</h3>
              
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Account Information</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email address</li>
                <li>Password (stored in encrypted/hashed form)</li>
                <li>Display name or username (optional)</li>
                <li>Profile photo (optional)</li>
                <li>Account preferences and settings</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Journal Content</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Journal entries (text content)</li>
                <li>Entry titles</li>
                <li>Entry metadata (date, time, mood selections)</li>
                <li>Tags and categories you assign</li>
                <li>Thread/topic assignments</li>
                <li>Voice recordings and audio files</li>
                <li>Transcriptions of voice recordings</li>
                <li>Attachments or media you upload</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Personal Reflection Data</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mood selections and emotional indicators</li>
                <li>Intentions and goals you set</li>
                <li>Personal connections and relationships you document</li>
                <li>Life events and milestones you record</li>
                <li>Responses to guided journaling prompts</li>
                <li>Journey progress and completions</li>
                <li>Decision-making entries and considerations</li>
                <li>Time capsule letters and future-dated content</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">AI Interaction Data</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Preferences for AI features (enabled/disabled)</li>
                <li>AI personalization settings (depth, creativity, sensitivity mode)</li>
                <li>Feedback you provide on AI-generated content</li>
                <li>Topics or phrases you indicate to avoid</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Payment Information</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Billing name and address</li>
                <li>Payment method details (processed by Stripe; we do not store full payment card numbers)</li>
                <li>Transaction history</li>
                <li>Subscription status and plan tier</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Communications</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Support requests and correspondence</li>
                <li>Feedback and suggestions you submit</li>
                <li>Survey responses</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">1.2 Information Collected Automatically</h3>
              
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Usage Data</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Features you access and how frequently</li>
                <li>Time spent in the application</li>
                <li>Actions taken (entries created, features used)</li>
                <li>Session duration and frequency</li>
                <li>Navigation patterns within the app</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Device and Technical Information</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Device type, model, and manufacturer</li>
                <li>Operating system and version</li>
                <li>Browser type and version</li>
                <li>Screen resolution</li>
                <li>Unique device identifiers</li>
                <li>IP address</li>
                <li>Time zone and language settings</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Log Data</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access times and dates</li>
                <li>Pages or screens viewed</li>
                <li>App crashes and error reports</li>
                <li>Referring URLs or sources</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">1.3 Information from Third Parties</h3>
              
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Authentication Providers</h4>
              <p>If you choose to sign in using a third-party service (e.g., Google, Apple), we may receive:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your name and email address</li>
                <li>Profile photo</li>
                <li>Unique identifier from that service</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Payment Processor</h4>
              <p>We receive from Stripe:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Confirmation of successful payments</li>
                <li>Subscription status updates</li>
                <li>General billing information (not full card numbers)</li>
              </ul>
            </section>

            <section id="how-we-use" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">2. HOW WE USE YOUR INFORMATION</h2>
              <p>We use the information we collect for the following purposes:</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.1 Providing and Improving the Service</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create and maintain your account</li>
                <li>Store and display your journal entries securely</li>
                <li>Enable core journaling features (writing, organizing, searching)</li>
                <li>Process voice recordings and generate transcriptions</li>
                <li>Track your journaling streaks, milestones, and progress</li>
                <li>Provide journey and guided journaling experiences</li>
                <li>Generate personalized prompts and insights</li>
                <li>Enable thread organization and tagging</li>
                <li>Facilitate future-dated time capsule functionality</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.2 AI-Powered Features</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Generate personalized daily prompts ("Daily Spark")</li>
                <li>Provide reflections and insights based on your writing</li>
                <li>Analyze themes and patterns across your entries (privately, for your benefit only)</li>
                <li>Generate weekly and annual summaries</li>
                <li>Power the Mirror reflection feature</li>
                <li>Provide guidance in Decision Lab</li>
                <li>Detect and suggest thread connections</li>
                <li>Personalize journey recommendations</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.3 Personalization</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Adapt the experience to your journaling stage</li>
                <li>Customize prompts based on your history and interests</li>
                <li>Respect your sensitivity and content preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.4 Communication</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Send transactional emails (account verification, password reset)</li>
                <li>Notify you of important account or service updates</li>
                <li>Respond to your support requests</li>
                <li>Send optional product updates or tips (with your consent)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.5 Payment Processing</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process subscription payments</li>
                <li>Manage your subscription status</li>
                <li>Provide receipts and billing history</li>
                <li>Handle refund requests</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.6 Safety and Security</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Detect and prevent fraud, abuse, and security threats</li>
                <li>Enforce our Terms of Service</li>
                <li>Protect the rights and safety of our users and the public</li>
                <li>Monitor for and address technical issues</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.7 Legal Compliance</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comply with applicable laws and regulations</li>
                <li>Respond to legal requests and prevent harm</li>
                <li>Establish, exercise, or defend legal claims</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.8 Analytics and Improvement</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Understand how users interact with the Service</li>
                <li>Identify areas for improvement</li>
                <li>Develop new features</li>
                <li>Measure the effectiveness of our services</li>
              </ul>
            </section>

            <section id="ai-processing" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">3. ARTIFICIAL INTELLIGENCE AND DATA PROCESSING</h2>
              <p>Given that Meadow uses AI to enhance your journaling experience, we want to be completely transparent about how your data is processed by AI systems.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.1 AI Processing Overview</h3>
              <p>Meadow uses artificial intelligence to provide personalized insights, generate prompts, and help you discover patterns in your journaling. This section explains exactly how your data interacts with AI systems.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.2 What Data Is Processed by AI</h3>
              <p>When AI features are enabled, the following data may be processed:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Text content of your journal entries</li>
                <li>Transcriptions of voice recordings</li>
                <li>Entry metadata (dates, moods, tags)</li>
                <li>Thread and topic information</li>
                <li>Your journaling history and patterns</li>
                <li>Your stated intentions and goals</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.3 How AI Processing Works</h3>
              <p><strong>On-Demand Processing</strong>: AI analysis occurs only when you request specific features (e.g., viewing insights, requesting a reflection) or when explicitly triggered (e.g., after saving an entry). We do not continuously monitor or analyze your content.</p>
              
              <p><strong>Data Minimization</strong>: We send only the minimum necessary context to AI systems. For most features, this includes summarized or aggregated information rather than full entry text.</p>
              
              <p><strong>Sensitive Mode</strong>: When enabled, AI features use only summarized/aggregated data, never raw entry content.</p>
              
              <p><strong>No Training on Your Data</strong>: Your journal content is NOT used to train AI models. Your entries are processed to generate outputs for you, but they do not become part of any machine learning training dataset.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.4 Third-Party AI Providers</h3>
              <p>We use OpenAI's API services to power AI features. When your data is processed:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Data is transmitted securely via encrypted connections (TLS 1.2+)</li>
                <li>Data is processed according to OpenAI's enterprise API terms</li>
                <li>Data is not used by OpenAI to train their models (per their API data usage policy)</li>
                <li>Data is not retained by OpenAI beyond the time needed to process your request</li>
                <li>Processing occurs in the United States</li>
              </ul>
              <p><strong>OpenAI's Privacy Policy</strong>: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">https://openai.com/privacy</a></p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.5 AI-Generated Content</h3>
              <p>Content generated by AI (insights, reflections, prompts) is:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Generated specifically for you based on your context</li>
                <li>Not reviewed by Meadow staff</li>
                <li>Stored in your account for your future reference</li>
                <li>Deletable at your request along with your other data</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.6 Opting Out of AI Features</h3>
              <p>You have full control over AI features:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Disable All AI</strong>: Toggle AI off entirely in Settings. You can still use all core journaling features without AI.</li>
                <li><strong>Sensitive Mode</strong>: Enable this to prevent raw entry text from being sent to AI systems.</li>
                <li><strong>Per-Feature Control</strong>: Disable specific AI features while keeping others enabled.</li>
              </ul>
              <p>When AI is disabled:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No journal content is sent to AI providers</li>
                <li>You still have access to manual journaling features</li>
                <li>Prompts become generic rather than personalized</li>
                <li>Insights and reflections are not generated</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.7 AI Safety and Content Moderation</h3>
              <p>For user safety, we implement:</p>
              <p><strong>Risk Detection</strong>: AI may detect content indicating potential crisis situations. If detected:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We provide crisis resources (hotlines, support information)</li>
                <li>We do not alert authorities or third parties</li>
                <li>We do not block you from journaling</li>
                <li>We log the detection privately for safety feature improvement</li>
              </ul>
              
              <p><strong>Content Boundaries</strong>: AI will not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide medical, legal, or professional advice</li>
                <li>Diagnose mental health conditions</li>
                <li>Prescribe treatments or interventions</li>
                <li>Replace professional mental health care</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.8 Embeddings and Semantic Search</h3>
              <p>To enable features like "find related entries," we:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Generate mathematical representations ("embeddings") of your content</li>
                <li>Store these embeddings in your private database space</li>
                <li>Use embeddings to find similar content within YOUR entries only</li>
                <li>Never share embeddings across users</li>
                <li>Delete embeddings when you delete the associated content</li>
              </ul>
            </section>

            <section id="data-storage" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">4. DATA STORAGE AND SECURITY</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.1 Where Your Data Is Stored</h3>
              <p>Your data is stored on secure cloud infrastructure:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Primary Database</strong>: Supabase (PostgreSQL), hosted on AWS in the United States</li>
                <li><strong>File Storage</strong>: Supabase Storage for audio files and attachments</li>
                <li><strong>AI Processing</strong>: OpenAI API servers in the United States</li>
                <li><strong>Payment Processing</strong>: Stripe servers (PCI-DSS compliant)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.2 Security Measures</h3>
              <p>We implement comprehensive security measures:</p>
              
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Technical Safeguards</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption in transit (TLS 1.2+)</li>
                <li>Encryption at rest (AES-256)</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>Row-level security (RLS) ensuring users can only access their own data</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Automated threat detection and monitoring</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Access Controls</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Role-based access control for staff</li>
                <li>Multi-factor authentication for administrative access</li>
                <li>Principle of least privilege for data access</li>
                <li>Audit logging of all data access</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Infrastructure Security</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Firewall protection</li>
                <li>DDoS mitigation</li>
                <li>Regular security patching</li>
                <li>Isolated database instances per logical tenant</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.3 Data Isolation</h3>
              <p>Your journal data is:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Stored in a database with strict row-level security</li>
                <li>Accessible only through authenticated requests with your credentials</li>
                <li>Isolated from other users' data at the database level</li>
                <li>Never accessible to other users under any circumstances</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.4 Incident Response</h3>
              <p>In the event of a security incident:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will investigate immediately</li>
                <li>We will notify affected users within 72 hours of confirmation</li>
                <li>We will provide details on what data was affected</li>
                <li>We will take steps to prevent future incidents</li>
                <li>We will report to authorities as required by law</li>
              </ul>
            </section>

            <section id="third-party-providers" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">5. THIRD-PARTY SERVICE PROVIDERS</h2>
              <p>We engage trusted third-party service providers to help operate our Service. These providers are bound by contractual obligations to protect your data.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">5.1 Infrastructure and Hosting</h3>
              <p><strong>Supabase</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Purpose: Database, authentication, file storage, serverless functions</li>
                <li>Data Processed: All user data</li>
                <li>Location: United States (AWS)</li>
                <li>Privacy Policy: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">https://supabase.com/privacy</a></li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">5.2 AI and Machine Learning</h3>
              <p><strong>OpenAI</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Purpose: AI-powered insights, prompts, and reflections</li>
                <li>Data Processed: Journal content (as described in Section 3)</li>
                <li>Location: United States</li>
                <li>Privacy Policy: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">https://openai.com/privacy</a></li>
                <li>Note: API usage does not contribute to model training</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">5.3 Payment Processing</h3>
              <p><strong>Stripe</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Purpose: Subscription billing and payment processing</li>
                <li>Data Processed: Payment information, billing details</li>
                <li>Certifications: PCI-DSS Level 1 compliant</li>
                <li>Privacy Policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">https://stripe.com/privacy</a></li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">5.4 Analytics (If Applicable)</h3>
              <p>If we use analytics services, they may include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Anonymous usage statistics</li>
                <li>Crash reporting</li>
                <li>Performance monitoring</li>
              </ul>
              <p>We do not share journal content with analytics providers.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">5.5 Email Services (If Applicable)</h3>
              <p>For transactional emails, we may use:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email delivery services for account notifications</li>
                <li>Only email addresses and necessary metadata are shared</li>
                <li>Journal content is never included in third-party email processing</li>
              </ul>
            </section>

            <section id="data-sharing" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">6. DATA SHARING AND DISCLOSURE</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.1 We Do Not Sell Your Data</h3>
              <p><strong>We do not sell, rent, or trade your personal information to third parties for their marketing purposes. Ever.</strong></p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.2 We Do Not Share Journal Content</h3>
              <p>Your journal entries, voice recordings, and personal reflections are never shared with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Other users</li>
                <li>Advertisers</li>
                <li>Marketing companies</li>
                <li>Data brokers</li>
                <li>Any third party not essential to providing the Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.3 Limited Sharing with Service Providers</h3>
              <p>We share data with service providers only as described in Section 5, and only to the extent necessary for them to provide their services to us.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.4 Legal Requirements</h3>
              <p>We may disclose your information if required by law, such as:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>In response to a valid subpoena, court order, or legal process</li>
                <li>To protect the rights, property, or safety of Meadow, our users, or others</li>
                <li>To investigate potential violations of our Terms of Service</li>
                <li>To detect, prevent, or address fraud, security, or technical issues</li>
              </ul>
              <p><strong>Our Commitment</strong>: We will:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Notify you of legal requests for your data unless prohibited by law</li>
                <li>Challenge overly broad or inappropriate requests</li>
                <li>Provide only the minimum data legally required</li>
                <li>Never voluntarily provide bulk access to user data</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.5 Business Transfers</h3>
              <p>If Meadow is involved in a merger, acquisition, or sale of assets, your data may be transferred. We will:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Notify you before data is transferred</li>
                <li>Ensure the acquiring entity honors this Privacy Policy</li>
                <li>Give you the opportunity to delete your data before transfer</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.6 Aggregated and De-Identified Data</h3>
              <p>We may share aggregated, de-identified data that cannot reasonably be used to identify you, such as:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Total number of users</li>
                <li>General usage statistics</li>
                <li>Feature popularity metrics</li>
              </ul>
            </section>

            <section id="your-rights" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">7. YOUR RIGHTS AND CHOICES</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.1 Access Your Data</h3>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access all journal entries you've created</li>
                <li>Export your data in a portable format</li>
                <li>View what information we have about you</li>
                <li>Request a copy of your personal data</li>
              </ul>
              <p><strong>How to Exercise</strong>: Use the "Export Data" feature in Settings, or contact us at privacy@[yourdomain].com.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.2 Correct Your Data</h3>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Edit or correct any journal entry</li>
                <li>Update your account information</li>
                <li>Modify your profile details</li>
              </ul>
              <p><strong>How to Exercise</strong>: Edit directly within the app, or contact us for assistance.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.3 Delete Your Data</h3>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Delete individual journal entries</li>
                <li>Delete your entire account and all associated data</li>
                <li>Request deletion of specific data categories</li>
              </ul>
              <p><strong>How to Exercise</strong>:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Delete entries within the app</li>
                <li>Use "Delete Account" in Settings for full deletion</li>
                <li>Contact us for specific deletion requests</li>
              </ul>
              <p><strong>What Happens When You Delete</strong>:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Journal entries are permanently deleted within 30 days</li>
                <li>Backups are purged within 90 days</li>
                <li>Aggregated, de-identified analytics may persist</li>
                <li>Legal hold data may be retained as required by law</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.4 Data Portability</h3>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Export your journal entries in a standard format (JSON, PDF)</li>
                <li>Take your data to another service</li>
                <li>Receive a machine-readable copy of your data</li>
              </ul>
              <p><strong>How to Exercise</strong>: Use the "Export" feature in Settings.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.5 Opt-Out Rights</h3>
              <p>You can opt out of:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-powered features (toggle in Settings)</li>
                <li>Marketing communications (unsubscribe link in emails)</li>
                <li>Analytics tracking (where applicable)</li>
                <li>Non-essential cookies</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.6 Restrict Processing</h3>
              <p>You can request that we restrict processing of your data in certain circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>While we verify the accuracy of data you've disputed</li>
                <li>If processing is unlawful but you don't want deletion</li>
                <li>If we no longer need the data but you need it for legal claims</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.7 Rights for Specific Jurisdictions</h3>
              
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">California Residents (CCPA/CPRA)</h4>
              <p>You have additional rights including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to know what personal information we collect</li>
                <li>Right to delete personal information</li>
                <li>Right to opt out of "sales" (we do not sell data)</li>
                <li>Right to non-discrimination for exercising your rights</li>
                <li>Right to correct inaccurate personal information</li>
                <li>Right to limit use of sensitive personal information</li>
              </ul>
              <p>To exercise these rights, contact us at privacy@[yourdomain].com or use our in-app tools.</p>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">European Economic Area Residents (GDPR)</h4>
              <p>You have additional rights including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to access</li>
                <li>Right to rectification</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object</li>
                <li>Rights related to automated decision-making</li>
              </ul>
              <p><strong>Legal Basis for Processing</strong>: We process your data based on:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contract performance (providing the Service)</li>
                <li>Legitimate interests (improving the Service, security)</li>
                <li>Consent (marketing communications, optional features)</li>
                <li>Legal obligation (compliance requirements)</li>
              </ul>
              <p><strong>Data Protection Authority</strong>: You have the right to lodge a complaint with your local data protection authority.</p>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Other Jurisdictions</h4>
              <p>We respect privacy rights under applicable local laws. Contact us to exercise your rights under your jurisdiction's laws.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.8 How to Exercise Your Rights</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>In-App</strong>: Use Settings &gt; Privacy or Settings &gt; Account</li>
                <li><strong>Email</strong>: privacy@[yourdomain].com</li>
                <li><strong>Response Time</strong>: Within 30 days (45 days for complex requests)</li>
                <li><strong>Verification</strong>: We may verify your identity before processing requests</li>
              </ul>
            </section>

            <section id="data-retention" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">8. DATA RETENTION</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">8.1 Active Account Data</h3>
              <p>While your account is active, we retain:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All journal entries and content you create</li>
                <li>Account information and preferences</li>
                <li>Usage data for service improvement</li>
                <li>Transaction and billing history</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">8.2 Deleted Content</h3>
              <p>When you delete content:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Entries</strong>: Removed from active database immediately, purged from backups within 90 days</li>
                <li><strong>Voice Recordings</strong>: Deleted immediately along with transcriptions</li>
                <li><strong>Attachments</strong>: Deleted immediately</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">8.3 Account Deletion</h3>
              <p>When you delete your account:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All personal data is scheduled for deletion</li>
                <li>Active database deletion: Within 30 days</li>
                <li>Backup purge: Within 90 days</li>
                <li>Some data may be retained for legal compliance (anonymized where possible)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">8.4 Retention for Legal Purposes</h3>
              <p>We may retain certain data longer if:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Required by law (tax records, legal holds)</li>
                <li>Needed to resolve disputes</li>
                <li>Necessary to enforce our agreements</li>
                <li>Required for fraud prevention</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">8.5 Inactive Accounts</h3>
              <p>For accounts inactive for extended periods:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We may send reminder emails</li>
                <li>We do not automatically delete accounts</li>
                <li>Your data remains secure until you request deletion</li>
              </ul>
            </section>

            <section id="international-transfers" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">9. INTERNATIONAL DATA TRANSFERS</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">9.1 Data Location</h3>
              <p>Our primary data storage and processing occurs in the United States.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">9.2 Transfer Mechanisms</h3>
              <p>For users outside the United States, we transfer data using:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Standard Contractual Clauses (SCCs) approved by relevant authorities</li>
                <li>Compliance with applicable data transfer frameworks</li>
                <li>Ensuring adequate protection as required by your jurisdiction</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">9.3 Your Consent</h3>
              <p>By using the Service, you consent to the transfer of your data to the United States and other countries where our service providers operate, understanding that data protection laws may differ from your jurisdiction.</p>
            </section>

            <section id="childrens-privacy" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">10. CHILDREN'S PRIVACY</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">10.1 Age Requirement</h3>
              <p>Meadow is not intended for children under the age of 13 (or the applicable age of digital consent in your jurisdiction).</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">10.2 No Knowing Collection</h3>
              <p>We do not knowingly collect personal information from children under 13. If we learn that we have collected data from a child under 13, we will delete it promptly.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">10.3 Parental Rights</h3>
              <p>If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@[yourdomain].com, and we will take steps to delete such information.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">10.4 Age Verification</h3>
              <p>We may implement age verification measures and reserve the right to terminate accounts if we determine the user is underage.</p>
            </section>

            <section id="cookies" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">11. COOKIES AND TRACKING TECHNOLOGIES</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">11.1 What We Use</h3>
              <p>We use limited cookies and similar technologies:</p>
              
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Essential Cookies</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authentication tokens to keep you logged in</li>
                <li>Security tokens to prevent CSRF attacks</li>
                <li>Session management</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Functional Cookies</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Preference storage (theme, settings)</li>
                <li>Feature state persistence</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Analytics (If Applicable)</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Anonymous usage statistics</li>
                <li>Performance monitoring</li>
                <li>Error tracking</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">11.2 What We Don't Use</h3>
              <p>We do not use:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Advertising cookies</li>
                <li>Cross-site tracking</li>
                <li>Third-party marketing pixels</li>
                <li>Social media tracking widgets</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">11.3 Your Cookie Choices</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Most browsers allow you to refuse cookies</li>
                <li>Essential cookies are required for the Service to function</li>
                <li>You can clear cookies at any time through your browser</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">11.4 Do Not Track</h3>
              <p>We respect Do Not Track (DNT) signals where technically feasible.</p>
            </section>

            <section id="changes" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">12. CHANGES TO THIS PRIVACY POLICY</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">12.1 How We Update</h3>
              <p>We may update this Privacy Policy from time to time. When we do:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will update the "Last Updated" date</li>
                <li>For material changes, we will notify you via:
                  <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                    <li>Email to your registered address</li>
                    <li>Prominent notice in the app</li>
                    <li>Banner on our website</li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">12.2 Your Continued Use</h3>
              <p>Your continued use of the Service after changes constitutes acceptance of the updated Privacy Policy. If you disagree with changes, you should stop using the Service and may request account deletion.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">12.3 Review History</h3>
              <p>Previous versions of this Privacy Policy are available upon request.</p>
            </section>

            <section id="contact" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">13. CONTACT US</h2>
              <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
              
              <p><strong>Email</strong>: privacy@[yourdomain].com</p>
              
              <p><strong>Mailing Address</strong>:<br />
              [Your Company Name]<br />
              [Street Address]<br />
              [City, State ZIP Code]<br />
              [Country]</p>
              
              <p><strong>Data Protection Officer</strong> (if applicable):<br />
              dpo@[yourdomain].com</p>
              
              <p><strong>Response Time</strong>: We aim to respond to all privacy inquiries within 30 days.</p>
            </section>

            <div className="mt-12 pt-8 border-t border-stone-200">
              <h2 className="text-2xl font-serif text-text-primary mb-4">SUMMARY OF KEY POINTS</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-2 px-4 font-semibold text-text-primary">Topic</th>
                      <th className="text-left py-2 px-4 font-semibold text-text-primary">Our Practice</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-stone-100">
                      <td className="py-2 px-4 font-medium text-text-primary">Selling Data</td>
                      <td className="py-2 px-4">We NEVER sell your data</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-2 px-4 font-medium text-text-primary">Journal Privacy</td>
                      <td className="py-2 px-4">Your entries are private and encrypted</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-2 px-4 font-medium text-text-primary">AI Processing</td>
                      <td className="py-2 px-4">Opt-in, transparent, no model training on your data</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-2 px-4 font-medium text-text-primary">Third Parties</td>
                      <td className="py-2 px-4">Limited to essential service providers</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-2 px-4 font-medium text-text-primary">Your Control</td>
                      <td className="py-2 px-4">Full access, export, and deletion rights</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-2 px-4 font-medium text-text-primary">Security</td>
                      <td className="py-2 px-4">Industry-standard encryption and protection</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-medium text-text-primary">Children</td>
                      <td className="py-2 px-4">Not for users under 13</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-text-secondary mt-6 italic">
                This Privacy Policy is effective as of December 21, 2025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
