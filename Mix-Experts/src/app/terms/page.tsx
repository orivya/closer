'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/profile/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function TermsOfServicePage() {
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
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-[var(--text-gray)]">Last Updated: {lastUpdated}</p>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-16">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {/* Introduction */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction and Acceptance of Terms</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    Welcome to Mix Experts, a platform operated by Limitless Perception LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you and Limitless Perception LLC governing your access to and use of the Mix Experts website, applications, and all related services (collectively, the &ldquo;Platform&rdquo;).
                                </p>
                                <p>
                                    <strong className="text-white">BY ACCESSING OR USING THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND OUR PRIVACY POLICY. IF YOU DO NOT AGREE, DO NOT ACCESS OR USE THE PLATFORM.</strong>
                                </p>
                                <p>
                                    Mix Experts operates as an online marketplace that connects audio professionals (&ldquo;Service Providers&rdquo; or &ldquo;Sellers&rdquo;) with individuals and businesses seeking audio services or digital products (&ldquo;Clients&rdquo; or &ldquo;Buyers&rdquo;). <strong className="text-white">The Platform serves solely as a venue for transactions. Limitless Perception LLC is not a party to any agreement between Service Providers and Clients, does not provide audio services, and has no control over the quality, safety, legality, or any other aspect of services or products offered through the Platform.</strong>
                                </p>
                            </div>
                        </section>

                        {/* Definitions */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">2. Definitions</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">&ldquo;Account&rdquo;</strong> means the user account you create to access the Platform.</li>
                                    <li><strong className="text-white">&ldquo;Content&rdquo;</strong> means any audio files, text, images, videos, or other materials uploaded, posted, or transmitted through the Platform.</li>
                                    <li><strong className="text-white">&ldquo;Service Provider&rdquo;</strong> or <strong className="text-white">&ldquo;Seller&rdquo;</strong> means any user who offers mixing, mastering, production, or other audio-related services or Digital Products through the Platform.</li>
                                    <li><strong className="text-white">&ldquo;Client&rdquo;</strong> or <strong className="text-white">&ldquo;Buyer&rdquo;</strong> means any user who purchases services or Digital Products from Service Providers.</li>
                                    <li><strong className="text-white">&ldquo;Digital Products&rdquo;</strong> means downloadable digital goods sold through the Platform, including but not limited to vocal presets, instrument presets, recording templates, mixing templates, sample packs, sound libraries, educational courses, tutorials, and other digital audio-related products.</li>
                                    <li><strong className="text-white">&ldquo;Platform Fee&rdquo;</strong> means the percentage-based fee charged by Limitless Perception LLC on transactions, as determined by the Service Provider&apos;s subscription tier.</li>
                                    <li><strong className="text-white">&ldquo;Seller License Terms&rdquo;</strong> means the specific licensing terms established by each Seller for their Digital Products.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Account Registration */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration and Eligibility</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">3.1 Eligibility</h3>
                                <p>
                                    To use the Platform, you must be at least 18 years old and legally capable of forming a binding contract in your jurisdiction. By creating an Account, you represent and warrant that you meet these requirements and that all registration information you provide is truthful and accurate.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">3.2 Account Creation and Accuracy</h3>
                                <p>
                                    You must provide accurate, current, and complete information during registration and maintain the accuracy of such information throughout your use of the Platform. You are solely responsible for maintaining the confidentiality of your Account credentials and for all activities that occur under your Account.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">3.3 Account Security</h3>
                                <p>
                                    You agree to immediately notify us of any unauthorized access to or use of your Account. We are not liable for any loss or damage arising from unauthorized use of your Account, whether or not you have notified us.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">3.4 Account Termination</h3>
                                <p>
                                    We reserve the right, in our sole discretion, to suspend, restrict, or terminate your Account at any time, with or without notice, for any reason or no reason, including but not limited to violation of these Terms, suspected fraudulent activity, or conduct we determine to be harmful to other users, third parties, or the Platform.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">3.5 Effect of Termination</h3>
                                <p>
                                    Upon termination, your right to use the Platform immediately ceases. Any pending transactions may be cancelled. We are not obligated to retain or provide you with any Content or data associated with your Account, except as required by applicable law.
                                </p>
                            </div>
                        </section>

                        {/* Marketplace Nature */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">4. Marketplace Nature of Platform</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">4.1 Platform as Venue Only</h3>
                                <p>
                                    <strong className="text-white">The Platform is a venue only.</strong> Limitless Perception LLC provides the technology and infrastructure to connect Service Providers with Clients. We do not:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Provide, endorse, or guarantee any services or Digital Products listed on the Platform</li>
                                    <li>Employ, supervise, or control Service Providers in any manner</li>
                                    <li>Verify the qualifications, credentials, or quality of work of any Service Provider</li>
                                    <li>Guarantee the accuracy of any listings, descriptions, or representations made by users</li>
                                    <li>Act as an agent for any user or have any fiduciary relationship with users</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">4.2 Direct Agreements Between Users</h3>
                                <p>
                                    All transactions on the Platform are direct agreements between Service Providers and Clients. Limitless Perception LLC is not a party to these agreements and has no obligation to resolve disputes between users, though we may choose to assist at our sole discretion.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">4.3 No Endorsement</h3>
                                <p>
                                    The inclusion of any Service Provider, service, or Digital Product on the Platform does not constitute an endorsement or recommendation by Limitless Perception LLC. Users are solely responsible for evaluating and selecting Service Providers or products.
                                </p>
                            </div>
                        </section>

                        {/* Platform Services */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">5. Subscription Tiers and Platform Fees</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">5.1 Subscription Tiers</h3>
                                <p>
                                    Mix Experts offers the following subscription tiers for Service Providers (prices subject to change):
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Free Tier:</strong> $0/month with a 10% Platform Fee on all transactions.</li>
                                    <li><strong className="text-white">Starter Tier:</strong> $19/month (or $15/month billed annually) with a 5% Platform Fee.</li>
                                    <li><strong className="text-white">Pro Tier:</strong> $49/month (or $39/month billed annually) with 0% Platform Fee.</li>
                                    <li><strong className="text-white">Studio Tier:</strong> $99/month (or $79/month billed annually) with 0% Platform Fee and additional features.</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">5.2 Platform Fee Structure</h3>
                                <p>
                                    Platform Fees are automatically deducted from each transaction before funds are disbursed to Service Providers. <strong className="text-white">Platform Fees are non-refundable under any circumstances</strong>, including if the underlying transaction is later refunded, disputed, or subject to chargeback.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">5.3 Subscription Terms</h3>
                                <p>
                                    Paid subscriptions automatically renew at the end of each billing cycle unless cancelled. You may cancel your subscription at any time, but no refunds or credits will be issued for partial billing periods. Upgrades take effect immediately with prorated charges. Downgrades take effect at the start of the next billing cycle.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">5.4 Price Changes</h3>
                                <p>
                                    We reserve the right to modify subscription prices and Platform Fee percentages at any time. We will provide reasonable notice before any price increases take effect for existing subscribers. Your continued use of the Platform after price changes constitutes acceptance of the new pricing.
                                </p>
                            </div>
                        </section>

                        {/* Service Provider Terms */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">6. Service Provider Terms and Obligations</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">6.1 Independent Contractor Status</h3>
                                <p>
                                    <strong className="text-white">Service Providers are independent contractors, not employees, agents, or representatives of Limitless Perception LLC.</strong> Nothing in these Terms creates an employment, partnership, joint venture, agency, or franchise relationship. Service Providers are solely responsible for their own:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Federal, state, and local taxes (including self-employment taxes)</li>
                                    <li>Business licenses and permits</li>
                                    <li>Insurance coverage</li>
                                    <li>Compliance with all applicable laws, regulations, and professional standards</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">6.2 Service Terms and Agreements</h3>
                                <p>
                                    <strong className="text-white">All terms, conditions, and agreements related to mixing, mastering, production, or other audio services are to be communicated and agreed upon directly between the Service Provider and the Client.</strong> This includes but is not limited to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Scope of work and deliverables</li>
                                    <li>Turnaround times and deadlines</li>
                                    <li>Revision policies and limits</li>
                                    <li>Pricing, payment terms, and any additional fees</li>
                                    <li>Royalty splits, backend compensation, or points on masters</li>
                                    <li>Credit and attribution requirements</li>
                                    <li>Confidentiality and non-disclosure terms</li>
                                    <li>Usage rights and licensing of final deliverables</li>
                                    <li>Cancellation and refund policies</li>
                                </ul>
                                <p className="mt-4">
                                    <strong className="text-white">Limitless Perception LLC is not a party to any such agreements and bears no responsibility for their negotiation, enforcement, or any disputes arising therefrom.</strong> The Platform provides tools for Service Providers to communicate their terms, but it is the sole responsibility of Service Providers and Clients to ensure mutual understanding and agreement before commencing work.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">6.3 Service Listings</h3>
                                <p>
                                    Service Providers are solely responsible for the accuracy and completeness of their service listings, including descriptions, pricing, turnaround times, revision policies, and portfolio samples. Service Providers should clearly communicate all terms and policies in their listings or through direct communication with Clients before accepting orders. Misrepresentation or misleading listings may result in Account termination.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">6.4 Refunds and Cancellations</h3>
                                <p>
                                    <strong className="text-white">Service Providers are responsible for establishing and communicating their own refund and cancellation policies to Clients.</strong> The Platform provides tools for Service Providers to process refunds when appropriate. Refund decisions for service-based transactions are at the discretion of the Service Provider, except in cases of clear fraud or non-delivery where the Platform may intervene.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">6.5 Delivery Obligations</h3>
                                <p>
                                    Service Providers agree to deliver work within the timeframes specified in their service listings or as otherwise agreed with Clients. Service Providers are solely responsible for managing their workload and meeting delivery commitments.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">6.6 Communication Standards</h3>
                                <p>
                                    Service Providers agree to maintain professional and respectful communication with Clients throughout all transactions.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">6.7 Prohibited Conduct for Service Providers</h3>
                                <p>Service Providers shall not:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Offer services or products that violate any applicable laws or third-party rights</li>
                                    <li>Engage in fraudulent, deceptive, or misleading practices</li>
                                    <li>Circumvent Platform Fees by soliciting or accepting off-platform payments for transactions initiated on the Platform</li>
                                    <li>Create fake reviews, manipulate ratings, or engage in review fraud</li>
                                    <li>Share Account access with unauthorized parties</li>
                                    <li>Sell or offer services or products containing infringing, stolen, or unlicensed content</li>
                                </ul>
                            </div>
                        </section>

                        {/* Client Terms */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">7. Client Terms and Responsibilities</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">7.1 Direct Agreements</h3>
                                <p>
                                    When you purchase services or Digital Products through the Platform, you enter into a direct agreement with the Service Provider. <strong className="text-white">Limitless Perception LLC is not a party to this agreement and assumes no liability for the performance or non-performance of Service Providers.</strong>
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">7.2 Payment</h3>
                                <p>
                                    All payments are processed through our third-party payment processor (currently Stripe). By making a purchase, you agree to the payment processor&apos;s terms of service. Clients agree to pay the full price listed at the time of purchase plus any applicable taxes or fees.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">7.3 Client Responsibilities</h3>
                                <p>Clients are solely responsible for:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Providing clear, accurate project requirements and specifications</li>
                                    <li>Providing reference materials and source files in a timely manner</li>
                                    <li>Ensuring they have all necessary rights to any Content they upload</li>
                                    <li>Responding to Service Provider communications in a reasonable timeframe</li>
                                    <li>Evaluating Service Providers before making purchases</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">7.4 Dispute Resolution Between Users</h3>
                                <p>
                                    If you are unsatisfied with services or products received, <strong className="text-white">you must first attempt to resolve the issue directly with the Service Provider.</strong> Service Providers set their own policies for revisions, refunds, and dispute resolution. If resolution cannot be reached after good-faith efforts, you may request Platform assistance within 14 days of delivery. <strong className="text-white">We may, in our sole discretion, review disputes and facilitate resolution, but we are under no obligation to do so and our involvement does not guarantee any particular outcome.</strong> Any determination we make is final and binding.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">7.5 Refund Policy</h3>
                                <p>
                                    <strong className="text-white">For service-based transactions (mixing, mastering, production, etc.), refund policies are established by each Service Provider individually.</strong> Clients should review the Service Provider&apos;s refund policy before placing an order. Service Providers have the ability to issue full or partial refunds through the Platform at their discretion.
                                </p>
                                <p className="mt-4">
                                    The Platform may intervene and issue refunds in limited circumstances, including:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Complete non-delivery of services after a reasonable period with no communication from the Service Provider</li>
                                    <li>Clear evidence of fraud or misrepresentation</li>
                                </ul>
                                <p className="mt-4">
                                    <strong className="text-white">The Platform will generally NOT intervene in refund decisions for:</strong>
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Subjective dissatisfaction with work that meets stated specifications</li>
                                    <li>Client&apos;s failure to provide necessary materials, feedback, or communication</li>
                                    <li>Changes in Client&apos;s needs or preferences after work has commenced</li>
                                    <li>Disputes over creative direction or artistic choices</li>
                                    <li>Disagreements about royalty splits, credits, or other terms that should have been agreed upon before work began</li>
                                    <li>Digital Products after download or access has been provided</li>
                                </ul>
                            </div>
                        </section>

                        {/* Digital Products */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">8. Digital Products</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">8.1 Seller-Defined License Terms</h3>
                                <p>
                                    Digital Products sold on the Platform (including vocal presets, instrument presets, recording templates, mixing templates, sample packs, educational courses, and other digital goods) are licensed according to the specific terms established by each Seller in their product listings (&ldquo;Seller License Terms&rdquo;). <strong className="text-white">Buyers must review and agree to the Seller License Terms before purchasing any Digital Product.</strong>
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">8.2 Default License Terms</h3>
                                <p>
                                    If a Seller does not specify license terms, the following default terms apply:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Buyer receives a non-exclusive, non-transferable license for personal and commercial use</li>
                                    <li>Buyer may NOT resell, redistribute, sublicense, or share the Digital Product</li>
                                    <li>Buyer may NOT claim ownership or authorship of the Digital Product itself</li>
                                    <li>License is perpetual unless terminated for violation of terms</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">8.3 Digital Product Refunds</h3>
                                <p>
                                    <strong className="text-white">Due to the nature of digital goods, all Digital Product sales are generally final and non-refundable once the product has been downloaded or accessed.</strong> Refunds may only be considered if:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>The product is materially different from its description</li>
                                    <li>Technical issues prevent access to the purchased content and cannot be resolved</li>
                                    <li>The product file is corrupted and the Seller cannot provide a working replacement</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">8.4 Seller Representations</h3>
                                <p>
                                    Sellers of Digital Products represent and warrant that:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>They own or have all necessary rights to sell and license the products</li>
                                    <li>The products do not infringe upon any third-party intellectual property rights</li>
                                    <li>All claims and descriptions in their listings are accurate and not misleading</li>
                                    <li>They will honor the license terms specified in their listings</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">8.5 Platform Role in Digital Products</h3>
                                <p>
                                    <strong className="text-white">Limitless Perception LLC does not review, verify, or endorse any Digital Products.</strong> We are not responsible for the content, quality, accuracy, or legality of Digital Products. Any disputes regarding Digital Products are between Buyer and Seller.
                                </p>
                            </div>
                        </section>

                        {/* Intellectual Property */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">9. Intellectual Property Rights</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">9.1 Platform Intellectual Property</h3>
                                <p>
                                    All intellectual property rights in the Platform itself, including trademarks, logos, designs, text, graphics, software, and underlying technology, are owned by Limitless Perception LLC or our licensors. You may not use our intellectual property without express written permission.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">9.2 User Content License to Platform</h3>
                                <p>
                                    You retain ownership of Content you upload to the Platform. By uploading Content, you grant Limitless Perception LLC a non-exclusive, worldwide, royalty-free, sublicensable license to use, display, reproduce, modify, and distribute such Content solely for the purpose of operating, promoting, and improving the Platform. This license terminates when you delete the Content or your Account, except for Content that has been shared with others or incorporated into Platform features.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">9.3 Work Product Ownership (Services)</h3>
                                <p>
                                    The ownership and rights to work product created through service transactions are determined by agreement between Service Provider and Client. If no specific agreement exists, the following defaults apply:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Clients retain ownership of their original source materials (stems, recordings, etc.)</li>
                                    <li>Upon full payment, Clients receive ownership of the final delivered work product</li>
                                    <li>Service Providers retain the right to use non-confidential portions of work in their portfolio unless Client explicitly requests otherwise at the time of order</li>
                                    <li>Service Providers retain ownership of their pre-existing tools, templates, presets, and techniques used in creating the work</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">9.4 Seller Intellectual Property Protection</h3>
                                <p>
                                    Service Providers and Sellers retain all intellectual property rights in:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Their portfolio content, demonstrations, and sample works</li>
                                    <li>Their Digital Products and the underlying creative works</li>
                                    <li>Their methodologies, techniques, and trade secrets</li>
                                    <li>Any pre-existing materials incorporated into client deliverables</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mt-6">9.5 Copyright Infringement Claims</h3>
                                <p>
                                    We respect intellectual property rights. If you believe your copyrighted work has been infringed on the Platform, please contact us at legal@mixexperts.com with: (a) identification of the copyrighted work, (b) identification of the allegedly infringing material, (c) your contact information, (d) a statement of good faith belief, and (e) a statement under penalty of perjury that the information is accurate.
                                </p>
                            </div>
                        </section>

                        {/* Payment Processing */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">10. Payment Processing</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">10.1 Third-Party Payment Processing</h3>
                                <p>
                                    All payments are processed through Stripe Connect or other third-party payment processors. Service Providers must connect a valid payment account to receive payouts. By using payment services, you agree to the applicable payment processor&apos;s terms of service. <strong className="text-white">Limitless Perception LLC is not responsible for any errors, failures, or issues arising from third-party payment processing.</strong>
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">10.2 Payouts</h3>
                                <p>
                                    Payout timing and availability depend on the payment processor and your financial institution. We do not guarantee specific payout timelines.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">10.3 Currency</h3>
                                <p>
                                    All prices are displayed in US Dollars unless otherwise specified. Currency conversion fees imposed by payment processors or financial institutions are your responsibility.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">10.4 Taxes</h3>
                                <p>
                                    <strong className="text-white">Users are solely responsible for determining and paying all applicable taxes on their transactions.</strong> Limitless Perception LLC may be required to report income to tax authorities and may withhold taxes as required by law.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">10.5 Chargebacks and Payment Disputes</h3>
                                <p>
                                    If a Client initiates a chargeback or payment dispute, we may immediately suspend the disputed funds and/or deduct the disputed amount from the Service Provider&apos;s available balance or future earnings. We may also charge reasonable fees for chargeback handling. Service Providers are responsible for providing documentation to dispute fraudulent chargebacks.
                                </p>
                            </div>
                        </section>

                        {/* Prohibited Content */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">11. Prohibited Content and Conduct</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>You agree not to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Upload, post, or transmit Content that is illegal, harmful, threatening, abusive, harassing, defamatory, obscene, or otherwise objectionable</li>
                                    <li>Infringe upon the intellectual property rights of others</li>
                                    <li>Transmit viruses, malware, or other harmful code</li>
                                    <li>Attempt to gain unauthorized access to any part of the Platform or other users&apos; accounts</li>
                                    <li>Use the Platform for any illegal purpose</li>
                                    <li>Engage in price manipulation, fake reviews, or other fraudulent conduct</li>
                                    <li>Circumvent or attempt to circumvent Platform Fees</li>
                                    <li>Scrape, harvest, or collect user data without authorization</li>
                                    <li>Impersonate any person or entity</li>
                                    <li>Interfere with the proper functioning of the Platform</li>
                                    <li>Use automated systems (bots, scrapers, etc.) to access the Platform without authorization</li>
                                    <li>Engage in any activity that could damage, disable, or impair the Platform</li>
                                </ul>
                            </div>
                        </section>

                        {/* Disclaimer */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">12. Disclaimers</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">12.1 Platform Disclaimer</h3>
                                <p className="uppercase font-semibold text-white">
                                    THE PLATFORM AND ALL SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, LIMITLESS PERCEPTION LLC DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">12.2 No Guarantee of Availability</h3>
                                <p>
                                    We do not guarantee that the Platform will be available at all times, uninterrupted, secure, or error-free. We may modify, suspend, or discontinue the Platform at any time without notice.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">12.3 No Guarantee of Results</h3>
                                <p>
                                    We make no representations or guarantees regarding income, business success, or any other results from using the Platform.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">12.4 Third-Party Services</h3>
                                <p>
                                    The Platform integrates with third-party services. We are not responsible for the availability, accuracy, security, or reliability of such third-party services.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">12.5 User Transactions</h3>
                                <p className="uppercase font-semibold text-white">
                                    LIMITLESS PERCEPTION LLC IS NOT RESPONSIBLE FOR AND DISCLAIMS ALL LIABILITY FOR THE QUALITY, SAFETY, LEGALITY, ACCURACY, OR DELIVERY OF ANY SERVICES, DIGITAL PRODUCTS, OR OTHER ITEMS OFFERED BY USERS. ANY DISPUTES BETWEEN USERS ARE SOLELY BETWEEN THOSE PARTIES.
                                </p>
                            </div>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">13. Limitation of Liability</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p className="uppercase font-semibold text-white">
                                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LIMITLESS PERCEPTION LLC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, REVENUE, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE OR WHETHER WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                                </p>
                                <p className="uppercase font-semibold text-white mt-4">
                                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY AND ALL CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF THE PLATFORM SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNTS PAID BY YOU TO LIMITLESS PERCEPTION LLC (NOT TO SERVICE PROVIDERS) IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100.00).
                                </p>
                                <p className="mt-4">
                                    Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability is limited to the maximum extent permitted by law.
                                </p>
                            </div>
                        </section>

                        {/* Indemnification */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">14. Indemnification</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    You agree to indemnify, defend, and hold harmless Limitless Perception LLC and its affiliates, officers, directors, employees, agents, licensors, and service providers from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees and court costs) arising out of or related to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Your use of or access to the Platform</li>
                                    <li>Your violation of these Terms</li>
                                    <li>Your violation of any applicable laws or third-party rights</li>
                                    <li>Any Content you upload, post, or transmit through the Platform</li>
                                    <li>Any services or Digital Products you provide or sell through the Platform</li>
                                    <li>Any transaction or dispute between you and another user</li>
                                    <li>Your tax obligations or failures to comply with tax requirements</li>
                                </ul>
                            </div>
                        </section>

                        {/* Governing Law */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">15. Governing Law and Dispute Resolution</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">15.1 Governing Law</h3>
                                <p>
                                    These Terms and any disputes arising hereunder shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">15.2 Binding Arbitration</h3>
                                <p>
                                    <strong className="text-white">Any dispute, claim, or controversy arising out of or relating to these Terms or the Platform shall be resolved by binding arbitration</strong> administered by the American Arbitration Association (&ldquo;AAA&rdquo;) in accordance with its Commercial Arbitration Rules. The arbitration shall be conducted in English, and the seat of arbitration shall be Houston, Texas, or may be conducted remotely as agreed by the parties.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">15.3 Class Action Waiver</h3>
                                <p className="uppercase font-semibold text-white">
                                    YOU AND LIMITLESS PERCEPTION LLC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON&apos;S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF CLASS OR REPRESENTATIVE PROCEEDING.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">15.4 Small Claims Exception</h3>
                                <p>
                                    Notwithstanding the above, either party may bring an individual action in small claims court for disputes within that court&apos;s jurisdiction.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">15.5 Injunctive Relief</h3>
                                <p>
                                    Either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights or confidential information.
                                </p>
                            </div>
                        </section>

                        {/* Changes to Terms */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">16. Changes to Terms</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    We reserve the right to modify these Terms at any time in our sole discretion. If we make material changes, we will notify you by posting the updated Terms on the Platform and updating the &ldquo;Last Updated&rdquo; date. We may also send email notification for significant changes. Your continued use of the Platform after any changes constitutes your acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Platform.
                                </p>
                            </div>
                        </section>

                        {/* Miscellaneous */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">17. General Provisions</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <h3 className="text-xl font-semibold text-white mt-6">17.1 Entire Agreement</h3>
                                <p>
                                    These Terms, together with the Privacy Policy and any other agreements expressly referenced herein, constitute the entire agreement between you and Limitless Perception LLC regarding the Platform and supersede all prior agreements and understandings.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">17.2 Severability</h3>
                                <p>
                                    If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">17.3 No Waiver</h3>
                                <p>
                                    Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision or any other provision. No waiver shall be effective unless made in writing and signed by an authorized representative of Limitless Perception LLC.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">17.4 Assignment</h3>
                                <p>
                                    You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction, including in connection with a merger, acquisition, or sale of assets.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">17.5 Force Majeure</h3>
                                <p>
                                    We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, pandemics, government actions, internet or telecommunications failures, or power outages.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">17.6 Relationship of Parties</h3>
                                <p>
                                    Nothing in these Terms creates any agency, partnership, joint venture, employment, or franchise relationship between you and Limitless Perception LLC.
                                </p>

                                <h3 className="text-xl font-semibold text-white mt-6">17.7 Survival</h3>
                                <p>
                                    Provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnification, limitation of liability, and dispute resolution provisions.
                                </p>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">18. Contact Information</h2>
                            <div className="text-[var(--text-gray)] space-y-4">
                                <p>
                                    If you have any questions about these Terms, please contact us:
                                </p>
                                <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl p-6 mt-4">
                                    <p><strong className="text-white">Limitless Perception LLC</strong></p>
                                    <p className="text-sm text-[var(--text-muted)]">d/b/a Mix Experts</p>
                                    <p className="mt-2">Legal Inquiries: <a href="mailto:legal@mixexperts.com" className="text-[var(--accent)] hover:underline">legal@mixexperts.com</a></p>
                                    <p>General Support: <a href="mailto:support@mixexperts.com" className="text-[var(--accent)] hover:underline">support@mixexperts.com</a></p>
                                </div>
                            </div>
                        </section>

                        {/* Acknowledgment */}
                        <section className="mb-12 p-6 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl">
                            <p className="text-white font-semibold">
                                BY USING MIX EXPERTS, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU ARE USING THE PLATFORM ON BEHALF OF AN ORGANIZATION, YOU REPRESENT AND WARRANT THAT YOU HAVE THE AUTHORITY TO BIND THAT ORGANIZATION TO THESE TERMS.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer isMarketingPage />
        </main>
    );
}
