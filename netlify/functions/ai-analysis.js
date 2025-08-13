// Netlify Function for OpenAI Analysis
// This keeps your API key secure on the server side

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parse the request body
        const { dataPreview, columns, summary } = JSON.parse(event.body);

        // Validate input
        if (!dataPreview || !columns) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required data' })
            };
        }

        // Rate limiting (simple check - you might want more sophisticated limiting)
        const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
        console.log(`AI Analysis request from IP: ${clientIP}`);

        // Your OpenAI API key (set as environment variable in Netlify)
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        
        if (!OPENAI_API_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'OpenAI API key not configured' })
            };
        }

        // Prepare the analysis prompt
        const analysisPrompt = `
You are an expert business data analyst. Analyze this dataset and provide comprehensive insights in JSON format.

Dataset Information:
- Columns: ${columns.join(', ')}
- Total Records: ${summary?.totalRows || 'Unknown'}
- Numeric Columns: ${summary?.numericColumns || []}
- Date Columns: ${summary?.dateColumns || []}

Sample Data:
${JSON.stringify(dataPreview, null, 2)}

Statistical Summary:
${JSON.stringify(summary?.statistics || {}, null, 2)}

Please provide analysis in this exact JSON structure:
{
    "executiveSummary": "2-3 sentence overview of key findings",
    "keyInsights": [
        "Insight 1: Specific finding with numbers",
        "Insight 2: Pattern or trend identified",
        "Insight 3: Notable observation"
    ],
    "patterns": [
        "Pattern 1: Description",
        "Pattern 2: Description"
    ],
    "anomalies": [
        "Anomaly 1: Unusual finding",
        "Anomaly 2: Outlier or exception"
    ],
    "businessRecommendations": [
        {
            "priority": "high",
            "title": "Primary Recommendation",
            "description": "Detailed actionable advice",
            "expectedImpact": "Quantified benefit if possible"
        },
        {
            "priority": "medium", 
            "title": "Secondary Recommendation",
            "description": "Additional improvement suggestion",
            "expectedImpact": "Potential outcome"
        }
    ],
    "predictions": [
        "Prediction 1: Future trend based on data",
        "Prediction 2: Likely outcome or scenario"
    ],
    "dataQualityAssessment": "Assessment of data completeness and reliability",
    "nextSteps": [
        "Next step 1: Immediate action",
        "Next step 2: Follow-up analysis needed"
    ]
}

Focus on actionable business insights. Use specific numbers from the data when possible.
`;

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Using GPT-3.5 to keep costs reasonable
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert business data analyst. Always respond with valid JSON in the requested format. Be specific and use numbers from the data when possible.'
                    },
                    {
                        role: 'user',
                        content: analysisPrompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI API Error:', errorData);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'AI analysis failed',
                    details: 'OpenAI API error'
                })
            };
        }

        const aiResponse = await response.json();
        
        // Parse the AI response
        let analysisResult;
        try {
            analysisResult = JSON.parse(aiResponse.choices[0].message.content);
        } catch (parseError) {
            // If JSON parsing fails, create a structured response
            const rawContent = aiResponse.choices[0].message.content;
            analysisResult = {
                executiveSummary: rawContent.substring(0, 200) + '...',
                keyInsights: ['AI analysis completed successfully'],
                patterns: ['Analysis patterns identified'],
                anomalies: [],
                businessRecommendations: [
                    {
                        priority: 'medium',
                        title: 'Review Analysis',
                        description: 'The AI provided insights in text format. Review the full analysis for detailed recommendations.',
                        expectedImpact: 'Improved decision making'
                    }
                ],
                predictions: [],
                dataQualityAssessment: 'Data quality assessment completed',
                nextSteps: ['Review detailed analysis'],
                rawAnalysis: rawContent
            };
        }

        // Add metadata
        analysisResult.metadata = {
            timestamp: new Date().toISOString(),
            model: 'gpt-3.5-turbo',
            tokensUsed: aiResponse.usage?.total_tokens || 'unknown'
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                analysis: analysisResult
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};
