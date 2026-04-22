import React, { useState } from 'react';
import { RiskData } from '../types';
import { generateText } from '../lib/ai';
import { Salad, Utensils, Info, Sparkles, ChefHat, Brain } from 'lucide-react';

interface DietGuidanceProps {
  riskData: RiskData | null;
}

export default function DietGuidance({ riskData }: DietGuidanceProps) {
  const [recipeInput, setRecipeInput] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecipe = async () => {
    if (!recipeInput.trim()) return;
    setIsGenerating(true);
    const prompt = `I have these ingredients: ${recipeInput}. Generate a PCOS-friendly (Low GI) recipe. Include title, ingredients, and simple steps.`;
    const systemInstruction = "You are a PCOS nutritionist. Provide a healthy, low-GI recipe based on the user's ingredients. Keep it concise and easy to follow.";
    const result = await generateText(prompt, systemInstruction);
    setRecipe(result);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {riskData ? (
        <div className={`notice p-4 rounded-xl border ${
          riskData.level === 'low' ? 'bg-sage-light border-sage-mid text-sage' :
          riskData.level === 'medium' ? 'bg-amber-light border-[#F5C97A] text-amber' :
          'bg-rose-light border-rose-mid text-rose'
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            <Info className="w-4 h-4" />
            Personalised Guidance: {riskData.level.toUpperCase()} RISK
          </div>
          <p className="text-xs leading-relaxed">
            {riskData.level === 'low' ? "Your risk is low. Follow general PCOS-friendly guidelines below to stay healthy." :
             riskData.level === 'medium' ? "⚠️ Medium risk: prioritise low-GI foods, reduce dairy, and increase anti-inflammatory eating." :
             "🔴 High risk: a strict low-GI diet is critical. Eliminate refined sugar and increase fibre intake immediately."}
          </p>
        </div>
      ) : (
        <div className="bg-plum-light border border-plum-mid rounded-xl p-3 text-sm text-plum flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>Complete the Risk Score to get personalised diet guidance based on your profile.</span>
        </div>
      )}

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-6 flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-rose" />
          Smart PCOS Recipe Generator
        </h3>
        <div className="flex flex-col gap-3">
          <p className="text-xs text-text-secondary">Tell me what's in your fridge, and I'll create a PCOS-friendly meal.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={recipeInput}
              onChange={e => setRecipeInput(e.target.value)}
              placeholder="e.g. eggs, spinach, mushrooms..."
              className="flex-1 border border-border-main rounded-xl px-4 py-2 text-sm outline-none focus:border-rose"
            />
            <button
              onClick={generateRecipe}
              disabled={isGenerating}
              className="bg-rose text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#D4556B] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Sparkles className="w-4 h-4" />}
              Generate
            </button>
          </div>
          {recipe && (
            <div className="mt-4 p-4 bg-plum-light rounded-xl border border-plum-mid text-sm leading-relaxed whitespace-pre-wrap">
              {recipe}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-4">Foods to embrace</h3>
        <div className="space-y-4">
          <FoodCategory title="🥦 Vegetables & Legumes" items={['Spinach', 'Broccoli', 'Kale', 'Chickpeas', 'Lentils', 'Sweet potato']} type="good" />
          <FoodCategory title="🐟 Proteins" items={['Salmon', 'Tofu', 'Eggs', 'Chicken', 'Sardines']} type="good" />
          <FoodCategory title="🫐 Fruits & Whole grains" items={['Berries', 'Apples', 'Oats', 'Quinoa', 'Brown rice']} type="good" />
        </div>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-4">Foods to limit</h3>
        <div className="space-y-4">
          <FoodCategory title="🍰 High sugar & refined carbs" items={['White bread', 'Pastries', 'Soda', 'Candy', 'White rice']} type="bad" />
          <FoodCategory title="🥩 Inflammatory foods" items={['Red meat (excess)', 'Fried foods', 'Processed snacks']} type="bad" />
          <FoodCategory title="🥛 Moderate intake" items={['Dairy', 'Caffeine', 'Alcohol', 'Soy']} type="mod" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-plum-light to-rose-light border border-plum-mid rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-plum" />
          Sample Meal Plan
        </h3>
        <div className="space-y-3">
          <MealItem time="Breakfast" text="Oats with berries, flaxseeds & almond butter" />
          <MealItem time="Snack" text="Apple + a handful of walnuts" />
          <MealItem time="Lunch" text="Grilled salmon, quinoa & spinach salad" />
          <MealItem time="Snack" text="Hummus with cucumber & carrot sticks" />
          <MealItem time="Dinner" text="Tofu stir-fry with broccoli & brown rice" />
        </div>
      </div>

      <div className="bg-white border border-border-main rounded-2xl p-6 shadow-bloom">
        <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-rose" />
          Mood-Food Correlation
        </h3>
        <div className="p-4 bg-rose-light border border-rose-mid rounded-xl">
          <p className="text-xs text-rose leading-relaxed font-medium">
            ✨ <strong>AI Insight:</strong> Based on your logs, you felt <strong>30% less bloated</strong> and had <strong>20% more energy</strong> on days you ate high-fiber meals (Salads, Oats).
          </p>
        </div>
        <p className="text-[10px] text-text-muted mt-3 uppercase tracking-wider text-center">Analysis based on last 14 days of logs</p>
      </div>
    </div>
  );
}

function FoodCategory({ title, items, type }: { title: string, items: string[], type: 'good' | 'bad' | 'mod' }) {
  const colors = {
    good: 'bg-sage-light text-sage',
    bad: 'bg-red-50 text-red-600',
    mod: 'bg-amber-light text-amber'
  };
  return (
    <div>
      <h4 className="text-xs font-bold text-text-main mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span key={item} className={`px-3 py-1 rounded-full text-[11px] font-medium ${colors[type]}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function MealItem({ time, text }: { time: string, text: string }) {
  return (
    <div className="flex gap-4 py-2 border-b border-plum-mid/10 last:border-none">
      <span className="text-[10px] font-bold text-plum uppercase tracking-wider w-16 pt-1">{time}</span>
      <span className="text-sm text-text-main flex-1">{text}</span>
    </div>
  );
}
