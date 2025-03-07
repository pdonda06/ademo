const STRUCTURE_MODEL = "google/flan-t5-xxl";

export async function recommendBusinessStructure(revenue, industry) {
  const prompt = `Recommend optimal business structure (LLP/Pvt Ltd) for revenue: ${revenue}, industry: ${industry}. Consider Indian tax laws and compliance requirements.`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${STRUCTURE_MODEL}`, {
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
    throw new Error("Failed to generate structure recommendation");
  }
}