
import { Journey, PromptCategory, QuickWrite } from '../types';
import { 
  Star, Heart, Wind, Compass, Users, Cloud, Sun, 
  Moon, Send, Sparkles, TrendingUp, Feather, BookOpen, Target, Palette, Zap, Battery
} from 'lucide-react';

// --- JOURNEYS (6 Series) ---
export const JOURNEYS: Journey[] = [
  {
    id: 'clarity',
    title: '7 Days of Clarity',
    description: 'Cut through mental noise and reconnect with what matters most.',
    icon: Star,
    color: 'sage',
    totalDays: 7,
    completedDays: 3,
    isFeatured: true,
    steps: [
      { 
        day: 1, 
        title: 'The Noise', 
        subtitle: 'Identifying distractions', 
        questions: [
            "What is one thing that stressed you out today?",
            "Did it actually matter in the long run?",
            "What is one thing you can ignore tomorrow?"
        ],
        prompt: 'Write about the mental "noise" you are carrying right now. Don\'t edit, just let it out.', 
        status: 'completed', 
        duration: '5 min' 
      },
      { 
        day: 2, 
        title: 'Values', 
        subtitle: 'What actually matters', 
        questions: [
            "Who did you envy today?",
            "What does that envy tell you about what you want?",
            "Name one person you admire."
        ],
        prompt: 'If you could only focus on three things for the rest of the year, what would they be and why?', 
        status: 'completed', 
        duration: '5 min' 
      },
      { 
        day: 3, 
        title: 'The Pause', 
        subtitle: 'Stopping before reacting', 
        questions: [
            "When did you rush today?",
            "How did your body feel in that moment?",
            "Where can you slow down?"
        ],
        prompt: 'Recall a moment today where you reacted instantly. What would have happened if you paused for 10 seconds?', 
        status: 'completed', 
        duration: '5 min' 
      },
      { 
        day: 4, 
        title: 'Identity', 
        subtitle: 'Who are you?', 
        questions: [
            "How do you introduce yourself?",
            "What is a label you are tired of?",
            "What is a label you want to claim?"
        ],
        prompt: 'Who are you without your job title, your relationships, or your possessions?', 
        status: 'current', 
        duration: '5 min' 
      },
      { 
        day: 5, 
        title: 'Energy', 
        subtitle: 'Audit your input', 
        questions: [
            "What music did you listen to?",
            "Who drained you?",
            "Who energized you?"
        ],
        prompt: 'What gave you energy today? What drained it? Be specific.', 
        status: 'locked', 
        duration: '5 min' 
      },
      { 
        day: 6, 
        title: 'Boundaries', 
        subtitle: 'Protecting your peace', 
        questions: [
            "What did you say 'yes' to out of guilt?",
            "What needs to change?",
            "What are you afraid will happen if you say 'no'?"
        ],
        prompt: 'Where do you need to say "no" so you can say "yes" to yourself?', 
        status: 'locked', 
        duration: '5 min' 
      },
      { 
        day: 7, 
        title: 'Integration', 
        subtitle: 'Moving forward', 
        questions: [
            "What is one word for this week?",
            "What are you leaving behind?",
            "What are you taking with you?"
        ],
        prompt: 'Write a manifesto for your next month based on what you learned this week.', 
        status: 'locked', 
        duration: '5 min' 
      },
    ]
  },
  {
    id: 'gratitude',
    title: '7 Days of Gratitude',
    description: 'Shift your perspective from lack to abundance.',
    icon: Heart,
    color: 'coral',
    totalDays: 7,
    completedDays: 0,
    steps: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      title: `Gratitude Day ${i + 1}`,
      subtitle: 'Finding the light',
      questions: ["What made you smile?", "Who helped you?", "What tasted good?"],
      prompt: 'Identify one small thing today that made your life easier.',
      status: i === 0 ? 'current' : 'locked',
      duration: '5 min'
    })) as any
  },
  {
    id: 'letting-go',
    title: '7 Days of Letting Go',
    description: 'Release what is holding you back to make space for the new.',
    icon: Wind,
    color: 'blue',
    totalDays: 7,
    completedDays: 0,
    steps: []
  },
  {
    id: 'purpose',
    title: '7 Days of Purpose',
    description: 'Align your daily actions with your deeper direction.',
    icon: Compass,
    color: 'sage',
    totalDays: 7,
    completedDays: 0,
    steps: []
  },
  {
    id: 'self-compassion',
    title: '7 Days of Compassion',
    description: 'Learn to treat yourself with the same kindness you offer others.',
    icon: Heart,
    color: 'purple',
    totalDays: 7,
    completedDays: 0,
    steps: []
  },
  {
    id: 'connection',
    title: '7 Days of Connection',
    description: 'Deepen your relationships and understanding of others.',
    icon: Users,
    color: 'emerald',
    totalDays: 7,
    completedDays: 0,
    steps: []
  }
];

// --- PROMPT CATEGORIES (Revised for Sequential Flow) ---
export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: 'Appreciating the present moment.',
    count: 6,
    icon: Heart,
    color: 'coral',
    prompts: [
      "Let's pause. What is one small thing that went well today?",
      "Why did this specific thing matter to you?",
      "Who helped make it happen, directly or indirectly?",
      "How did it feel in your body when you experienced it?",
      "If you could capture this feeling in one word, what would it be?",
      "Take a moment to simply say thank you."
    ]
  },
  {
    id: 'discovery',
    title: 'Self-Discovery',
    description: 'Understanding your true self.',
    count: 5,
    icon: Sparkles,
    color: 'sage',
    prompts: [
      "What is a thought that has been looping in your mind lately?",
      "If you were a stranger observing your life this week, what would you notice?",
      "What is one thing you are pretending not to know?",
      "What would you do if you knew you wouldn't fail?",
      "What is one step you can take towards that truth tomorrow?"
    ]
  },
  {
    id: 'goals',
    title: 'Goals & Dreams',
    description: 'Mapping your future.',
    count: 5,
    icon: Target,
    color: 'purple',
    prompts: [
      "Fast forward 5 years. Ideally, what does your Tuesday morning look like?",
      "What is the biggest gap between that vision and today?",
      "What is one fear that comes up when you think about closing that gap?",
      "What is one resource or strength you already have that can help?",
      "Define one tiny action you will take in the next 24 hours."
    ]
  },
  {
    id: 'creative',
    title: 'Creative Expression',
    description: 'Unlocking your imagination.',
    count: 5,
    icon: Palette,
    color: 'blue',
    prompts: [
      "If your current mood was a landscape, what would it look like?",
      "What is the weather like in this landscape?",
      "If you could walk anywhere in this place, where would you go?",
      "What object would you find there?",
      "What message does that object have for you?"
    ]
  },
  {
    id: 'inner-worlds',
    title: 'Inner Worlds',
    description: 'Dreams, intuition, and the subconscious.',
    count: 5,
    icon: Cloud,
    color: 'lavender',
    prompts: [
      "Close your eyes for a moment. What is the loudest emotion you feel?",
      "Where does this emotion live in your body?",
      "If this emotion could speak, what would it say?",
      "What does this part of you need right now?",
      "How can you offer that to yourself today?"
    ]
  },
  {
    id: 'letters-unsent',
    title: 'Letters Unsent',
    description: 'Words for those you cannot reach.',
    count: 5,
    icon: Send,
    color: 'peach',
    prompts: [
      "Who is someone you need to speak to, but can't?",
      "What is the main thing you want them to know?",
      "What have you been afraid to say?",
      "If they heard you, how would you hope they respond?",
      "How does it feel to finally write this down?"
    ]
  },
  {
    id: 'tiny-joys',
    title: 'Tiny Joys',
    description: 'Micro-moments of happiness.',
    count: 5,
    icon: Sun,
    color: 'yellow',
    prompts: [
      "Look around you. What is one beautiful thing you can see?",
      "Recall a delicious taste or smell from this week.",
      "Think of a song that lifts your spirits.",
      "What is a small interaction that made you smile?",
      "How can you create one more tiny joy today?"
    ]
  },
  {
    id: 'growth-edges',
    title: 'Growth Edges',
    description: 'Where you are being stretched.',
    count: 5,
    icon: TrendingUp,
    color: 'mint',
    prompts: [
      "Where do you feel most uncomfortable right now?",
      "What is this discomfort trying to teach you?",
      "What old habit are you trying to break?",
      "What new habit are you trying to build?",
      "Celebrate yourself: How have you grown in the last month?"
    ]
  }
];

// --- QUICK WRITES (Refined & Expanded) ---
export const QUICK_WRITES: QuickWrite[] = [
  { 
    id: 'morning-pages', 
    title: 'Morning Pages', 
    icon: Sun, 
    prompts: [
      'What is the first thing on your mind this morning?', 
      'What is one intention you want to set for today?',
      'What is a small kindness you can offer yourself today?'
    ] 
  },
  { 
    id: 'evening-reflection', 
    title: 'Evening Reset', 
    icon: Moon, 
    prompts: [
      'What went well today?', 
      'What was challenging?', 
      'What is one thing you can let go of before sleeping?'
    ] 
  },
  { 
    id: 'energy-check', 
    title: 'Energy Check', 
    icon: Battery, 
    prompts: [
      'How is your physical energy right now? (1-10)', 
      'How is your mental clarity? (1-10)', 
      'How is your emotional state?',
      'What do you need most right now?'
    ] 
  },
  { 
    id: '3-good-things', 
    title: '3 Good Things', 
    icon: Heart, 
    prompts: [
      'First good thing...', 
      'Second good thing...',
      'Third good thing...'
    ] 
  },
  { 
    id: 'brain-dump', 
    title: 'Brain Dump', 
    icon: Cloud, 
    prompts: [
      'Unload everything on your mind. Don\'t filter it.'
    ] 
  },
];
