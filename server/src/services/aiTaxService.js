const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;
const TAX_PLAN_MODEL = "google/flan-t5-large";

export async function generateTaxSavingPlan(income, expenses, deductions) {
  const textInputs = `Generate a tax-saving plan for a user with income: ${income}, business expenses: ${expenses}, deductions: ${deductions}. Include recommendations for pension contributions, investment options, and eligible deductions.`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${TAX_PLAN_MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: textInputs })
    });

    const data = await response.json();
    return data[0].generated_text;
  } catch (error) {
    throw new Error("Failed to generate tax plan");
  }
}