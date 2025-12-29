import { Product } from '../types';

// Helper to safely access environment variables in various environments (Vite, CRA, etc.)
const getEnv = (key: string) => {
  try {
    // Check for Vite
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
    // Check for Node/CRA/Process
    // Safe check: typeof process must be defined, process must be truthy, process.env must be truthy
    if (typeof process !== 'undefined' && process && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore errors accessing env
    console.warn('Error reading environment variable', e);
  }
  return '';
};

// 1. Get these from your Shopify Partner Dashboard -> Headless Channel
const SHOPIFY_DOMAIN = getEnv('REACT_APP_SHOPIFY_DOMAIN') || 'your-store.myshopify.com'; 
const STOREFRONT_ACCESS_TOKEN = getEnv('REACT_APP_SHOPIFY_TOKEN') || 'your-public-access-token';

async function shopifyFetch(query: string, variables = {}) {
  // Prevent fetch if defaults are still active to avoid console 404s/errors, mostly for demo purposes
  if (SHOPIFY_DOMAIN.includes('your-store') || STOREFRONT_ACCESS_TOKEN.includes('your-public-access-token')) {
    // Return mock error or empty to gracefully fallback to static data
    return { errors: [{ message: 'Shopify credentials not configured.' }] };
  }

  const endpoint = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
       console.error(`Shopify API Fetch Error: ${response.status} ${response.statusText}`);
       return { errors: [{ message: `HTTP Error ${response.status}` }] };
    }

    return await response.json();
  } catch (error) {
    console.error("Network error fetching from Shopify:", error);
    return { errors: [{ message: String(error) }] };
  }
}

export async function getShopifyProducts(): Promise<Product[]> {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            productType
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const json = await shopifyFetch(query);
    
    // Check if we got a valid data object
    if (!json || !json.data || !json.data.products) {
       // Silent fail: implies we should stick to static data
       return [];
    }
    
    // Map Shopify's complex graph structure to our simple Product interface
    return json.data.products.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      type: node.productType || 'Digital',
      price: `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(0)}`, // Format as $29
      image: node.images.edges[0]?.node.url || '', // Fallback image if missing
      description: node.description,
      badge: '' // You could use tags for this later
    }));
  } catch (error) {
    console.error("Error processing Shopify products:", error);
    return [];
  }
}