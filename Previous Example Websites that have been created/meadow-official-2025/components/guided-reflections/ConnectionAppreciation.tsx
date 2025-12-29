import React, { useState } from 'react';
import { Users, Heart, MessageCircle, UserPlus, Send, ArrowRight } from 'lucide-react';
import WizardLayout from './WizardLayout';

interface ConnectionAppreciationProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'connected' | 'appreciate' | 'conversation' | 'be-like' | 'message' | 'summary';

const ConnectionAppreciation: React.FC<ConnectionAppreciationProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('connected');
  const [connectedPerson, setConnectedPerson] = useState('');
  const [whatHelped, setWhatHelped] = useState('');
  const [appreciatePerson, setAppreciatePerson] = useState('');
  const [appreciateWhy, setAppreciateWhy] = useState('');
  const [conversationPerson, setConversationPerson] = useState('');
  const [conversationTopic, setConversationTopic] = useState('');
  const [beLike, setBeLike] = useState('');
  const [gratitudeMessage, setGratitudeMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['connected', 'appreciate', 'conversation', 'be-like', 'message', 'summary'];
  const stepIndex = steps.indexOf(step);

  const canProceed = () => {
    switch (step) {
      case 'connected': return connectedPerson.trim().length > 0;
      case 'appreciate': return appreciatePerson.trim().length > 0;
      case 'conversation': return conversationPerson.trim().length > 0 || conversationTopic.trim().length > 0;
      case 'be-like': return beLike.trim().length > 0;
      case 'message': return true; // Optional
      default: return true;
    }
  };

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStep(steps[stepIndex + 1]);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });

      let content = `## Connection & Appreciation\n\n`;
      content += `### Felt Most Connected To\n**${connectedPerson}**\n`;
      if (whatHelped) content += `*What helped:* ${whatHelped}\n`;
      content += `\n### Want to Appreciate More\n**${appreciatePerson}**\n`;
      if (appreciateWhy) content += `*Why:* ${appreciateWhy}\n`;
      content += `\n### Conversation to Have\n`;
      if (conversationPerson) content += `**With:** ${conversationPerson}\n`;
      if (conversationTopic) content += `**About:** ${conversationTopic}\n`;
      content += `\n### This Week I Want to Be\n*${beLike}*\n`;
      if (gratitudeMessage) {
        content += `\n### Gratitude Message\n"${gratitudeMessage}"\n`;
      }

      await onComplete(`Connection & Appreciation - ${date}`, content);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <WizardLayout
      title="Connection"
      icon={Users}
      step={stepIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? nextStep : undefined}
      onComplete={step === 'summary' ? handleSave : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'message' ? 'See Summary' : 'Continue'}
      color="sage"
    >
      {/* Step 1: Connected */}
      {step === 'connected' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Heart size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Who Made You Feel Connected?
            </h2>
            <p className="text-stone-500 font-serif italic">
              Who did you feel most connected to recently?
            </p>
          </div>

          <div className="space-y-4 mb-2">
            <input
              autoFocus
              type="text"
              value={connectedPerson}
              onChange={(e) => setConnectedPerson(e.target.value)}
              placeholder="Name a person..."
              className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all border border-stone-100"
            />

            <textarea
              value={whatHelped}
              onChange={(e) => setWhatHelped(e.target.value)}
              placeholder="What helped create that connection? (optional)"
              className="w-full p-6 bg-white rounded-3xl text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-32 transition-all border border-stone-100"
            />
          </div>
        </>
      )}

      {/* Step 2: Appreciate */}
      {step === 'appreciate' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <UserPlus size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Who Deserves Appreciation?
            </h2>
            <p className="text-stone-500 font-serif italic">
              Who would you like to appreciate more, and why?
            </p>
          </div>

          <div className="space-y-4 mb-2">
            <input
              autoFocus
              type="text"
              value={appreciatePerson}
              onChange={(e) => setAppreciatePerson(e.target.value)}
              placeholder="Name a person..."
              className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all border border-stone-100"
            />

            <textarea
              value={appreciateWhy}
              onChange={(e) => setAppreciateWhy(e.target.value)}
              placeholder="Why do you want to appreciate them more?"
              className="w-full p-6 bg-white rounded-3xl text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-32 transition-all border border-stone-100"
            />
          </div>
        </>
      )}

      {/* Step 3: Conversation */}
      {step === 'conversation' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <MessageCircle size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              A Conversation to Have
            </h2>
            <p className="text-stone-500 font-serif italic">
              What's one simple, real conversation you want to have soon?
            </p>
          </div>

          <div className="space-y-4 mb-2">
            <input
              autoFocus
              type="text"
              value={conversationPerson}
              onChange={(e) => setConversationPerson(e.target.value)}
              placeholder="With whom?"
              className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 transition-all border border-stone-100"
            />

            <textarea
              value={conversationTopic}
              onChange={(e) => setConversationTopic(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full p-6 bg-white rounded-3xl text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-32 transition-all border border-stone-100"
            />
          </div>
        </>
      )}

      {/* Step 4: Be Like */}
      {step === 'be-like' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Users size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Who Do You Want to Be?
            </h2>
            <p className="text-stone-500 font-serif italic">
              What kind of friend/partner/teammate do you want to be this week?
            </p>
          </div>

          <textarea
            autoFocus
            value={beLike}
            onChange={(e) => setBeLike(e.target.value)}
            placeholder="This week, I want to be someone who..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-48 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 5: Gratitude Message */}
      {step === 'message' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Send size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Write a Gratitude Note
            </h2>
            <p className="text-stone-500 font-serif italic">
              A short message you could send (or keep for yourself)
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-2">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-3">To: {appreciatePerson || 'Someone special'}</p>
            <textarea
              autoFocus
              value={gratitudeMessage}
              onChange={(e) => setGratitudeMessage(e.target.value)}
              placeholder="I wanted you to know that..."
              className="w-full p-0 bg-transparent text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none h-32 font-serif text-lg leading-relaxed"
            />
          </div>

          <p className="text-center text-stone-400 text-sm mt-4">
            This step is optional.
          </p>
        </>
      )}

      {/* Step 6: Summary */}
      {step === 'summary' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-scale-in border border-stone-100">
              <Heart size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Connected
            </h2>
            <p className="text-stone-400 font-serif italic">
              Your relationship garden is tended
            </p>
          </div>

          <div className="space-y-4 mb-2">
            {/* People mentioned */}
            <div className="flex gap-2 justify-center mb-4">
              {[connectedPerson, appreciatePerson, conversationPerson].filter(p => p).map((person, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center font-serif text-base font-bold">
                  {person.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <p className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-2">Connected With</p>
              <p className="text-sage-900 font-serif text-lg">{connectedPerson}</p>
              {whatHelped && <p className="text-stone-500 text-sm mt-1 italic">{whatHelped}</p>}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <p className="text-xs font-bold text-sage-600 uppercase tracking-widest mb-2">Want to Appreciate</p>
              <p className="text-sage-900 font-serif text-lg">{appreciatePerson}</p>
              {appreciateWhy && <p className="text-stone-500 text-sm mt-1">{appreciateWhy}</p>}
            </div>

            {(conversationPerson || conversationTopic) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Conversation to Have</p>
                {conversationPerson && <p className="text-sage-900">With {conversationPerson}</p>}
                {conversationTopic && <p className="text-stone-500 text-sm mt-1">{conversationTopic}</p>}
              </div>
            )}

            <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
              <p className="text-xs font-bold text-sage-600 uppercase tracking-widest mb-2">I Want to Be</p>
              <p className="text-sage-900 font-serif italic">"{beLike}"</p>
            </div>

            {gratitudeMessage && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 dashed-border">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Gratitude Note</p>
                <p className="text-sage-900 text-sm font-serif">"{gratitudeMessage}"</p>
              </div>
            )}
          </div>
        </>
      )}
    </WizardLayout>
  );
};

export default ConnectionAppreciation;
