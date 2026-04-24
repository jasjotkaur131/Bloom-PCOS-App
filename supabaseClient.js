// ============================================
// Frontend Integration — supabaseClient.js
// Install: npm install @supabase/supabase-js
// ============================================

import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project values
// Find at: https://supabase.com → Project Settings → API
const SUPABASE_URL = "https://odvnredkdodvxvtirwtg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdm5yZWRrZG9kdnh2dGlyd3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NDg1MDAsImV4cCI6MjA5MjIyNDUwMH0.MCDLSKnghJfk1vDZ-hZpeoIgDEsg9r_XxlzxsedA620";
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/predict-pcos-risk`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Submit PCOS form and get risk prediction ──────────────────────────────────
export async function submitPCOSForm(formData) {
  // Map your HTML form values to API payload
  const payload = {
    age: parseInt(formData.age),
    height_cm: parseFloat(formData.height),
    weight_kg: parseFloat(formData.weight),
    menstrual_cycle_regular: formData.menstrual_regular === "Yes",
    avg_cycle_length_days: formData.cycle_length ? parseInt(formData.cycle_length) : null,

    // Symptoms — true if checked
    symptom_acne: formData.symptoms?.includes("Acne") ?? false,
    symptom_hairfall: formData.symptoms?.includes("Hairfall") ?? false,
    symptom_excess_facial_hair: formData.symptoms?.includes("Excess facial hair") ?? false,
    symptom_weight_gain: formData.symptoms?.includes("Weightgain") ?? false,
    symptom_irregular_period: formData.symptoms?.includes("Irregular period") ?? false,
    symptom_mood_swings: formData.symptoms?.includes("Mood swings") ?? false,

    exercise_frequency: formData.exercise,    // "Daily" | "3-4 times a week" | "Rarely" | "Never"
    sleep_hours: formData.sleep,              // "Less than 5 hours" | "5-7 hours" etc.
    stress_level: parseInt(formData.stress),  // 1–5
    junk_food_frequency: formData.junk_food,  // "Daily" | "Occasionally" | "Rarely"
  };

  // Get auth token if user is logged in (optional)
  const { data: { session } } = await supabase.auth.getSession();
  const headers = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
  };
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Submission failed");
  }

  return await response.json();
  // Returns: { success, submission_id, result: { risk_level, risk_score, bmi, message } }
}

// ── Fetch past submissions for logged-in user ─────────────────────────────────
export async function getUserHistory() {
  const { data, error } = await supabase
    .from("pcos_submissions")
    .select("id, created_at, risk_level, risk_score, bmi, age")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}


// ── Example usage in your form ────────────────────────────────────────────────
/*

document.getElementById("pcos-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    age: e.target.age.value,
    height: e.target.height.value,
    weight: e.target.weight.value,
    menstrual_regular: e.target.menstrual_regular.value,
    cycle_length: e.target.cycle_length.value,
    symptoms: Array.from(e.target.querySelectorAll('input[name="symptoms"]:checked'))
                   .map(el => el.value),
    exercise: e.target.exercise.value,
    sleep: e.target.sleep.value,
    stress: e.target.stress.value,
    junk_food: e.target.junk_food.value,
  };

  try {
    const result = await submitPCOSForm(formData);
    console.log("Risk Level:", result.result.risk_level);   // "Low" | "Moderate" | "High"
    console.log("Message:", result.result.message);
    console.log("BMI:", result.result.bmi);
    // Show result to user on the page
  } catch (err) {
    console.error("Error:", err.message);
  }
});

*/
