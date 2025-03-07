const PAYROLL_MODEL = "Salesforce/xgen-7b ControllerBase";

export async function recommendSalaryStructure(salary, allowances) {
  const prompt = `Suggest tax-efficient salary structuring for a salary of ${salary} with allowances: ${JSON.stringify(allowances)}. Consider Indian tax laws and eligible deductions.`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${PAYROLL_MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    return data[0].generated_text;
  } catch (error) {
    throw new Error("Failed to generate salary structure");
  }
}