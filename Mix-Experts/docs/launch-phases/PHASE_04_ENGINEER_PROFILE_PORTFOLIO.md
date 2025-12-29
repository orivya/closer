# PHASE 04: ENGINEER PROFILE & PORTFOLIO MANAGEMENT

**Status:** Not Started
**Priority:** High
**Dependencies:** Phase 01 (Auth), Phase 02 (Database), Phase 03 (Dashboard)
**Estimated Duration:** 3-4 weeks

## Overview

This phase implements the complete engineer profile and portfolio management system, enabling audio engineers to build their professional presence, showcase their work with before/after audio samples, and manage their public-facing profile page.

## Core Features

- Profile data management and editing
- Avatar and banner image uploads
- Portfolio items with before/after audio samples
- Cover image uploads for portfolio items
- Drag-and-drop reordering
- Public profile pages with SEO
- Profile publish/unpublish controls
- Profile completeness tracking

---

## Implementation Stages

### Profile Data Layer

- [ ] **Stage 1: Create profile data fetching hook (useProfile)**
  - **File:** `src/hooks/useProfile.ts`
  - **Implementation:**
    - Create custom hook that fetches user profile from Supabase
    - Use React Query for caching and automatic refetching
    - Handle loading, error, and success states
    - Accept optional userId parameter (defaults to current user)
    - Return profile data, loading state, error, and refetch function
  - **Example:**
    ```typescript
    export function useProfile(userId?: string) {
      const { data: user } = useUser();
      const targetUserId = userId || user?.id;

      return useQuery({
        queryKey: ['profile', targetUserId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', targetUserId)
            .single();
          if (error) throw error;
          return data;
        },
        enabled: !!targetUserId,
      });
    }
    ```
  - **Testing:**
    - Verify hook fetches profile on mount
    - Test with different user IDs
    - Verify caching behavior
    - Test error handling for non-existent profiles

- [ ] **Stage 2: Wire dashboard settings page to fetch current profile**
  - **File:** `src/app/dashboard/settings/page.tsx`
  - **Implementation:**
    - Import and use useProfile hook
    - Display loading skeleton while fetching
    - Show error message if profile fetch fails
    - Populate form fields with fetched profile data
    - Handle case where profile doesn't exist yet (create default)
  - **UI Components:**
    - Loading skeleton matching form layout
    - Error alert with retry button
    - Form sections: Personal Info, Bio, Social Links, Theme
  - **Testing:**
    - Verify initial data loads correctly
    - Test loading states
    - Test error scenarios
    - Verify form prepopulation

- [ ] **Stage 3: Implement profile update functionality**
  - **File:** `src/hooks/useUpdateProfile.ts`
  - **Implementation:**
    - Create mutation hook using React Query's useMutation
    - Accept partial profile updates
    - Optimistically update cache
    - Handle success and error states
    - Invalidate and refetch profile query on success
  - **Example:**
    ```typescript
    export function useUpdateProfile() {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async (updates: Partial<Profile>) => {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', updates.id)
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries(['profile', data.id]);
          toast.success('Profile updated successfully');
        },
        onError: (error) => {
          toast.error('Failed to update profile');
        },
      });
    }
    ```
  - **Testing:**
    - Test successful updates
    - Verify optimistic updates
    - Test error handling
    - Verify toast notifications

### Avatar & Banner Management

- [ ] **Stage 4: Create avatar upload component with preview**
  - **File:** `src/components/profile/AvatarUpload.tsx`
  - **Implementation:**
    - Create file input with image preview
    - Show current avatar or default placeholder
    - Implement image cropping/resizing to square (256x256)
    - Support drag-and-drop and click-to-upload
    - Validate file type (JPEG, PNG, WebP) and size (max 5MB)
    - Show upload progress indicator
  - **Libraries:**
    - react-dropzone for drag-and-drop
    - react-image-crop or similar for cropping
  - **UI Features:**
    - Circular preview matching final display
    - "Change Avatar" button overlay on hover
    - File size and type validation messages
    - Remove avatar option
  - **Testing:**
    - Test drag-and-drop functionality
    - Test click-to-upload
    - Verify file validation
    - Test image cropping
    - Test preview rendering

- [ ] **Stage 5: Implement avatar upload to Supabase Storage**
  - **File:** `src/hooks/useAvatarUpload.ts`
  - **Implementation:**
    - Create mutation hook for avatar upload
    - Upload to Supabase Storage bucket 'avatars'
    - Generate unique filename using userId and timestamp
    - Delete old avatar file before uploading new one
    - Update profile.avatar_url in database
    - Return public URL for immediate display
  - **Example:**
    ```typescript
    export function useAvatarUpload() {
      const { data: user } = useUser();
      const updateProfile = useUpdateProfile();

      return useMutation({
        mutationFn: async (file: File) => {
          // Delete old avatar if exists
          if (user.avatar_url) {
            const oldPath = extractPathFromUrl(user.avatar_url);
            await supabase.storage.from('avatars').remove([oldPath]);
          }

          // Upload new avatar
          const filePath = `${user.id}/${Date.now()}.${file.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          // Update profile
          await updateProfile.mutateAsync({ avatar_url: publicUrl });

          return publicUrl;
        },
      });
    }
    ```
  - **Storage Configuration:**
    - Create 'avatars' bucket in Supabase
    - Set public access
    - Configure RLS policies (users can upload/delete own avatars)
  - **Testing:**
    - Test successful upload
    - Verify old avatar deletion
    - Test storage bucket policies
    - Verify public URL generation
    - Test profile update integration

- [ ] **Stage 6: Create banner upload component with preview**
  - **File:** `src/components/profile/BannerUpload.tsx`
  - **Implementation:**
    - Create file input with wide preview (16:9 or 3:1 aspect ratio)
    - Show current banner or default gradient/pattern
    - Implement image cropping to banner dimensions (1500x500)
    - Support drag-and-drop and click-to-upload
    - Validate file type and size (max 10MB)
    - Show upload progress
  - **UI Features:**
    - Full-width preview matching profile page display
    - "Change Banner" button overlay on hover
    - Position adjustment slider/tool
    - Remove banner option (revert to default)
  - **Testing:**
    - Test upload flow
    - Verify aspect ratio enforcement
    - Test preview rendering
    - Test position adjustment

- [ ] **Stage 7: Implement banner upload to Supabase Storage**
  - **File:** `src/hooks/useBannerUpload.ts`
  - **Implementation:**
    - Create mutation hook similar to avatar upload
    - Upload to 'banners' bucket in Supabase Storage
    - Handle old banner deletion
    - Update profile.banner_url in database
    - Support optional position data (focal point)
  - **Storage Configuration:**
    - Create 'banners' bucket
    - Set public access
    - Configure RLS policies
  - **Testing:**
    - Test upload process
    - Verify old banner cleanup
    - Test storage policies
    - Verify database updates

### Profile Information Editing

- [ ] **Stage 8: Implement bio editor with character limit**
  - **File:** `src/components/profile/BioEditor.tsx`
  - **Implementation:**
    - Create textarea with 500 character limit
    - Show character count (e.g., "245/500")
    - Auto-save on blur or debounced while typing
    - Support markdown or rich text (optional)
    - Provide preview of formatted bio
  - **UI Features:**
    - Character counter that changes color as limit approaches
    - Real-time preview panel
    - Save indicator (saving, saved, error)
  - **Example:**
    ```typescript
    export function BioEditor({ bio, onUpdate }: BioEditorProps) {
      const [value, setValue] = useState(bio || '');
      const updateProfile = useUpdateProfile();

      const debouncedSave = useDebouncedCallback((newBio: string) => {
        updateProfile.mutate({ bio: newBio });
      }, 1000);

      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value.slice(0, 500);
        setValue(newValue);
        debouncedSave(newValue);
      };

      return (
        <div>
          <textarea value={value} onChange={handleChange} />
          <div className={value.length > 450 ? 'text-warning' : ''}>
            {value.length}/500
          </div>
        </div>
      );
    }
    ```
  - **Testing:**
    - Test character limit enforcement
    - Verify auto-save behavior
    - Test debouncing
    - Verify character counter accuracy

- [ ] **Stage 9: Implement tagline editor**
  - **File:** `src/components/profile/TaglineEditor.tsx`
  - **Implementation:**
    - Create single-line input with 100 character limit
    - Show character count
    - Auto-save on blur
    - Display prominently on profile
    - Provide suggestions/examples
  - **UI Features:**
    - Inline editing with save indicator
    - Example taglines for inspiration
    - Preview how it appears on public profile
  - **Examples to show users:**
    - "Transforming raw tracks into polished masterpieces"
    - "Mixing engineer specializing in indie rock & alternative"
    - "Grammy-nominated mixing & mastering specialist"
  - **Testing:**
    - Test character limit
    - Verify auto-save
    - Test empty state handling

- [ ] **Stage 10: Add location and timezone selectors**
  - **File:** `src/components/profile/LocationTimezoneSelector.tsx`
  - **Implementation:**
    - Create location autocomplete using Google Places API or similar
    - Add timezone dropdown with automatic detection
    - Store location as city/country string
    - Store timezone in IANA format (e.g., "America/New_York")
    - Option to display/hide location publicly
  - **Libraries:**
    - @react-google-maps/api or similar for location
    - spacetime or moment-timezone for timezone handling
  - **UI Features:**
    - Location search with autocomplete
    - Timezone auto-detection based on browser
    - Manual timezone override
    - Privacy toggle for location display
  - **Database fields:**
    - profiles.location (text)
    - profiles.timezone (text)
    - profiles.show_location (boolean)
  - **Testing:**
    - Test location search
    - Verify timezone detection
    - Test privacy toggle
    - Verify database updates

- [ ] **Stage 11: Implement social links editor (add, edit, remove)**
  - **File:** `src/components/profile/SocialLinksEditor.tsx`
  - **Implementation:**
    - Support multiple social platforms (Instagram, Twitter, LinkedIn, SoundCloud, etc.)
    - Dynamic form to add/remove links
    - Validate URL format for each platform
    - Auto-detect platform from URL
    - Store as JSON array or separate table
  - **Supported platforms:**
    - Instagram
    - Twitter/X
    - LinkedIn
    - SoundCloud
    - YouTube
    - TikTok
    - Facebook
    - Website (custom)
  - **UI Features:**
    - Platform icons/logos
    - "Add Link" button with platform selector
    - Inline editing for each link
    - Delete button with confirmation
    - Drag-to-reorder links
  - **Validation:**
    - URL format validation
    - Platform-specific URL patterns
    - Duplicate link prevention
  - **Database schema:**
    ```sql
    CREATE TABLE social_links (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ```
  - **Testing:**
    - Test adding links
    - Test URL validation
    - Test editing and deleting
    - Test reordering
    - Verify platform detection

- [ ] **Stage 12: Create theme selector with live preview**
  - **File:** `src/components/profile/ThemeSelector.tsx`
  - **Implementation:**
    - Offer 5-8 pre-designed color themes
    - Show live preview of profile with selected theme
    - Support custom color picker (optional advanced feature)
    - Apply theme to public profile page
    - Store theme choice in profiles.theme
  - **Theme options:**
    - Dark Professional (black/gold)
    - Ocean Blue (navy/cyan)
    - Forest Green (dark green/mint)
    - Sunset (orange/purple gradient)
    - Monochrome (grayscale)
    - Custom (color picker)
  - **UI Features:**
    - Grid of theme cards with previews
    - Selected theme highlighted
    - Live preview panel showing profile header
    - Apply button or auto-apply on selection
  - **Database:**
    - profiles.theme (text, stores theme name or custom colors JSON)
  - **Testing:**
    - Test theme selection
    - Verify preview rendering
    - Test theme application to public profile
    - Test custom color picker (if implemented)

### Portfolio Management - Data Layer

- [ ] **Stage 13: Create portfolio items fetching hook**
  - **File:** `src/hooks/usePortfolioItems.ts`
  - **Implementation:**
    - Create hook to fetch all portfolio items for a user
    - Support sorting by display_order or created_at
    - Filter by featured status (optional)
    - Use React Query for caching
    - Return items, loading, error states
  - **Example:**
    ```typescript
    export function usePortfolioItems(userId?: string, options?: { featuredOnly?: boolean }) {
      const { data: user } = useUser();
      const targetUserId = userId || user?.id;

      return useQuery({
        queryKey: ['portfolio-items', targetUserId, options],
        queryFn: async () => {
          let query = supabase
            .from('portfolio_items')
            .select('*')
            .eq('profile_id', targetUserId)
            .order('display_order', { ascending: true });

          if (options?.featuredOnly) {
            query = query.eq('is_featured', true);
          }

          const { data, error } = await query;
          if (error) throw error;
          return data;
        },
        enabled: !!targetUserId,
      });
    }
    ```
  - **Database schema reference:**
    ```sql
    CREATE TABLE portfolio_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      artist TEXT,
      genre TEXT,
      release_date DATE,
      description TEXT,
      before_audio_url TEXT NOT NULL,
      after_audio_url TEXT NOT NULL,
      cover_image_url TEXT,
      spotify_url TEXT,
      apple_music_url TEXT,
      youtube_url TEXT,
      is_featured BOOLEAN DEFAULT FALSE,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    ```
  - **Testing:**
    - Test fetching all items
    - Test featured filter
    - Test ordering
    - Verify caching behavior

- [ ] **Stage 14: Wire dashboard portfolio page to display items**
  - **File:** `src/app/dashboard/portfolio/page.tsx`
  - **Implementation:**
    - Use usePortfolioItems hook
    - Display items in grid or list view
    - Show empty state if no items exist
    - Add "Create Portfolio Item" button
    - Show loading skeletons during fetch
    - Display basic item info: title, artist, cover image
  - **UI Features:**
    - Grid layout (2-3 columns)
    - Item cards with cover image, title, artist
    - Edit and delete buttons on each card
    - Featured badge/indicator
    - Drag handles for reordering (Stage 23)
  - **Empty state:**
    - Illustration or icon
    - "No portfolio items yet" message
    - "Add Your First Project" CTA button
  - **Testing:**
    - Test with zero items
    - Test with multiple items
    - Verify loading states
    - Test responsive layout

### Portfolio Management - Create & Upload

- [ ] **Stage 15: Create "Add Portfolio Item" modal/form**
  - **File:** `src/components/portfolio/AddPortfolioItemModal.tsx`
  - **Implementation:**
    - Create multi-step form or single comprehensive form
    - Fields: title (required), artist, genre, release date, description
    - Audio uploads: before and after (required)
    - Cover image upload (optional)
    - External links: Spotify, Apple Music, YouTube (optional)
    - Submit button disabled until required fields filled
    - Close/cancel button
  - **Form validation:**
    - Title: required, max 200 chars
    - Artist: max 200 chars
    - Description: max 1000 chars
    - Before audio: required, valid audio file
    - After audio: required, valid audio file
    - URLs: valid URL format
  - **UI approach:**
    - Option A: Single scrollable form
    - Option B: Multi-step wizard (1: Basic Info, 2: Audio, 3: Details)
  - **Testing:**
    - Test form validation
    - Test modal open/close
    - Test field interactions
    - Verify submit button state

- [ ] **Stage 16: Implement before audio upload**
  - **File:** `src/hooks/useBeforeAudioUpload.ts`
  - **Implementation:**
    - Create mutation hook for uploading before audio
    - Upload to 'portfolio-audio' bucket in Supabase Storage
    - Validate file type (MP3, WAV, FLAC, M4A)
    - Validate file size (max 50MB)
    - Show upload progress
    - Generate unique filename
    - Return public URL
  - **File path structure:**
    - `{userId}/portfolio/{portfolioItemId}/before_{timestamp}.{ext}`
  - **Validation:**
    - Accept audio/* MIME types
    - Max size: 50MB
    - Supported formats: mp3, wav, flac, m4a, ogg
  - **Example:**
    ```typescript
    export function useBeforeAudioUpload(portfolioItemId: string) {
      const { data: user } = useUser();

      return useMutation({
        mutationFn: async (file: File) => {
          const fileExt = file.name.split('.').pop();
          const filePath = `${user.id}/portfolio/${portfolioItemId}/before_${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('portfolio-audio')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('portfolio-audio')
            .getPublicUrl(filePath);

          return publicUrl;
        },
        onUploadProgress: (progress) => {
          // Track progress for UI
        },
      });
    }
    ```
  - **Storage configuration:**
    - Create 'portfolio-audio' bucket
    - Set public access for playback
    - Configure RLS policies
    - Set appropriate MIME types
  - **Testing:**
    - Test upload with various audio formats
    - Test file size validation
    - Verify progress tracking
    - Test storage policies

- [ ] **Stage 17: Implement after audio upload**
  - **File:** `src/hooks/useAfterAudioUpload.ts`
  - **Implementation:**
    - Create mutation hook identical to before audio upload
    - Upload to same 'portfolio-audio' bucket
    - Use 'after_' prefix in filename
    - Same validation and size limits
    - Return public URL
  - **File path structure:**
    - `{userId}/portfolio/{portfolioItemId}/after_{timestamp}.{ext}`
  - **Testing:**
    - Test upload process
    - Verify file naming convention
    - Test with different formats
    - Verify storage policies

- [ ] **Stage 18: Implement cover image upload**
  - **File:** `src/hooks/useCoverImageUpload.ts`
  - **Implementation:**
    - Create mutation hook for cover image upload
    - Upload to 'portfolio-covers' bucket
    - Resize/optimize image (800x800 recommended)
    - Validate file type (JPEG, PNG, WebP)
    - Max size: 5MB
    - Generate thumbnail version (optional)
    - Return public URL
  - **File path structure:**
    - `{userId}/portfolio/{portfolioItemId}/cover_{timestamp}.{ext}`
  - **Image processing:**
    - Resize to max 800x800 maintaining aspect ratio
    - Compress for web (quality 85)
    - Convert to WebP for better performance (optional)
  - **UI features in upload component:**
    - Image preview before upload
    - Crop/resize tool
    - "Use track artwork" suggestion
    - Default placeholder if no image
  - **Testing:**
    - Test image upload
    - Verify resizing
    - Test file validation
    - Verify preview rendering

- [ ] **Stage 19: Add metadata fields (artist, genre, release date, description)**
  - **File:** `src/components/portfolio/PortfolioItemMetadataFields.tsx`
  - **Implementation:**
    - Artist name input (text, 200 chars)
    - Genre selector (dropdown or autocomplete with common genres)
    - Release date picker (date input)
    - Description textarea (1000 chars, with counter)
    - All fields optional but recommended
  - **Genre suggestions:**
    - Hip-Hop/Rap
    - R&B/Soul
    - Pop
    - Rock
    - Electronic/EDM
    - Country
    - Jazz
    - Classical
    - Alternative/Indie
    - Metal
    - Other (custom input)
  - **UI features:**
    - Genre autocomplete with suggestions
    - Date picker component
    - Description with markdown support (optional)
    - Character counters
  - **Testing:**
    - Test all field inputs
    - Test genre autocomplete
    - Test date picker
    - Verify character limits

- [ ] **Stage 20: Add external links (Spotify, Apple Music, YouTube)**
  - **File:** `src/components/portfolio/ExternalLinksFields.tsx`
  - **Implementation:**
    - Text inputs for each platform URL
    - URL validation for each platform
    - Auto-format URLs (extract track ID if needed)
    - Platform icons/logos
    - Optional "Listen Now" links on public profile
  - **Validation patterns:**
    - Spotify: https://open.spotify.com/track/{id}
    - Apple Music: https://music.apple.com/...
    - YouTube: https://youtube.com/watch?v={id} or youtu.be/{id}
  - **UI features:**
    - Input with platform logo prefix
    - Validation feedback (checkmark or error)
    - "Preview" button to test link
    - All fields optional
  - **Testing:**
    - Test URL validation
    - Test with various URL formats
    - Verify platform detection
    - Test preview functionality

- [ ] **Stage 21: Implement portfolio item edit functionality**
  - **File:** `src/hooks/useUpdatePortfolioItem.ts` and edit modal component
  - **Implementation:**
    - Create mutation hook for updating portfolio items
    - Reuse AddPortfolioItemModal in edit mode
    - Pre-populate form with existing data
    - Allow updating all fields including audio files
    - Handle audio file replacement (delete old, upload new)
    - Optimistic updates in cache
  - **Example:**
    ```typescript
    export function useUpdatePortfolioItem() {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<PortfolioItem> }) => {
          const { data, error } = await supabase
            .from('portfolio_items')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          return data;
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries(['portfolio-items']);
          toast.success('Portfolio item updated');
        },
      });
    }
    ```
  - **UI features:**
    - "Edit" button on each portfolio item card
    - Same modal as create, but pre-filled
    - "Replace Audio" option for before/after files
    - "Replace Cover Image" option
    - Save and cancel buttons
  - **Testing:**
    - Test editing all fields
    - Test audio file replacement
    - Test cover image replacement
    - Verify optimistic updates

- [ ] **Stage 22: Implement portfolio item delete with confirmation**
  - **File:** `src/hooks/useDeletePortfolioItem.ts`
  - **Implementation:**
    - Create mutation hook for deletion
    - Delete associated files from storage (before audio, after audio, cover)
    - Delete database record
    - Show confirmation dialog before deletion
    - Update cache immediately after deletion
  - **Example:**
    ```typescript
    export function useDeletePortfolioItem() {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async (item: PortfolioItem) => {
          // Delete storage files
          const filesToDelete = [
            extractPathFromUrl(item.before_audio_url),
            extractPathFromUrl(item.after_audio_url),
            item.cover_image_url ? extractPathFromUrl(item.cover_image_url) : null,
          ].filter(Boolean);

          await supabase.storage.from('portfolio-audio').remove(filesToDelete);
          if (item.cover_image_url) {
            await supabase.storage.from('portfolio-covers').remove([extractPathFromUrl(item.cover_image_url)]);
          }

          // Delete database record
          const { error } = await supabase
            .from('portfolio_items')
            .delete()
            .eq('id', item.id);

          if (error) throw error;
        },
        onSuccess: () => {
          queryClient.invalidateQueries(['portfolio-items']);
          toast.success('Portfolio item deleted');
        },
      });
    }
    ```
  - **Confirmation dialog:**
    - "Are you sure you want to delete this portfolio item?"
    - Show item title in confirmation
    - "This action cannot be undone"
    - Cancel and Delete buttons
  - **Testing:**
    - Test deletion flow
    - Verify confirmation dialog
    - Test storage file cleanup
    - Verify cache updates

- [ ] **Stage 23: Implement drag-and-drop reordering**
  - **File:** `src/components/portfolio/PortfolioItemsList.tsx`
  - **Implementation:**
    - Use @dnd-kit/core or react-beautiful-dnd for drag-and-drop
    - Show drag handles on each portfolio item card
    - Update display_order field on drop
    - Optimistic UI update
    - Batch update all affected items' display_order
  - **Libraries:**
    - @dnd-kit/core + @dnd-kit/sortable (recommended)
    - Or react-beautiful-dnd (simpler but less maintained)
  - **Example with dnd-kit:**
    ```typescript
    export function PortfolioItemsList({ items }: Props) {
      const updateOrder = useUpdatePortfolioOrder();
      const sensors = useSensors(useSensor(PointerSensor));

      const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over?.id);
          const reordered = arrayMove(items, oldIndex, newIndex);

          // Update display_order for all items
          const updates = reordered.map((item, index) => ({
            id: item.id,
            display_order: index,
          }));

          updateOrder.mutate(updates);
        }
      };

      return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.id)}>
            {items.map(item => (
              <SortablePortfolioItem key={item.id} item={item} />
            ))}
          </SortableContext>
        </DndContext>
      );
    }
    ```
  - **UI features:**
    - Visual drag handle icon (six dots)
    - Smooth animations during drag
    - Placeholder/ghost during drag
    - Auto-save order changes
  - **Testing:**
    - Test drag-and-drop interaction
    - Verify order persistence
    - Test with many items
    - Test on mobile (touch events)

- [ ] **Stage 24: Add "Featured" toggle for portfolio items**
  - **File:** Enhancement to portfolio item cards
  - **Implementation:**
    - Add toggle switch/checkbox on each item card
    - Update is_featured field in database
    - Show featured badge on public profile
    - Optionally limit number of featured items (e.g., max 3)
    - Featured items appear first in list
  - **UI features:**
    - Star icon toggle button
    - "Featured" badge on item card when enabled
    - Tooltip: "Feature this item on your profile"
    - Visual distinction for featured items (gold border, star badge)
  - **Business logic:**
    - Consider limiting to 3-5 featured items max
    - Show warning if trying to feature more than limit
    - Auto-unfeature oldest if limit reached
  - **Testing:**
    - Test toggle functionality
    - Verify badge display
    - Test featured limit (if implemented)
    - Verify sorting (featured first)

### Public Profile Page

- [ ] **Stage 25: Create public profile page data fetching**
  - **File:** `src/hooks/usePublicProfile.ts`
  - **Implementation:**
    - Fetch profile by username (not ID)
    - Include portfolio items in response
    - Include social links
    - Return null if profile not found or not published
    - No authentication required (public endpoint)
  - **Example:**
    ```typescript
    export function usePublicProfile(username: string) {
      return useQuery({
        queryKey: ['public-profile', username],
        queryFn: async () => {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select(`
              *,
              portfolio_items(*),
              social_links(*)
            `)
            .eq('username', username)
            .eq('is_published', true)
            .single();

          if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
          }

          return profile;
        },
      });
    }
    ```
  - **Database requirements:**
    - profiles.username (unique, indexed)
    - profiles.is_published (boolean)
    - RLS policy to allow public read of published profiles
  - **Testing:**
    - Test fetching existing profile
    - Test non-existent username
    - Test unpublished profile
    - Verify public access (no auth)

- [ ] **Stage 26: Wire [username]/page.tsx to database**
  - **File:** `src/app/[username]/page.tsx`
  - **Implementation:**
    - Extract username from URL params
    - Use usePublicProfile hook
    - Display profile header (avatar, banner, name, tagline, bio)
    - Display portfolio items grid
    - Display social links
    - Apply selected theme to page
    - Handle loading state
  - **Page sections:**
    - Hero: banner, avatar, name, tagline
    - About: bio, location, social links
    - Portfolio: grid of portfolio items with audio players
    - Contact: CTA button or contact form
  - **Example structure:**
    ```tsx
    export default function ProfilePage({ params }: { params: { username: string } }) {
      const { data: profile, isLoading, error } = usePublicProfile(params.username);

      if (isLoading) return <ProfileSkeleton />;
      if (!profile) return <NotFound />;
      if (error) return <ErrorPage />;

      return (
        <div className={`theme-${profile.theme}`}>
          <ProfileHeader profile={profile} />
          <ProfileAbout profile={profile} />
          <PortfolioGrid items={profile.portfolio_items} />
          <SocialLinks links={profile.social_links} />
        </div>
      );
    }
    ```
  - **Testing:**
    - Test with valid username
    - Test loading state
    - Test theme application
    - Verify all sections render correctly

- [ ] **Stage 27: Implement 404 handling for non-existent profiles**
  - **File:** `src/app/[username]/not-found.tsx`
  - **Implementation:**
    - Custom 404 page for invalid usernames
    - Friendly message: "This profile doesn't exist"
    - Suggestion to check spelling
    - Link to homepage or browse engineers
    - Return 404 status code
  - **UI design:**
    - Centered content
    - Illustration or icon
    - "Profile Not Found" heading
    - "The profile you're looking for doesn't exist or may have been removed"
    - "Back to Home" button
  - **Testing:**
    - Test with random username
    - Verify 404 status code
    - Test navigation buttons

- [ ] **Stage 28: Handle unpublished profile access (redirect or message)**
  - **File:** Enhanced logic in `src/app/[username]/page.tsx`
  - **Implementation:**
    - Check if profile exists but is_published = false
    - If user is the profile owner, show preview with banner
    - If user is not owner, show "Profile is private" message
    - Provide option for owner to publish from preview
  - **Owner preview mode:**
    - Banner at top: "This is a preview. Your profile is not public yet."
    - "Publish Profile" button in banner
    - Full profile display below
  - **Non-owner view:**
    - "This profile is currently private"
    - "Check back later"
    - Link to homepage
  - **Example:**
    ```tsx
    if (!profile?.is_published) {
      const isOwner = user?.id === profile?.id;

      if (isOwner) {
        return (
          <>
            <PreviewBanner onPublish={handlePublish} />
            <ProfileContent profile={profile} />
          </>
        );
      }

      return <PrivateProfileMessage />;
    }
    ```
  - **Testing:**
    - Test as profile owner
    - Test as non-owner
    - Test publish action
    - Verify banner display

- [ ] **Stage 29: Implement profile publish/unpublish toggle**
  - **File:** `src/components/profile/PublishToggle.tsx`
  - **Implementation:**
    - Add toggle in dashboard settings
    - Update profiles.is_published field
    - Show confirmation before unpublishing
    - Display current status clearly
    - Provide preview link when published
  - **UI features:**
    - Large toggle switch
    - Status indicator: "Published" (green) or "Private" (gray)
    - Published URL display with copy button
    - Warning when unpublishing: "Your profile will no longer be visible to others"
  - **Example:**
    ```tsx
    export function PublishToggle({ profile }: Props) {
      const updateProfile = useUpdateProfile();
      const [isPublished, setIsPublished] = useState(profile.is_published);

      const handleToggle = async () => {
        if (isPublished) {
          // Confirm unpublish
          const confirmed = await confirm('Are you sure? Your profile will become private.');
          if (!confirmed) return;
        }

        const newValue = !isPublished;
        setIsPublished(newValue);
        updateProfile.mutate({ is_published: newValue });
      };

      return (
        <div>
          <Switch checked={isPublished} onChange={handleToggle} />
          <span>{isPublished ? 'Published' : 'Private'}</span>
          {isPublished && (
            <div>
              Your profile: <CopyableLink url={`https://mixexperts.com/${profile.username}`} />
            </div>
          )}
        </div>
      );
    }
    ```
  - **Testing:**
    - Test publish action
    - Test unpublish with confirmation
    - Verify URL display
    - Test copy to clipboard

- [ ] **Stage 30: Add profile completeness indicator**
  - **File:** `src/components/profile/ProfileCompletenessWidget.tsx`
  - **Implementation:**
    - Calculate completion percentage based on filled fields
    - Display progress bar and percentage
    - List incomplete sections with links to complete them
    - Show in dashboard sidebar or settings page
    - Encourage completion for better visibility
  - **Completion criteria:**
    - Avatar uploaded (10%)
    - Banner uploaded (10%)
    - Bio written (15%)
    - Tagline added (10%)
    - Location set (5%)
    - At least 2 social links (10%)
    - At least 1 portfolio item (30%)
    - At least 3 portfolio items (10%)
  - **UI design:**
    - Circular or linear progress bar
    - Percentage display (e.g., "75% Complete")
    - Checklist of items
    - Green checkmarks for completed items
    - "Complete your profile" CTA for incomplete items
  - **Example:**
    ```tsx
    export function ProfileCompletenessWidget({ profile, portfolioCount }: Props) {
      const checks = [
        { label: 'Upload avatar', complete: !!profile.avatar_url, weight: 10 },
        { label: 'Upload banner', complete: !!profile.banner_url, weight: 10 },
        { label: 'Write bio', complete: !!profile.bio && profile.bio.length > 50, weight: 15 },
        { label: 'Add tagline', complete: !!profile.tagline, weight: 10 },
        { label: 'Set location', complete: !!profile.location, weight: 5 },
        { label: 'Add social links', complete: profile.social_links?.length >= 2, weight: 10 },
        { label: 'Add portfolio item', complete: portfolioCount >= 1, weight: 30 },
        { label: 'Add 3 portfolio items', complete: portfolioCount >= 3, weight: 10 },
      ];

      const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
      const completedWeight = checks.filter(c => c.complete).reduce((sum, c) => sum + c.weight, 0);
      const percentage = Math.round((completedWeight / totalWeight) * 100);

      return (
        <div>
          <CircularProgress value={percentage} />
          <h3>{percentage}% Complete</h3>
          <ul>
            {checks.map(check => (
              <li key={check.label}>
                {check.complete ? '✓' : '○'} {check.label}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    ```
  - **Testing:**
    - Test calculation accuracy
    - Test with various completion levels
    - Verify checklist updates
    - Test progress bar rendering

- [ ] **Stage 31: Generate SEO metadata for public profiles**
  - **File:** `src/app/[username]/page.tsx` metadata generation
  - **Implementation:**
    - Generate dynamic metadata for each profile page
    - Include title, description, Open Graph tags, Twitter cards
    - Use profile data (name, bio, tagline)
    - Include avatar and banner as og:image
    - Add schema.org markup for Person/MusicGroup
  - **Next.js 14 approach:**
    ```tsx
    export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
      const profile = await fetchPublicProfile(params.username);

      if (!profile) {
        return {
          title: 'Profile Not Found',
        };
      }

      return {
        title: `${profile.name} - Audio Engineer | MixExperts`,
        description: profile.tagline || profile.bio?.slice(0, 160),
        openGraph: {
          title: profile.name,
          description: profile.tagline,
          images: [profile.banner_url || profile.avatar_url],
          type: 'profile',
        },
        twitter: {
          card: 'summary_large_image',
          title: profile.name,
          description: profile.tagline,
          images: [profile.banner_url || profile.avatar_url],
        },
      };
    }
    ```
  - **Schema.org markup:**
    ```json
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "John Doe",
      "jobTitle": "Audio Mixing & Mastering Engineer",
      "description": "Bio text here",
      "image": "avatar_url",
      "url": "https://mixexperts.com/johndoe",
      "sameAs": ["social_links"]
    }
    ```
  - **Testing:**
    - Test metadata generation
    - Validate with Facebook Debugger
    - Validate with Twitter Card Validator
    - Test schema.org markup with Google Rich Results Test
    - Verify og:image displays correctly

- [ ] **Stage 32: Test before/after audio player with real files**
  - **File:** `src/components/portfolio/BeforeAfterAudioPlayer.tsx`
  - **Implementation:**
    - Create custom audio player component
    - Side-by-side or toggle view for before/after
    - Synchronized playback option (play both at once)
    - Individual play controls
    - Waveform visualization (optional, using wavesurfer.js)
    - Volume controls, seek bar, time display
  - **Player features:**
    - Play/pause buttons for both tracks
    - "Compare" mode: A/B toggle while playing
    - "Sync" mode: play both simultaneously
    - Visual indicator of which track is playing
    - Waveform preview (optional but impressive)
  - **Libraries:**
    - Native HTML5 audio elements (simplest)
    - howler.js for advanced features
    - wavesurfer.js for waveform visualization
  - **Example structure:**
    ```tsx
    export function BeforeAfterAudioPlayer({ beforeUrl, afterUrl }: Props) {
      const [mode, setMode] = useState<'before' | 'after' | 'sync'>('before');
      const beforeRef = useRef<HTMLAudioElement>(null);
      const afterRef = useRef<HTMLAudioElement>(null);

      const handlePlay = (track: 'before' | 'after') => {
        if (mode === 'sync') {
          beforeRef.current?.play();
          afterRef.current?.play();
        } else {
          const ref = track === 'before' ? beforeRef : afterRef;
          ref.current?.play();
        }
      };

      return (
        <div>
          <div className="mode-selector">
            <button onClick={() => setMode('before')}>Before</button>
            <button onClick={() => setMode('after')}>After</button>
            <button onClick={() => setMode('sync')}>Compare</button>
          </div>

          <audio ref={beforeRef} src={beforeUrl} />
          <audio ref={afterRef} src={afterUrl} />

          <AudioControls onPlay={handlePlay} mode={mode} />
        </div>
      );
    }
    ```
  - **Testing:**
    - Test with real audio files (MP3, WAV)
    - Test playback controls
    - Test mode switching
    - Test synchronized playback
    - Test on different browsers
    - Test mobile playback
    - Performance test with large files

---

## Database Schema Summary

```sql
-- Profiles table (enhanced from Phase 02)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_location BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark-professional';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

-- Social links table
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_social_links_profile ON social_links(profile_id);

-- Portfolio items table
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  genre TEXT,
  release_date DATE,
  description TEXT,
  before_audio_url TEXT NOT NULL,
  after_audio_url TEXT NOT NULL,
  cover_image_url TEXT,
  spotify_url TEXT,
  apple_music_url TEXT,
  youtube_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolio_items_profile ON portfolio_items(profile_id);
CREATE INDEX idx_portfolio_items_featured ON portfolio_items(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_portfolio_items_order ON portfolio_items(profile_id, display_order);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public read for published profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_published = TRUE);

-- Users can view and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Social links policies
CREATE POLICY "Users can manage own social links" ON social_links
  FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Public social links viewable" ON social_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = social_links.profile_id AND profiles.is_published = TRUE
    )
  );

-- Portfolio items policies
CREATE POLICY "Users can manage own portfolio items" ON portfolio_items
  FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Public portfolio items viewable" ON portfolio_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = portfolio_items.profile_id AND profiles.is_published = TRUE
    )
  );
```

## Storage Buckets Configuration

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', TRUE),
  ('banners', 'banners', TRUE),
  ('portfolio-audio', 'portfolio-audio', TRUE),
  ('portfolio-covers', 'portfolio-covers', TRUE);

-- Storage policies for avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Similar policies for banners, portfolio-audio, portfolio-covers
-- (Repeat above pattern for each bucket)
```

---

## Testing Checklist

- [ ] Profile fetching and caching works correctly
- [ ] Profile updates persist and refresh properly
- [ ] Avatar upload, preview, and deletion work
- [ ] Banner upload and preview work
- [ ] Bio editor saves with character limit
- [ ] Tagline editor saves properly
- [ ] Location and timezone save correctly
- [ ] Social links can be added, edited, deleted, reordered
- [ ] Theme selection applies to public profile
- [ ] Portfolio items fetch and display correctly
- [ ] Portfolio item creation with all fields works
- [ ] Before audio uploads successfully
- [ ] After audio uploads successfully
- [ ] Cover image uploads and displays
- [ ] Portfolio item editing works for all fields
- [ ] Portfolio item deletion removes all associated files
- [ ] Drag-and-drop reordering persists correctly
- [ ] Featured toggle works and displays badge
- [ ] Public profile page displays all data correctly
- [ ] 404 page shows for invalid usernames
- [ ] Unpublished profiles show appropriate message
- [ ] Publish/unpublish toggle works correctly
- [ ] Profile completeness calculation is accurate
- [ ] SEO metadata generates correctly for profiles
- [ ] Before/after audio player works on all browsers
- [ ] All storage buckets have correct permissions
- [ ] RLS policies prevent unauthorized access
- [ ] Mobile responsive design works for all pages

---

## Dependencies & Libraries

**Required:**
- @tanstack/react-query (data fetching and caching)
- @supabase/supabase-js (database and storage)
- react-hook-form (form management)
- zod (form validation)

**Recommended:**
- @dnd-kit/core + @dnd-kit/sortable (drag-and-drop)
- react-dropzone (file uploads)
- react-image-crop (image cropping)
- date-fns or dayjs (date handling)
- react-hot-toast or sonner (notifications)

**Optional:**
- wavesurfer.js (audio waveform visualization)
- howler.js (advanced audio playback)
- @react-google-maps/api (location autocomplete)

---

## Security Considerations

1. **File Upload Validation:**
   - Validate file types on client and server
   - Enforce file size limits
   - Sanitize filenames
   - Use virus scanning for uploaded files (production)

2. **Storage Access:**
   - RLS policies enforce bucket access control
   - Users can only modify their own files
   - Public buckets for profile assets
   - Private buckets not needed for this phase

3. **Public Profile Access:**
   - No authentication required for published profiles
   - Unpublished profiles only visible to owner
   - Username should be URL-safe (validate format)
   - Rate limiting on profile views (optional)

4. **Data Validation:**
   - Validate all user inputs on server side
   - Sanitize HTML/markdown in bio and description
   - Validate URLs for social links and external platforms
   - Character limits enforced in database

---

## Performance Considerations

1. **Image Optimization:**
   - Resize images on upload
   - Serve WebP format when supported
   - Use CDN for storage (Supabase provides this)
   - Lazy load portfolio item images

2. **Audio Streaming:**
   - Use streaming for large audio files
   - Consider transcoding to consistent format
   - Implement progressive loading
   - Cache audio files in browser

3. **Data Fetching:**
   - Use React Query for caching
   - Implement pagination for many portfolio items
   - Prefetch related data
   - Use stale-while-revalidate strategy

4. **Page Load:**
   - Server-side render public profiles
   - Generate static pages for popular profiles
   - Optimize bundle size
   - Lazy load heavy components (audio player, image cropper)

---

## Success Criteria

This phase is complete when:

1. Engineers can fully customize their profiles
2. Avatar and banner uploads work reliably
3. Portfolio items can be created with before/after audio
4. Audio player provides excellent UX for comparing tracks
5. Public profile pages look professional and load quickly
6. Profile publish/unpublish works correctly
7. All data persists correctly in Supabase
8. SEO metadata generates for good search visibility
9. Mobile experience is smooth and responsive
10. All security policies are properly configured

---

## Next Phase

**Phase 05:** Booking System & Availability
- Calendar integration
- Booking request flow
- Pricing and packages
- Stripe payment integration
- Booking confirmation and management
