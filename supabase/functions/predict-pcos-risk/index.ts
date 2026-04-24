import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function calculateRisk(data) {
  let score = 0;
  if (!data.menstrual_cycle_regular) score += 2;
  if (data.avg_cycle_length_days < 21 || data.avg_cycle_length_days > 35) score += 1;
  if (data.symptom_acne) score += 1;
  if (data.symptom_hairfall) score += 1;
  if (data.symptom_excess_facial_hair) score += 2;
  if (data.symptom_weight_gain) score += 1;
  if (data.symptom_irregular_period) score += 2;
  if (data.symptom_mood_swings) score += 1;
  const bmi = data.weight_kg / Math.pow(data.height_cm / 100, 2);
  if (bmi > 27) score += 2;
  if (data.stress_level >= 4) score += 1;
  if (["Rarely", "Never"].includes(data.exercise_frequency)) score += 1;
  if (["Less than 5 hours", "More than 9 hours"].includes(data.sleep_hours)) score += 1;
  if (data.junk_food_frequency === "Daily") score += 1;
  let risk_level;
  if (score >= 9) risk_level = "High";
  else if (score >= 5) risk_level = "Moderate";
  else risk_level = "Low";
  return { score, risk_level, bmi: parseFloat(bmi.toFixed(1)) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const body = await req.json();
    const required = ["age", "height_cm", "weight_kg", "menstrual_cycle_regular",
      "exercise_frequency", "sleep_hours", "stress_level", "junk_food_frequency"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    const { score, risk_level, bmi } = calculateRisk(body);
    const authHeader = req.headers.get("Authorization");
    let user_id = null;
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(
        authHeader.replace("Bearer ", "")
      );
      user_id = user?.id ?? null;
    }
    const { data, error } = await supabase
      .from("pcos_submissions")
      .insert({
        user_id,
        age: body.age,
        height_cm: body.height_cm,
        weight_kg: body.weight_kg,
        menstrual_cycle_regular: body.menstrual_cycle_regular,
        avg_cycle_length_days: body.avg_cycle_length_days ?? null,
        symptom_acne: body.symptom_acne ?? false,
        symptom_hairfall: body.symptom_hairfall ?? false,
        symptom_excess_facial_hair: body.symptom_excess_facial_hair ?? false,
        symptom_weight_gain: body.symptom_weight_gain ?? false,
        symptom_irregular_period: body.symptom_irregular_period ?? false,
        symptom_mood_swings: body.symptom_mood_swings ?? false,
        exercise_frequency: body.exercise_frequency,
        sleep_hours: body.sleep_hours,
        stress_level: body.stress_level,
        junk_food_frequency: body.junk_food_frequency,
        risk_score: score,
        risk_level,
      })
      .select()
      .single();
    if (error) throw error;
    return new Response(
      JSON.stringify({
        success: true,
        submission_id: data.id,
        result: {
          risk_level,
          risk_score: score,
          bmi,
          message: risk_level === "High"
            ? "Your responses suggest a high risk of PCOS. We strongly recommend consulting a doctor."
            : risk_level === "Moderate"
            ? "Your responses suggest a moderate risk of PCOS. Consider consulting a gynecologist."
            : "Your responses suggest a low risk of PCOS. Maintain a healthy lifestyle.",
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});