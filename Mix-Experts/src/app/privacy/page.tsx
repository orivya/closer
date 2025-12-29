'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/profile/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function PrivacyPolicyPage() {
    // Set default theme for marketing pages
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'amber');
    }, []);

    const lastUpdated = "December 28, 2024";

    return (
        <main className="min-h-screen selection:bg-[var(--accent)] selection:text-white">
            <Navbar />

            <div className="relative z-10 pt-20">
                <div className="py-16 text-center px-6 border-b border-[var(--border-dark)]">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-[var(--text-gray)]">Last Updated: {lastUpdated}</p>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-16">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {/* Introduction */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    Limitless Perception LLC, doing business as Mix Experts (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website, applications, and services (collectively, the &ldquo;Platform&rdquo;).
                                </p>
                                <p>
                                    <strong className="text-white">By accessing or using the Platform, you consent to the collection, use, and disclosure of your information as described in this Privacy Policy.</strong> If you do not agree with our practices, please do not use the Platform.
                                </p>
                                <p>
                                    This Privacy Policy applies only to information collected through our Platform and does not apply to information collected by third parties, including Service Providers who use our Platform.
                                </p>
                            </div>
                        </section>

                        {/* Information We Collect */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">2.1 Information You Provide Directly</h3>
                                <p>We collect information you voluntarily provide, including:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Account Information:</strong> Name, email address, username, password, and profile details</li>
                                    <li><strong className="text-white">Profile Information:</strong> Professional bio, portfolio items, service offerings, pricing, profile photos, and links to external sites</li>
                                    <li><strong className="text-white">Payment Information:</strong> Billing address and payment details (note: payment card information is collected and processed directly by our payment processor, Stripe, and is not stored on our servers)</li>
                                    <li><strong className="text-white">Payout Information:</strong> Bank account or payment account information for Service Providers receiving payouts</li>
                                    <li><strong className="text-white">Communications:</strong> Messages exchanged with other users and correspondence with our support team</li>
                                    <li><strong className="text-white">User Content:</strong> Audio files, images, Digital Products, and other materials you upload</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">2.2 Information Collected Automatically</h3>
                                <p>When you access the Platform, we may automatically collect:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Device Information:</strong> Device type, operating system, browser type, and unique device identifiers</li>
                                    <li><strong className="text-white">Log Data:</strong> IP address, access times, pages viewed, and referring URLs</li>
                                    <li><strong className="text-white">Usage Information:</strong> Features used, actions taken, and interaction patterns</li>
                                    <li><strong className="text-white">Approximate Location:</strong> General geographic location derived from IP address</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">2.3 Information from Third Parties</h3>
                                <p>We may receive information from:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Payment Processors:</strong> Transaction status and limited payment information from Stripe</li>
                                    <li><strong className="text-white">Other Users:</strong> Reviews, ratings, and feedback about you</li>
                                    <li><strong className="text-white">Analytics Services:</strong> Aggregated usage data from analytics providers</li>
                                </ul>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>We use collected information for the following purposes:</p>

                                <h3 className="text-xl font-semibold text-white mt-6">3.1 Platform Operations</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Create and manage your account</li>
                                    <li>Facilitate transactions between users</li>
                                    <li>Process payments and payouts</li>
                                    <li>Provide customer support</li>
                                    <li>Enable user communication</li>
                                    <li>Display profiles and listings to other users</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">3.2 Platform Improvement</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Analyze usage to improve functionality</li>
                                    <li>Develop new features</li>
                                    <li>Monitor and analyze trends</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">3.3 Communications</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Send transactional notifications (order confirmations, payment receipts)</li>
                                    <li>Provide service announcements and updates</li>
                                    <li>Send marketing communications (where you have opted in or where permitted by law)</li>
                                    <li>Respond to your inquiries</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">3.4 Safety and Security</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Detect and prevent fraud, abuse, and security incidents</li>
                                    <li>Enforce our Terms of Service</li>
                                    <li>Protect our rights and the rights of users</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">3.5 Legal Compliance</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Comply with applicable laws and regulations</li>
                                    <li>Respond to legal requests and processes</li>
                                    <li>Fulfill tax reporting obligations</li>
                                </ul>
                            </div>
                        </section>

                        {/* How We Share Your Information */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">4. How We Share Your Information</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>We may share your information in the following circumstances:</p>

                                <h3 className="text-xl font-semibold text-white mt-6">4.1 With Other Users</h3>
                                <p>
                                    Certain information is visible to other Platform users:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Service Provider profiles, portfolios, and listings are publicly visible</li>
                                    <li>Reviews and ratings are visible to other users</li>
                                    <li>When transacting, users can see relevant profile and order information</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">4.2 With Service Providers (Third-Party Vendors)</h3>
                                <p>We share information with third-party vendors who help us operate the Platform:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Payment Processing:</strong> Stripe processes payments and receives necessary payment information</li>
                                    <li><strong className="text-white">Hosting:</strong> Cloud providers host and store Platform data</li>
                                    <li><strong className="text-white">Email Services:</strong> Email providers deliver transactional and marketing emails</li>
                                    <li><strong className="text-white">Analytics:</strong> Analytics services help us understand Platform usage</li>
                                </ul>
                                <p className="mt-4">
                                    These vendors are contractually obligated to use your information only for the services they provide to us.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">4.3 For Legal Purposes</h3>
                                <p>We may disclose your information:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>To comply with legal obligations, court orders, or legal processes</li>
                                    <li>To respond to government or regulatory requests</li>
                                    <li>To protect our rights, privacy, safety, or property</li>
                                    <li>To investigate potential violations of our Terms</li>
                                    <li>In connection with legal claims or disputes</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">4.4 Business Transfers</h3>
                                <p>
                                    If we are involved in a merger, acquisition, reorganization, bankruptcy, or sale of assets, your information may be transferred as part of that transaction.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">4.5 With Your Consent</h3>
                                <p>
                                    We may share your information with third parties when you provide explicit consent.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">4.6 Aggregated or De-identified Data</h3>
                                <p>
                                    We may share aggregated or de-identified information that cannot reasonably identify you for any purpose.
                                </p>
                            </div>
                        </section>

                        {/* Data Retention */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    We retain your information for as long as reasonably necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. Factors we consider include:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Whether your account is active</li>
                                    <li>Legal, tax, or accounting requirements</li>
                                    <li>Dispute resolution or enforcement of agreements</li>
                                    <li>Business needs and legitimate interests</li>
                                </ul>
                                <p className="mt-4">
                                    When you request deletion of your account, we will delete or anonymize your information within a reasonable period, except where retention is required by law or for legitimate business purposes (such as tax records or fraud prevention).
                                </p>
                            </div>
                        </section>

                        {/* Data Security */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    We implement reasonable technical and organizational measures designed to protect your information from unauthorized access, alteration, disclosure, or destruction. These measures include:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Encryption:</strong> Data transmitted to and from the Platform is encrypted using TLS/SSL</li>
                                    <li><strong className="text-white">Access Controls:</strong> Access to personal data is limited to authorized personnel</li>
                                    <li><strong className="text-white">Payment Security:</strong> Payment information is handled by Stripe in accordance with PCI-DSS standards</li>
                                </ul>
                                <p className="mt-4">
                                    <strong className="text-white">However, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee the absolute security of your information.</strong> You are responsible for maintaining the security of your account credentials.
                                </p>
                            </div>
                        </section>

                        {/* Cookies */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking Technologies</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">7.1 What Are Cookies?</h3>
                                <p>
                                    Cookies are small data files stored on your device when you visit websites. We use cookies and similar technologies to operate and improve the Platform.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">7.2 Types of Cookies We Use</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Essential Cookies:</strong> Required for Platform functionality (e.g., authentication, security)</li>
                                    <li><strong className="text-white">Functional Cookies:</strong> Remember your preferences and settings</li>
                                    <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how users interact with the Platform</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">7.3 Managing Cookies</h3>
                                <p>
                                    Most browsers allow you to control cookies through settings. You can refuse or delete cookies, but this may affect Platform functionality.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">7.4 Do Not Track</h3>
                                <p>
                                    Our Platform does not currently respond to &ldquo;Do Not Track&rdquo; browser signals. We treat all users consistently regardless of this setting.
                                </p>
                            </div>
                        </section>

                        {/* Your Rights */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">8. Your Privacy Rights</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    Depending on your location and applicable laws, you may have certain rights regarding your personal information:
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">8.1 Access</h3>
                                <p>
                                    You may request access to the personal information we hold about you.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">8.2 Correction</h3>
                                <p>
                                    You may request correction of inaccurate information. You can update most information directly through your account settings.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">8.3 Deletion</h3>
                                <p>
                                    You may request deletion of your personal information, subject to legal requirements and legitimate business needs.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">8.4 Marketing Opt-Out</h3>
                                <p>
                                    You can opt out of marketing communications by using the unsubscribe link in emails or contacting us. Note that you may still receive transactional communications.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">8.5 Exercising Your Rights</h3>
                                <p>
                                    To exercise these rights, contact us at <a href="mailto:privacy@mixexperts.com" className="text-[var(--accent)] hover:underline">privacy@mixexperts.com</a>. We may need to verify your identity before processing your request. We will respond within the timeframe required by applicable law.
                                </p>
                            </div>
                        </section>

                        {/* California Residents */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">9. California Residents</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Right to Know:</strong> You may request information about the categories and specific pieces of personal information we collect, use, and disclose.</li>
                                    <li><strong className="text-white">Right to Delete:</strong> You may request deletion of your personal information, subject to exceptions.</li>
                                    <li><strong className="text-white">Right to Correct:</strong> You may request correction of inaccurate personal information.</li>
                                    <li><strong className="text-white">Right to Opt-Out of Sale/Sharing:</strong> We do not sell personal information in the traditional sense. If our data practices constitute a &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; under California law, you have the right to opt out.</li>
                                    <li><strong className="text-white">Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
                                </ul>
                                <p className="mt-4">
                                    To exercise your California privacy rights, contact us at <a href="mailto:privacy@mixexperts.com" className="text-[var(--accent)] hover:underline">privacy@mixexperts.com</a>.
                                </p>
                            </div>
                        </section>

                        {/* International Users */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">10. International Users</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">10.1 Data Transfers</h3>
                                <p>
                                    We are based in the United States. If you access the Platform from outside the United States, your information will be transferred to, stored, and processed in the United States, where data protection laws may differ from those in your country. By using the Platform, you consent to this transfer.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">10.2 European Users</h3>
                                <p>
                                    If you are in the European Economic Area (EEA), United Kingdom, or Switzerland, we process your data on the following legal bases:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Contract:</strong> Processing necessary to provide our services</li>
                                    <li><strong className="text-white">Legitimate Interests:</strong> Processing for security, fraud prevention, and service improvement where our interests do not override your rights</li>
                                    <li><strong className="text-white">Consent:</strong> Processing based on your consent (which you may withdraw)</li>
                                    <li><strong className="text-white">Legal Obligation:</strong> Processing required by law</li>
                                </ul>
                                <p className="mt-4">
                                    You may have additional rights under GDPR, including the right to data portability, the right to restrict processing, and the right to lodge a complaint with a supervisory authority.
                                </p>
                            </div>
                        </section>

                        {/* Children's Privacy */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">11. Children&apos;s Privacy</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    The Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe a child under 18 has provided us with personal information, please contact us at <a href="mailto:privacy@mixexperts.com" className="text-[var(--accent)] hover:underline">privacy@mixexperts.com</a>, and we will take steps to delete such information.
                                </p>
                            </div>
                        </section>

                        {/* Third-Party Links */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">12. Third-Party Links and Services</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    The Platform may contain links to third-party websites or services not operated by us. This Privacy Policy does not apply to those third parties. We are not responsible for the privacy practices of third-party sites. We encourage you to review the privacy policies of any third-party services you use.
                                </p>
                            </div>
                        </section>

                        {/* Service Provider Privacy */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">13. Service Provider Privacy Practices</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    When you transact with Service Providers on the Platform, those Service Providers may collect information from you directly. <strong className="text-white">Service Providers are independent parties and their collection and use of your information is governed by their own privacy practices, not this Privacy Policy.</strong> We are not responsible for the privacy practices of Service Providers.
                                </p>
                            </div>
                        </section>

                        {/* Changes to Policy */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">14. Changes to This Privacy Policy</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    We may update this Privacy Policy from time to time. When we make changes, we will update the &ldquo;Last Updated&rdquo; date at the top of this page. For material changes, we may also notify you by email or by posting a prominent notice on the Platform.
                                </p>
                                <p>
                                    Your continued use of the Platform after any changes constitutes your acceptance of the updated Privacy Policy. If you do not agree to changes, you should stop using the Platform.
                                </p>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Us</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                                </p>
                                <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl p-6 mt-4">
                                    <p><strong className="text-white">Limitless Perception LLC</strong></p>
                                    <p className="text-sm text-[var(--text-muted)]">d/b/a Mix Experts</p>
                                    <p className="mt-2">Privacy Inquiries: <a href="mailto:privacy@mixexperts.com" className="text-[var(--accent)] hover:underline">privacy@mixexperts.com</a></p>
                                    <p>General Support: <a href="mailto:support@mixexperts.com" className="text-[var(--accent)] hover:underline">support@mixexperts.com</a></p>
                                </div>
                            </div>
                        </section>

                        {/* Acknowledgment */}
                        <section className="mb-12 p-6 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl">
                            <p className="text-white font-semibold">
                                By using Mix Experts, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer isMarketingPage />
        </main>
    );
}
