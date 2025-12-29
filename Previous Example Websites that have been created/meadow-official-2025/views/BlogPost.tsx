import React from 'react';
import { ViewState } from '../types';
import {
  ChevronLeft, Clock, Calendar, Share2,
  ArrowRight, Feather, CheckCircle2
} from 'lucide-react';

interface BlogPostProps {
  onChangeView: (view: ViewState, data?: any) => void;
  postId?: string;
  categoryId?: string;
}

// Full blog post content for SEO
const BLOG_POSTS: Record<string, {
  title: string;
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  relatedPosts: string[];
}> = {
  'getting-started-journaling': {
    title: 'The Complete Beginner\'s Guide to Journaling',
    excerpt: 'Everything you need to know to start your journaling journey today. Learn the basics, overcome common obstacles, and discover the transformative power of daily writing.',
    readTime: '8 min read',
    date: 'December 20, 2025',
    author: 'Meadow Team',
    category: 'Journaling Tips',
    tags: ['beginners', 'getting started', 'daily practice', 'habits'],
    relatedPosts: ['morning-pages-practice', 'journaling-prompts-guide'],
    content: [
      `# Why Start Journaling?

Journaling is one of the most accessible and powerful tools for self-improvement available to us. It requires nothing more than a pen and paper—or a digital app like Meadow—and a few minutes of your time. Yet its benefits extend far beyond what this simplicity might suggest.

Research has consistently shown that regular journaling can reduce stress, improve emotional intelligence, boost memory, and even strengthen your immune system. But perhaps most importantly, journaling gives you a space to think clearly, process your experiences, and understand yourself more deeply.`,

      `## The Science Behind Journaling

When you write about your thoughts and feelings, you activate different parts of your brain than when you simply think about them. This process, called "cognitive processing," helps you:

- **Organize your thoughts**: Writing forces you to structure your ideas
- **Gain perspective**: Seeing words on a page creates distance from overwhelming emotions
- **Identify patterns**: Over time, you'll notice recurring themes in your life
- **Strengthen memory**: The act of writing reinforces neural pathways`,

      `## Getting Started: What You Need

The beauty of journaling is its simplicity. Here's everything you need to begin:

### 1. Choose Your Medium
- **Physical journal**: Many people find the tactile experience of writing by hand more meaningful
- **Digital app**: Apps like Meadow offer features like mood tracking, AI insights, and easy organization
- **Both**: Use whatever feels right in the moment

### 2. Find Your Time
The "best" time to journal is whenever you'll actually do it. That said, many people find success with:
- **Morning**: Start your day with clarity and intention
- **Evening**: Process the day's events before sleep
- **During transitions**: Between activities or during your commute

### 3. Create Your Space
Designate a comfortable, quiet spot for your practice. This could be:
- A corner of your bedroom
- Your favorite coffee shop
- A park bench
- Anywhere you feel at ease`,

      `## Your First Entry: Just Begin

The hardest part of journaling is often just starting. Here are some simple ways to break through the blank page:

### Stream of Consciousness
Simply write whatever comes to mind. Don't worry about grammar, structure, or making sense. Just let the words flow for 5-10 minutes.

### Use a Prompt
Answer a simple question like:
- "What's on my mind right now?"
- "How am I feeling today?"
- "What am I grateful for?"

### Describe Your Day
Start with the basics: What did you do? Who did you see? What stood out?`,

      `## Common Obstacles and How to Overcome Them

### "I don't have time"
Start with just 5 minutes. Set a timer if needed. Quality matters more than quantity.

### "I don't know what to write"
Use prompts, or simply describe your surroundings. The Meadow app offers daily prompts tailored to your journaling style.

### "My writing isn't good enough"
Your journal is for you alone. There's no wrong way to do it. Embrace imperfection.

### "I forget to write"
Tie journaling to an existing habit—after your morning coffee, before bed, or during lunch. Use reminders if helpful.`,

      `## Building Your Practice

Consistency is more important than perfection. Here's how to make journaling stick:

1. **Start small**: 5 minutes is enough
2. **Be consistent**: Same time each day if possible
3. **Be patient**: Benefits compound over time
4. **Stay curious**: Experiment with different styles and prompts
5. **Review occasionally**: Look back at old entries to see your growth

Remember, journaling is a practice, not a performance. Some days you'll write pages; others, just a sentence. Both are valid. The goal is simply to show up for yourself.`,

      `## Ready to Begin?

Your journaling journey starts with a single word. Open your notebook or app, take a deep breath, and write whatever comes to mind. There's no right or wrong here—only the beautiful process of getting to know yourself better.

Meadow is designed to make your journaling practice effortless and meaningful. With features like mood tracking, AI-powered insights, and thoughtful prompts, we're here to support your self-discovery journey.`
    ]
  },
  'morning-pages-practice': {
    title: 'Morning Pages: How 20 Minutes Can Transform Your Day',
    excerpt: 'Discover the life-changing practice of morning pages and how to implement this powerful habit in your daily routine.',
    readTime: '5 min read',
    date: 'December 18, 2025',
    author: 'Meadow Team',
    category: 'Journaling Tips',
    tags: ['morning routine', 'creativity', 'habits', 'productivity'],
    relatedPosts: ['getting-started-journaling', 'journaling-consistency'],
    content: [
      `# What Are Morning Pages?

Morning Pages is a practice popularized by Julia Cameron in her book "The Artist's Way." The concept is simple: every morning, before you do anything else, you write three pages of stream-of-consciousness text by hand.

The goal isn't to write something beautiful or even coherent. It's to clear your mind of the mental clutter that accumulates overnight and prevents you from accessing your deeper creativity and clarity.`,

      `## The Rules of Morning Pages

1. **Write first thing in the morning** - Before checking your phone, before coffee if possible
2. **Write three pages** - Not two, not four, but three
3. **Write by hand** - The physical act engages your brain differently
4. **Don't stop to think** - Keep your pen moving
5. **Don't read them back** - At least not right away

These "rules" aren't arbitrary. Each serves a specific purpose in quieting your inner critic and accessing your authentic thoughts.`,

      `## Benefits of Morning Pages

### Mental Clarity
Morning Pages act like a mental shower. You wash away the thoughts cluttering your mind and start your day fresh.

### Reduced Anxiety
By externalizing your worries onto paper, you gain perspective and often realize that problems seem smaller when written down.

### Enhanced Creativity
Many artists, writers, and entrepreneurs credit Morning Pages with unlocking creative breakthroughs. By bypassing your inner critic, you access ideas that usually stay hidden.

### Self-Discovery
Over time, you'll notice patterns in your writing—recurring themes, unexpressed feelings, and hidden desires that reveal who you really are.`,

      `## How to Start

1. Set your alarm 30 minutes earlier than usual
2. Keep your journal and pen by your bed
3. Upon waking, sit up and begin writing immediately
4. Write whatever comes to mind—complaints, dreams, grocery lists, anything
5. When you reach three pages, stop
6. Close your journal and begin your day

That's it. Simple, but profoundly effective.`
    ]
  },
  'journaling-anxiety-relief': {
    title: 'How Journaling Helps Manage Anxiety: A Science-Based Approach',
    excerpt: 'Explore the research-backed benefits of journaling for anxiety and learn specific techniques to calm your mind.',
    readTime: '6 min read',
    date: 'December 15, 2025',
    author: 'Meadow Team',
    category: 'Mental Wellness',
    tags: ['anxiety', 'mental health', 'coping strategies', 'self-care'],
    relatedPosts: ['gratitude-journaling-benefits', 'emotional-processing-journal'],
    content: [
      `# The Connection Between Journaling and Anxiety Relief

Anxiety often stems from a sense of overwhelm—too many thoughts racing through our minds, too many "what ifs" demanding attention. Journaling offers a powerful antidote by providing a structured space to externalize and examine these thoughts.

Research from the University of Rochester Medical Center found that journaling helps people manage anxiety, reduce stress, and cope with depression. But how exactly does putting pen to paper help calm an anxious mind?`,

      `## The Science of Writing Away Worry

When you're anxious, your amygdala—the brain's alarm system—is on high alert. This triggers a cascade of stress hormones that keep you in fight-or-flight mode.

Writing about your worries engages your prefrontal cortex, the rational part of your brain. This activation helps regulate the amygdala's response, essentially telling your brain: "We're processing this. It's okay to calm down."

A 2017 study in the journal Psychophysiology found that expressive writing before a stressful event reduced intrusive thoughts and improved performance among worriers.`,

      `## Techniques for Anxiety Relief

### 1. Worry Dump
Set a timer for 10 minutes and write down every worry, fear, and anxious thought in your mind. Don't filter or judge—just dump it all onto the page. When the timer ends, close your journal. You've given those worries a home outside your head.

### 2. Evidence Testing
Write down an anxious thought, then list the evidence for and against it. Often, you'll find the evidence doesn't support your worst fears.

### 3. Gratitude Shift
When anxiety strikes, write three things you're grateful for. This simple act shifts your focus from threat to appreciation.

### 4. Future Self Letter
Write a letter from your future self who has successfully navigated the situation you're worried about. What advice would they give you?`,

      `## Making It a Practice

The key to using journaling for anxiety is consistency. Try to write for at least 10 minutes daily, even when you're not feeling anxious. This builds a foundation that supports you when difficult moments arise.

Remember: Your journal is a judgment-free zone. There's no wrong way to express your feelings. The simple act of showing up for yourself on the page is itself a form of self-care.`
    ]
  }
};

const BlogPost: React.FC<BlogPostProps> = ({ onChangeView, postId = 'getting-started-journaling', categoryId }) => {
  const post = BLOG_POSTS[postId] || BLOG_POSTS['getting-started-journaling'];

  return (
    <div className="min-h-screen bg-[#faf9f7] animate-fade-up">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#faf9f7]/95 backdrop-blur-xl border-b border-stone-200/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => categoryId ? onChangeView(ViewState.BLOG_CATEGORY, { categoryId }) : onChangeView(ViewState.BLOG)}
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
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Meadow Blog', url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-text-muted hover:text-text-secondary"
            >
              <Share2 size={18} />
            </button>
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

      {/* Article */}
      <article className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mb-4">
              <span className="px-3 py-1 bg-sage/10 rounded-full text-sage-dark">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {post.date}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-text-primary leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Author */}
          <div className="flex items-center gap-4 py-6 border-y border-stone-100 mb-12">
            <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
              <Feather size={20} className="text-sage-dark" />
            </div>
            <div>
              <p className="font-medium text-text-primary">{post.author}</p>
              <p className="text-sm text-text-muted">Meadow Journal</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.map((section, index) => (
              <div key={index} className="mb-8">
                {section.split('\n\n').map((paragraph, pIndex) => {
                  // Handle headers
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={pIndex} className="font-serif text-3xl text-text-primary mt-12 mb-6">
                        {paragraph.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={pIndex} className="font-serif text-2xl text-text-primary mt-10 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIndex} className="font-serif text-xl text-text-primary mt-8 mb-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  // Handle lists
                  if (paragraph.includes('\n- ')) {
                    const [intro, ...items] = paragraph.split('\n- ');
                    return (
                      <div key={pIndex}>
                        {intro && <p className="text-text-secondary leading-relaxed mb-3">{intro}</p>}
                        <ul className="space-y-2 mb-4">
                          {items.map((item, iIndex) => (
                            <li key={iIndex} className="flex items-start gap-3 text-text-secondary">
                              <CheckCircle2 size={18} className="text-sage shrink-0 mt-1" />
                              <span>{item.replace('- ', '')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  // Handle numbered lists
                  if (paragraph.match(/^\d\./)) {
                    const items = paragraph.split('\n');
                    return (
                      <ol key={pIndex} className="space-y-2 mb-4 list-decimal list-inside">
                        {items.map((item, iIndex) => (
                          <li key={iIndex} className="text-text-secondary">
                            {item.replace(/^\d\.\s*/, '')}
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  // Regular paragraph
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <p key={pIndex} className="font-medium text-text-primary mb-4">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  return (
                    <p key={pIndex} className="text-text-secondary leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-stone-100">
            <p className="text-sm text-text-muted mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-stone-100 rounded-full text-sm text-text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-6 py-12 bg-gradient-to-br from-sage/10 to-sage/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-4">
            Start Your Journaling Practice Today
          </h2>
          <p className="text-text-secondary mb-8">
            Meadow makes journaling effortless with AI-powered insights, mood tracking, and thoughtful prompts.
          </p>
          <button
            onClick={() => onChangeView(ViewState.AUTH)}
            className="px-8 py-4 bg-sage text-white rounded-2xl font-medium hover:bg-sage-dark transition-colors shadow-lg shadow-sage/20"
          >
            Try Meadow Free
          </button>
        </div>
      </section>

      {/* Related Posts */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-serif text-2xl text-text-primary mb-8">
            Continue Reading
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {post.relatedPosts.map(relatedId => {
              const related = BLOG_POSTS[relatedId];
              if (!related) return null;
              return (
                <button
                  key={relatedId}
                  onClick={() => onChangeView(ViewState.BLOG_POST, { postId: relatedId })}
                  className="group p-6 rounded-2xl bg-white/80 border border-stone-100 hover:border-sage/30 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <p className="text-xs text-text-muted mb-2">{related.category}</p>
                  <h4 className="font-serif text-lg text-text-primary mb-2 group-hover:text-sage-dark transition-colors">
                    {related.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sage-dark text-sm font-medium">
                    Read more <ArrowRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
