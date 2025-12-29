import React from 'react';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, FileText } from 'lucide-react';

interface TermsProps {
  onChangeView: (view: ViewState) => void;
}

const Terms: React.FC<TermsProps> = ({ onChangeView }) => {
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
              <h1 className="font-serif text-4xl text-text-primary mb-2">Terms of Service</h1>
              <p className="text-text-secondary font-light">Last Updated: December 21, 2025</p>
              <p className="text-text-secondary font-light">Effective Date: December 21, 2025</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sage/10 text-sage flex items-center justify-center">
              <FileText size={22} />
            </div>
          </div>

          <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-text-primary prose-p:text-text-secondary prose-li:text-text-secondary prose-strong:text-text-primary">
            <div className="mb-8">
              <p className="text-lg font-medium text-text-primary mb-4">
                <strong>Meadow — Personal Journaling Application</strong>
              </p>
              <p className="text-sm text-text-secondary mb-6">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and [Your Company Name] ("Meadow," "Company," "we," "us," or "our") governing your access to and use of the Meadow application, website, and related services (collectively, the "Service").
              </p>
              <p className="text-sm font-semibold text-text-primary mb-6">
                <strong>BY ACCESSING OR USING THE SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS.</strong> If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p className="text-sm text-text-secondary">
                If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms, and "you" refers to both you individually and the organization.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-serif text-text-primary mb-4">TABLE OF CONTENTS</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><a href="#eligibility" className="text-sage hover:underline">Eligibility and Account Registration</a></li>
                <li><a href="#description" className="text-sage hover:underline">Description of Service</a></li>
                <li><a href="#subscriptions" className="text-sage hover:underline">Subscription Plans and Payments</a></li>
                <li><a href="#user-content" className="text-sage hover:underline">User Content</a></li>
                <li><a href="#acceptable-use" className="text-sage hover:underline">Acceptable Use Policy</a></li>
                <li><a href="#ai-features" className="text-sage hover:underline">Artificial Intelligence Features</a></li>
                <li><a href="#mental-health" className="text-sage hover:underline">Mental Health and Wellness Disclaimer</a></li>
                <li><a href="#intellectual-property" className="text-sage hover:underline">Intellectual Property</a></li>
                <li><a href="#privacy" className="text-sage hover:underline">Privacy and Data Protection</a></li>
                <li><a href="#third-party" className="text-sage hover:underline">Third-Party Services and Links</a></li>
                <li><a href="#disclaimers" className="text-sage hover:underline">Disclaimers</a></li>
                <li><a href="#limitation" className="text-sage hover:underline">Limitation of Liability</a></li>
                <li><a href="#indemnification" className="text-sage hover:underline">Indemnification</a></li>
                <li><a href="#termination" className="text-sage hover:underline">Term and Termination</a></li>
                <li><a href="#dispute" className="text-sage hover:underline">Dispute Resolution</a></li>
                <li><a href="#general" className="text-sage hover:underline">General Provisions</a></li>
                <li><a href="#contact" className="text-sage hover:underline">Contact Information</a></li>
              </ol>
            </div>

            <section id="eligibility" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">1. ELIGIBILITY AND ACCOUNT REGISTRATION</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">1.1 Age Requirements</h3>
              <p>You must be at least 13 years of age (or the age of digital consent in your jurisdiction, whichever is higher) to use the Service. If you are under 18, you represent that you have your parent's or legal guardian's permission to use the Service.</p>
              <p>By using the Service, you represent and warrant that you meet these age requirements.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">1.2 Account Creation</h3>
              <p>To access certain features of the Service, you must create an account. When creating an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security and confidentiality of your login credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">1.3 Account Security</h3>
              <p>You are solely responsible for maintaining the confidentiality of your account credentials. We are not liable for any loss or damage arising from your failure to protect your account information.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">1.4 One Account Per User</h3>
              <p>Each user may maintain only one account. Creating multiple accounts to circumvent restrictions, abuse promotions, or for any fraudulent purpose is prohibited and may result in termination of all accounts.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">1.5 Account Verification</h3>
              <p>We reserve the right to verify your identity or eligibility at any time. Failure to provide requested verification may result in suspension or termination of your account.</p>
            </section>

            <section id="description" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">2. DESCRIPTION OF SERVICE</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.1 Core Service</h3>
              <p>Meadow is a personal journaling application that provides:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Journal Entry Creation</strong>: Write, organize, and store personal journal entries</li>
                <li><strong>Voice Recording</strong>: Record audio entries with optional transcription</li>
                <li><strong>Organization Tools</strong>: Threads, tags, and categorization of entries</li>
                <li><strong>Personal Insights</strong>: AI-powered reflections and observations (optional)</li>
                <li><strong>Guided Journeys</strong>: Structured journaling programs</li>
                <li><strong>Reflection Spaces</strong>: Mirror, TimeVault, Decision Lab, and other reflection tools</li>
                <li><strong>Progress Tracking</strong>: Streaks, milestones, and personal statistics</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.2 Service Availability</h3>
              <p>We strive to provide reliable access to the Service but do not guarantee uninterrupted availability. The Service may be temporarily unavailable due to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Scheduled maintenance (we will provide advance notice when possible)</li>
                <li>Emergency maintenance or repairs</li>
                <li>Technical difficulties or system failures</li>
                <li>Circumstances beyond our reasonable control</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.3 Service Modifications</h3>
              <p>We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice. This includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Adding or removing features</li>
                <li>Changing the user interface</li>
                <li>Updating AI models and capabilities</li>
                <li>Modifying pricing or subscription tiers</li>
              </ul>
              <p>We will make reasonable efforts to notify you of material changes that significantly affect your use of the Service.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">2.4 Beta Features</h3>
              <p>We may offer beta or experimental features. These features:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Are provided "as is" without warranty</li>
                <li>May be modified or discontinued without notice</li>
                <li>May have reduced reliability or functionality</li>
                <li>Are subject to additional terms if specified</li>
              </ul>
            </section>

            <section id="subscriptions" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">3. SUBSCRIPTION PLANS AND PAYMENTS</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.1 Subscription Tiers</h3>
              <p>Meadow offers the following subscription tiers:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Free</strong>: Basic journaling features with limited AI capabilities</li>
                <li><strong>Pro</strong>: Enhanced features including advanced AI insights</li>
                <li><strong>Premium</strong>: Full access to all features including premium AI capabilities</li>
              </ul>
              <p>Specific features included in each tier are described on our website and within the app. We reserve the right to modify tier features with reasonable notice.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.2 Pricing</h3>
              <p>Current pricing is displayed on our website and within the app. Prices:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Are stated in U.S. dollars unless otherwise specified</li>
                <li>May vary by region</li>
                <li>Do not include applicable taxes, which will be added where required</li>
                <li>Are subject to change with notice to existing subscribers</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.3 Billing</h3>
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Payment Processing</h4>
              <p>All payments are processed securely through Stripe. By subscribing, you authorize us to charge your payment method on file.</p>
              
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Billing Cycle</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Monthly subscriptions are billed on the same date each month</li>
                <li>Annual subscriptions are billed on the same date each year</li>
                <li>If your billing date falls on a day not in a given month, you will be billed on the last day of that month</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Automatic Renewal</h4>
              <p>Subscriptions automatically renew at the end of each billing period unless you cancel before the renewal date. You authorize us to charge the then-current subscription fee upon renewal.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.4 Free Trials</h3>
              <p>We may offer free trials at our discretion. Free trial terms:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Are limited to new users or as otherwise specified</li>
                <li>Require a valid payment method</li>
                <li>Will convert to a paid subscription at the end of the trial period unless cancelled</li>
                <li>May be limited to one per user</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.5 Cancellation</h3>
              <p>You may cancel your subscription at any time:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Through your account settings</li>
                <li>By contacting customer support</li>
              </ul>
              <p>Upon cancellation:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You retain access to paid features until the end of your current billing period</li>
                <li>Your subscription will not renew</li>
                <li>You will retain access to Free tier features</li>
                <li>Your data will remain accessible unless you delete your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.6 Refunds</h3>
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">General Policy</h4>
              <p>Subscription fees are generally non-refundable. However, we may provide refunds at our sole discretion in cases of:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Technical issues preventing use of the Service</li>
                <li>Billing errors</li>
                <li>Other circumstances we deem appropriate</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">How to Request a Refund</h4>
              <p>Contact support@[yourdomain].com with your account email and reason for the refund request.</p>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Timeframe</h4>
              <p>Refund requests must be submitted within 30 days of the charge in question.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.7 Price Changes</h3>
              <p>We may change subscription prices with at least 30 days' notice to current subscribers. Price changes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Take effect at the start of your next billing period</li>
                <li>Do not affect the current billing period</li>
                <li>Will be communicated via email and/or in-app notification</li>
              </ul>
              <p>If you disagree with a price change, you may cancel before the new price takes effect.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.8 Taxes</h3>
              <p>You are responsible for all applicable taxes. We will collect and remit taxes where legally required. Tax amounts will be shown before payment is processed.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">3.9 Payment Failures</h3>
              <p>If a payment fails:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will attempt to charge your payment method again</li>
                <li>We may suspend access to paid features after multiple failures</li>
                <li>Your subscription may be cancelled if payment is not received</li>
                <li>You remain responsible for any unpaid fees</li>
              </ul>
            </section>

            <section id="user-content" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">4. USER CONTENT</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.1 Definition of User Content</h3>
              <p>"User Content" includes all content you create, upload, or store through the Service, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Journal entries (text)</li>
                <li>Voice recordings and transcriptions</li>
                <li>Tags, titles, and metadata</li>
                <li>Mood selections and other inputs</li>
                <li>Responses to prompts and journeys</li>
                <li>Time capsule letters</li>
                <li>Decision lab entries</li>
                <li>Any other content you create within the Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.2 Ownership of User Content</h3>
              <p><strong>You retain full ownership of all User Content you create.</strong> We do not claim any ownership rights to your User Content.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.3 License to Meadow</h3>
              <p>By creating User Content, you grant us a limited license to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Store and back up your content on our servers</li>
                <li>Process your content to provide the Service (including AI features)</li>
                <li>Display your content back to you</li>
                <li>Transmit your content as necessary to provide the Service</li>
              </ul>
              <p>This license:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Is non-exclusive and royalty-free</li>
                <li>Exists solely to enable us to provide the Service</li>
                <li>Terminates when you delete the content or your account</li>
                <li>Does not grant us the right to sell, share, or disclose your content to third parties (except as described in our Privacy Policy)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.4 User Content Standards</h3>
              <p>You represent and warrant that your User Content:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Does not infringe any third party's intellectual property rights</li>
                <li>Does not violate any applicable law or regulation</li>
                <li>Does not contain material that is defamatory, obscene, or harmful</li>
                <li>Does not contain malware, viruses, or harmful code</li>
                <li>Is not intended to harass, abuse, or harm others</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.5 No Obligation to Monitor</h3>
              <p>We are not obligated to monitor User Content, but we reserve the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Review content for safety and security purposes</li>
                <li>Remove content that violates these Terms</li>
                <li>Suspend or terminate accounts that violate these Terms</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.6 Content Backup and Export</h3>
              <p>You are responsible for maintaining your own backups of important content. While we implement backup systems, we encourage you to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Regularly export your data using our export feature</li>
                <li>Keep copies of important entries elsewhere</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">4.7 Content Deletion</h3>
              <p>When you delete User Content:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>It is removed from active databases promptly</li>
                <li>It may persist in backups for up to 90 days</li>
                <li>It cannot be recovered after deletion is complete</li>
              </ul>
            </section>

            <section id="acceptable-use" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">5. ACCEPTABLE USE POLICY</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">5.1 Permitted Use</h3>
              <p>You may use the Service for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal journaling and self-reflection</li>
                <li>Tracking personal goals and intentions</li>
                <li>Organizing your thoughts and experiences</li>
                <li>Participating in guided journeys</li>
                <li>Other lawful personal purposes consistent with the Service's design</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">5.2 Prohibited Conduct</h3>
              <p>You agree NOT to:</p>
              
              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Security Violations</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Attempt to gain unauthorized access to the Service or other accounts</li>
                <li>Circumvent, disable, or interfere with security features</li>
                <li>Probe, scan, or test the vulnerability of the Service</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Abuse and Misuse</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the Service for any illegal purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Use the Service to harass, abuse, or harm others</li>
                <li>Impersonate any person or entity</li>
                <li>Create accounts for anyone other than yourself without permission</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Content Violations</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Upload malware, viruses, or harmful code</li>
                <li>Use the Service to store illegal content</li>
                <li>Share login credentials with others</li>
                <li>Attempt to access other users' content</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Commercial Restrictions</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the Service for commercial purposes without authorization</li>
                <li>Resell, sublicense, or transfer access to the Service</li>
                <li>Scrape, harvest, or collect data from the Service</li>
                <li>Use the Service to compete with Meadow</li>
              </ul>

              <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">Technical Restrictions</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>Modify, adapt, or create derivative works of the Service</li>
                <li>Remove or alter any proprietary notices or labels</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">5.3 Enforcement</h3>
              <p>Violations of this Acceptable Use Policy may result in:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Warning or notice of violation</li>
                <li>Temporary suspension of access</li>
                <li>Permanent termination of account</li>
                <li>Legal action if warranted</li>
              </ul>
              <p>We reserve the right to determine, in our sole discretion, whether conduct violates this policy.</p>
            </section>

            <section id="ai-features" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">6. ARTIFICIAL INTELLIGENCE FEATURES</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.1 AI-Powered Features</h3>
              <p>Meadow includes optional AI-powered features that provide:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personalized journaling prompts ("Daily Spark")</li>
                <li>Reflections and insights based on your writing</li>
                <li>Pattern and theme observations</li>
                <li>Weekly and annual summaries</li>
                <li>Guidance for decision-making (Decision Lab)</li>
                <li>Other AI-generated content</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.2 How AI Works</h3>
              <p>Our AI features:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process your User Content to generate personalized outputs</li>
                <li>Use machine learning models provided by third-party services (OpenAI)</li>
                <li>Generate content based on patterns in your writing</li>
                <li>Are designed to support, not replace, your own reflection</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.3 AI Limitations</h3>
              <p><strong>AI-generated content has important limitations:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>It is generated by machine learning models, not humans</li>
                <li>It may be inaccurate, incomplete, or inappropriate</li>
                <li>It may not fully understand context or nuance</li>
                <li>It cannot know information you haven't shared</li>
                <li>It may occasionally produce unexpected outputs</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.4 AI Is Not Professional Advice</h3>
              <p><strong>AI-generated content is NOT:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Medical or health advice</li>
                <li>Mental health treatment or therapy</li>
                <li>Professional counseling</li>
                <li>Legal advice</li>
                <li>Financial advice</li>
                <li>A substitute for professional help</li>
              </ul>
              <p>AI outputs are for informational and reflective purposes only. See Section 7 for important mental health disclaimers.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.5 User Responsibility</h3>
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Evaluating AI-generated content critically</li>
                <li>Not relying solely on AI outputs for important decisions</li>
                <li>Seeking professional help when needed</li>
                <li>Using your own judgment</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.6 AI Opt-Out</h3>
              <p>You may disable AI features at any time:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Toggle AI off in Settings</li>
                <li>Use Sensitive Mode for limited AI interaction</li>
                <li>Continue using core journaling features without AI</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.7 AI Training</h3>
              <p><strong>Your User Content is NOT used to train AI models.</strong> Your data is processed to generate outputs for you but does not become part of any machine learning training dataset.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">6.8 Changes to AI Features</h3>
              <p>We may modify, improve, or discontinue AI features at any time. This includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Updating the underlying AI models</li>
                <li>Changing how AI features work</li>
                <li>Adding or removing specific AI capabilities</li>
              </ul>
            </section>

            <section id="mental-health" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">7. MENTAL HEALTH AND WELLNESS DISCLAIMER</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.1 Not a Mental Health Service</h3>
              <p><strong>MEADOW IS NOT A MENTAL HEALTH SERVICE, THERAPY PLATFORM, OR MEDICAL TREATMENT.</strong></p>
              <p>The Service is designed as a personal journaling tool to support self-reflection. It is not intended to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Diagnose mental health conditions</li>
                <li>Provide treatment for mental illness</li>
                <li>Replace professional mental health care</li>
                <li>Serve as crisis intervention</li>
                <li>Substitute for therapy or counseling</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.2 Not Medical Advice</h3>
              <p>Nothing in the Service constitutes medical advice. AI-generated insights, reflections, and suggestions are:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>For informational and reflective purposes only</li>
                <li>Not personalized medical or mental health guidance</li>
                <li>Not evaluated or reviewed by medical professionals</li>
                <li>Not intended to treat any condition</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.3 Seek Professional Help</h3>
              <p>If you are experiencing:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mental health challenges</li>
                <li>Emotional distress</li>
                <li>Thoughts of self-harm or suicide</li>
                <li>A mental health crisis</li>
              </ul>
              <p><strong>Please seek help from qualified professionals:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>National Suicide Prevention Lifeline</strong>: 988 (US)</li>
                <li><strong>Crisis Text Line</strong>: Text HOME to 741741 (US)</li>
                <li><strong>International Association for Suicide Prevention</strong>: https://www.iasp.info/resources/Crisis_Centres/</li>
                <li>Your doctor, therapist, or mental health provider</li>
                <li>Emergency services (911 in the US)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.4 No Therapeutic Relationship</h3>
              <p>Using Meadow does not create:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A therapist-client relationship</li>
                <li>A doctor-patient relationship</li>
                <li>Any professional treatment relationship</li>
              </ul>
              <p>We do not provide clinical oversight of your use of the Service.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.5 User Acknowledgment</h3>
              <p>By using the Service, you acknowledge that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You understand the Service is not a substitute for professional mental health care</li>
                <li>You will seek appropriate professional help when needed</li>
                <li>You use the Service at your own risk regarding mental health matters</li>
                <li>AI-generated content may not be appropriate for your situation</li>
                <li>The Service is not equipped to handle mental health emergencies</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">7.6 Safety Features</h3>
              <p>While we include some safety features (such as providing crisis resources when concerning content is detected), these features:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Are not a substitute for professional crisis intervention</li>
                <li>May not detect all concerning content</li>
                <li>Should not be relied upon as a safety system</li>
                <li>Do not constitute mental health monitoring</li>
              </ul>
            </section>

            <section id="intellectual-property" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">8. INTELLECTUAL PROPERTY</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">8.1 Meadow's Intellectual Property</h3>
              <p>The Service, including its original content, features, and functionality, is owned by Meadow and protected by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copyright law</li>
                <li>Trademark law</li>
                <li>Trade secret law</li>
                <li>Other intellectual property laws</li>
              </ul>
              <p>This includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The Meadow name, logo, and branding</li>
                <li>The design, layout, and user interface</li>
                <li>Software code and architecture</li>
                <li>AI prompts and configurations</li>
                <li>Marketing materials and documentation</li>
                <li>Journeys and guided content we create</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">8.2 Limited License to Users</h3>
              <p>Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and use the Service for personal purposes</li>
                <li>Use features and functionality as intended</li>
                <li>Export your own User Content</li>
              </ul>
              <p>This license does not include the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copy, modify, or distribute the Service</li>
                <li>Create derivative works</li>
                <li>Reverse engineer or decompile</li>
                <li>Use for commercial purposes</li>
                <li>Sublicense or transfer your access</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">8.3 Feedback</h3>
              <p>If you provide feedback, suggestions, or ideas about the Service, you grant us the right to use this feedback without restriction or compensation. This includes the right to incorporate feedback into the Service.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">8.4 DMCA and Copyright Infringement</h3>
              <p>If you believe content on the Service infringes your copyright, please contact us with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your contact information</li>
                <li>Description of the copyrighted work</li>
                <li>Location of the infringing material</li>
                <li>Statement of good faith belief</li>
                <li>Statement under penalty of perjury</li>
                <li>Your physical or electronic signature</li>
              </ul>
              <p><strong>DMCA Contact</strong>: legal@[yourdomain].com</p>
            </section>

            <section id="privacy" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">9. PRIVACY AND DATA PROTECTION</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">9.1 Privacy Policy</h3>
              <p>Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">9.2 Data Security</h3>
              <p>We implement industry-standard security measures to protect your data, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption in transit and at rest</li>
                <li>Secure authentication systems</li>
                <li>Access controls and monitoring</li>
                <li>Regular security assessments</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">9.3 Your Privacy Rights</h3>
              <p>You have rights regarding your personal data, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and portability</li>
                <li>Correction and deletion</li>
                <li>Opting out of certain processing</li>
                <li>Rights under applicable data protection laws (GDPR, CCPA, etc.)</li>
              </ul>
              <p>See our Privacy Policy for details on exercising these rights.</p>
            </section>

            <section id="third-party" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">10. THIRD-PARTY SERVICES AND LINKS</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">10.1 Third-Party Service Providers</h3>
              <p>The Service relies on third-party providers for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hosting and infrastructure (Supabase)</li>
                <li>AI capabilities (OpenAI)</li>
                <li>Payment processing (Stripe)</li>
                <li>Other essential services</li>
              </ul>
              <p>These providers are governed by their own terms and privacy policies.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">10.2 Third-Party Links</h3>
              <p>The Service may contain links to third-party websites or services. We are not responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The content of third-party sites</li>
                <li>Privacy practices of third parties</li>
                <li>Any damages from your use of third-party services</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">10.3 App Stores</h3>
              <p>If you access the Service through an app store (Apple App Store, Google Play), you are also bound by that app store's terms of service.</p>
            </section>

            <section id="disclaimers" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">11. DISCLAIMERS</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">11.1 "As Is" and "As Available"</h3>
              <p><strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</strong></p>
              <p>We disclaim all warranties, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or completeness</li>
                <li>Reliability or availability</li>
                <li>Security</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">11.2 No Guarantee of Results</h3>
              <p>We do not guarantee that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The Service will meet your specific needs</li>
                <li>The Service will be uninterrupted or error-free</li>
                <li>Results from using the Service will be accurate</li>
                <li>AI-generated content will be helpful or appropriate</li>
                <li>Defects will be corrected</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">11.3 Technology Limitations</h3>
              <p>We are not responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Internet or connectivity issues</li>
                <li>Device compatibility problems</li>
                <li>Third-party service outages</li>
                <li>Data loss due to system failures</li>
                <li>Consequences of technical errors</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">11.4 User Content Risks</h3>
              <p>You are solely responsible for your User Content. We do not guarantee:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Privacy of content you share</li>
                <li>Permanent storage of your content</li>
                <li>Recovery of deleted content</li>
              </ul>
            </section>

            <section id="limitation" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">12. LIMITATION OF LIABILITY</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">12.1 Limitation of Damages</h3>
              <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL MEADOW, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, use, or goodwill</li>
                <li>Personal injury or emotional distress</li>
                <li>Any damages arising from:
                  <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                    <li>Your use or inability to use the Service</li>
                    <li>Any content obtained from the Service</li>
                    <li>Unauthorized access to your data</li>
                    <li>Conduct of third parties</li>
                    <li>AI-generated content</li>
                    <li>Any other matter relating to the Service</li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">12.2 Cap on Liability</h3>
              <p><strong>OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The amount you paid us in the 12 months preceding the claim, OR</li>
                <li>One hundred U.S. dollars ($100)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">12.3 Exceptions</h3>
              <p>Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability is limited to the maximum extent permitted by law.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">12.4 Essential Purpose</h3>
              <p>The limitations in this section apply even if any remedy fails of its essential purpose.</p>
            </section>

            <section id="indemnification" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">13. INDEMNIFICATION</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">13.1 Your Indemnification Obligation</h3>
              <p>You agree to indemnify, defend, and hold harmless Meadow, its affiliates, officers, directors, employees, and agents from and against any claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising from:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use of the Service</li>
                <li>Your User Content</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your violation of applicable laws</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">13.2 Indemnification Process</h3>
              <p>We will:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Notify you of any such claim</li>
                <li>Provide you with reasonable assistance (at your expense)</li>
                <li>Allow you to control the defense and settlement</li>
              </ul>
              <p>We may participate in the defense with our own counsel at our expense.</p>
            </section>

            <section id="termination" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">14. TERM AND TERMINATION</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">14.1 Term</h3>
              <p>These Terms are effective upon your first use of the Service and continue until terminated.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">14.2 Termination by You</h3>
              <p>You may terminate your account at any time by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Deleting your account in Settings</li>
                <li>Contacting customer support</li>
                <li>Ceasing use of the Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">14.3 Termination by Us</h3>
              <p>We may suspend or terminate your access immediately, without notice, if:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You violate these Terms</li>
                <li>You violate the Acceptable Use Policy</li>
                <li>We are required to by law</li>
                <li>We discontinue the Service</li>
                <li>Your conduct harms other users</li>
                <li>Your conduct creates legal risk for us</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">14.4 Effect of Termination</h3>
              <p>Upon termination:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your right to use the Service ends immediately</li>
                <li>You remain responsible for any unpaid fees</li>
                <li>Provisions that should survive termination will survive (including disclaimers, limitations of liability, and dispute resolution)</li>
                <li>We will delete your data according to our Privacy Policy</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">14.5 Suspension</h3>
              <p>We may suspend your access temporarily while investigating potential violations. During suspension:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may not access the Service</li>
                <li>We are not obligated to provide notice or explanation</li>
                <li>We may reinstate access at our discretion</li>
              </ul>
            </section>

            <section id="dispute" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">15. DISPUTE RESOLUTION</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">15.1 Informal Resolution</h3>
              <p>Before filing a formal dispute, you agree to attempt informal resolution by contacting us at legal@[yourdomain].com. Most disputes can be resolved through good-faith communication.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">15.2 Binding Arbitration</h3>
              <p><strong>If informal resolution fails, you and Meadow agree to resolve any dispute through binding arbitration</strong>, except as specified below.</p>
              <p>Arbitration will be conducted by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A neutral arbitrator</li>
                <li>Under the rules of the American Arbitration Association (AAA)</li>
                <li>In [Your State/City] or another mutually agreed location</li>
                <li>With each party bearing its own costs (unless otherwise required by law)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">15.3 Exceptions to Arbitration</h3>
              <p>Either party may bring claims in small claims court if they qualify. Either party may seek injunctive relief in court to protect intellectual property rights.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">15.4 Class Action Waiver</h3>
              <p><strong>YOU AND MEADOW AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE PROCEEDING.</strong></p>
              <p>Unless both you and we agree, no arbitrator or judge may consolidate claims or preside over any form of representative or class proceeding.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">15.5 Opt-Out</h3>
              <p>You may opt out of the arbitration and class action waiver provisions by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Sending written notice within 30 days of first using the Service</li>
                <li>Mailing to: [Your Company Address]</li>
                <li>Including your name, email, and clear statement of opt-out</li>
              </ul>
              <p>If you opt out, disputes will be resolved in the courts of [Your State].</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">15.6 Governing Law</h3>
              <p>These Terms are governed by the laws of the State of [Your State], without regard to conflict of law principles.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">15.7 Venue</h3>
              <p>Any legal action not subject to arbitration shall be brought in the state or federal courts located in [Your City, State].</p>
            </section>

            <section id="general" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">16. GENERAL PROVISIONS</h2>
              
              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.1 Entire Agreement</h3>
              <p>These Terms, together with our Privacy Policy and any supplemental terms, constitute the entire agreement between you and Meadow regarding the Service.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.2 Amendments</h3>
              <p>We may modify these Terms at any time. We will notify you of material changes by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the updated Terms on our website</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending email notification for significant changes</li>
                <li>Providing in-app notice</li>
              </ul>
              <p>Continued use after changes constitutes acceptance of the modified Terms.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.3 Waiver</h3>
              <p>Our failure to enforce any right or provision of these Terms shall not be deemed a waiver. Any waiver must be in writing.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.4 Severability</h3>
              <p>If any provision is found unenforceable, the remaining provisions continue in effect. The unenforceable provision will be modified to the minimum extent necessary to make it enforceable.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.5 Assignment</h3>
              <p>You may not assign or transfer these Terms without our written consent. We may assign these Terms freely, including in connection with a merger or acquisition.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.6 No Third-Party Beneficiaries</h3>
              <p>These Terms do not create any third-party beneficiary rights.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.7 Force Majeure</h3>
              <p>We are not liable for failures or delays caused by circumstances beyond our reasonable control, including natural disasters, war, terrorism, strikes, or infrastructure failures.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.8 Headings</h3>
              <p>Section headings are for convenience only and have no legal effect.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.9 Electronic Communications</h3>
              <p>By using the Service, you consent to receive electronic communications from us. These communications satisfy any legal requirement that communications be in writing.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.10 Export Compliance</h3>
              <p>You agree to comply with all applicable export laws and regulations. You represent that you are not located in a country subject to U.S. embargo or designated as a "terrorist supporting" country.</p>

              <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">16.11 California Users</h3>
              <p>If you are a California resident, you waive California Civil Code Section 1542, which says: "A general release does not extend to claims which the creditor does not know or suspect to exist in his or her favor at the time of executing the release, which if known by him or her must have materially affected his or her settlement with the debtor."</p>
            </section>

            <section id="contact" className="mb-10">
              <h2 className="text-2xl font-serif text-text-primary mb-4">17. CONTACT INFORMATION</h2>
              <p>If you have questions about these Terms, please contact us:</p>
              
              <p><strong>General Inquiries</strong><br />
              Email: support@[yourdomain].com</p>
              
              <p><strong>Legal Matters</strong><br />
              Email: legal@[yourdomain].com</p>
              
              <p><strong>Mailing Address</strong><br />
              [Your Company Name]<br />
              [Street Address]<br />
              [City, State ZIP Code]<br />
              [Country]</p>
            </section>

            <div className="mt-12 pt-8 border-t border-stone-200">
              <h2 className="text-2xl font-serif text-text-primary mb-4">ACKNOWLEDGMENT</h2>
              <p className="font-semibold text-text-primary mb-4">
                BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM.
              </p>
              <p className="font-semibold text-text-primary">
                IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THE SERVICE.
              </p>
              <p className="text-sm text-text-secondary mt-6 italic">
                These Terms of Service are effective as of December 21, 2025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
