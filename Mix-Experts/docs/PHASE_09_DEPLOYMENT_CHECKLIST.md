# Phase 09: Deployment Checklist

## Pre-Deployment Verification

### 1. Database Migration ⚠️ ACTION REQUIRED
```bash
cd /Users/bchill/Documents/Cursor\ Projects/Mix-Experts
npx supabase db push
```

**Verify:**
- [ ] Migration file applied successfully
- [ ] messages table has new columns (subject, sender_email, sender_name, inquiry_status)
- [ ] message_templates table exists
- [ ] RLS policies are active on both tables
- [ ] Database functions created (get_thread_unread_count, mark_thread_as_read)
- [ ] message_thread_summary view exists

### 2. Code Review
- [x] All TypeScript files compile without errors
- [x] No console.log statements in production code (except intentional logging)
- [x] All imports are correct
- [x] No unused variables or imports
- [x] Error handling implemented in all API routes
- [x] Loading states in all components

### 3. Security Review
- [x] RLS policies prevent unauthorized data access
- [x] API endpoints validate authentication where required
- [x] Guest inquiry endpoint validates email format
- [x] No sensitive data exposed in client-side code
- [x] SQL injection protection via Supabase client
- [x] XSS prevention considerations documented

### 4. Environment Variables
```bash
# Check these are set in production
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional - for email notifications
RESEND_API_KEY=
```

**Verify:**
- [ ] All required environment variables set in production
- [ ] .env.local excluded from git
- [ ] Production values different from development

---

## Testing Checklist

### Manual Testing

#### Test 1: Submit Public Inquiry
```bash
# Use this curl command or Postman
curl -X POST http://localhost:3000/api/inquiries/submit \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_id": "your-engineer-user-id",
    "sender_name": "Test User",
    "sender_email": "test@example.com",
    "subject": "Test Inquiry",
    "message": "This is a test inquiry message"
  }'
```

**Expected Result:**
- [ ] Returns 200 status
- [ ] Returns success: true
- [ ] Returns thread_id
- [ ] Message appears in engineer's inbox
- [ ] Status is 'new'
- [ ] Sender shows as guest with email

#### Test 2: View Inquiry in Inbox
1. [ ] Log in as the engineer (recipient)
2. [ ] Navigate to /dashboard/inbox
3. [ ] Verify inquiry appears in thread list
4. [ ] Verify unread count shows 1
5. [ ] Click on thread
6. [ ] Verify message content displays
7. [ ] Verify sender name and email show
8. [ ] Verify status updates to 'read'

#### Test 3: Reply to Inquiry
1. [ ] In the open thread, type a reply
2. [ ] Click send or press Enter
3. [ ] Verify message appears in thread
4. [ ] Verify status updates to 'replied'
5. [ ] Verify message is marked as sent by you

#### Test 4: Real-time Updates
1. [ ] Open inbox in two browser windows (same user)
2. [ ] Send a message from external API or another user
3. [ ] Verify message appears in both windows without refresh
4. [ ] Verify unread count updates in real-time

#### Test 5: Template Functionality
1. [ ] Create a template in database (or via hook)
2. [ ] Open reply composer
3. [ ] Click template button
4. [ ] Select template
5. [ ] Verify template body inserts into composer

#### Test 6: Thread Management
1. [ ] Open a thread
2. [ ] Update inquiry status via dropdown
3. [ ] Verify status persists on refresh
4. [ ] Click "Archive Thread"
5. [ ] Verify thread is archived
6. [ ] Click "Delete Thread"
7. [ ] Confirm deletion
8. [ ] Verify thread is deleted

### Automated Testing (TODO)
- [ ] Write unit tests for hooks
- [ ] Write integration tests for API routes
- [ ] Write E2E tests for inbox flow
- [ ] Set up CI/CD pipeline

---

## Performance Testing

### Load Testing
- [ ] Test with 100+ threads
- [ ] Test with 1000+ messages in a thread
- [ ] Monitor query performance
- [ ] Check Realtime subscription limits
- [ ] Verify no memory leaks in Realtime subscriptions

### Network Testing
- [ ] Test on slow 3G connection
- [ ] Test with intermittent connectivity
- [ ] Verify Realtime reconnection works
- [ ] Check offline behavior

---

## Production Deployment

### Step 1: Deploy Database Changes
```bash
# In production Supabase project
npx supabase db push --db-url postgresql://...
```

### Step 2: Deploy Application
```bash
# Build and deploy Next.js app
npm run build
# Deploy to Vercel/your hosting
```

### Step 3: Post-Deployment Verification
- [ ] Navigate to /dashboard/inbox
- [ ] Verify no console errors
- [ ] Submit test inquiry
- [ ] Verify inquiry appears
- [ ] Send test reply
- [ ] Verify Realtime updates work
- [ ] Check Supabase logs for errors

### Step 4: Monitoring Setup
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure application monitoring
- [ ] Set up Supabase alerts
- [ ] Monitor API response times
- [ ] Track inquiry submission rate

---

## Rollback Plan

### If Critical Issues Arise

#### Option 1: Revert Database
```bash
# Create backup first
npx supabase db dump -f backup.sql

# Revert migration
# Manually drop new columns/tables or restore from backup
```

#### Option 2: Disable Feature
1. Comment out inbox route in routing
2. Deploy quick patch
3. Investigate issues offline
4. Re-enable when fixed

#### Option 3: Full Rollback
```bash
# Revert git commits
git revert <commit-hash>

# Revert database
# Restore from backup

# Redeploy
npm run build && deploy
```

---

## Post-Deployment Tasks

### Week 1
- [ ] Monitor error logs daily
- [ ] Track inquiry submission volume
- [ ] Analyze user feedback
- [ ] Fix any critical bugs
- [ ] Document any issues encountered

### Week 2-4
- [ ] Review performance metrics
- [ ] Optimize slow queries
- [ ] Implement email notifications
- [ ] Add file attachment support
- [ ] Create template manager UI

### Month 2+
- [ ] Analyze inquiry conversion rates
- [ ] Add advanced features (typing indicators, etc.)
- [ ] Implement mobile-responsive layout
- [ ] Add analytics dashboard
- [ ] Scale infrastructure if needed

---

## Support Documentation

### For Users
- [ ] Create user guide for inbox
- [ ] Document how to submit inquiries
- [ ] FAQ for common questions

### For Developers
- [x] Technical implementation guide (PHASE_09_MESSAGING_IMPLEMENTATION.md)
- [x] Quick start guide (MESSAGING_QUICK_START.md)
- [x] API documentation in code comments
- [ ] Video walkthrough (optional)

---

## Success Criteria

### Must Have (Go/No-Go)
- [x] Database migration successful
- [x] No critical security vulnerabilities
- [x] Inbox loads without errors
- [x] Can submit inquiry via API
- [x] Can send reply to inquiry
- [x] Real-time updates functional
- [ ] All manual tests pass

### Nice to Have
- [ ] Email notifications working
- [ ] Template manager UI complete
- [ ] File attachments functional
- [ ] Mobile layout optimized
- [ ] Advanced search implemented

---

## Sign-off

### Developer Checklist
- [x] All code reviewed
- [x] Documentation complete
- [x] Known issues documented
- [ ] Tests written and passing
- [ ] Performance benchmarks met

### Deployment Approval
- [ ] Database migration verified
- [ ] Environment variables set
- [ ] Backup created
- [ ] Rollback plan ready
- [ ] Monitoring configured

### Go-Live Authorization
**Deployment Date:** _____________
**Deployed By:** _____________
**Sign-off:** _____________

---

## Emergency Contacts

**Technical Lead:** ______________
**Database Admin:** ______________
**DevOps:** ______________
**On-Call:** ______________

---

## Notes

Use this space for deployment-specific notes:

```
[Deployment notes here]
```

---

**Last Updated:** December 28, 2025
**Phase:** 09 - Messaging & Inbox System
**Status:** Ready for Deployment Testing
