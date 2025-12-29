import { Sun, MessageCircle, Clock, Star, Bell, BookPlus } from "lucide-react";

const features = [
  {
    icon: Sun,
    title: "Pattern Recognition",
    description: "Notices themes across conversations. The stories you tell, the things you avoid, the questions you circle back to.",
  },
  {
    icon: MessageCircle,
    title: "Thoughtful Challenge",
    description: "Asks the questions that help you see your situation from angles you hadn't considered.",
  },
  {
    icon: Clock,
    title: "Living Memory",
    description: "Every conversation builds on the last. Remembers what matters to you, what you're working through.",
  },
  {
    icon: Star,
    title: "Surfaced Insights",
    description: "Conversations become a library of clarity. Organized, searchable, accessible when you need it.",
  },
  {
    icon: Bell,
    title: "Gentle Rhythm",
    description: "Start your day with intention. End it with reflection. Orivya meets you where you are.",
  },
  {
    icon: BookPlus,
    title: "Continuous Context",
    description: "Pick up where you left off. Reference past conversations. Your history becomes a resource, not a blur.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 pb-[100px] relative z-10">
      <div className="text-center max-w-[500px] mx-auto mb-14">
        <div className="font-mono text-[10px] font-medium text-sage uppercase tracking-[2px] mb-3.5">
          What Makes This Different
        </div>
        <h2 className="text-[28px] font-semibold mb-2.5">Clarity, not just conversation</h2>
        <p className="text-[15px] text-tertiary">Most AI just responds. Orivya actually pays attention.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[920px] mx-auto">
        {features.map((feature) => (
          <div 
            key={feature.title}
            className="bg-card-custom border border-subtle rounded-[14px] py-7 px-6 transition-all duration-300 hover:border-border hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 mb-[18px] flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-sage stroke-[1.5]" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">{feature.title}</h3>
            <p className="text-[13px] text-muted-custom leading-[1.55]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
