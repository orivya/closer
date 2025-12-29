import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.mdx?$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Calculate reading time (rough estimate)
  const words = content.split(/\s+/g).length;
  const minutes = Math.ceil(words / 200);
  const readingTime = `${minutes} min read`;

  type Items = {
    [key: string]: string | string[];
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (field === 'readingTime') {
        items[field] = readingTime;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items as Partial<BlogPost>;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1?.date! > post2?.date! ? -1 : 1));
  return posts;
}

export function getPostsByCategory(category: string, fields: string[] = []) {
    const allPosts = getAllPosts([...fields, 'category']);
    return allPosts.filter(post => post?.category === category);
}
