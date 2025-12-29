import React from 'react';
import { ViewState } from '../types';
import {
  BookOpen, Feather, Brain, Heart, Compass,
  Sparkles, Clock, TrendingUp, ArrowRight, Search
} from 'lucide-react';

interface BlogProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

// Blog categories for SEO content
const BLOG_CATEGORIES = [
  {
    id: 'journaling-tips',
    title: 'Journaling Tips',
    description: 'Master the art of journaling with proven techniques and daily practices',
    icon: Feather,
    color: 'sage',
    postCount: 12,
    featured: true
  },
  {
    id: 'mental-wellness',
    title: 'Mental Wellness',
    description: 'Explore the connection between journaling and mental health',
    icon: Brain,
    color: 'lavender',
    postCount: 8,
    featured: true
  },
  {
    id: 'self-discovery',
    title: 'Self-Discovery',
    description: 'Uncover your authentic self through reflective writing',
    icon: Compass,
    color: 'clay',
    postCount: 10,
    featured: false
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness & Meditation',
    description: 'Combine mindfulness practices with journaling for deeper awareness',
    icon: Heart,
    color: 'sage',
    postCount: 6,
    featured: false
  },
  {
    id: 'productivity',
    title: 'Productivity & Goals',
    description: 'Use journaling to achieve your goals and boost productivity',
    icon: TrendingUp,
    color: 'lavender',
    postCount: 9,
    featured: false
  },
  {
    id: 'creative-writing',
    title: 'Creative Writing',
    description: 'Unlock your creativity through journaling exercises and prompts',
    icon: Sparkles,
    color: 'clay',
    postCount: 7,
    featured: false
  }
];

// Featured posts for the blog home
const FEATURED_POSTS = [
  {
    id: 'getting-started-journaling',
    title: 'The Complete Beginner\'s Guide to Journaling',
    excerpt: 'Everything you need to know to start your journaling journey today. Learn the basics, overcome common obstacles, and discover the transformative power of daily writing.',
    category: 'journaling-tips',
    readTime: '8 min read',
    date: 'Dec 20, 2025',
    featured: true
  },
  {
    id: 'morning-pages-practice',
    title: 'Morning Pages: How 20 Minutes Can Transform Your Day',
    excerpt: 'Discover the life-changing practice of morning pages and how to implement this powerful habit in your daily routine.',
    category: 'journaling-tips',
    readTime: '5 min read',
    date: 'Dec 18, 2025',
    featured: false
  },
  {
    id: 'journaling-anxiety-relief',
    title: 'How Journaling Helps Manage Anxiety: A Science-Based Approach',
    excerpt: 'Explore the research-backed benefits of journaling for anxiety and learn specific techniques to calm your mind.',
    category: 'mental-wellness',
    readTime: '6 min read',
    date: 'Dec 15, 2025',
    featured: false
  }
];

const Blog: React.FC<BlogProps> = ({ onChangeView }) => {
  return (
    <div className="min-h-screen bg-[#faf9f7] animate-fade-up">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#faf9f7]/95 backdrop-blur-xl border-b border-stone-200/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onChangeView(ViewState.HOME)}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage to-sage-dark text-white flex items-center justify-center shadow-lg shadow-sage/20 group-hover:scale-105 transition-transform">
              <BookOpen size={16} fill="currentColor" />
            </div>
            <span className="font-serif text-xl font-medium text-text-primary tracking-tight">Meadow</span>
          </button>
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

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-lavender/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 rounded-full text-sage-dark text-sm font-medium mb-6">
            <BookOpen size={16} />
            Meadow Journal
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 leading-tight">
            Insights for Your
            <span className="text-sage"> Journaling Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Explore articles, guides, and tips to deepen your self-reflection practice
            and unlock the full potential of journaling.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-sage/20 focus:border-sage outline-none transition-all text-text-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {FEATURED_POSTS.filter(p => p.featured).map(post => (
        <section key={post.id} className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => onChangeView(ViewState.BLOG_POST, { postId: post.id })}
              className="w-full group"
            >
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sage/10 to-lavender/10 p-8 md:p-12 border border-white/50 hover:shadow-xl transition-all duration-500">
                <div className="absolute top-4 left-4 px-3 py-1 bg-sage text-white text-xs font-medium rounded-full">
                  Featured
                </div>
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-text-primary mb-4 group-hover:text-sage-dark transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-text-secondary text-lg leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sage-dark font-medium group-hover:gap-3 transition-all">
                    Read Article <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </section>
      ))}

      {/* Categories Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-8">
            Explore Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOG_CATEGORIES.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onChangeView(ViewState.BLOG_CATEGORY, { categoryId: category.id, title: category.title })}
                  className="group p-6 rounded-2xl bg-white/80 border border-stone-100 hover:border-sage/30 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-sage-dark" />
                  </div>
                  <h3 className="font-serif text-lg text-text-primary mb-2 group-hover:text-sage-dark transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">
                    {category.description}
                  </p>
                  <span className="text-xs text-text-muted">
                    {category.postCount} articles
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-8">
            Latest Articles
          </h2>
          <div className="space-y-4">
            {FEATURED_POSTS.filter(p => !p.featured).map(post => (
              <button
                key={post.id}
                onClick={() => onChangeView(ViewState.BLOG_POST, { postId: post.id })}
                className="w-full group p-6 rounded-2xl bg-white/80 border border-stone-100 hover:border-sage/30 hover:shadow-md transition-all duration-300 text-left flex items-start gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-2">
                    <span className="px-2 py-1 bg-sage/10 rounded-full text-sage-dark capitalize">
                      {post.category.replace('-', ' ')}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg text-text-primary mb-2 group-hover:text-sage-dark transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <ArrowRight size={20} className="text-stone-300 group-hover:text-sage-dark group-hover:translate-x-1 transition-all mt-2" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-sage/20 to-sage/5 p-8 md:p-12 text-center border border-sage/10">
            <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-4">
              Start Your Journaling Practice Today
            </h2>
            <p className="text-text-secondary mb-8 max-w-xl mx-auto">
              Join thousands of people using Meadow to cultivate self-awareness
              and personal growth through daily reflection.
            </p>
            <button
              onClick={() => onChangeView(ViewState.AUTH)}
              className="px-8 py-4 bg-sage text-white rounded-2xl font-medium hover:bg-sage-dark transition-colors shadow-lg shadow-sage/20"
            >
              Try Meadow Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
