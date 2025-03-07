const CAPITAL_GAINS_MODEL = "microsoft/DialoGPT-medium";

export async function calculateCapitalGains(assetValue, holdingPeriod) {
  const prompt = `Calculate capital gains tax for asset value: ${assetValue}, holding period: ${holdingPeriod} months. Use Indian tax rates.`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${CAPITAL_GAINS_MODEL}`, {
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
    throw new Error("Failed to calculate capital gains");
  }
}