import { OrivyaAvatar } from "@/components/OrivyaAvatar";
import { Bell, Mic, Calendar } from "lucide-react";

const phoneMessages = [
  { type: "ai", text: "Good morning. You mentioned yesterday you wanted to revisit that decision. How are you feeling about it now?" },
  { type: "user", text: "Clearer actually. I think I was overcomplicating it." },
  { type: "ai", text: "That happens. Sometimes clarity sneaks up once we stop overthinking. What's the simple version you're seeing now?" },
  { type: "user", text: "I just need to say no." },
  { type: "ai", text: "There it is. How does it feel to say that out loud?" },
];

const mobileFeatures = [
  { icon: Bell, title: "Gentle nudges", description: "Check-ins that respect your time and energy" },
  { icon: Mic, title: "Voice when you need it", description: "Talk through thoughts without typing" },
  { icon: Calendar, title: "Daily rhythm", description: "Morning intention, evening reflection" },
];

export function MobileSection() {
  return (
    <section className="py-20 px-6 pb-[120px] relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-[26px] font-semibold mb-2.5">With you everywhere</h2>
        <p className="text-sm text-tertiary">Clarity when you need it, wherever you are</p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-12 items-center lg:items-start">
        {/* Phone Mockup */}
        <div className="w-[280px] sm:w-[280px] w-[260px] bg-elevated border border-border rounded-[36px] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="bg-background rounded-[26px] overflow-hidden h-[560px] sm:h-[560px] h-[500px] flex flex-col">
            {/* Notch */}
            <div className="h-7 flex justify-center items-end pb-1">
              <div className="w-20 h-1.5 bg-elevated rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-2.5 border-b border-subtle">
              <OrivyaAvatar size="phone" />
              <span className="text-xs font-semibold">Orivya</span>
            </div>

            {/* Messages */}
            <div className="flex-1 px-3 py-4 flex flex-col gap-3 overflow-y-auto">
              {phoneMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`max-w-[80%] ${msg.type === "user" ? "self-end" : "self-start"}`}
                >
                  <div 
                    className={`px-3.5 py-2.5 rounded-[14px] text-xs leading-[1.45] ${
                      msg.type === "user"
                        ? "bg-sage text-white rounded-br-[4px]"
                        : "bg-surface text-secondary border border-subtle rounded-bl-[4px]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-subtle">
              <div className="w-full px-3.5 py-2.5 bg-surface border border-subtle rounded-full text-xs text-muted-custom">
                What's on your mind?
              </div>
            </div>

            {/* Home indicator */}
            <div className="h-5 flex justify-center items-center">
              <div className="w-[100px] h-1 bg-muted-foreground rounded-sm" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-[280px] lg:max-w-[280px] max-w-[320px] flex flex-col gap-5 pt-10 lg:pt-10 pt-8">
          {mobileFeatures.map((feature) => (
            <div key={feature.title} className="flex gap-3.5">
              <div className="w-9 h-9 bg-sage-subtle rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-[18px] h-[18px] text-sage stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-custom leading-[1.45]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
