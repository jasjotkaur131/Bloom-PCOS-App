import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../lib/ai';
import { Message, RiskData } from '../types';
import { Send, Sparkles } from 'lucide-react';

interface AIChatProps {
  riskData: RiskData | null;
}

export default function AIChat({ riskData }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your Bloom AI companion 🌸 I can answer questions about PCOS symptoms, hormones, diet, medications, fertility, and more. I personalise my answers to your health profile — complete the Risk Score first for the best responses! What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const buildSystemPrompt = () => {
    let profile = '';
    if (riskData) {
      profile = `
USER HEALTH PROFILE:
- PCOS Risk Level: ${riskData.level.toUpperCase()} (${Math.round(riskData.probability * 100)}% probability)
- BMI: ${riskData.bmi}
- Cycle length: ${riskData.cycleLength} days
- Testosterone: ${riskData.testosterone} ng/dL
- LH/FSH ratio: ${riskData.lhfsh}
- Fasting blood sugar: ${riskData.sugar} mg/dL
- Symptoms present: ${riskData.symptoms.join(', ') || 'none'}

Always reference these specific values in your answers. Give advice tailored exactly to this profile — e.g. if BMI is high, address weight management specifically; if LH/FSH is elevated, explain what that means for them; if they have irregular cycles, focus on that.`;
    } else {
      profile = '\n\nNo health profile available yet. Encourage the user to complete the Risk Score tab for personalised answers. For now, give general PCOS information and ask about their specific symptoms to tailor your response.';
    }
    return `You are Bloom, a compassionate, knowledgeable PCOS health companion app. You provide warm, detailed, medically accurate, and highly personalised information about Polycystic Ovary Syndrome (PCOS).${profile}

Guidelines:
- Always personalise answers using the user's actual health data when available
- Give specific, actionable advice — not generic bullet points
- Be conversational, empathetic, and encouraging
- Cover diet, hormones, metformin, birth control, inositol, lifestyle, mental health, fertility, exercise
- Always remind users to confirm decisions with their doctor
- Never diagnose — you support, not replace, medical care
- Keep responses concise but thorough (3-5 sentences typically)`;
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const prompt = `Conversation history:\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}\nuser: ${messageText}`;
    const response = await generateText(prompt, buildSystemPrompt());

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  const quickPrompts = [
    { label: 'What causes PCOS?', text: 'What are the main causes of PCOS and how does it affect my hormones?' },
    { label: 'Insulin resistance', text: 'How can I manage insulin resistance with PCOS — any natural ways?' },
    { label: 'Best supplements', text: 'Which supplements actually work for PCOS — inositol, magnesium, vitamin D?' },
    { label: 'PCOS & fertility', text: 'How does PCOS affect my chances of getting pregnant?' },
    { label: 'Best exercises', text: 'What kind of exercise is best for PCOS and why?' },
    { label: 'Mental health', text: 'How does PCOS affect mental health like anxiety and depression?' },
  ];

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      <div className="bg-sage-light border border-sage-mid rounded-xl p-3 text-sm text-sage mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>I give personalised answers based on your risk profile. Not a substitute for medical advice.</span>
      </div>

      <div className="flex-1 overflow-y-auto bg-white border border-border-main rounded-2xl shadow-bloom p-4 mb-4 flex flex-col gap-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'assistant'
                ? 'bg-plum-light text-text-main self-start rounded-bl-none'
                : 'bg-rose text-white self-end rounded-br-none'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="bg-plum-light p-3 rounded-2xl rounded-bl-none self-start">
            <div className="flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-plum rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-plum rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-plum rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.text)}
            className="bg-plum-light border border-plum-mid rounded-full px-3 py-1.5 text-xs font-medium text-plum hover:bg-plum hover:text-white transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 p-2 bg-white border border-border-main rounded-full shadow-bloom">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about PCOS..."
          className="flex-1 bg-transparent border-none outline-none px-3 text-sm"
        />
        <button
          onClick={() => handleSend()}
          disabled={isTyping}
          className="bg-rose text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#D4556B] transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
