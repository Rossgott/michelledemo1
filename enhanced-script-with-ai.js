// Enhanced Data Analysis Dashboard with AI Integration
// This shows how to modify your existing script to include AI analysis

class AIEnhancedDataAnalyzer extends ComprehensiveDataAnalyzer {
    constructor() {
        super();
        // Add AI configuration
        this.aiConfig = {
            provider: 'openai', // or 'azure', 'claude', 'vertex', 'local'
            apiKey: null, // Set via user input or environment
            enabled: false
        };
        this.setupAIConfiguration();
    }

    setupAIConfiguration() {
        // Add AI configuration UI
        this.addAIConfigurationPanel();
    }

    addAIConfigurationPanel() {
        const aiPanel = document.createElement('div');
        aiPanel.className = 'ai-config-panel';
        aiPanel.innerHTML = `
            <div class="ai-config-content">
                <h3>🤖 AI-Powered Analysis</h3>
                <p>Connect to AI engines for advanced insights</p>
                
                <div class="ai-provider-selection">
                    <label>
                        <input type="radio" name="aiProvider" value="openai" checked>
                        OpenAI GPT-4
                    </label>
                    <label>
                        <input type="radio" name="aiProvider" value="azure">
                        Azure OpenAI
                    </label>
                    <label>
                        <input type="radio" name="aiProvider" value="claude">
                        Anthropic Claude
                    </label>
                    <label>
                        <input type="radio" name="aiProvider" value="local">
                        Local AI (Ollama)
                    </label>
                </div>
                
                <div class="ai-api-key">
                    <input type="password" id="aiApiKey" placeholder="Enter API Key (optional for local AI)">
                    <button id="enableAI">Enable AI Analysis</button>
                </div>
                
                <div class="ai-features">
                    <h4>AI Features:</h4>
                    <ul>
                        <li>✨ Natural language insights</li>
                        <li>🔍 Pattern recognition</li>
                        <li>📈 Predictive analysis</li>
                        <li>💡 Business recommendations</li>
                        <li>🎯 Anomaly detection</li>
                    </ul>
                </div>
            </div>
        `;

        // Insert after upload section
        const uploadSection = document.querySelector('.upload-section');
        uploadSection.parentNode.insertBefore(aiPanel, uploadSection.nextSibling);

        // Setup event listeners
        document.getElementById('enableAI').addEventListener('click', () => {
            this.enableAIAnalysis();
        });
    }

    enableAIAnalysis() {
        const apiKey = document.getElementById('aiApiKey').value;
        const provider = document.querySelector('input[name="aiProvider"]:checked').value;
        
        if (provider !== 'local' && !apiKey) {
            alert('Please enter an API key for the selected AI provider');
            return;
        }

        this.aiConfig = {
            provider: provider,
            apiKey: apiKey,
            enabled: true
        };

        document.querySelector('.ai-config-panel').innerHTML = `
            <div class="ai-enabled">
                <h3>🤖 AI Analysis Enabled</h3>
                <p>Provider: ${provider.toUpperCase()}</p>
                <p>Your analysis will now include AI-powered insights!</p>
            </div>
        `;
    }

    // Override the analysis method to include AI
    async performComprehensiveAnalysis() {
        console.log('Starting comprehensive analysis with AI...');
        
        // Step 1: Existing statistical analysis
        this.identifyColumnTypes();
        this.assessDataQuality();
        this.generateExecutiveSummary();
        this.performPerformanceAnalysis();
        this.performDemographicAnalysis();
        this.performTemporalAnalysis();
        this.performStatisticalAnalysis();
        this.performCorrelationAnalysis();

        // Step 2: AI-powered analysis (if enabled)
        if (this.aiConfig.enabled) {
            await this.performAIAnalysis();
        } else {
            // Fallback to rule-based insights
            this.generateAdvancedInsights();
            this.generateRecommendations();
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    async performAIAnalysis() {
        try {
            console.log('Performing AI analysis...');
            
            const aiInsights = await this.callAIProvider();
            
            // Merge AI insights with existing analysis
            this.analysisResults.aiInsights = aiInsights;
            this.enhanceExistingAnalysisWithAI(aiInsights);
            
        } catch (error) {
            console.error('AI Analysis failed, falling back to statistical analysis:', error);
            this.generateAdvancedInsights();
            this.generateRecommendations();
        }
    }

    async callAIProvider() {
        const dataPreview = this.prepareDataForAI();
        
        switch (this.aiConfig.provider) {
            case 'openai':
                return await this.analyzeWithOpenAI(dataPreview);
            case 'azure':
                return await this.analyzeWithAzureOpenAI(dataPreview);
            case 'claude':
                return await this.analyzeWithClaude(dataPreview);
            case 'local':
                return await this.analyzeWithLocalAI(dataPreview);
            default:
                throw new Error('Unsupported AI provider');
        }
    }

    async analyzeWithOpenAI(dataPreview) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.aiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert business analyst. Analyze datasets and provide actionable insights in JSON format."
                    },
                    {
                        role: "user",
                        content: `Analyze this dataset and return insights in JSON format with these sections:
                        
                        {
                            "executiveSummary": "Brief overview of key findings",
                            "keyInsights": ["insight1", "insight2", "insight3"],
                            "patterns": ["pattern1", "pattern2"],
                            "anomalies": ["anomaly1", "anomaly2"],
                            "recommendations": [
                                {"priority": "high", "title": "title", "description": "desc"},
                                {"priority": "medium", "title": "title", "description": "desc"}
                            ],
                            "predictions": ["prediction1", "prediction2"],
                            "businessImpact": "Description of business implications"
                        }
                        
                        Dataset:
                        ${dataPreview}`
                    }
                ],
                max_tokens: 2000,
                temperature: 0.3
            })
        });

        const result = await response.json();
        return JSON.parse(result.choices[0].message.content);
    }

    async analyzeWithLocalAI(dataPreview) {
        // For local AI using Ollama or similar
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama2", // or "mistral", "codellama", etc.
                prompt: `As a data analyst, analyze this dataset and provide insights:
                
                ${dataPreview}
                
                Please provide:
                1. Key findings
                2. Patterns identified
                3. Business recommendations
                4. Potential risks or opportunities
                
                Format as structured analysis.`,
                stream: false
            })
        });

        const result = await response.json();
        return this.parseLocalAIResponse(result.response);
    }

    prepareDataForAI() {
        // Prepare a concise data summary for AI analysis
        const sample = this.data.slice(0, 20); // More samples for better AI analysis
        const summary = this.generateDataSummary();
        
        return `
        Dataset Overview:
        - Total Records: ${this.data.length}
        - Columns: ${this.columns.join(', ')}
        - Numeric Columns: ${this.numericColumns.join(', ')}
        - Categorical Columns: ${this.categoricalColumns.join(', ')}
        - Date Columns: ${this.dateColumns.join(', ')}
        
        Statistical Summary:
        ${JSON.stringify(summary, null, 2)}
        
        Sample Data (First 20 rows):
        ${JSON.stringify(sample, null, 2)}
        `;
    }

    generateDataSummary() {
        const summary = {};
        
        this.numericColumns.forEach(col => {
            const values = this.data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
            if (values.length > 0) {
                summary[col] = {
                    mean: values.reduce((a, b) => a + b, 0) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    total: values.reduce((a, b) => a + b, 0)
                };
            }
        });

        return summary;
    }

    enhanceExistingAnalysisWithAI(aiInsights) {
        // Replace or enhance existing insights with AI-generated ones
        if (aiInsights.recommendations) {
            this.analysisResults.recommendations = aiInsights.recommendations;
        }
        
        if (aiInsights.keyInsights) {
            this.analysisResults.advancedInsights = aiInsights.keyInsights.map(insight => ({
                type: 'ai_insight',
                title: 'AI Insight',
                description: insight
            }));
        }

        // Add AI-specific sections
        this.analysisResults.aiPredictions = aiInsights.predictions || [];
        this.analysisResults.businessImpact = aiInsights.businessImpact || '';
    }

    // Override display methods to show AI insights
    displayAdvancedInsights() {
        const insights = this.analysisResults.advancedInsights || [];
        const aiInsights = this.analysisResults.aiInsights;
        const container = document.getElementById('advancedInsights');
        
        let html = '';
        
        if (aiInsights) {
            html += `
                <div class="ai-insights-section">
                    <h3>🤖 AI-Powered Insights</h3>
                    <div class="ai-executive-summary">
                        <h4>Executive Summary</h4>
                        <p>${aiInsights.executiveSummary}</p>
                    </div>
                    
                    ${aiInsights.keyInsights ? `
                        <div class="ai-key-insights">
                            <h4>Key Insights</h4>
                            <ul>
                                ${aiInsights.keyInsights.map(insight => `<li>${insight}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${aiInsights.patterns ? `
                        <div class="ai-patterns">
                            <h4>Patterns Detected</h4>
                            <ul>
                                ${aiInsights.patterns.map(pattern => `<li>${pattern}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${aiInsights.predictions ? `
                        <div class="ai-predictions">
                            <h4>Predictive Insights</h4>
                            <ul>
                                ${aiInsights.predictions.map(prediction => `<li>${prediction}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Add traditional insights if no AI insights
        if (insights.length > 0) {
            html += insights.map(insight => `
                <div class="insight-item ${insight.type}">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                </div>
            `).join('');
        }
        
        container.innerHTML = html || '<p>No advanced insights generated for this dataset.</p>';
    }

    parseLocalAIResponse(response) {
        // Parse unstructured AI response into structured format
        return {
            executiveSummary: response.substring(0, 200) + '...',
            keyInsights: [
                'AI analysis completed using local model',
                'Insights extracted from natural language processing'
            ],
            recommendations: [
                {
                    priority: 'medium',
                    title: 'Local AI Analysis',
                    description: 'Consider upgrading to cloud-based AI for more detailed insights'
                }
            ]
        };
    }
}

// CSS for AI configuration panel
const aiStyles = `
.ai-config-panel {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    margin: 2rem 0;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.ai-config-content h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.ai-provider-selection {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
}

.ai-provider-selection label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.1);
    border-radius: 0.5rem;
    cursor: pointer;
}

.ai-api-key {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
}

.ai-api-key input {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
}

.ai-api-key button {
    padding: 0.75rem 1.5rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
}

.ai-features ul {
    list-style: none;
    padding: 0;
}

.ai-features li {
    padding: 0.25rem 0;
}

.ai-enabled {
    text-align: center;
    padding: 2rem;
}

.ai-insights-section {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%);
    border: 2px solid #10b981;
    border-radius: 1rem;
    padding: 2rem;
    margin: 2rem 0;
}

.ai-insights-section h3 {
    color: #10b981;
    margin-bottom: 1.5rem;
}

.ai-insights-section h4 {
    color: #059669;
    margin: 1rem 0 0.5rem 0;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = aiStyles;
document.head.appendChild(styleSheet);

// Usage: Replace the original class initialization
// document.addEventListener('DOMContentLoaded', () => {
//     new AIEnhancedDataAnalyzer();
// });
