import React from 'react';
import { ViewState } from '../types';
import {
  ChevronLeft, Clock, ArrowRight, Feather, Brain,
  Compass, Heart, TrendingUp, Sparkles
} from 'lucide-react';

interface BlogCategoryProps {
  onChangeView: (view: ViewState, data?: any) => void;
  categoryId?: string;
  title?: string;
}

// Posts data organized by category
const POSTS_BY_CATEGORY: Record<string, Array<{
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
}>> = {
  'journaling-tips': [
    {
      id: 'getting-started-journaling',
      title: 'The Complete Beginner\'s Guide to Journaling',
      excerpt: 'Everything you need to know to start your journaling journey today.',
      readTime: '8 min read',
      date: 'Dec 20, 2025'
    },
    {
      id: 'morning-pages-practice',
      title: 'Morning Pages: How 20 Minutes Can Transform Your Day',
      excerpt: 'Discover the life-changing practice of morning pages.',
      readTime: '5 min read',
      date: 'Dec 18, 2025'
    },
    {
      id: 'journaling-prompts-guide',
      title: '50 Journaling Prompts for Self-Reflection',
      excerpt: 'A comprehensive collection of prompts to spark your writing.',
      readTime: '10 min read',
      date: 'Dec 15, 2025'
    },
    {
      id: 'bullet-journal-basics',
      title: 'Bullet Journaling: A Practical Guide',
      excerpt: 'Learn the bullet journal method and customize it for your needs.',
      readTime: '7 min read',
      date: 'Dec 12, 2025'
    },
    {
      id: 'journaling-consistency',
      title: 'How to Build a Consistent Journaling Habit',
      excerpt: 'Practical tips to make journaling a daily practice.',
      readTime: '6 min read',
      date: 'Dec 10, 2025'
    }
  ],
  'mental-wellness': [
    {
      id: 'journaling-anxiety-relief',
      title: 'How Journaling Helps Manage Anxiety',
      excerpt: 'Explore the research-backed benefits of journaling for anxiety.',
      readTime: '6 min read',
      date: 'Dec 15, 2025'
    },
    {
      id: 'gratitude-journaling-benefits',
      title: 'The Science of Gratitude Journaling',
      excerpt: 'How writing about gratitude rewires your brain for happiness.',
      readTime: '5 min read',
      date: 'Dec 12, 2025'
    },
    {
      id: 'emotional-processing-journal',
      title: 'Processing Emotions Through Writing',
      excerpt: 'Use journaling as a tool for emotional regulation.',
      readTime: '7 min read',
      date: 'Dec 8, 2025'
    }
  ],
  'self-discovery': [
    {
      id: 'know-yourself-journaling',
      title: 'Know Yourself: Deep Questions for Self-Discovery',
      excerpt: 'Profound questions to uncover your authentic self.',
      readTime: '8 min read',
      date: 'Dec 14, 2025'
    },
    {
      id: 'values-clarification',
      title: 'Discovering Your Core Values Through Journaling',
      excerpt: 'A guided exercise to identify what matters most to you.',
      readTime: '6 min read',
      date: 'Dec 10, 2025'
    }
  ],
  'mindfulness': [
    {
      id: 'mindful-journaling',
      title: 'Mindful Journaling: Combining Meditation and Writing',
      excerpt: 'How to bring mindfulness into your journaling practice.',
      readTime: '5 min read',
      date: 'Dec 16, 2025'
    }
  ],
  'productivity': [
    {
      id: 'goal-setting-journal',
      title: 'Goal Setting in Your Journal: A Complete System',
      excerpt: 'Create a powerful goal-tracking system in your journal.',
      readTime: '8 min read',
      date: 'Dec 13, 2025'
    }
  ],
  'creative-writing': [
    {
      id: 'creative-journaling',
      title: 'Creative Journaling: Beyond Words',
      excerpt: 'Explore art journaling, collage, and mixed media.',
      readTime: '6 min read',
      date: 'Dec 11, 2025'
    }
  ]
};

const CATEGORY_META: Record<string, { icon: any; color: string; description: string }> = {
  'journaling-tips': {
    icon: Feather,
    color: 'sage',
    description: 'Master the art of journaling with proven techniques and daily practices'
  },
  'mental-wellness': {
    icon: Brain,
    color: 'lavender',
    description: 'Explore the connection between journaling and mental health'
  },
  'self-discovery': {
    icon: Compass,
    color: 'clay',
    description: 'Uncover your authentic self through reflective writing'
  },
  'mindfulness': {
    icon: Heart,
    color: 'sage',
    description: 'Combine mindfulness practices with journaling for deeper awareness'
  },
  'productivity': {
    icon: TrendingUp,
    color: 'lavender',
    description: 'Use journaling to achieve your goals and boost productivity'
  },
  'creative-writing': {
    icon: Sparkles,
    color: 'clay',
    description: 'Unlock your creativity through journaling exercises and prompts'
  }
};

const BlogCategory: React.FC<BlogCategoryProps> = ({ onChangeView, categoryId = 'journaling-tips', title }) => {
  const posts = POSTS_BY_CATEGORY[categoryId] || [];
  const meta = CATEGORY_META[categoryId] || CATEGORY_META['journaling-tips'];
  const Icon = meta.icon;
  const displayTitle = title || categoryId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-[#faf9f7] animate-fade-up">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#faf9f7]/95 backdrop-blur-xl border-b border-stone-200/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onChangeView(ViewState.BLOG)}
              className="p-2 rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-2 text-text-secondary"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
            <button
              onClick={() => onChangeView(ViewState.HOME)}
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage to-sage-dark text-white flex items-center justify-center shadow-lg shadow-sage/20 group-hover:scale-105 transition-transform">
                <Feather size={16} fill="currentColor" />
              </div>
              <span className="font-serif text-xl font-medium text-text-primary tracking-tight hidden md:inline">Meadow</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onChangeView(ViewState.AUTH)}
              className="hidden md:block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => onChangeView(ViewState.AUTH)}
              className="bg-text-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Journaling
            </button>
          </div>
        </div>
      </header>

      {/* Category Hero */}
      <section className="px-6 py-12 border-b border-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center shrink-0">
              <Icon size={32} className="text-sage-dark" />
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-3">
                {displayTitle}
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl">
                {meta.description}
              </p>
              <p className="text-sm text-text-muted mt-3">
                {posts.length} articles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts List */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {posts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => onChangeView(ViewState.BLOG_POST, { postId: post.id, categoryId })}
                className="w-full group p-6 rounded-2xl bg-white/80 border border-stone-100 hover:border-sage/30 hover:shadow-lg transition-all duration-300 text-left"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="font-serif text-xl text-text-primary mb-2 group-hover:text-sage-dark transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-secondary">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-stone-300 group-hover:text-sage-dark group-hover:translate-x-1 transition-all mt-2 shrink-0" />
                </div>
              </button>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted">No articles in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h3 className="font-serif text-xl text-text-primary mb-6">
            Explore Other Topics
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(CATEGORY_META)
              .filter(([id]) => id !== categoryId)
              .slice(0, 4)
              .map(([id, meta]) => {
                const CategoryIcon = meta.icon;
                return (
                  <button
                    key={id}
                    onClick={() => onChangeView(ViewState.BLOG_CATEGORY, { categoryId: id })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sage/5 border border-sage/10 hover:border-sage/30 transition-colors"
                  >
                    <CategoryIcon size={16} className="text-sage-dark" />
                    <span className="text-sm text-text-secondary capitalize">
                      {id.replace('-', ' ')}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogCategory;
