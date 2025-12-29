import { ArrowRight } from "lucide-react";

export function ClaritySection() {
  return (
    <section className="py-20 px-6 pb-[120px] relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-[28px] font-semibold mb-3">From conversation to clarity</h2>
        <p className="text-[15px] text-tertiary">Your thoughts become organized understanding</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-[900px] mx-auto">
        {/* Conversation Card */}
        <div className="flex-1 max-w-[260px] lg:max-w-[260px] max-w-[320px] w-full">
          <div className="bg-card-custom border border-subtle rounded-2xl p-6 h-[180px] flex flex-col">
            <div className="font-mono text-[9px] text-sage uppercase tracking-[1px] mb-3">
              Conversation
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="bg-sage text-white px-3 py-2 rounded-lg rounded-br-sm text-[11px] max-w-[85%] ml-auto">
                I keep putting this off...
              </div>
              <div className="bg-surface text-secondary border border-subtle px-3 py-2 rounded-lg rounded-bl-sm text-[11px] max-w-[85%]">
                What would change if you stopped waiting?
              </div>
              <div className="bg-sage text-white px-3 py-2 rounded-lg rounded-br-sm text-[11px] max-w-[85%] ml-auto">
                Maybe I'm scared it'll work.
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="w-10 flex items-center justify-center flex-shrink-0 lg:rotate-0 rotate-90">
          <ArrowRight className="w-6 h-6 text-muted-custom stroke-[1.5]" />
        </div>

        {/* Insight Card */}
        <div className="flex-1 max-w-[260px] lg:max-w-[260px] max-w-[320px] w-full">
          <div 
            className="border border-sage rounded-2xl p-6 h-[180px] flex flex-col"
            style={{ background: "linear-gradient(180deg, hsl(148 12% 55% / 0.06) 0%, hsl(var(--background-card)) 100%)" }}
          >
            <div className="font-mono text-[9px] text-sage uppercase tracking-[1px] mb-3">
              Insight
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-medium text-sage-light mb-2">Pattern Recognized</div>
              <div className="text-[13px] text-foreground leading-relaxed">
                Your hesitation isn't about fear of failure. It's about what success would require you to become.
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="w-10 flex items-center justify-center flex-shrink-0 lg:rotate-0 rotate-90">
          <ArrowRight className="w-6 h-6 text-muted-custom stroke-[1.5]" />
        </div>

        {/* Library Card */}
        <div className="flex-1 max-w-[260px] lg:max-w-[260px] max-w-[320px] w-full">
          <div className="bg-card-custom border border-subtle rounded-2xl p-6 h-[180px] flex flex-col">
            <div className="font-mono text-[9px] text-sage uppercase tracking-[1px] mb-3">
              Library
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {["Fear of success pattern", "Identity and change", "Procrastination triggers"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 px-2.5 py-2 bg-surface rounded-md">
                  <div className="w-1.5 h-1.5 bg-sage rounded-full flex-shrink-0" />
                  <span className="text-[11px] text-secondary truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
