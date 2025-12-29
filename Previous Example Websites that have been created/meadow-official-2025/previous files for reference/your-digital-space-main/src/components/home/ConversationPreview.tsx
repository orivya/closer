import { OrivyaAvatar } from "@/components/OrivyaAvatar";

const messages = [
  {
    type: "user",
    text: "Every Sunday I tell myself this is the week I'll finally ask my manager about the promotion. Then Monday comes and I just... don't. It's been months.",
  },
  {
    type: "orivya",
    text: "That's interesting. The wanting is clearly there. But something changes between Sunday night and Monday morning. What do you think you're protecting yourself from?",
  },
  {
    type: "user",
    text: "Hearing no, I guess. Or maybe finding out I'm not as ready as I thought.",
  },
  {
    type: "orivya",
    text: "So the silence keeps the possibility alive. You're not procrastinating. You're protecting something that matters to you. That's actually worth sitting with before you decide what to do next.",
  },
];

export function ConversationPreview() {
  return (
    <section className="py-10 px-6 pb-[100px] relative z-10">
      <div className="max-w-[600px] mx-auto bg-elevated border border-subtle rounded-[18px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-[22px] py-[18px] border-b border-subtle">
          <OrivyaAvatar size="preview" />
          <div>
            <div className="text-[13px] font-semibold">Orivya</div>
            <div className="text-[11px] text-muted-custom">Listening</div>
          </div>
        </div>

        {/* Messages */}
        <div className="px-[22px] py-6 flex flex-col gap-[18px]">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`max-w-[82%] ${msg.type === "user" ? "self-end" : "self-start"}`}
            >
              <div 
                className={`px-4 py-[13px] rounded-xl text-sm leading-relaxed ${
                  msg.type === "user" 
                    ? "bg-sage text-white rounded-br-[4px]" 
                    : "bg-surface text-foreground border border-subtle rounded-bl-[4px]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
