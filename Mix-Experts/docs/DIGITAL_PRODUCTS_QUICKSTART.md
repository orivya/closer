# Digital Products Marketplace - Quick Start Guide

## For Sellers: How to Sell Digital Products

### Step 1: Create a Product
1. Navigate to **Dashboard → Products**
2. Click the **"New Product"** card
3. Fill in the **Details** tab:
   - Product name (required) - e.g., "Deep House Serum Presets Vol. 1"
   - Price (required) - e.g., 29.99
   - Category - Select from: Preset, Sample Pack, Template, Course, E-Book, Other
   - Description - Describe what's included
   - Tags - Add searchable tags (comma-separated)
   - Active toggle - Keep checked to make product visible

### Step 2: Upload Files
1. Switch to the **Files** tab
2. **Cover Image** (optional but recommended):
   - Click to upload
   - Accepted: PNG, JPG (max 5MB)
   - Recommended: Square aspect ratio (1:1)
3. **Product File** (required):
   - Click to upload your main product file
   - Accepted: Any file type (ZIP, RAR recommended for bundles)
   - File size is calculated automatically
4. **Preview Audio** (optional):
   - Upload an MP3 preview
   - This will be playable on the public product page

### Step 3: Set License Terms
1. Switch to the **License** tab
2. Select a **License Type**:
   - **Personal** - For personal use only
   - **Commercial** - Can be used in commercial projects
   - **Exclusive** - Full exclusive rights
3. Add custom **License Terms** (optional):
   - Write specific usage restrictions
   - These are shown to buyers before purchase

### Step 4: Publish
1. Click **"Save Product"**
2. Your product is now live!
3. Share your product page: `yourdomain.com/yourUsername/products/your-product-slug`

## For Buyers: How to Purchase Products

### Step 1: Browse Products
1. Visit an artist's profile
2. Navigate to their **Products** section
3. Click on a product to view details

### Step 2: Review Product Details
On the product page, you'll see:
- Cover image
- Audio preview (if available)
- Product description
- License type and terms
- Price
- File size
- Download count (social proof)

### Step 3: Purchase
1. Click **"Buy Now"**
2. If not logged in, you'll be redirected to login
3. Complete payment on Stripe checkout page
4. You'll be redirected back on success

### Step 4: Download
1. Navigate to **Dashboard → Downloads** (or **Client → Downloads**)
2. Find your purchased product
3. Click **"Download"**
4. File will open in a new tab
5. You have **5 downloads** per purchase

### Download Limits
- Each purchase includes **5 downloads**
- Downloads are tracked automatically
- When you have 2 or fewer downloads remaining, you'll see a warning
- Download links expire after **1 hour** for security

## For Sellers: Track Your Sales

### View Sales Dashboard
1. Navigate to **Dashboard → Sales**
2. See your key metrics:
   - **Total Sales** - Number of products sold
   - **Total Revenue** - Gross revenue
   - **Your Payout** - Revenue after platform fees
   - **Total Downloads** - How many times products were downloaded

### Understand Platform Fees
- **Free Tier**: 10% platform fee
- **Pro Tier**: 0% platform fee
- **Stripe Fee**: 2.9% + $0.30 (all tiers)

**Example (Free Tier):**
- Product price: $100.00
- Platform fee (10%): -$10.00
- Stripe fee (2.9% + $0.30): -$3.20
- **Your payout: $86.80**

**Example (Pro Tier):**
- Product price: $100.00
- Platform fee (0%): $0.00
- Stripe fee (2.9% + $0.30): -$3.20
- **Your payout: $96.80**

### Recent Sales List
Each sale shows:
- Product name and thumbnail
- Buyer information
- Purchase date
- Download statistics
- Payment breakdown
- Order number

## Managing Your Products

### Edit a Product
1. Go to **Dashboard → Products**
2. Click on the product card
3. Make your changes
4. Click **"Save Product"**

### Deactivate a Product
1. Open the product in the editor
2. On the **Details** tab, uncheck **"Product is active"**
3. Save
4. Product will be hidden from public view but not deleted

### Delete a Product
1. Open the product in the editor
2. Click the **"Delete"** button (red, bottom left)
3. Confirm deletion
4. **Note**: You cannot delete products that have been purchased
   - If the product has sales, deactivate it instead

## Best Practices

### For Sellers

#### Product Naming
- Be specific and descriptive
- Include genre, plugin, or DAW if relevant
- Example: "Tech House Ableton Project Template" vs "Template 1"

#### Pricing Strategy
- Research competitor pricing
- Consider bundling for higher value
- Start with lower prices to build reviews

#### Cover Images
- Use high-quality, professional images
- Square aspect ratio (1:1) works best
- Show what's included (presets, samples, etc.)
- Use consistent branding across products

#### Descriptions
- List exactly what's included (number of presets, samples, etc.)
- Mention compatibility (DAW, plugins required)
- Describe the sound/style
- Include installation instructions if needed

#### Audio Previews
- Create a compelling demo
- Keep it under 2 minutes
- Show variety of included content
- Use 320kbps MP3 for quality

#### File Organization
- Use ZIP files for bundles
- Include a README.txt with:
  - Installation instructions
  - File structure explanation
  - System requirements
  - Contact information
- Organize files in clear folders

#### Tags
- Use relevant, searchable keywords
- Include genre tags
- Include instrument/plugin tags
- Include technique tags
- Example: "techno, bass, synth, serum, leads"

### For Buyers

#### Before Purchasing
- Read the full description
- Check license terms
- Listen to the preview
- Verify compatibility with your setup
- Check file size (ensure you have storage)

#### After Purchasing
- Download immediately (while link is fresh)
- Back up the file to external storage
- Download before you've used all 5 downloads
- Contact seller if you have issues

## Troubleshooting

### For Sellers

**"Cannot delete product with existing purchases"**
- Solution: Deactivate the product instead
- Why: Buyers need continued access to downloads

**File upload fails**
- Check file size (very large files may time out)
- Check internet connection
- Try a different browser
- Ensure file isn't corrupted

**Product not appearing on public page**
- Check that "Product is active" is enabled
- Ensure your profile is published
- Clear your browser cache

### For Buyers

**"Download limit reached"**
- You've used all 5 downloads
- Contact the seller for assistance
- Purchase again if needed (new license)

**"Download link has expired"**
- Generated links expire after 1 hour
- Click "Download" again to generate a new link

**"Purchase not found"**
- Payment may still be processing
- Check your email for confirmation
- Wait a few minutes and refresh
- Contact support if issue persists

**Download is slow**
- Large file sizes may take time
- Check your internet speed
- Try downloading at a different time
- Ensure you have enough disk space

## API Integration (Advanced)

### Webhook Integration
If you need to integrate product purchases with external systems:

1. Set up Stripe webhooks
2. Listen for `checkout.session.completed` events
3. Check `metadata.purchase_id` to identify the purchase
4. Query the `product_purchases` table for details

### Custom Download Pages
You can create custom download pages by:

1. Using the GET endpoint: `/api/products/download?purchaseId={id}&buyerId={id}`
2. Checking `canDownload` status
3. Calling POST endpoint when user clicks download
4. Opening the returned `downloadUrl`

## Support

### For Product Issues
- Sellers can be contacted through the platform messaging system
- Include your order number in support requests
- Buyers have 5 downloads to ensure they can access files

### For Platform Issues
- Check this documentation first
- Contact MixExperts support
- Include screenshots if relevant
- Provide order/product numbers

## Legal Notes

### For Sellers
- You are responsible for the content you sell
- Ensure you have rights to all included files
- License terms are legally binding
- Platform fee is deducted automatically
- You receive payouts according to your Stripe Connect settings

### For Buyers
- Purchases are non-refundable after download
- License terms are set by the seller
- Do not redistribute files unless license permits
- Contact seller for license questions
- Keep download links private

## Next Steps

### For Sellers
1. Create your first product
2. Share your product page on social media
3. Consider creating product bundles
4. Build a portfolio of products
5. Engage with buyers (answer questions, provide support)
6. Upgrade to Pro tier to eliminate platform fees

### For Buyers
1. Browse featured products
2. Follow your favorite artists
3. Build your library
4. Leave reviews (coming soon)
5. Request custom products from sellers

---

**Happy creating and happy producing! 🎵**

For more information, visit the full documentation or contact support.
