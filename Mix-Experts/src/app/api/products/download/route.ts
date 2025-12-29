import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { purchaseId } = await request.json();

    if (!purchaseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get purchase record - use authenticated user ID, not from request
    const { data: purchase, error: purchaseError } = await supabase
      .from('product_purchases')
      .select('*, products(*)')
      .eq('id', purchaseId)
      .eq('buyer_id', user.id)
      .eq('status', 'completed')
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'Purchase not found or not authorized' },
        { status: 404 }
      );
    }

    // Check download limit
    if (purchase.download_limit && purchase.download_count >= purchase.download_limit) {
      return NextResponse.json(
        { error: `Download limit reached (${purchase.download_limit} downloads max)` },
        { status: 403 }
      );
    }

    // Check if download has expired
    if (purchase.download_expires_at && new Date(purchase.download_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 403 }
      );
    }

    // Get the product file
    if (!purchase.products?.file_url) {
      return NextResponse.json(
        { error: 'Product file not available' },
        { status: 404 }
      );
    }

    // Generate signed URL for private bucket (expires in 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('products')
      .createSignedUrl(purchase.products.file_url, 3600); // 1 hour = 3600 seconds

    if (signedUrlError || !signedUrlData) {
      console.error('Error creating signed URL:', signedUrlError);
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      );
    }

    // Update download count and last downloaded timestamp
    const { error: updateError } = await supabase
      .from('product_purchases')
      .update({
        download_count: purchase.download_count + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq('id', purchaseId);

    if (updateError) {
      console.error('Error updating download count:', updateError);
      // Don't fail the request, just log it
    }

    return NextResponse.json({
      downloadUrl: signedUrlData.signedUrl,
      fileName: purchase.products.name,
      fileSize: purchase.products.file_size_mb,
      downloadCount: purchase.download_count + 1,
      downloadsRemaining: purchase.download_limit ? purchase.download_limit - (purchase.download_count + 1) : null,
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    });

  } catch (error) {
    console.error('Download error:', error);
    // Don't expose internal error details to clients
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}

// GET endpoint to check download status
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const purchaseId = searchParams.get('purchaseId');

    if (!purchaseId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get purchase record - use authenticated user ID, not from request
    const { data: purchase, error: purchaseError } = await supabase
      .from('product_purchases')
      .select('download_count, download_limit, last_downloaded_at, download_expires_at, status')
      .eq('id', purchaseId)
      .eq('buyer_id', user.id)
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      downloadCount: purchase.download_count,
      downloadLimit: purchase.download_limit,
      downloadsRemaining: purchase.download_limit ? purchase.download_limit - purchase.download_count : null,
      lastDownloadedAt: purchase.last_downloaded_at,
      downloadExpiresAt: purchase.download_expires_at,
      canDownload: purchase.status === 'completed' &&
                   (!purchase.download_limit || purchase.download_count < purchase.download_limit) &&
                   (!purchase.download_expires_at || new Date(purchase.download_expires_at) > new Date()),
    });

  } catch (error) {
    console.error('Status check error:', error);
    // Don't expose internal error details to clients
    return NextResponse.json(
      { error: 'Failed to check download status' },
      { status: 500 }
    );
  }
}
