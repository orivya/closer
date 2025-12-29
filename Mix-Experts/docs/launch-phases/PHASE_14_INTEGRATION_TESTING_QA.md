# Phase 14: Integration Testing & Quality Assurance

**Status:** Not Started
**Priority:** Critical
**Duration:** 5-7 days
**Owner:** Engineering Team

## Overview

Phase 14 focuses on comprehensive end-to-end integration testing and quality assurance to ensure all platform features work correctly across different user journeys, payment scenarios, edge cases, and environments. This phase validates the complete user experience from signup through transaction completion.

## Testing Environment Setup

### Prerequisites
- [ ] Staging environment configured and deployed
- [ ] Stripe test mode enabled with test API keys
- [ ] Supabase staging database populated with test data
- [ ] Test user accounts created (free tier and Pro tier)
- [ ] Browser testing tools configured (BrowserStack or similar)
- [ ] Performance monitoring tools enabled (Lighthouse CI, Web Vitals)
- [ ] Test audio files and media assets prepared
- [ ] Error tracking configured (Sentry or similar)

### Test Data Requirements
- [ ] 10+ test engineer profiles (mix of complete and incomplete)
- [ ] 20+ portfolio items with real audio samples
- [ ] 15+ services across different categories
- [ ] 10+ digital products
- [ ] Multiple test Stripe cards (success, decline, 3D secure)
- [ ] Test webhooks configured and verified

---

## User Journey Tests

### Stage 1: New Engineer Signup → Onboarding → Profile Setup → Publish

**Test Case:** Complete new user registration and profile creation flow

**Test Steps:**
1. Navigate to signup page
2. Enter email and password
3. Verify email confirmation sent
4. Click confirmation link
5. Complete onboarding wizard (name, role, expertise)
6. Upload profile photo
7. Add bio and location
8. Save profile
9. Toggle profile to "Published"

**Expected Results:**
- [ ] Signup form validates email format and password strength
- [ ] Email confirmation sent within 30 seconds
- [ ] Confirmation link activates account successfully
- [ ] Onboarding wizard saves progress between steps
- [ ] Profile photo uploads and displays correctly (optimized)
- [ ] Profile URL is accessible at /[username]
- [ ] Published profile appears in search results
- [ ] Welcome email sent upon profile publish
- [ ] Dashboard shows profile completion percentage

**Edge Cases to Test:**
- [ ] Duplicate email registration attempt
- [ ] Expired confirmation link
- [ ] Username already taken
- [ ] Special characters in username
- [ ] Profile photo too large (>10MB)
- [ ] Invalid image format

---

### Stage 2: Engineer Adds Portfolio Item with Audio

**Test Case:** Upload and publish audio portfolio item

**Test Steps:**
1. Navigate to Dashboard → Portfolio
2. Click "Add Portfolio Item"
3. Enter title, description, tags
4. Upload audio file (WAV, 24bit/48kHz, ~50MB)
5. Add credits (artist, studio, date)
6. Set visibility to "Public"
7. Save portfolio item
8. Verify item appears on profile

**Expected Results:**
- [ ] Audio upload shows progress indicator
- [ ] Audio file processes successfully (conversion to streamable format)
- [ ] Waveform visualization generated automatically
- [ ] Audio player works on portfolio item page
- [ ] Audio streams without requiring full download
- [ ] Metadata (duration, format) extracted correctly
- [ ] Portfolio item appears on public profile immediately
- [ ] Tags are searchable and clickable
- [ ] Credits display properly formatted

**Edge Cases to Test:**
- [ ] Upload fails mid-transfer (resume capability)
- [ ] Unsupported audio format (MP3, FLAC, AIFF)
- [ ] File size exceeds limit
- [ ] Invalid characters in title
- [ ] Empty required fields
- [ ] Audio file corrupted or unreadable
- [ ] Multiple simultaneous uploads

**Performance Checks:**
- [ ] Upload completes in <2 minutes for 50MB file
- [ ] Audio processing completes within 1 minute
- [ ] Waveform renders in <5 seconds

---

### Stage 3: Engineer Creates and Publishes Service

**Test Case:** Create a mixing service offering

**Test Steps:**
1. Navigate to Dashboard → Services
2. Click "Create Service"
3. Select category (Mixing & Mastering)
4. Enter title: "Professional Stereo Mix"
5. Write detailed description (200+ words)
6. Set pricing: $500 base price
7. Add delivery time: 5 days
8. Add revision policy: 2 included revisions
9. Upload service image/thumbnail
10. Set status to "Published"

**Expected Results:**
- [ ] Service form validates all required fields
- [ ] Rich text editor works for description (bold, italic, lists)
- [ ] Pricing accepts decimal values
- [ ] Delivery time shows in days/weeks selector
- [ ] Service thumbnail uploads and optimizes
- [ ] Published service appears on profile
- [ ] Service has unique shareable URL
- [ ] Service shows "Book Now" button to clients
- [ ] Service includes clear pricing breakdown

**Edge Cases to Test:**
- [ ] Price set to $0 (should warn or prevent)
- [ ] Extremely long description (>5000 words)
- [ ] No category selected
- [ ] Delivery time set to 0 days
- [ ] Negative revision count
- [ ] Service thumbnail wrong aspect ratio

---

### Stage 4: Engineer Creates and Publishes Product

**Test Case:** Create and publish a digital product (sample pack)

**Test Steps:**
1. Navigate to Dashboard → Products
2. Click "Create Product"
3. Enter title: "Analog Drum Samples Vol. 1"
4. Add description with feature list
5. Set price: $49.99
6. Upload product files (ZIP containing WAV files)
7. Upload product preview image
8. Add preview audio samples (3 samples)
9. Set license type: "Personal & Commercial Use"
10. Publish product

**Expected Results:**
- [ ] Product file upload supports ZIP, RAR formats
- [ ] File size limit clearly indicated (max 500MB)
- [ ] Preview audio samples playable before purchase
- [ ] Product image displays at correct resolution
- [ ] License terms displayed clearly
- [ ] Product page shows file size and format info
- [ ] "Add to Cart" button functional
- [ ] Product appears in engineer's product catalog
- [ ] Product URL is shareable

**Edge Cases to Test:**
- [ ] Product file exceeds size limit
- [ ] Corrupted ZIP file
- [ ] No preview samples provided
- [ ] Price changed after publication
- [ ] Product file deleted after sales (should prevent)

---

### Stage 5: Engineer Connects Stripe Account

**Test Case:** Complete Stripe Connect onboarding for payouts

**Test Steps:**
1. Navigate to Dashboard → Payments
2. Click "Connect Stripe Account"
3. Redirected to Stripe Connect onboarding
4. Enter business details (test mode):
   - Business type: Individual
   - Name, DOB, SSN (test data)
   - Bank account details (test routing/account)
5. Submit and return to MixExperts
6. Verify Stripe account connected

**Expected Results:**
- [ ] Stripe Connect OAuth flow initiates correctly
- [ ] User redirected to Stripe with proper parameters
- [ ] Stripe onboarding collects required information
- [ ] Return URL redirects back to MixExperts dashboard
- [ ] Dashboard shows "Stripe Connected" status with green indicator
- [ ] Payout method displays (bank account last 4 digits)
- [ ] Stripe account ID stored in database
- [ ] Engineer can now receive payments
- [ ] "Payouts" tab becomes accessible

**Edge Cases to Test:**
- [ ] User abandons Stripe onboarding midway
- [ ] Stripe rejects account (invalid info)
- [ ] User tries to connect second account
- [ ] Return URL contains error parameter
- [ ] Stripe webhook fails to deliver account update

---

### Stage 6: Engineer Upgrades to Pro Subscription

**Test Case:** Upgrade from free tier to Pro subscription

**Test Steps:**
1. Navigate to Dashboard → Subscription
2. Review Pro tier benefits (0% platform fee, analytics, etc.)
3. Click "Upgrade to Pro - $29/month"
4. Enter Stripe test card: 4242 4242 4242 4242
5. Complete payment form
6. Confirm subscription

**Expected Results:**
- [ ] Subscription pricing clearly displayed ($29/month)
- [ ] Payment form loads securely (Stripe Elements)
- [ ] Test card processes successfully
- [ ] Subscription created in Stripe dashboard
- [ ] User tier updated to "Pro" in database
- [ ] Dashboard shows "Pro" badge
- [ ] Platform fee changes from 10% to 0% for future orders
- [ ] Invoice emailed to user
- [ ] Subscription appears in billing history
- [ ] Cancel subscription option available

**Edge Cases to Test:**
- [ ] Card declined (test with 4000 0000 0000 0002)
- [ ] Expired card
- [ ] Insufficient funds card
- [ ] User already has active subscription
- [ ] Payment processing timeout
- [ ] Webhook delivery failure

**Payment Verification:**
- [ ] Stripe subscription ID stored correctly
- [ ] Next billing date calculated accurately
- [ ] Proration handled for mid-cycle upgrade

---

### Stage 7: Artist Finds Engineer Profile (Search/Direct Link)

**Test Case:** Client discovers engineer profile through search and direct URL

**Test Steps - Search Discovery:**
1. Navigate to /search or /engineers
2. Enter search term: "mixing engineer Los Angeles"
3. Apply filters: Location (Los Angeles), Service (Mixing)
4. Review search results
5. Click on engineer profile

**Test Steps - Direct Link:**
1. Receive direct link: /johndoestudio
2. Click link or paste in browser
3. Profile loads

**Expected Results - Search:**
- [ ] Search returns relevant profiles (location + service match)
- [ ] Results show profile photo, name, specialty, location
- [ ] Results include rating and review count
- [ ] "View Profile" button on each result
- [ ] Search filters work correctly (additive filtering)
- [ ] No results shows helpful message
- [ ] Search performance <1 second
- [ ] Pagination works for >20 results

**Expected Results - Direct Link:**
- [ ] Profile loads with all sections visible
- [ ] Profile URL is clean and readable (/username)
- [ ] Page title shows engineer name + "MixExperts"
- [ ] Meta description populated for social sharing
- [ ] Open Graph tags present for rich previews
- [ ] Profile photo, bio, portfolio, services visible
- [ ] Contact button prominent and functional

**Edge Cases to Test:**
- [ ] Search with no results
- [ ] Search with special characters
- [ ] Very long search query (>100 chars)
- [ ] Invalid username in direct URL (404 page)
- [ ] Unpublished profile access attempt
- [ ] Deleted profile access attempt

---

### Stage 8: Artist Listens to Portfolio Audio

**Test Case:** Client reviews engineer's portfolio audio samples

**Test Steps:**
1. On engineer profile, scroll to Portfolio section
2. View portfolio grid (thumbnails + metadata)
3. Click on portfolio item "Hip Hop Mix - Artist Name"
4. Audio player expands or navigates to detail page
5. Click play button
6. Listen to 30 seconds
7. Use scrubber to skip ahead
8. Adjust volume
9. Read credits and description

**Expected Results:**
- [ ] Portfolio items display in grid (3-4 columns)
- [ ] Each item shows waveform preview, title, genre tags
- [ ] Audio player loads without page refresh
- [ ] Play/pause button responds immediately
- [ ] Audio streams progressively (no full download required)
- [ ] Waveform shows playback progress
- [ ] Scrubber allows seeking to any position
- [ ] Volume control functional (0-100%)
- [ ] Audio quality is high (no compression artifacts)
- [ ] Credits display clearly (artist, studio, role)
- [ ] Genre tags clickable (shows similar work)
- [ ] Share button available for portfolio item

**Performance Checks:**
- [ ] Audio starts playing within 2 seconds
- [ ] Seeking to new position loads in <1 second
- [ ] No stuttering or buffering during playback
- [ ] Multiple audio files load smoothly (no memory leak)

**Edge Cases to Test:**
- [ ] Audio file no longer exists (404 handling)
- [ ] Slow network connection (buffering indicator)
- [ ] Very long audio file (>10 minutes)
- [ ] Multiple audio players on page (only one plays)
- [ ] Mobile device compatibility (iOS Safari restrictions)

---

### Stage 9: Artist Submits Inquiry

**Test Case:** Client sends inquiry message to engineer

**Test Steps:**
1. On engineer profile, click "Contact" or "Send Inquiry"
2. Inquiry form appears (modal or dedicated page)
3. Fill out form:
   - Name: "Sarah Johnson"
   - Email: "sarah@example.com"
   - Project Type: "Album Mixing"
   - Budget: "$2000-$5000"
   - Message: Detailed project description (200 words)
4. Attach reference track (optional)
5. Click "Send Inquiry"

**Expected Results:**
- [ ] Inquiry form validates required fields
- [ ] Email format validated
- [ ] Budget dropdown shows common ranges
- [ ] Message textarea has character count
- [ ] File attachment supports audio formats (MP3, WAV)
- [ ] File size limit shown (max 25MB)
- [ ] "Send" button disabled during submission
- [ ] Success message shows after submission
- [ ] Inquiry saved to database with timestamp
- [ ] Email notification sent to engineer immediately
- [ ] Email includes all inquiry details + attachment link
- [ ] Copy of inquiry sent to client email (confirmation)
- [ ] Inquiry appears in engineer's Dashboard → Inquiries

**Edge Cases to Test:**
- [ ] Empty required fields (validation errors)
- [ ] Invalid email format
- [ ] Message too short (<10 chars) or too long (>5000 chars)
- [ ] Attachment too large
- [ ] Unsupported file type
- [ ] Email delivery failure (retry mechanism)
- [ ] Spam protection (rate limiting multiple inquiries)
- [ ] Duplicate inquiry prevention (same email within 5 mins)

---

### Stage 10: Engineer Responds to Inquiry

**Test Case:** Engineer replies to client inquiry

**Test Steps:**
1. Engineer receives email notification
2. Clicks link to view inquiry in dashboard
3. Navigates to Dashboard → Inquiries
4. Clicks on inquiry from Sarah Johnson
5. Reviews inquiry details and reference track
6. Clicks "Reply"
7. Types response message with quote and timeline
8. Optionally attaches custom proposal PDF
9. Clicks "Send Reply"

**Expected Results:**
- [ ] Email notification contains inquiry preview
- [ ] Email link directs to specific inquiry in dashboard
- [ ] Inquiry detail page shows all client info
- [ ] Reference track playable inline
- [ ] Reply editor has formatting options
- [ ] Character count for reply message
- [ ] Attachment upload for proposal documents (PDF)
- [ ] "Send Reply" triggers email to client
- [ ] Reply stored in inquiry thread
- [ ] Inquiry status updates to "Responded"
- [ ] Client receives email with full reply text
- [ ] Email includes link back to engineer profile
- [ ] Reply timestamp recorded

**Edge Cases to Test:**
- [ ] Engineer replies multiple times (thread view)
- [ ] Reply with no message (validation)
- [ ] Large attachment (>5MB proposal)
- [ ] Client email bounces (notification to engineer)
- [ ] Reply before engineer has Stripe connected (warning shown)

---

### Stage 11: Artist Books Service (Complete Checkout)

**Test Case:** Client books mixing service and completes payment

**Test Steps:**
1. Client on engineer's service page: "Professional Stereo Mix - $500"
2. Clicks "Book Now" or "Add to Cart"
3. Booking form appears:
   - Project name: "Album Track 1"
   - Project details: Requirements and notes
   - Upload stems (ZIP file, ~200MB)
4. Reviews order summary (price, delivery time, revisions)
5. Clicks "Proceed to Checkout"
6. Enters payment details (Stripe test card: 4242 4242 4242 4242)
7. Enters billing info
8. Clicks "Complete Booking - $500"

**Expected Results:**
- [ ] Service booking form validates all fields
- [ ] File upload shows progress for large stem files
- [ ] Order summary calculates total correctly
- [ ] Platform fee shown if applicable (10% for free tier = $50)
- [ ] Engineer receives $450 (if free tier) or $500 (if Pro tier)
- [ ] Checkout form uses Stripe Payment Element (secure)
- [ ] Payment processing indicator shows
- [ ] Payment succeeds and returns success page
- [ ] Order confirmation number generated
- [ ] Order appears in client's "My Orders" section
- [ ] Order appears in engineer's Dashboard → Orders
- [ ] Confirmation email sent to client with order details
- [ ] Notification email sent to engineer with project files link
- [ ] Stem files accessible to engineer in dashboard

**Payment Verification:**
- [ ] Stripe Payment Intent created successfully
- [ ] Payment status: "succeeded"
- [ ] Correct amount charged (including platform fee)
- [ ] Platform fee transferred to MixExperts Stripe account
- [ ] Engineer balance updated (pending payout)
- [ ] Transaction record created in database

**Edge Cases to Test:**
- [ ] Card declined during checkout
- [ ] Payment requires 3D Secure (test with 4000 0025 0000 3155)
- [ ] Checkout timeout (30 min expiry)
- [ ] Stem file upload fails mid-transfer
- [ ] Duplicate booking prevention (double-click)
- [ ] Service price changed during checkout session
- [ ] Service unpublished during checkout

---

### Stage 12: Payment Succeeds and Order Created

**Test Case:** Verify complete order creation and payment reconciliation

**Test Steps:**
1. After successful checkout (Stage 11), verify:
   - Order record created in database
   - Payment Intent in Stripe dashboard
   - Webhook received and processed
2. Check engineer dashboard for new order
3. Check client dashboard for order status
4. Verify Stripe Connect transfer scheduled

**Expected Results:**
- [ ] Order ID unique and sequential
- [ ] Order status: "Pending" (awaiting engineer start)
- [ ] Order contains all service details (price, delivery date, revisions)
- [ ] Payment status: "Paid"
- [ ] Payment Intent ID linked to order
- [ ] Stripe webhook `payment_intent.succeeded` received
- [ ] Webhook processed within 30 seconds
- [ ] Engineer's Stripe Connect account shows incoming transfer
- [ ] Transfer amount correct (order total minus platform fee)
- [ ] Transfer scheduled according to payout schedule
- [ ] Order files (stems) stored securely and accessible
- [ ] Order timeline initialized (ordered date, expected delivery date)

**Database Validation:**
- [ ] Order record includes: client ID, engineer ID, service ID, amount, status
- [ ] Payment record includes: Stripe Payment Intent ID, amount, fee, net
- [ ] Engineer balance updated with net amount
- [ ] Transaction log entry created

**Edge Cases to Test:**
- [ ] Webhook delivery fails (retry mechanism, 3 attempts)
- [ ] Webhook received twice (idempotency check)
- [ ] Order created but webhook delayed (>5 min)
- [ ] Payment succeeded but order creation failed (rollback)

---

### Stage 13: Engineer Receives Notification

**Test Case:** Verify engineer receives multi-channel notifications for new order

**Test Steps:**
1. After order creation, check:
   - Email inbox for engineer
   - Dashboard notification bell/indicator
   - In-app notification center
2. Click email link to view order
3. Click dashboard notification to view order

**Expected Results:**
- [ ] Email notification sent within 1 minute of order creation
- [ ] Email subject: "New Order: [Project Name] - $[Amount]"
- [ ] Email includes: client name, project details, files link, delivery deadline
- [ ] Email has clear CTA: "View Order" button
- [ ] Dashboard shows notification badge (red dot or count)
- [ ] Notification center lists order with timestamp
- [ ] Clicking notification navigates to order detail page
- [ ] Email link includes order ID and directs to correct order
- [ ] Notification marked as "read" after viewing
- [ ] Notification preferences respected (if engineer disabled email)

**Notification Content Validation:**
- [ ] Client name and profile link
- [ ] Project name and description
- [ ] Order amount and delivery deadline
- [ ] Quick actions: "Accept Order", "View Files"
- [ ] Clear typography and branding

**Edge Cases to Test:**
- [ ] Engineer has email notifications disabled (only in-app shown)
- [ ] Email bounces (invalid engineer email)
- [ ] Multiple simultaneous orders (separate notifications)
- [ ] Notification for order update vs new order (different templates)

---

### Stage 14: Engineer Updates Order Status

**Test Case:** Engineer updates order through workflow stages

**Test Steps:**
1. Engineer navigates to Dashboard → Orders
2. Clicks on order from Sarah Johnson
3. Reviews project details and stem files
4. Downloads stems for work
5. Clicks "Start Working" → Status changes to "In Progress"
6. After completing mix, clicks "Upload Delivery"
7. Uploads final mix files (WAV + MP3)
8. Adds delivery notes
9. Clicks "Mark as Delivered" → Status changes to "Delivered"

**Expected Results:**
- [ ] Order status changes reflected immediately in UI
- [ ] Status timeline shows progression (Pending → In Progress → Delivered)
- [ ] Each status change timestamped
- [ ] Client receives email notification for each status change
- [ ] "In Progress" status shows progress indicator to client
- [ ] Delivery file upload validates file types (audio files only)
- [ ] Delivery files stored securely (client download link generated)
- [ ] "Delivered" status triggers client notification with download link
- [ ] Delivery notes visible to client
- [ ] Order marked as "Awaiting Review" after delivery
- [ ] Expected delivery date updated if needed

**Status Workflow Validation:**
- [ ] Status cannot move backwards (In Progress → Pending blocked)
- [ ] Delivery required before marking "Delivered"
- [ ] Revision requests change status to "Revision Requested"
- [ ] Completion only after client approval or auto-complete (14 days)

**Edge Cases to Test:**
- [ ] Engineer tries to deliver before uploading files (validation)
- [ ] Delivery file upload fails (retry mechanism)
- [ ] Very large delivery file (>500MB)
- [ ] Multiple delivery attempts (versioning)
- [ ] Status update with poor network (offline handling)

---

### Stage 15: Engineer Uploads Delivery

**Test Case:** Engineer uploads final deliverables for client

**Test Steps:**
1. On order detail page (status: In Progress)
2. Scroll to "Delivery" section
3. Click "Upload Files"
4. Select files from computer:
   - Final_Mix_Stereo.wav (100MB)
   - Final_Mix_Stereo.mp3 (10MB)
   - Mix_Notes.pdf (500KB)
5. Add delivery message: "First mix delivered. Let me know your feedback."
6. Click "Upload Delivery"
7. Wait for upload completion
8. Click "Mark as Delivered"

**Expected Results:**
- [ ] File upload supports multiple file selection
- [ ] Upload progress shown for each file
- [ ] Large files upload reliably (resumable upload)
- [ ] All files upload successfully
- [ ] Files stored in secure, order-specific directory
- [ ] File names preserved and sanitized
- [ ] Total delivery size calculated and shown
- [ ] Delivery message saved with files
- [ ] "Mark as Delivered" enabled after upload completes
- [ ] Status changes to "Delivered"
- [ ] Client receives email: "Your order has been delivered!"
- [ ] Email includes download links for all files
- [ ] Download links expire after 30 days (configurable)
- [ ] Engineer can upload additional files later (revisions)

**Upload Validation:**
- [ ] Supported file types: audio (WAV, MP3, AIFF, FLAC), documents (PDF, TXT)
- [ ] Max file size: 500MB per file
- [ ] Total delivery size limit: 2GB
- [ ] Malware scanning on upload (if implemented)

**Edge Cases to Test:**
- [ ] Upload interrupted (resume capability)
- [ ] Unsupported file type (warning shown)
- [ ] File size exceeds limit (error message)
- [ ] No files selected (validation)
- [ ] Duplicate file names (auto-rename)
- [ ] Network timeout during upload (retry)

---

### Stage 16: Client Downloads Delivery

**Test Case:** Client downloads delivered files from engineer

**Test Steps:**
1. Client receives delivery email notification
2. Clicks "Download Files" link in email
3. Redirected to order page or download page
4. Reviews delivery message from engineer
5. Clicks "Download All as ZIP" or individual file downloads
6. Files download to computer
7. Extracts ZIP and verifies files

**Expected Results:**
- [ ] Email link directs to authenticated download page
- [ ] Download page lists all delivery files with names and sizes
- [ ] Individual download buttons for each file
- [ ] "Download All" creates ZIP archive on-demand
- [ ] ZIP includes all files with preserved structure
- [ ] Download starts immediately after click
- [ ] Download progress shown for large files
- [ ] Files download completely without corruption
- [ ] File names match uploaded names
- [ ] Delivery message displayed prominently
- [ ] Download activity logged (timestamp, IP)
- [ ] Download count shown to engineer (for analytics)

**Security Checks:**
- [ ] Download links require authentication (client must be logged in)
- [ ] Download links include security token
- [ ] Links expire after 30 days
- [ ] Files not accessible via direct URL without token
- [ ] Rate limiting on downloads (prevent abuse)

**Edge Cases to Test:**
- [ ] Client not logged in (redirect to login, then download)
- [ ] Expired download link (error message, request re-send)
- [ ] Very large ZIP download (>1GB, progress indicator)
- [ ] Download interrupted (resume capability)
- [ ] Multiple simultaneous downloads
- [ ] Mobile device download (appropriate file handling)

---

### Stage 17: Client Leaves Review

**Test Case:** Client submits rating and review for completed order

**Test Steps:**
1. After downloading delivery, client sees "Leave a Review" prompt
2. Navigates to order detail page
3. Clicks "Write Review"
4. Review form appears:
   - Star rating: 5/5
   - Review title: "Outstanding mix quality!"
   - Review text: Detailed feedback (150 words)
   - Would recommend: Yes
5. Clicks "Submit Review"

**Expected Results:**
- [ ] Review form accessible only after delivery received
- [ ] Star rating selector (1-5 stars, required)
- [ ] Review title field (optional, max 100 chars)
- [ ] Review text area (required, min 20 chars, max 1000 chars)
- [ ] "Would recommend" toggle (optional)
- [ ] Character count shown for review text
- [ ] Form validates before submission
- [ ] Review submits successfully
- [ ] Success message: "Thank you for your review!"
- [ ] Review appears on engineer's profile immediately
- [ ] Review shows: client name/initial, rating, text, date
- [ ] Engineer receives notification of new review
- [ ] Engineer's average rating updates
- [ ] Review count increments
- [ ] Order status updates to "Completed"

**Review Display Validation:**
- [ ] Reviews sorted by date (newest first)
- [ ] Star rating shown visually (gold stars)
- [ ] Client name/photo shown (if public profile)
- [ ] Review date shown (relative: "2 days ago")
- [ ] Engineer can reply to review (optional feature)
- [ ] Review verified badge shown ("Verified Order")

**Edge Cases to Test:**
- [ ] Client tries to review before receiving delivery (blocked)
- [ ] Client tries to review same order twice (prevented)
- [ ] Review with no text (validation error)
- [ ] Review with inappropriate content (flag for moderation)
- [ ] Very long review (truncated with "Read more")
- [ ] Review submitted then order refunded (review removed?)

---

### Stage 18: Client Purchases Digital Product

**Test Case:** Client purchases and pays for digital product (sample pack)

**Test Steps:**
1. Client browses engineer profile, clicks "Products" tab
2. Clicks on product: "Analog Drum Samples Vol. 1 - $49.99"
3. Product page shows description, preview audio, file info
4. Plays preview audio samples (3 samples)
5. Clicks "Purchase Product"
6. Redirected to checkout page
7. Enters payment details (Stripe test card: 5555 5555 5555 4444 - Mastercard)
8. Enters billing address
9. Clicks "Complete Purchase - $49.99"
10. Payment processes

**Expected Results:**
- [ ] Product page loads with all details
- [ ] Preview audio samples playable without purchase
- [ ] "Purchase" button prominent and clear
- [ ] Checkout shows product thumbnail, name, price
- [ ] Total includes product price (no platform fee for digital products, or consistent fee)
- [ ] Payment form secure (Stripe Payment Element)
- [ ] Payment processes successfully
- [ ] Payment Intent created in Stripe
- [ ] Purchase confirmation page shown
- [ ] Confirmation email sent to client with download link
- [ ] Purchase appears in client's "My Purchases" section
- [ ] Engineer receives notification of sale
- [ ] Engineer's sales analytics updated

**Payment Verification:**
- [ ] Stripe Payment Intent amount: $49.99
- [ ] Platform fee calculated (if applicable, e.g., 10% = $4.99)
- [ ] Engineer receives net amount: $45 (if 10% fee) or $49.99 (if 0% for Pro)
- [ ] Payment status: "succeeded"
- [ ] Payment method: Mastercard ending in 4444

**Edge Cases to Test:**
- [ ] Card declined (error shown, retry option)
- [ ] Product purchased while engineer unpublishes it
- [ ] Product price changed during checkout (warning)
- [ ] Checkout session expires (30 min timeout)
- [ ] Client already purchased product (re-download vs re-purchase)

---

### Stage 19: Client Downloads Product

**Test Case:** Client downloads purchased digital product

**Test Steps:**
1. After successful purchase, client on confirmation page
2. Clicks "Download Product" button
3. Alternatively, navigates to Dashboard → My Purchases
4. Finds "Analog Drum Samples Vol. 1"
5. Clicks "Download"
6. Product ZIP file downloads
7. Extracts ZIP and verifies contents (100 WAV files, license PDF)

**Expected Results:**
- [ ] Confirmation page shows instant download link
- [ ] "My Purchases" lists all purchased products
- [ ] Each product shows: thumbnail, name, purchase date, download button
- [ ] Download button triggers immediate download
- [ ] Product file (ZIP) downloads completely
- [ ] ZIP file size matches product listing
- [ ] ZIP extracts without errors
- [ ] All product files present and intact
- [ ] License PDF included in ZIP
- [ ] Download link works multiple times (no download limit)
- [ ] Download link accessible indefinitely (lifetime access)
- [ ] Download logged for analytics

**Security Checks:**
- [ ] Download requires authentication (logged-in client only)
- [ ] Download URL includes security token
- [ ] Product files not accessible via direct URL
- [ ] Download permission verified (client must own product)
- [ ] Rate limiting on downloads (prevent abuse/sharing)

**Edge Cases to Test:**
- [ ] Download on mobile device (appropriate handling)
- [ ] Very large product file (>500MB, progress shown)
- [ ] Download interrupted (resume capability)
- [ ] Client refunded product (download access revoked)
- [ ] Product file deleted by engineer (error message, support contact)
- [ ] Multiple simultaneous product downloads

---

### Stage 20: Engineer Views Analytics

**Test Case:** Engineer reviews earnings, order stats, and profile analytics

**Test Steps:**
1. Engineer navigates to Dashboard → Analytics
2. Reviews overview metrics:
   - Total earnings (all time)
   - Earnings this month
   - Total orders
   - Orders this month
   - Average rating
   - Profile views (last 30 days)
3. Views earnings chart (line graph, last 6 months)
4. Views order breakdown (by service type)
5. Checks top-performing services
6. Reviews traffic sources
7. Exports analytics data (CSV)

**Expected Results:**
- [ ] Analytics dashboard loads within 2 seconds
- [ ] Overview cards show accurate totals
- [ ] Earnings displayed in USD with correct formatting ($12,345.67)
- [ ] Earnings chart interactive (hover shows date + amount)
- [ ] Chart data accurate (matches order records)
- [ ] Order breakdown pie chart shows service distribution
- [ ] Top services ranked by revenue and order count
- [ ] Profile views tracked accurately (unique vs total)
- [ ] Traffic sources shown (search, direct, social, referral)
- [ ] Date range selector works (7 days, 30 days, 90 days, all time)
- [ ] CSV export downloads with all transaction data
- [ ] CSV includes: date, client, service, amount, fee, net

**Pro Tier Features:**
- [ ] Pro users see advanced analytics (conversion rate, avg. project value)
- [ ] Pro users see client retention metrics
- [ ] Pro users can compare periods (month-over-month)
- [ ] Free tier shows upgrade prompt for advanced features

**Edge Cases to Test:**
- [ ] New account with no data (empty state message)
- [ ] Account with 1000+ orders (pagination, performance)
- [ ] Chart with sparse data (handles gracefully)
- [ ] CSV export with special characters in data (proper escaping)
- [ ] Very long date range (performance check)

---

## Payment Flow Tests

### Stage 21: Test with Stripe Test Cards (Success)

**Test Case:** Verify successful payment processing with various test cards

**Test Cards to Test:**
- **Visa:** 4242 4242 4242 4242
- **Mastercard:** 5555 5555 5555 4444
- **Amex:** 3782 822463 10005
- **Discover:** 6011 1111 1111 1117

**Test Steps (for each card):**
1. Initiate service booking checkout
2. Enter test card details
3. Use test CVV: Any 3 digits (4 for Amex)
4. Use test expiry: Any future date
5. Enter test ZIP: Any valid format
6. Complete payment

**Expected Results:**
- [ ] All major card brands accepted
- [ ] Card brand detected and icon shown
- [ ] Payment processes successfully for all cards
- [ ] Payment Intent created with correct card brand
- [ ] Confirmation page shown for each
- [ ] Order created for each test
- [ ] Card last 4 digits shown in order details
- [ ] Receipt includes card brand (Visa, Mastercard, etc.)

**Payment Intent Validation:**
- [ ] Status: "succeeded"
- [ ] Amount: Matches order total
- [ ] Payment method: Correct card type
- [ ] Metadata: Includes order ID, engineer ID

---

### Stage 22: Test with Declined Card

**Test Case:** Handle declined payment scenarios gracefully

**Test Cards for Decline Scenarios:**
- **Generic decline:** 4000 0000 0000 0002
- **Insufficient funds:** 4000 0000 0000 9995
- **Lost card:** 4000 0000 0000 9987
- **Stolen card:** 4000 0000 0000 9979
- **Expired card:** 4000 0000 0000 0069

**Test Steps (for each decline type):**
1. Initiate checkout with $500 service
2. Enter declined test card
3. Complete payment form
4. Submit payment

**Expected Results:**
- [ ] Payment fails with appropriate error message
- [ ] Error message user-friendly: "Your card was declined. Please try a different payment method."
- [ ] Specific decline reason shown when safe: "Insufficient funds"
- [ ] Payment form stays open (doesn't navigate away)
- [ ] Client can retry with different card
- [ ] No order created in database
- [ ] No charge made in Stripe
- [ ] Decline logged for fraud detection
- [ ] Engineer not notified (no false notifications)
- [ ] Client can retry up to 3 times (rate limiting)

**Error Messaging:**
- [ ] Generic decline: "Your card was declined"
- [ ] Insufficient funds: "Insufficient funds. Please use a different card."
- [ ] Lost/Stolen: "Your card was declined. Please contact your bank."
- [ ] Expired: "Your card has expired. Please use a different card."

**Edge Cases:**
- [ ] Multiple rapid decline attempts (fraud protection)
- [ ] Decline after 3D Secure challenge
- [ ] Network timeout during payment (unclear status handling)

---

### Stage 23: Test Subscription Creation

**Test Case:** Verify Pro subscription creation and billing cycle

**Test Steps:**
1. Free tier engineer navigates to Dashboard → Subscription
2. Clicks "Upgrade to Pro - $29/month"
3. Reviews Pro benefits modal
4. Clicks "Continue to Payment"
5. Enters Stripe test card: 4242 4242 4242 4242
6. Confirms subscription purchase
7. Wait for webhook processing

**Expected Results:**
- [ ] Subscription checkout form shows $29/month clearly
- [ ] Payment processes successfully
- [ ] Stripe Subscription object created
- [ ] Subscription status: "active"
- [ ] Subscription interval: "month"
- [ ] Subscription price: $29.00
- [ ] First billing date: Today
- [ ] Next billing date: 30 days from today
- [ ] Subscription ID stored in database
- [ ] User tier updated from "free" to "pro"
- [ ] Dashboard shows "Pro" badge
- [ ] Platform fee changes to 0% for future orders
- [ ] Invoice generated and emailed
- [ ] Subscription visible in Stripe dashboard
- [ ] Payment method saved for future billing

**Webhook Validation:**
- [ ] `customer.subscription.created` webhook received
- [ ] Webhook processed within 30 seconds
- [ ] User tier updated via webhook (idempotent)

**Edge Cases to Test:**
- [ ] User already has active subscription (prevent duplicate)
- [ ] Card declined during subscription creation
- [ ] Webhook fails to process (manual sync needed)
- [ ] User cancels within 1 hour (refund policy)

---

### Stage 24: Test Subscription Cancellation

**Test Case:** Cancel Pro subscription and verify downgrade

**Test Steps:**
1. Pro tier engineer navigates to Dashboard → Subscription
2. Reviews current subscription details (next billing date, amount)
3. Clicks "Cancel Subscription"
4. Confirmation modal appears: "Are you sure? You'll lose Pro benefits."
5. Confirms cancellation
6. Subscription cancels

**Expected Results:**
- [ ] Cancellation confirmation modal clear and informative
- [ ] Modal explains what happens: "Access continues until [date], then reverts to free tier"
- [ ] Cancellation processes immediately
- [ ] Stripe subscription updated: `cancel_at_period_end = true`
- [ ] Subscription status: "active" (until period end)
- [ ] User retains Pro access until period end date
- [ ] Dashboard shows: "Pro (cancels on [date])"
- [ ] Cancellation confirmation email sent
- [ ] On period end date, tier auto-downgrades to "free"
- [ ] Platform fee reverts to 10% for future orders
- [ ] No charge on next billing date
- [ ] Subscription status changes to "canceled" after period end

**Webhook Validation:**
- [ ] `customer.subscription.updated` webhook received (cancel_at_period_end)
- [ ] `customer.subscription.deleted` webhook received at period end
- [ ] User tier downgraded via webhook automation

**Edge Cases to Test:**
- [ ] Cancel immediately after subscribing (same day)
- [ ] Cancel then re-subscribe before period end (reactivate)
- [ ] Cancel with failed payment method (subscription already inactive)
- [ ] Webhook processing delay (manual tier check on login)

---

### Stage 25: Test Refund Process

**Test Case:** Process refund for completed order

**Test Steps:**
1. Engineer or admin initiates refund for order #12345 ($500)
2. Navigates to order detail page
3. Clicks "Issue Refund"
4. Selects refund type: Full or Partial
5. Enters refund amount: $500 (full refund)
6. Enters reason: "Client requested cancellation"
7. Confirms refund

**Expected Results:**
- [ ] Refund button only visible for paid orders
- [ ] Refund form shows order total and available refund amount
- [ ] Partial refund allows custom amount (up to order total)
- [ ] Refund reason required (dropdown + text field)
- [ ] Confirmation modal warns: "This will refund $500 to the client's card"
- [ ] Refund processes in Stripe
- [ ] Stripe Refund object created
- [ ] Refund status: "succeeded"
- [ ] Client's card credited within 5-10 business days
- [ ] Order status updates to "Refunded"
- [ ] Engineer's balance decreases by refund amount
- [ ] Platform fee also refunded (engineer only loses their portion)
- [ ] Refund notification sent to client
- [ ] Refund appears in engineer's transaction history (negative)
- [ ] Refund logged in admin audit trail

**Refund Types:**
- [ ] Full refund: Entire order amount returned
- [ ] Partial refund: Specified amount returned (e.g., $250 of $500)
- [ ] Refund after payout: Deducted from next payout or creates negative balance

**Edge Cases to Test:**
- [ ] Refund amount exceeds order total (validation error)
- [ ] Double refund attempt (prevention)
- [ ] Refund for order already refunded (blocked)
- [ ] Refund fails in Stripe (error handling, retry)
- [ ] Refund for very old order (>90 days, Stripe limitations)
- [ ] Partial refund multiple times (cumulative limit check)

---

### Stage 26: Verify Platform Fee Calculation (10% Free Tier)

**Test Case:** Confirm correct platform fee calculation for free tier engineers

**Test Scenarios:**

**Scenario 1: Service Order - $500**
1. Free tier engineer receives service order: $500
2. Calculate expected platform fee: $500 × 10% = $50
3. Engineer net: $450

**Scenario 2: Service Order - $1,250**
1. Free tier engineer receives service order: $1,250
2. Calculate expected platform fee: $1,250 × 10% = $125
3. Engineer net: $1,125

**Scenario 3: Digital Product - $49.99**
1. Free tier engineer sells digital product: $49.99
2. Calculate expected platform fee: $49.99 × 10% = $5.00 (rounded)
3. Engineer net: $44.99

**Expected Results (for each scenario):**
- [ ] Platform fee calculated correctly at 10% of order total
- [ ] Platform fee shown to engineer in order details
- [ ] Platform fee shown to engineer in checkout summary (optional transparency)
- [ ] Stripe transfer amount = Order total - Platform fee
- [ ] Engineer dashboard shows gross and net amounts separately
- [ ] Transaction record includes: gross, fee, net
- [ ] Platform account receives fee amount
- [ ] Fee calculation handles cents correctly (no rounding errors)
- [ ] Analytics show gross revenue vs net revenue

**Database Validation:**
- [ ] Order table: `total_amount`, `platform_fee`, `engineer_net`
- [ ] Platform fee amount: Exactly 10% of total
- [ ] Stripe transfer amount matches `engineer_net`

**Edge Cases:**
- [ ] Very small order ($10): Fee = $1, Net = $9
- [ ] Order with cents ($127.49): Fee = $12.75, Net = $114.74
- [ ] Large order ($10,000): Fee = $1,000, Net = $9,000

---

### Stage 27: Verify 0% Fee for Pro Tier

**Test Case:** Confirm Pro tier engineers pay 0% platform fee

**Test Scenarios:**

**Scenario 1: Pro Engineer Service Order - $500**
1. Pro tier engineer receives service order: $500
2. Platform fee: $500 × 0% = $0
3. Engineer net: $500 (full amount)

**Scenario 2: Pro Engineer Service Order - $2,000**
1. Pro tier engineer receives service order: $2,000
2. Platform fee: $2,000 × 0% = $0
3. Engineer net: $2,000

**Scenario 3: Pro Engineer Digital Product - $99**
1. Pro tier engineer sells digital product: $99
2. Platform fee: $99 × 0% = $0
3. Engineer net: $99

**Expected Results (for each scenario):**
- [ ] Platform fee = $0 for all Pro tier transactions
- [ ] Engineer receives 100% of order amount
- [ ] Stripe transfer amount = Full order total
- [ ] Order details show "Platform Fee: $0 (Pro Tier)"
- [ ] Dashboard shows gross = net for Pro users
- [ ] Analytics highlight Pro tier benefit (savings vs free tier)
- [ ] Pro badge shown on orders/transactions
- [ ] No platform fee deducted from engineer balance

**Tier Verification:**
- [ ] User tier checked at order creation
- [ ] Platform fee calculated based on tier at time of order (not time of payout)
- [ ] If engineer upgrades to Pro, previous orders still have 10% fee
- [ ] If engineer downgrades from Pro, new orders have 10% fee

**Edge Cases:**
- [ ] Engineer upgrades to Pro mid-order (fee based on tier at order time)
- [ ] Engineer's subscription expires (downgrade to free, fees apply)
- [ ] Refund on Pro tier order (no fee to reverse, full refund to client)

---

### Stage 28: Verify Engineer Payout Amounts

**Test Case:** Confirm correct payout amounts for engineers

**Test Setup:**
1. Free tier engineer "JohnDoe" has completed orders totaling $5,000
   - Orders: $500, $1,250, $2,000, $1,250
   - Platform fees (10%): $50, $125, $200, $125 = $500 total
   - Expected net: $4,500
2. Pro tier engineer "JaneStudio" has completed orders totaling $5,000
   - Orders: $2,500, $1,500, $1,000
   - Platform fees (0%): $0
   - Expected net: $5,000

**Test Steps:**
1. Check engineer dashboards for pending balance
2. Trigger Stripe payout (manual or automatic)
3. Verify Stripe transfer details
4. Check engineer bank account (test mode: simulated)

**Expected Results - Free Tier (JohnDoe):**
- [ ] Dashboard shows gross earnings: $5,000
- [ ] Dashboard shows platform fees: -$500
- [ ] Dashboard shows net earnings: $4,500
- [ ] Pending balance: $4,500 (assuming all orders delivered)
- [ ] Stripe transfer initiated for $4,500
- [ ] Transfer status: "paid" or "in_transit"
- [ ] Transfer arrives in Stripe Connect account
- [ ] Payout schedule: Daily, weekly, or monthly (based on settings)
- [ ] Transaction history shows individual orders with fee breakdown

**Expected Results - Pro Tier (JaneStudio):**
- [ ] Dashboard shows gross earnings: $5,000
- [ ] Dashboard shows platform fees: $0
- [ ] Dashboard shows net earnings: $5,000
- [ ] Pending balance: $5,000
- [ ] Stripe transfer initiated for $5,000
- [ ] Pro badge indicates 0% fee benefit
- [ ] Savings shown: "$0 in platform fees (Pro Tier)"

**Payout Validation:**
- [ ] Payout amount matches available balance
- [ ] Payout includes all completed orders (not pending/in-progress)
- [ ] Refunded orders deducted from payout
- [ ] Payout failure handling (insufficient balance, bank error)
- [ ] Payout history accessible in dashboard

**Edge Cases:**
- [ ] Payout with negative balance (refund exceeds earnings: held)
- [ ] First payout (Stripe may hold for verification)
- [ ] Payout below minimum threshold ($10: held until minimum reached)
- [ ] Currency conversion for international engineers (if supported)

---

## Edge Case Tests

### Stage 29: Profile with No Portfolio Items

**Test Case:** Engineer profile with no portfolio items yet

**Test Steps:**
1. Create new engineer account
2. Complete profile setup (name, bio, photo)
3. Publish profile without adding portfolio items
4. View profile as client

**Expected Results:**
- [ ] Profile loads successfully (no errors)
- [ ] Portfolio section shows empty state message
- [ ] Empty state text: "No portfolio items yet. Check back soon!"
- [ ] Empty state includes icon or illustration
- [ ] Engineer sees different message in dashboard: "Add your first portfolio item to showcase your work"
- [ ] "Add Portfolio Item" CTA shown to engineer only
- [ ] Profile still searchable and accessible
- [ ] Other sections visible (bio, services if added)
- [ ] No broken layout or missing sections
- [ ] Meta tags still populate for SEO

**User Experience:**
- [ ] Empty state doesn't look broken or incomplete
- [ ] Client can still contact engineer (inquiry form available)
- [ ] Engineer prompted to add portfolio items (dashboard reminder)

---

### Stage 30: Profile with No Services

**Test Case:** Engineer profile with no services listed

**Test Steps:**
1. Engineer has profile and portfolio items
2. Engineer has not created any services
3. Client visits profile

**Expected Results:**
- [ ] Profile loads successfully
- [ ] Services section shows empty state
- [ ] Empty state message: "No services available yet"
- [ ] Portfolio items still visible
- [ ] Client can still view portfolio and send inquiry
- [ ] No "Book Now" buttons (no services to book)
- [ ] Engineer dashboard prompts: "Create your first service to start accepting bookings"
- [ ] Profile search ranking may be lower (no services = less visibility)
- [ ] Engineer can still receive inquiries

---

### Stage 31: Unpublished Profile Access

**Test Case:** Attempt to access unpublished engineer profile

**Test Steps:**
1. Engineer creates profile but keeps it "Unpublished"
2. Client attempts to access profile URL: /engineername
3. Client attempts to access via search

**Expected Results:**
- [ ] Direct URL access shows 404 page or "Profile not available"
- [ ] Profile does not appear in search results
- [ ] Profile not indexed by search engines (noindex meta tag)
- [ ] Engineer can still access own profile when logged in
- [ ] Engineer sees banner: "Your profile is unpublished. Only you can see it."
- [ ] Engineer has "Publish Profile" button in banner
- [ ] Once published, profile immediately accessible
- [ ] Previous URLs still work after publishing (no link breaks)

**Security:**
- [ ] Unpublished profile data not exposed via API
- [ ] Direct API requests return 403/404
- [ ] Portfolio items from unpublished profile not accessible

---

### Stage 32: Invalid Username Access

**Test Case:** Access profile with non-existent username

**Test Steps:**
1. Client navigates to /thisuserdoesnotexist
2. API query for username returns null

**Expected Results:**
- [ ] 404 error page shown
- [ ] 404 page branded (MixExperts logo, navigation)
- [ ] 404 page helpful message: "Profile not found"
- [ ] 404 page includes search or "Browse Engineers" CTA
- [ ] Browser console shows 404 status (not 500 error)
- [ ] Error logged for monitoring (but not alerted as critical)
- [ ] User can navigate back to homepage easily

---

### Stage 33: Expired Session Handling

**Test Case:** User session expires during activity

**Test Steps:**
1. Engineer logs in
2. Session expires after 24 hours (configurable)
3. Engineer attempts to perform action (update profile, view orders)

**Expected Results:**
- [ ] Action fails gracefully (no error crash)
- [ ] User redirected to login page
- [ ] Message shown: "Your session has expired. Please log in again."
- [ ] After login, user redirected back to intended action
- [ ] No data loss (form data preserved if possible)
- [ ] Session timeout warning shown before expiry (e.g., 5 min warning)
- [ ] "Stay logged in" option extends session

**Security:**
- [ ] Expired session tokens rejected by API
- [ ] User cannot access protected routes
- [ ] Token refresh mechanism (if implemented) works

---

### Stage 34: Network Error Handling

**Test Case:** Handle network failures gracefully

**Test Steps:**
1. Simulate network disconnection (browser dev tools: offline mode)
2. User attempts to:
   - Load profile
   - Submit form
   - Upload file
   - Make payment

**Expected Results:**
- [ ] Network error detected and shown to user
- [ ] Error message: "Network connection lost. Please check your connection."
- [ ] User not shown generic error (avoid "Something went wrong")
- [ ] Retry button available
- [ ] Form data preserved (not lost on error)
- [ ] File uploads pause and resume when connection restored
- [ ] Payment errors prevent double charges (idempotency)
- [ ] Offline indicator shown (e.g., banner at top)
- [ ] App doesn't freeze or become unresponsive

---

### Stage 35: Large File Upload Handling

**Test Case:** Upload very large audio file (portfolio or stems)

**Test Steps:**
1. Engineer attempts to upload 500MB WAV file (portfolio item)
2. Client uploads 800MB stem pack (service order)

**Expected Results:**
- [ ] File size limit clearly indicated before upload
- [ ] If within limit: Upload progress bar shown (percentage + speed)
- [ ] Upload uses chunked/resumable upload (not single request)
- [ ] User can pause/resume upload (optional feature)
- [ ] Network interruption pauses upload, resumes automatically
- [ ] Large files don't timeout (adequate timeout settings)
- [ ] Upload completes successfully
- [ ] File integrity verified (checksum)
- [ ] If exceeds limit: Error shown before upload starts
- [ ] Suggested actions: Compress file, split into parts

**Performance:**
- [ ] Upload doesn't block UI (background processing)
- [ ] User can navigate away and upload continues
- [ ] Upload speed shown (MB/s)
- [ ] Estimated time remaining shown

---

### Stage 36: Concurrent Booking Attempts

**Test Case:** Multiple clients attempt to book limited-availability service simultaneously

**Test Steps:**
1. Engineer has service with limited slots (e.g., "1 booking per month")
2. Two clients (Alice and Bob) initiate booking at same time (within 1 second)
3. Both proceed to checkout
4. Both submit payment

**Expected Results:**
- [ ] First payment to complete secures the booking
- [ ] Second payment attempt fails or queued
- [ ] Second client shown message: "This service is no longer available for the selected time slot"
- [ ] Second client's payment NOT charged (payment blocked before processing)
- [ ] No double-booking created
- [ ] First client receives order confirmation
- [ ] Second client offered alternative: "Join waitlist" or "Contact engineer for availability"
- [ ] Database constraint prevents duplicate active bookings (if applicable)
- [ ] Race condition handled via database locks or atomic transactions

**Alternative Implementation (if no slot limits):**
- [ ] Both bookings succeed (if no capacity restriction)
- [ ] Engineer receives both orders

---

### Stage 37: Double Payment Prevention

**Test Case:** Prevent duplicate charges if user clicks "Pay" multiple times

**Test Steps:**
1. Client on checkout page for $500 service
2. Clicks "Complete Payment" button
3. Payment processing starts (network latency: 3 seconds)
4. Client clicks "Complete Payment" again (impatient double-click)

**Expected Results:**
- [ ] Button disabled immediately after first click
- [ ] Loading spinner/indicator shown on button
- [ ] Second click ignored (button disabled)
- [ ] Only one Payment Intent created in Stripe
- [ ] Only one order created in database
- [ ] Only one charge to client's card
- [ ] Order confirmation shown once payment succeeds
- [ ] If API receives duplicate request: Idempotency key prevents duplicate charge

**Idempotency Implementation:**
- [ ] Checkout session has unique ID
- [ ] Payment Intent created with idempotency key (session ID)
- [ ] Duplicate requests with same key return original Payment Intent
- [ ] Order creation also idempotent (unique order ID or constraint)

---

## Performance Tests

### Stage 38: Page Load Times < 3 Seconds

**Test Case:** Verify all critical pages load within 3 seconds

**Pages to Test:**
- Homepage
- Engineer profile page
- Service detail page
- Product detail page
- Checkout page
- Dashboard (engineer)
- Search results page

**Test Method:**
1. Use browser DevTools Performance tab
2. Measure time to First Contentful Paint (FCP)
3. Measure time to Largest Contentful Paint (LCP)
4. Measure time to Time to Interactive (TTI)
5. Test on simulated 3G network (throttling)

**Expected Results (for each page):**
- [ ] First Contentful Paint (FCP): <1.5 seconds
- [ ] Largest Contentful Paint (LCP): <2.5 seconds
- [ ] Time to Interactive (TTI): <3.5 seconds
- [ ] Total page load (onLoad): <3 seconds (fast connection)
- [ ] Total page load (3G): <5 seconds
- [ ] No render-blocking resources
- [ ] Images lazy-loaded below fold
- [ ] Critical CSS inlined
- [ ] JavaScript bundles optimized (<200KB)

**Performance Optimizations Verified:**
- [ ] Server-side rendering (SSR) or static generation
- [ ] Image optimization (WebP format, responsive sizes)
- [ ] Code splitting (dynamic imports)
- [ ] CDN usage for static assets
- [ ] Gzip/Brotli compression
- [ ] Efficient caching headers

---

### Stage 39: Lighthouse Score > 80

**Test Case:** Achieve Lighthouse score >80 across all categories

**Test Pages:**
- Homepage
- Engineer profile
- Service page
- Dashboard

**Lighthouse Categories:**
- Performance
- Accessibility
- Best Practices
- SEO

**Test Method:**
1. Run Lighthouse audit in Chrome DevTools
2. Use CLI: `lighthouse [URL] --view`
3. Test in incognito mode (no extensions)
4. Test on mobile and desktop

**Expected Results (for each page):**
- [ ] Performance score: >85
- [ ] Accessibility score: >90
- [ ] Best Practices score: >90
- [ ] SEO score: >90
- [ ] PWA (if applicable): Passing

**Key Metrics:**
- [ ] LCP <2.5s (green)
- [ ] FID <100ms (green)
- [ ] CLS <0.1 (green)
- [ ] No accessibility violations (color contrast, ARIA labels)
- [ ] All images have alt text
- [ ] Semantic HTML used
- [ ] Meta descriptions present
- [ ] Proper heading hierarchy (H1 → H2 → H3)

**Failing Audits to Address:**
- [ ] Fix any red or orange audits
- [ ] Optimize images not sized correctly
- [ ] Add missing meta tags
- [ ] Fix accessibility issues (keyboard navigation, screen reader)

---

### Stage 40: Image Optimization Verified

**Test Case:** Confirm all images optimized for web

**Test Steps:**
1. Audit all images on engineer profile page
2. Check portfolio thumbnails, profile photos, service images
3. Verify format, size, compression

**Expected Results:**
- [ ] All images served in modern format (WebP, AVIF fallback)
- [ ] Fallback to JPEG/PNG for unsupported browsers
- [ ] Images responsive (srcset with multiple sizes)
- [ ] Images lazy-loaded (loading="lazy" attribute)
- [ ] Image file sizes optimized:
  - Profile photos: <100KB
  - Portfolio thumbnails: <150KB
  - Service images: <200KB
  - Full-size images: <500KB
- [ ] Images served from CDN (fast delivery)
- [ ] Images have width/height attributes (prevent CLS)
- [ ] Images compressed without visible quality loss
- [ ] No images larger than viewport (oversized images)

**Tools to Use:**
- [ ] Lighthouse image audit
- [ ] WebPageTest image analysis
- [ ] Browser DevTools Network tab (check image sizes)

---

### Stage 41: Audio Streaming Performance

**Test Case:** Verify audio streaming is fast and reliable

**Test Steps:**
1. Engineer profile with 10 portfolio audio items
2. Click play on first audio item
3. Measure time to start playback
4. Seek to middle of track
5. Play multiple tracks in sequence
6. Test on slow connection (3G throttling)

**Expected Results:**
- [ ] Audio starts playing within 2 seconds
- [ ] Audio streams progressively (no full download required)
- [ ] Seeking loads new position within 1 second
- [ ] Audio buffers ahead to prevent stuttering
- [ ] Buffering indicator shown if loading
- [ ] Multiple audio files load without memory leak
- [ ] Audio quality preserved (no excessive compression)
- [ ] Audio file format optimized (MP3 or AAC for streaming)
- [ ] Waveform loads independently (doesn't block audio)
- [ ] Playback smooth on mobile devices

**Performance Checks:**
- [ ] Audio files served with proper Content-Type header
- [ ] Audio files served with byte-range requests (HTTP 206)
- [ ] CDN used for audio delivery
- [ ] Audio bitrate appropriate (128-320 kbps)

---

### Stage 42: Database Query Performance

**Test Case:** Verify database queries optimized and fast

**Test Scenarios:**
1. Load engineer profile (fetches user, portfolio, services, reviews)
2. Search engineers (queries multiple filters)
3. Load dashboard orders (pagination, filters)
4. Load analytics (aggregate queries)

**Test Method:**
1. Enable database query logging
2. Monitor query execution time
3. Check for N+1 query problems
4. Verify indexes exist on queried columns

**Expected Results:**
- [ ] Profile page: <5 database queries total
- [ ] Each query completes in <100ms
- [ ] No N+1 queries (use eager loading/joins)
- [ ] Indexes exist on:
  - User: username, email
  - Portfolio: user_id, published
  - Services: user_id, published, category
  - Orders: user_id, engineer_id, status
  - Reviews: engineer_id, created_at
- [ ] Search queries use indexes (no full table scans)
- [ ] Aggregate queries (analytics) optimized with proper indexes
- [ ] Database connection pooling configured
- [ ] Query results cached where appropriate (Redis)

**Tools to Use:**
- [ ] Supabase Performance Insights
- [ ] Database EXPLAIN ANALYZE for slow queries
- [ ] APM tool (New Relic, Datadog) for query monitoring

---

## Browser/Device Tests

### Stage 43: Chrome Desktop

**Test Case:** Full functionality on Chrome desktop

**Test Environment:**
- Browser: Chrome (latest version)
- OS: macOS, Windows, Linux
- Screen: 1920x1080

**Test Steps:**
1. Complete full user journey (signup → profile → booking → payment)
2. Test all interactive elements (buttons, forms, modals)
3. Test audio playback
4. Test file uploads
5. Test responsive behavior (resize window)

**Expected Results:**
- [ ] All pages render correctly
- [ ] All forms submit successfully
- [ ] Audio player works perfectly
- [ ] File uploads complete
- [ ] Payment checkout works (Stripe Elements)
- [ ] No console errors
- [ ] No layout issues
- [ ] Animations smooth (60fps)
- [ ] Tooltips and hover states work
- [ ] Keyboard navigation functional

---

### Stage 44: Safari Desktop

**Test Case:** Full functionality on Safari desktop

**Test Environment:**
- Browser: Safari (latest version)
- OS: macOS
- Screen: 2560x1440 (Retina)

**Test Steps:**
- Same as Chrome desktop test

**Expected Results:**
- [ ] All features work identically to Chrome
- [ ] Audio playback works (Safari specific checks)
- [ ] WebP images display correctly (Safari 14+)
- [ ] No Safari-specific CSS bugs
- [ ] Stripe Elements render correctly
- [ ] Forms validate properly
- [ ] Date pickers work (Safari native or custom)

**Safari-Specific Checks:**
- [ ] Flexbox/Grid layouts correct
- [ ] Backdrop blur effects (if used) work or fallback gracefully
- [ ] Audio autoplay policy respected (no autoplay)

---

### Stage 45: Firefox Desktop

**Test Case:** Full functionality on Firefox desktop

**Test Environment:**
- Browser: Firefox (latest version)
- OS: Windows, Linux
- Screen: 1920x1080

**Test Steps:**
- Same as Chrome desktop test

**Expected Results:**
- [ ] All features work identically to Chrome
- [ ] Audio player compatible
- [ ] Forms validate correctly
- [ ] File uploads work
- [ ] No Firefox-specific layout issues
- [ ] Payment checkout works

---

### Stage 46: Chrome Mobile

**Test Case:** Full functionality on Chrome mobile (Android)

**Test Environment:**
- Browser: Chrome Mobile
- Device: Android phone (Samsung, Pixel)
- Screen: 375x667 (mobile viewport)

**Test Steps:**
1. Test responsive layout (all pages mobile-optimized)
2. Test touch interactions (tap, swipe, pinch-zoom)
3. Test audio playback on mobile
4. Test file upload from mobile device
5. Test payment on mobile (Stripe mobile)

**Expected Results:**
- [ ] Responsive layout works perfectly (<768px viewport)
- [ ] Navigation menu collapses to hamburger
- [ ] All buttons/links large enough for touch (min 44x44px)
- [ ] Forms easy to fill on mobile (appropriate input types)
- [ ] Audio player mobile-optimized (larger controls)
- [ ] File upload triggers native file picker
- [ ] Payment form mobile-friendly (Stripe mobile Elements)
- [ ] No horizontal scrolling
- [ ] Images scale correctly
- [ ] Text readable without zoom (min 16px font)

**Mobile-Specific Checks:**
- [ ] Viewport meta tag present
- [ ] Touch events work (no :hover-only interactions)
- [ ] Modals/dialogs cover full screen or positioned well
- [ ] Fixed headers don't obscure content
- [ ] Performance good on mid-range device

---

### Stage 47: Safari Mobile (iOS)

**Test Case:** Full functionality on Safari mobile (iOS)

**Test Environment:**
- Browser: Safari Mobile
- Device: iPhone (13, 14, 15)
- Screen: 390x844

**Test Steps:**
- Same as Chrome mobile test

**Expected Results:**
- [ ] All features work identically to Chrome mobile
- [ ] Audio playback works (iOS Safari restrictions: user-initiated)
- [ ] No audio autoplay (iOS prevents it)
- [ ] Forms compatible (iOS keyboard behavior)
- [ ] File upload works (iOS photo/file picker)
- [ ] Payment works (Apple Pay option shown if configured)
- [ ] No layout issues with iOS Safari chrome (address bar behavior)

**iOS-Specific Checks:**
- [ ] Safe area insets respected (notch, home indicator)
- [ ] Audio doesn't conflict with silent mode
- [ ] Zoom disabled on inputs (font-size ≥16px prevents zoom)
- [ ] Sticky elements account for iOS Safari bottom bar

---

### Stage 48: Tablet Viewport

**Test Case:** Full functionality on tablet

**Test Environment:**
- Device: iPad (768x1024), Android tablet
- Browsers: Safari, Chrome

**Test Steps:**
1. Test responsive layout at 768px-1024px width
2. Test both portrait and landscape orientations
3. Test touch interactions
4. Test all features (same as desktop/mobile)

**Expected Results:**
- [ ] Tablet-optimized layout (between mobile and desktop)
- [ ] Navigation works (may show desktop nav or mobile hamburger)
- [ ] Content readable and well-spaced
- [ ] Forms easy to use with touch
- [ ] Audio player sized appropriately
- [ ] Images scale correctly
- [ ] Multi-column layouts work (e.g., 2-column grid)
- [ ] No wasted space or overly cramped content
- [ ] Orientation change handled gracefully

---

## Test Completion Criteria

### Overall Requirements
- [ ] All 48 test stages completed
- [ ] All critical bugs fixed (P0, P1)
- [ ] Non-critical bugs documented for post-launch (P2, P3)
- [ ] Performance benchmarks met (load times, Lighthouse scores)
- [ ] Payment flows 100% functional (Stripe test mode)
- [ ] Cross-browser compatibility verified (95%+ feature parity)
- [ ] Mobile experience optimized and tested
- [ ] Security vulnerabilities addressed (OWASP top 10)
- [ ] Accessibility compliance (WCAG 2.1 AA minimum)
- [ ] Test documentation completed (this document + bug reports)

### Sign-off Required From
- [ ] Engineering Lead
- [ ] Product Manager
- [ ] QA Lead
- [ ] Stakeholder/Founder

---

## Bug Tracking & Reporting

### Bug Severity Levels
- **P0 (Critical):** Blocks launch, payment failures, data loss, security vulnerabilities
- **P1 (High):** Major functionality broken, poor user experience, performance issues
- **P2 (Medium):** Minor functionality issues, edge cases, cosmetic bugs
- **P3 (Low):** Nice-to-have fixes, minor cosmetic issues, future enhancements

### Bug Report Template
```
**Bug ID:** [Unique ID]
**Title:** [Brief description]
**Severity:** P0/P1/P2/P3
**Stage:** [Which test stage revealed this]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:** [What should happen]
**Actual Result:** [What actually happens]
**Environment:** [Browser, device, OS]
**Screenshots/Video:** [Attach evidence]
**Assigned To:** [Engineer name]
**Status:** Open / In Progress / Fixed / Verified
```

---

## Test Environment Teardown

After completing Phase 14:
- [ ] Export all test results and bug reports
- [ ] Archive test data (screenshots, videos, logs)
- [ ] Clean up test orders and transactions (if needed)
- [ ] Document any Stripe test mode specifics for production
- [ ] Prepare production checklist based on test findings
- [ ] Schedule regression testing for post-launch

---

## Next Steps After Phase 14

1. **Address Critical Bugs:** Fix all P0 and P1 issues before launch
2. **Final Security Audit:** Penetration testing, vulnerability scan
3. **Production Environment Setup:** Deploy to production Stripe, Supabase
4. **Soft Launch:** Limited user beta testing
5. **Full Launch:** Open to public with monitoring

---

## Appendix: Testing Tools & Resources

### Recommended Tools
- **Browser Testing:** BrowserStack, LambdaTest
- **Performance:** Lighthouse CI, WebPageTest, Chrome DevTools
- **Accessibility:** axe DevTools, WAVE
- **API Testing:** Postman, Insomnia
- **Load Testing:** k6, Artillery
- **Error Tracking:** Sentry, LogRocket
- **Analytics:** Google Analytics, Mixpanel

### Stripe Test Resources
- **Test Cards:** https://stripe.com/docs/testing
- **Webhooks:** Use Stripe CLI for local testing
- **Connect Testing:** Stripe Dashboard test mode

---

**Document Version:** 1.0
**Last Updated:** 2025-12-28
**Next Review:** After test completion
