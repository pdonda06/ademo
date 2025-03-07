const INCENTIVE_MODEL = "facebook/bart-large-cnn";

export async function fetchGovernmentUpdates() {
  try {
    const response = await fetch(`https://api-government-updates.example.com/tax-incentives`);
    const updates = await response.json();

    // Classify updates using AI
    const classifiedUpdates = await Promise.all(updates.map(async update => {
      const summary = await summarizeUpdate(update.text);
      return { ...update, summary };
    }));

    return classifiedUpdates;
  } catch (error) {
    throw new Error("Failed to fetch government updates");
  }
}

async function summarizeUpdate(text) {
  const prompt = `Summarize this government update: ${text}. Focus on tax implications.`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${INCENTIVE_MODEL}`, {
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
    return "Failed to generate summary";
  }
}