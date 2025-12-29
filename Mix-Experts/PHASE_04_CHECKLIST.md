# Phase 04: Integration Checklist

Use this checklist to ensure Phase 04 is properly integrated into your MixExperts platform.

---

## Pre-Integration

- [ ] Read `PHASE_04_IMPLEMENTATION_SUMMARY.md`
- [ ] Read `PHASE_04_INTEGRATION_GUIDE.md`
- [ ] Backup current codebase
- [ ] Verify npm dependencies are installed:
  ```bash
  npm install sonner @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
  ```

---

## Database Setup

### Tables
- [ ] `profiles` table exists with all required columns
- [ ] `social_links` table exists
- [ ] `portfolio_items` table exists

### Storage Buckets
- [ ] `avatars` bucket created and public
- [ ] `banners` bucket created and public
- [ ] `portfolio-audio` bucket created and public
- [ ] `portfolio-images` bucket created and public

### RLS Policies
- [ ] profiles: Users can read own profile
- [ ] profiles: Users can update own profile
- [ ] profiles: Public can read published profiles
- [ ] social_links: Users can manage own links
- [ ] social_links: Public can read links for published profiles
- [ ] portfolio_items: Users can manage own items
- [ ] portfolio_items: Public can read items for published profiles

---

## File Integration

### Core Files (Already Created)
- [ ] All hooks created in `/src/hooks/`
- [ ] All profile components created in `/src/components/profile/`
- [ ] All portfolio components created in `/src/components/portfolio/`
- [ ] Root layout updated with Toaster

### Page Updates (Need Manual Integration)
- [ ] Backup `/src/app/dashboard/settings/page.tsx`
- [ ] Replace with `page-updated.tsx` content
- [ ] Backup `/src/app/dashboard/portfolio/page.tsx`
- [ ] Replace with `page-updated.tsx` content
- [ ] Backup `/src/app/[username]/page.tsx`
- [ ] Replace with `page-updated.tsx` content

---

## Testing Phase 1: Profile Settings

### Avatar & Banner
- [ ] Navigate to `/dashboard/settings`
- [ ] Upload avatar (test PNG, JPG)
- [ ] Verify avatar preview appears
- [ ] Upload banner image
- [ ] Verify banner preview appears
- [ ] Check database for avatar_url update
- [ ] Check database for banner_url update

### Bio & Tagline
- [ ] Edit bio field
- [ ] Wait 1+ second (auto-save)
- [ ] Verify "Saving..." indicator appears
- [ ] Check database for bio update
- [ ] Edit tagline field
- [ ] Verify auto-save works
- [ ] Test character limit (500 for bio, 100 for tagline)

### Location & Timezone
- [ ] Enter location
- [ ] Verify auto-save after 1 second
- [ ] Change timezone
- [ ] Verify immediate save
- [ ] Check database for updates

### Social Links
- [ ] Click "Add Link"
- [ ] Select platform (Instagram)
- [ ] Enter URL
- [ ] Click "Add"
- [ ] Verify link appears in list
- [ ] Edit existing link
- [ ] Delete a link
- [ ] Check database for social_links records

### Theme
- [ ] Select different theme
- [ ] Verify theme applied to page
- [ ] Check database for theme update
- [ ] Reload page, verify theme persists

### Publish Toggle
- [ ] Toggle publish status
- [ ] Verify button updates
- [ ] Check database for is_published update

### Profile Completeness
- [ ] Verify completeness indicator shows correct percentage
- [ ] Complete all 6 items
- [ ] Verify 100% completion message

---

## Testing Phase 2: Portfolio Management

### Add Portfolio Item
- [ ] Click "Add Portfolio Item"
- [ ] Fill in title and artist (required)
- [ ] Fill in genre and description (optional)
- [ ] Upload cover image
- [ ] Verify preview appears
- [ ] Click "Next: Audio"
- [ ] Upload before audio (MP3 or WAV)
- [ ] Verify green checkmark appears
- [ ] Upload after audio
- [ ] Click "Create Portfolio Item"
- [ ] Verify item appears in list

### Edit Portfolio Item
- [ ] Click edit button on item
- [ ] Change title
- [ ] Upload new cover image
- [ ] Click "Save Changes"
- [ ] Verify updates in list

### Delete Portfolio Item
- [ ] Click delete button
- [ ] Confirm deletion
- [ ] Verify item removed from list
- [ ] Check database for deletion

### Drag & Drop Reorder
- [ ] Drag an item up or down
- [ ] Verify visual feedback during drag
- [ ] Drop item in new position
- [ ] Verify "Portfolio reordered" toast
- [ ] Reload page, verify order persists

### Featured Toggle
- [ ] Click star icon on item
- [ ] Verify star fills in yellow
- [ ] Verify "Portfolio item updated" toast
- [ ] Click star again to unfeature
- [ ] Check database for is_featured update

---

## Testing Phase 3: Public Profile

### Published Profile
- [ ] Note your username from settings
- [ ] Open new tab to `/{your-username}`
- [ ] Verify profile loads
- [ ] Verify theme is applied
- [ ] Verify avatar displays
- [ ] Verify banner displays
- [ ] Verify bio displays
- [ ] Verify tagline displays
- [ ] Verify social links display
- [ ] Verify portfolio items display

### Unpublished Profile
- [ ] Set profile to unpublished in settings
- [ ] Navigate to `/{your-username}` in new tab
- [ ] Verify "Profile Unpublished" message shows
- [ ] Cannot view profile content

### Non-existent Profile
- [ ] Navigate to `/nonexistentuser123`
- [ ] Verify "Profile Not Found" (404) message
- [ ] Verify "Go Home" button works

### Audio Player
- [ ] Click on portfolio item
- [ ] Click play on before audio
- [ ] Verify audio plays
- [ ] Switch to after audio
- [ ] Verify audio switches and continues
- [ ] Test seek bar
- [ ] Test reset button

---

## Error Handling Tests

### File Upload Errors
- [ ] Try uploading file > 5MB for avatar (should fail)
- [ ] Try uploading file > 10MB for banner (should fail)
- [ ] Try uploading file > 50MB for audio (should fail)
- [ ] Try uploading non-image file for avatar (should fail)
- [ ] Try uploading non-audio file for audio (should fail)
- [ ] Verify error toasts appear for all failures

### Network Errors
- [ ] Disconnect internet
- [ ] Try to save profile
- [ ] Verify error toast appears
- [ ] Reconnect internet
- [ ] Verify retry works

### Validation Errors
- [ ] Try to create portfolio item without title (should fail)
- [ ] Try to create portfolio item without artist (should fail)
- [ ] Try to create portfolio item without before audio (should fail)
- [ ] Try to create portfolio item without after audio (should fail)
- [ ] Verify error toasts for each

---

## Performance Tests

- [ ] Upload large images (near 5MB limit)
- [ ] Upload large audio files (near 50MB limit)
- [ ] Test with 20+ portfolio items
- [ ] Test drag-and-drop with many items
- [ ] Monitor console for errors
- [ ] Check network tab for slow requests

---

## Browser Compatibility

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test on mobile Safari
- [ ] Test on mobile Chrome

---

## Responsive Design

- [ ] Test settings page on mobile
- [ ] Test portfolio page on mobile
- [ ] Test public profile on mobile
- [ ] Verify touch-friendly drag-and-drop
- [ ] Verify modals are mobile-friendly

---

## Security Verification

- [ ] Verify RLS prevents unauthorized profile edits
- [ ] Verify RLS prevents unauthorized portfolio edits
- [ ] Verify file size limits are enforced server-side
- [ ] Verify unpublished profiles are protected
- [ ] Verify proper authentication is required

---

## Production Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database migrations complete
- [ ] RLS policies active
- [ ] Storage buckets configured
- [ ] Build passes (`npm run build`)
- [ ] Deploy to staging
- [ ] Test on staging
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Test critical paths in production

---

## Post-Deployment

- [ ] Monitor error logs
- [ ] Check storage usage
- [ ] Verify user feedback is positive
- [ ] Document any issues
- [ ] Plan future enhancements

---

## Optional Enhancements

Future improvements to consider:

- [ ] Add image cropper for avatars/banners
- [ ] Add audio waveform visualization
- [ ] Add portfolio analytics (plays, views)
- [ ] Add portfolio categories/tags
- [ ] Add bulk operations (delete multiple items)
- [ ] Add export portfolio feature
- [ ] Add portfolio sharing links
- [ ] Add portfolio embed codes

---

## Documentation

- [ ] Update user documentation
- [ ] Create video tutorials
- [ ] Update API documentation
- [ ] Document any custom configurations
- [ ] Share with team

---

## Sign-off

- [ ] Developer approval
- [ ] QA approval
- [ ] Product owner approval
- [ ] Ready for production

---

**Completion Date:** _______________

**Completed By:** _______________

**Notes:**
