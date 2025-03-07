import { useState } from 'react';
import { Calculator, TrendingUp, PieChart, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TaxAssistant() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');

  const [formData, setFormData] = useState({
    income: '',
    expenses: [],
    investments: {},
    deductions: {}
  });

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      const prompt = `Generate tax optimization recommendations for an individual with:
            - Annual income: ₹${formData.income}
            - Business expenses: ${formData.expenses.join(', ')}
            - Investments: ${Object.keys(formData.investments).join(', ')}
            - Tax deductions: ${Object.keys(formData.deductions).join(', ')}
            Focus on Indian tax laws and provide practical, actionable suggestions.
            Format the response as a list of bullet points, with each point being a separate recommendation.`;

      const response = await fetch('http://localhost:5001/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.candidates && Array.isArray(data.candidates)) {
        const rawText = data.candidates[0]?.content?.parts?.[0]?.text || "";

        // First split by major sections (split by double newlines or section headers)
        const sections = rawText.split(/\n\n+|\*\*[^*]+:\*\*/)
          .map(section => section.trim())
          .filter(section => section.length > 0);

        // Process each section to extract points
        const allPoints = sections.flatMap(section => {
          return section
            .split(/\n/)
            .map(point => point.trim())
            .filter(point => point && !point.startsWith('**') && !point.startsWith('*'))
            .map(point => {
              return point
                .replace(/\*\*/g, '')
                .replace(/\*/g, '')
                .replace(/\[|\]/g, '')
                .replace(/^\s*[-•]\s*/, '')
                .trim();
            })
            .filter(point => {
              const wordCount = point.split(' ').length;
              return wordCount > 10 && !point.endsWith(':'); // Ensure points are substantial
            });
        });

        // If we have less than 3 points, split longer points into multiple
        let recommendations = allPoints;
        if (allPoints.length < 3) {
          recommendations = allPoints.flatMap(point => {
            const sentences = point.split(/\.\s+/);
            return sentences
              .filter(sentence => sentence.split(' ').length > 5)
              .map(sentence => sentence.trim() + '.');
          });
        }

        // Ensure we have at least 3 recommendations
        while (recommendations.length < 3) {
          recommendations.push(
            "Consider consulting with a tax professional for personalized advice.",
            "Review your tax planning strategy quarterly to optimize deductions.",
            "Maintain detailed records of all financial transactions for tax purposes."
          );
        }

        // Take the first 5 recommendations to avoid overwhelming the user
        const finalRecommendations = recommendations.slice(0, 5).map(point => ({
          title: 'Tax Recommendation',
          description: point,
          impact: 'High Priority',
        }));

        setAnalysis({
          currentTax: 'N/A',
          recommendations: finalRecommendations,
        });
      } else {
        console.error("Unexpected Gemini API response:", data);
        toast.error("Unexpected response from Gemini API.");
        setAnalysis({
          currentTax: 'N/A',
          recommendations: [{
            title: "Error",
            description: "The API returned an unexpected response. Please try again later.",
            impact: "Error",
          }]
        })
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Analysis failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Tax Assistant</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Financial Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Annual Income</label>
              <input
                type="number"
                value={formData.income}
                onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expenses</label>
              <input
                type="text"
                value={formData.expenses.join(', ')}
                onChange={(e) => setFormData(prev => ({ ...prev, expenses: e.target.value.split(', ') }))}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Investments</label>
              <input
                type="text"
                value={Object.keys(formData.investments).join(', ')}
                onChange={(e) => setFormData(prev => ({ ...prev, investments: e.target.value.split(', ').reduce((acc, key) => ({ ...acc, [key]: '' }), {}) }))}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deductions</label>
              <input
                type="text"
                value={Object.keys(formData.deductions).join(', ')}
                onChange={(e) => setFormData(prev => ({ ...prev, deductions: e.target.value.split(', ').reduce((acc, key) => ({ ...acc, [key]: '' }), {}) }))}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 w-full bg-primary text-white py-2 rounded-lg"
          >
            {loading ? 'Analyzing...' : 'Analyze Tax Situation'}
          </button>
        </div>

        {/* Results & Recommendations */}
        {analysis && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Tax Analysis</h2>
            <div className="space-y-4">
              {/* <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium">Current Tax Liability</div>
                <div className="text-2xl font-bold">
                  ₹{analysis.currentTax ? analysis.currentTax.toLocaleString() : 'N/A'}
                </div>
              </div> */}
              <div>
              
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-primary mt-1" />
                      <div>
                        {/* <div className="font-medium">{rec.title}</div> */}
                        <div className="text-sm text-gray-600">{rec.description}</div>
                        <div className="text-xs text-gray-500">{rec.impact}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}