# Phase 04 Integration Guide

## Quick Start

This guide will help you integrate Phase 04 components into your MixExperts platform.

---

## 1. Replace Dashboard Pages

### Settings Page

**Location:** `/src/app/dashboard/settings/page.tsx`

The updated settings page includes:
- Avatar and banner upload with real-time preview
- Bio editor with auto-save
- Tagline editor with auto-save
- Location and timezone selectors
- Social links manager
- Theme selector with database persistence
- Profile completeness indicator
- Publish/unpublish toggle

**To integrate:**
```bash
# Backup current file
cp src/app/dashboard/settings/page.tsx src/app/dashboard/settings/page.tsx.backup

# Copy new version
cp src/app/dashboard/settings/page-updated.tsx src/app/dashboard/settings/page.tsx
```

---

### Portfolio Page

**Location:** `/src/app/dashboard/portfolio/page.tsx`

The updated portfolio page includes:
- Add/edit portfolio items modal
- Drag-and-drop reordering
- Featured toggle
- Delete confirmation
- Real-time database sync

**To integrate:**
```bash
# Backup current file
cp src/app/dashboard/portfolio/page.tsx src/app/dashboard/portfolio/page.tsx.backup

# Copy new version
cp src/app/dashboard/portfolio/page-updated.tsx src/app/dashboard/portfolio/page.tsx
```

---

## 2. Update Public Profile Page

**Location:** `/src/app/[username]/page.tsx`

The updated public profile page includes:
- Database-driven profile fetching
- 404 handling for non-existent profiles
- Unpublished profile protection
- Dynamic theme application
- Loading and error states

**To integrate:**
```bash
# Backup current file
cp src/app/[username]/page.tsx src/app/[username]/page.tsx.backup

# Copy new version
cp src/app/[username]/page-updated.tsx src/app/[username]/page.tsx
```

---

## 3. Verify Global Toaster

The root layout at `/src/app/layout.tsx` has been updated to include:

```tsx
import { Toaster } from 'sonner';

// ... inside the return
<Toaster position="top-right" />
```

This provides toast notifications throughout the app.

---

## 4. File Organization

All new files are organized as follows:

### Hooks (`/src/hooks/`)
- `useProfile.ts` - Profile data fetching
- `useUpdateProfile.ts` - Profile updates
- `useAvatarUpload.ts` - Avatar uploads
- `useBannerUpload.ts` - Banner uploads
- `useSocialLinks.ts` - Social links CRUD
- `usePortfolioItems.ts` - Portfolio CRUD
- `usePortfolioAudioUpload.ts` - Audio uploads
- `usePortfolioCoverUpload.ts` - Cover uploads
- `usePublicProfile.ts` - Public profile fetching

### Profile Components (`/src/components/profile/`)
- `AvatarUpload.tsx` - Avatar upload component
- `BannerUpload.tsx` - Banner upload component
- `BioEditor.tsx` - Bio editor with auto-save
- `TaglineEditor.tsx` - Tagline editor with auto-save
- `LocationTimezoneSelector.tsx` - Location/timezone inputs
- `SocialLinksEditor.tsx` - Social links manager
- `ThemeSelectorWithSave.tsx` - Theme selector with save
- `ProfileCompletenessIndicator.tsx` - Completion status
- `PublishToggle.tsx` - Publish/unpublish button

### Portfolio Components (`/src/components/portfolio/`)
- `AddPortfolioItemModal.tsx` - Add/edit modal
- `PortfolioListWithDnd.tsx` - List with drag-drop
- `BeforeAfterAudioPlayer.tsx` - Audio player

---

## 5. Testing the Integration

### Test Profile Settings

1. Navigate to `/dashboard/settings`
2. Upload an avatar image
3. Upload a banner image
4. Edit your bio (verify auto-save works)
5. Edit your tagline (verify auto-save works)
6. Add a social link
7. Change your theme
8. Toggle publish status

### Test Portfolio

1. Navigate to `/dashboard/portfolio`
2. Click "Add Portfolio Item"
3. Fill in track details
4. Upload cover image
5. Upload before audio
6. Upload after audio
7. Save the item
8. Try drag-and-drop reordering
9. Toggle featured status
10. Edit an existing item
11. Delete an item

### Test Public Profile

1. Note your username from settings
2. Navigate to `/{your-username}` in a new tab
3. Verify your theme is applied
4. Verify profile data displays
5. Test unpublish (should show unpublished message)
6. Test non-existent profile (e.g., `/nonexistentuser123`)

---

## 6. Database Setup Verification

Ensure these tables exist in your Supabase database:

### profiles table
```sql
-- Should have these columns (at minimum):
id, username, display_name, email, avatar_url, banner_url,
bio, tagline, location, timezone, theme, is_published,
is_verified, subscription_tier, subscription_status,
created_at, updated_at
```

### social_links table
```sql
-- Should have these columns:
id, profile_id, platform, url, display_order, created_at, updated_at
```

### portfolio_items table
```sql
-- Should have these columns:
id, profile_id, title, artist, genre, before_audio_url,
after_audio_url, cover_image_url, description, is_featured,
display_order, created_at, updated_at
```

### Storage Buckets

Ensure these buckets exist and are public:
- `avatars`
- `banners`
- `portfolio-audio`
- `portfolio-images`

---

## 7. Row Level Security (RLS) Policies

Recommended RLS policies for security:

### profiles table
```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Anyone can read published profiles
CREATE POLICY "Anyone can read published profiles"
ON profiles FOR SELECT
USING (is_published = true);
```

### social_links table
```sql
-- Users can manage their own links
CREATE POLICY "Users can manage own links"
ON social_links FOR ALL
USING (auth.uid() = profile_id);

-- Anyone can read links for published profiles
CREATE POLICY "Anyone can read public links"
ON social_links FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = social_links.profile_id
    AND profiles.is_published = true
  )
);
```

### portfolio_items table
```sql
-- Users can manage their own items
CREATE POLICY "Users can manage own items"
ON portfolio_items FOR ALL
USING (auth.uid() = profile_id);

-- Anyone can read items for published profiles
CREATE POLICY "Anyone can read public items"
ON portfolio_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = portfolio_items.profile_id
    AND profiles.is_published = true
  )
);
```

---

## 8. Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 9. Common Issues & Solutions

### Issue: "Not authenticated" errors
**Solution:** Ensure user is logged in via AuthContext

### Issue: File uploads fail
**Solution:**
1. Check storage bucket permissions (should be public)
2. Verify bucket names match exactly
3. Check file size limits

### Issue: Auto-save not working
**Solution:**
1. Check network tab for API calls
2. Verify debounce is working (wait 1+ second)
3. Check console for errors

### Issue: Drag-and-drop not working
**Solution:**
1. Ensure @dnd-kit packages are installed
2. Check for JavaScript errors
3. Verify items have unique IDs

### Issue: Theme not applying
**Solution:**
1. Check `data-theme` attribute on `<html>` element
2. Verify theme value in database
3. Check CSS variables in globals.css

---

## 10. Customization Options

### Toast Notifications
Customize in `/src/app/layout.tsx`:
```tsx
<Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      background: 'var(--bg-elevated)',
      color: 'white',
      border: '1px solid var(--border-dark)',
    },
  }}
/>
```

### Auto-save Delay
Change in BioEditor.tsx and TaglineEditor.tsx:
```tsx
const [debouncedValue] = useDebounce(value, 2000); // Change from 1000 to 2000ms
```

### File Size Limits
Change in upload hooks:
```tsx
const maxSize = 10 * 1024 * 1024; // Change from 5MB to 10MB
```

---

## 11. Performance Tips

1. **Optimize Images:** Use Next.js Image component for avatars/banners
2. **Lazy Load Audio:** Audio files are already lazy-loaded
3. **Cache Profile Data:** useProfile hook caches automatically
4. **Debounce Inputs:** Bio/tagline editors already debounced

---

## 12. Deployment Checklist

Before deploying to production:

- [ ] All RLS policies configured
- [ ] Storage buckets created and public
- [ ] Environment variables set
- [ ] Test all file uploads
- [ ] Test auto-save functionality
- [ ] Test drag-and-drop
- [ ] Test public profile viewing
- [ ] Test 404 handling
- [ ] Test unpublished profile protection
- [ ] Performance test with large portfolios

---

## 13. Maintenance

Regular maintenance tasks:

1. **Monitor Storage Usage:** Check storage bucket sizes monthly
2. **Clean Orphaned Files:** Remove files from deleted portfolio items
3. **Backup Database:** Regular backups of profiles and portfolio data
4. **Update Dependencies:** Keep npm packages up to date
5. **Review RLS Policies:** Audit security policies quarterly

---

## Support

If you encounter issues:

1. Check the console for errors
2. Verify database schema matches requirements
3. Check RLS policies are configured
4. Review network tab for failed API calls
5. Test with a fresh profile

---

## Conclusion

Phase 04 is ready for production use. Follow this guide to integrate all components seamlessly into your MixExperts platform.

For detailed information about each component, see `PHASE_04_IMPLEMENTATION_SUMMARY.md`.
