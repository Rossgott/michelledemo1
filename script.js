// Comprehensive Data Analysis Dashboard JavaScript
// Based on professional marketing analysis format

class ComprehensiveDataAnalyzer {
    constructor() {
        this.data = null;
        this.columns = [];
        this.numericColumns = [];
        this.dateColumns = [];
        this.categoricalColumns = [];
        this.analysisResults = {};
        this.init();
    }

    init() {
        this.setupFileUpload();
        this.setupDragAndDrop();
    }

    setupFileUpload() {
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => this.handleFile(e.target.files[0]));
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    async handleFile(file) {
        if (!file) return;

        this.showFileInfo(file);
        this.showLoading();

        try {
            const text = await this.readFile(file);
            
            if (file.name.endsWith('.csv')) {
                this.data = this.parseCSV(text);
            } else if (file.name.endsWith('.json')) {
                this.data = JSON.parse(text);
            }

            await this.performComprehensiveAnalysis();
            this.showResults();
        } catch (error) {
            console.error('Error processing file:', error);
            this.hideLoading();
            this.showError(`Error processing file: ${error.message}`);
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    parseCSV(text) {
        const lines = text.trim().split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) throw new Error('Empty CSV file');
        
        const headers = this.parseCSVLine(lines[0]);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            try {
                const values = this.parseCSVLine(lines[i]);
                if (values.length !== headers.length) continue;
                
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            } catch (error) {
                continue;
            }
        }

        if (data.length === 0) throw new Error('No valid data rows found');
        return data;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"' && inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    showFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        const fileDetails = document.getElementById('fileDetails');
        
        fileDetails.innerHTML = `
            <p><strong>Name:</strong> ${file.name}</p>
            <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
            <p><strong>Type:</strong> ${file.type || 'Unknown'}</p>
            <p><strong>Last Modified:</strong> ${new Date(file.lastModified).toLocaleString()}</p>
        `;
        
        fileInfo.style.display = 'block';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showLoading() {
        document.getElementById('loadingSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loadingSection').style.display = 'none';
    }

    showError(message) {
        const loadingSection = document.getElementById('loadingSection');
        loadingSection.innerHTML = `
            <div style="color: #ef4444; text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3>Error Processing File</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
        loadingSection.style.display = 'block';
    }

    async performComprehensiveAnalysis() {
        console.log('Starting comprehensive analysis...');
        
        // Step 1: Data profiling and quality assessment
        this.identifyColumnTypes();
        this.assessDataQuality();
        
        // Step 2: Generate executive summary metrics
        this.generateExecutiveSummary();
        
        // Step 3: Perform detailed analyses
        this.performPerformanceAnalysis();
        this.performDemographicAnalysis();
        this.performTemporalAnalysis();
        this.performStatisticalAnalysis();
        this.performCorrelationAnalysis();
        
        // Step 4: Generate insights and recommendations
        this.generateAdvancedInsights();
        this.generateRecommendations();
        
        // Add delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    identifyColumnTypes() {
        if (this.data.length === 0) return;
        
        this.columns = Object.keys(this.data[0]);
        this.numericColumns = [];
        this.dateColumns = [];
        this.categoricalColumns = [];

        this.columns.forEach(col => {
            const sample = this.data.slice(0, Math.min(100, this.data.length))
                .map(row => row[col])
                .filter(val => val != null && val !== '');
            
            // Check if numeric
            const numericCount = sample.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length;
            if (numericCount / sample.length > 0.7) {
                this.numericColumns.push(col);
                return;
            }
            
            // Check if date
            const dateCount = sample.filter(val => {
                const date = new Date(val);
                return !isNaN(date.getTime()) && date.getFullYear() > 1900;
            }).length;
            if (dateCount / sample.length > 0.7) {
                this.dateColumns.push(col);
                return;
            }
            
            // Otherwise categorical
            this.categoricalColumns.push(col);
        });
    }

    assessDataQuality() {
        const totalRows = this.data.length;
        const qualityMetrics = {
            completeness: {},
            uniqueness: {},
            overall: 0
        };

        this.columns.forEach(col => {
            const values = this.data.map(row => row[col]);
            const nonNullValues = values.filter(val => val != null && val !== '');
            const uniqueValues = new Set(nonNullValues);
            
            qualityMetrics.completeness[col] = (nonNullValues.length / totalRows * 100).toFixed(1);
            qualityMetrics.uniqueness[col] = uniqueValues.size;
        });

        // Calculate overall quality score
        const avgCompleteness = Object.values(qualityMetrics.completeness)
            .reduce((sum, val) => sum + parseFloat(val), 0) / this.columns.length;
        
        qualityMetrics.overall = avgCompleteness;
        this.analysisResults.dataQuality = qualityMetrics;
    }

    generateExecutiveSummary() {
        const summary = {
            totalRows: this.data.length,
            totalColumns: this.columns.length,
            numericColumns: this.numericColumns.length,
            dateColumns: this.dateColumns.length,
            categoricalColumns: this.categoricalColumns.length,
            dataQualityScore: this.analysisResults.dataQuality.overall,
            keyMetrics: []
        };

        // Calculate key business metrics if applicable
        if (this.hasColumns(['impressions', 'clicks', 'spent'])) {
            const totalImpressions = this.sumColumn('impressions');
            const totalClicks = this.sumColumn('clicks');
            const totalSpent = this.sumColumn('spent');
            const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;

            summary.keyMetrics = [
                { label: 'Total Impressions', value: totalImpressions.toLocaleString(), type: 'count' },
                { label: 'Total Clicks', value: totalClicks.toLocaleString(), type: 'count' },
                { label: 'Total Spend', value: `$${totalSpent.toLocaleString()}`, type: 'currency' },
                { label: 'Overall CTR', value: `${ctr.toFixed(3)}%`, type: 'percentage' }
            ];
        } else {
            // Generic metrics for any dataset
            const topNumericCols = this.numericColumns.slice(0, 4);
            summary.keyMetrics = topNumericCols.map(col => ({
                label: this.formatColumnName(col),
                value: this.sumColumn(col).toLocaleString(),
                type: 'count'
            }));
        }

        this.analysisResults.executiveSummary = summary;
    }

    performPerformanceAnalysis() {
        const performance = {
            topPerformers: [],
            trends: [],
            efficiency: {},
            insights: []
        };

        // Identify top performers based on key metrics
        if (this.numericColumns.length > 0) {
            const primaryMetric = this.numericColumns[0];
            const sorted = [...this.data].sort((a, b) => 
                parseFloat(b[primaryMetric]) - parseFloat(a[primaryMetric])
            );
            performance.topPerformers = sorted.slice(0, 10);
        }

        // Calculate efficiency metrics
        if (this.hasColumns(['spent', 'clicks']) || this.hasColumns(['cost', 'revenue'])) {
            performance.efficiency = this.calculateEfficiencyMetrics();
        }

        this.analysisResults.performance = performance;
    }

    performDemographicAnalysis() {
        const demographics = {
            segments: {},
            performance: {},
            insights: []
        };

        // Look for demographic columns
        const demoColumns = this.categoricalColumns.filter(col => 
            ['age', 'gender', 'location', 'segment', 'category', 'type'].some(demo => 
                col.toLowerCase().includes(demo)
            )
        );

        demoColumns.forEach(col => {
            const segments = this.groupBy(col);
            demographics.segments[col] = segments;
            
            if (this.numericColumns.length > 0) {
                demographics.performance[col] = this.calculateSegmentPerformance(col, segments);
            }
        });

        this.analysisResults.demographics = demographics;
    }

    performTemporalAnalysis() {
        const temporal = {
            trends: {},
            seasonality: {},
            insights: []
        };

        if (this.dateColumns.length > 0) {
            const dateCol = this.dateColumns[0];
            const timeSeriesData = this.createTimeSeriesData(dateCol);
            
            temporal.trends = this.calculateTrends(timeSeriesData);
        }

        this.analysisResults.temporal = temporal;
    }

    performStatisticalAnalysis() {
        const statistical = {
            distributions: {},
            outliers: {},
            insights: []
        };

        this.numericColumns.forEach(col => {
            const values = this.data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
            statistical.distributions[col] = this.calculateDistributionStats(values);
            statistical.outliers[col] = this.detectOutliers(values);
        });

        this.analysisResults.statistical = statistical;
    }

    performCorrelationAnalysis() {
        const correlations = {
            significant: [],
            insights: []
        };

        if (this.numericColumns.length >= 2) {
            for (let i = 0; i < this.numericColumns.length; i++) {
                for (let j = i + 1; j < this.numericColumns.length; j++) {
                    const col1 = this.numericColumns[i];
                    const col2 = this.numericColumns[j];
                    const correlation = this.calculateCorrelation(col1, col2);
                    
                    if (Math.abs(correlation) > 0.3) {
                        correlations.significant.push({
                            column1: col1,
                            column2: col2,
                            correlation: correlation,
                            strength: this.getCorrelationStrength(correlation)
                        });
                    }
                }
            }
        }

        this.analysisResults.correlations = correlations;
    }

    generateAdvancedInsights() {
        const insights = [];

        // Data quality insights
        const avgQuality = this.analysisResults.dataQuality.overall;
        if (avgQuality < 80) {
            insights.push({
                type: 'warning',
                title: 'Data Quality Concern',
                description: `Average data completeness is ${avgQuality.toFixed(1)}%. Consider data cleaning to improve analysis accuracy.`
            });
        }

        // Performance insights
        if (this.analysisResults.performance.efficiency) {
            const efficiency = this.analysisResults.performance.efficiency;
            if (efficiency.roi && efficiency.roi < 1) {
                insights.push({
                    type: 'opportunity',
                    title: 'ROI Optimization Opportunity',
                    description: `Current ROI is ${efficiency.roi.toFixed(2)}. Focus on high-performing segments to improve returns.`
                });
            }
        }

        // Correlation insights
        const strongCorrelations = this.analysisResults.correlations.significant.filter(c => 
            Math.abs(c.correlation) > 0.7
        );
        if (strongCorrelations.length > 0) {
            insights.push({
                type: 'insight',
                title: 'Strong Correlations Detected',
                description: `Found ${strongCorrelations.length} strong correlations that could indicate causal relationships.`
            });
        }

        this.analysisResults.advancedInsights = insights;
    }

    generateRecommendations() {
        const recommendations = [];

        // Data-driven recommendations based on analysis
        if (this.analysisResults.demographics.performance) {
            const bestSegments = this.findBestPerformingSegments();
            if (bestSegments.length > 0) {
                recommendations.push({
                    priority: 'high',
                    title: 'Focus on High-Performing Segments',
                    description: `Allocate more resources to ${bestSegments.join(', ')} segments which show superior performance metrics.`
                });
            }
        }

        if (this.analysisResults.temporal.trends) {
            const trends = this.analysisResults.temporal.trends;
            if (trends.direction === 'declining') {
                recommendations.push({
                    priority: 'high',
                    title: 'Address Declining Trend',
                    description: 'Implement strategies to reverse the declining performance trend identified in the temporal analysis.'
                });
            }
        }

        // Quality recommendations
        const lowQualityColumns = Object.entries(this.analysisResults.dataQuality.completeness)
            .filter(([col, quality]) => parseFloat(quality) < 70)
            .map(([col, quality]) => col);

        if (lowQualityColumns.length > 0) {
            recommendations.push({
                priority: 'medium',
                title: 'Improve Data Collection',
                description: `Improve data collection for ${lowQualityColumns.join(', ')} to enhance analysis accuracy.`
            });
        }

        this.analysisResults.recommendations = recommendations;
    }

    // Helper methods
    hasColumns(requiredColumns) {
        return requiredColumns.every(col => 
            this.columns.some(existingCol => 
                existingCol.toLowerCase() === col.toLowerCase()
            )
        );
    }

    sumColumn(columnName) {
        return this.data.reduce((sum, row) => {
            const value = parseFloat(row[columnName]);
            return sum + (isNaN(value) ? 0 : value);
        }, 0);
    }

    formatColumnName(col) {
        return col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    groupBy(column) {
        const groups = {};
        this.data.forEach(row => {
            const key = row[column];
            if (!groups[key]) groups[key] = [];
            groups[key].push(row);
        });
        return groups;
    }

    calculateCorrelation(col1, col2) {
        const pairs = this.data.map(row => ({
            x: parseFloat(row[col1]),
            y: parseFloat(row[col2])
        })).filter(pair => !isNaN(pair.x) && !isNaN(pair.y));

        if (pairs.length < 2) return 0;

        const n = pairs.length;
        const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
        const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
        const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
        const sumXX = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);
        const sumYY = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }

    getCorrelationStrength(correlation) {
        const abs = Math.abs(correlation);
        if (abs >= 0.8) return 'Very Strong';
        if (abs >= 0.6) return 'Strong';
        if (abs >= 0.4) return 'Moderate';
        if (abs >= 0.2) return 'Weak';
        return 'Very Weak';
    }

    calculateDistributionStats(values) {
        if (values.length === 0) return null;

        const sorted = [...values].sort((a, b) => a - b);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const median = sorted.length % 2 === 0 
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];
        
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const std = Math.sqrt(variance);
        const skewness = std === 0 ? 0 : values.reduce((sum, val) => sum + Math.pow((val - mean) / std, 3), 0) / values.length;

        return {
            mean: mean,
            median: median,
            std: std,
            skewness: skewness,
            min: Math.min(...values),
            max: Math.max(...values),
            q1: sorted[Math.floor(sorted.length * 0.25)],
            q3: sorted[Math.floor(sorted.length * 0.75)]
        };
    }

    detectOutliers(values) {
        const stats = this.calculateDistributionStats(values);
        if (!stats) return [];

        const iqr = stats.q3 - stats.q1;
        const lowerBound = stats.q1 - 1.5 * iqr;
        const upperBound = stats.q3 + 1.5 * iqr;

        return values.filter(val => val < lowerBound || val > upperBound);
    }

    calculateEfficiencyMetrics() {
        const efficiency = {};
        
        if (this.hasColumns(['spent', 'clicks'])) {
            const totalSpent = this.sumColumn('spent');
            const totalClicks = this.sumColumn('clicks');
            efficiency.cpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
        }

        if (this.hasColumns(['spent', 'approved_conversion'])) {
            const totalSpent = this.sumColumn('spent');
            const totalConversions = this.sumColumn('approved_conversion');
            efficiency.costPerConversion = totalConversions > 0 ? totalSpent / totalConversions : 0;
            efficiency.roi = totalSpent > 0 ? totalConversions / totalSpent : 0;
        }

        return efficiency;
    }

    calculateSegmentPerformance(column, segments) {
        const performance = {};
        
        Object.keys(segments).forEach(segment => {
            const segmentData = segments[segment];
            const metrics = {};
            
            this.numericColumns.forEach(numCol => {
                const values = segmentData.map(row => parseFloat(row[numCol])).filter(v => !isNaN(v));
                metrics[numCol] = {
                    sum: values.reduce((a, b) => a + b, 0),
                    avg: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
                    count: values.length
                };
            });
            
            performance[segment] = metrics;
        });
        
        return performance;
    }

    findBestPerformingSegments() {
        const bestSegments = [];
        
        if (this.analysisResults.demographics.performance) {
            Object.entries(this.analysisResults.demographics.performance).forEach(([column, segments]) => {
                const primaryMetric = this.numericColumns[0];
                if (primaryMetric && segments) {
                    const sortedSegments = Object.entries(segments)
                        .sort(([,a], [,b]) => (b[primaryMetric]?.avg || 0) - (a[primaryMetric]?.avg || 0));
                    
                    if (sortedSegments.length > 0) {
                        bestSegments.push(`${column}: ${sortedSegments[0][0]}`);
                    }
                }
            });
        }
        
        return bestSegments;
    }

    createTimeSeriesData(dateColumn) {
        const timeSeriesData = this.data.map(row => ({
            date: new Date(row[dateColumn]),
            ...this.numericColumns.reduce((acc, col) => {
                acc[col] = parseFloat(row[col]) || 0;
                return acc;
            }, {})
        })).filter(item => !isNaN(item.date.getTime()))
          .sort((a, b) => a.date - b.date);

        return timeSeriesData;
    }

    calculateTrends(timeSeriesData) {
        if (timeSeriesData.length < 2) return { direction: 'insufficient_data' };

        const primaryMetric = this.numericColumns[0];
        if (!primaryMetric) return { direction: 'no_numeric_data' };

        const values = timeSeriesData.map((item, index) => ({
            x: index,
            y: item[primaryMetric]
        }));

        // Simple linear regression
        const n = values.length;
        const sumX = values.reduce((sum, point) => sum + point.x, 0);
        const sumY = values.reduce((sum, point) => sum + point.y, 0);
        const sumXY = values.reduce((sum, point) => sum + point.x * point.y, 0);
        const sumXX = values.reduce((sum, point) => sum + point.x * point.x, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const direction = slope > 0.001 ? 'increasing' : slope < -0.001 ? 'declining' : 'stable';

        return { direction, slope, metric: primaryMetric };
    }

    showResults() {
        this.hideLoading();
        
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');

        this.displayExecutiveSummary();
        this.displayDataOverview();
        this.displayPerformanceAnalysis();
        this.displayDemographicAnalysis();
        this.displayTemporalAnalysis();
        this.displayStatisticalAnalysis();
        this.displayCorrelationAnalysis();
        this.displayAdvancedInsights();
        this.displayRecommendations();
        this.displayDetailedTables();
    }

    displayExecutiveSummary() {
        const summary = this.analysisResults.executiveSummary;
        const container = document.getElementById('executiveSummary');
        
        const metricsHtml = summary.keyMetrics.map(metric => `
            <div class="metric-card">
                <h3>${metric.value}</h3>
                <p>${metric.label}</p>
            </div>
        `).join('');
        
        container.innerHTML = metricsHtml;

        // Key findings
        const keyFindings = document.getElementById('keyFindings');
        keyFindings.innerHTML = `
            <div class="key-findings">
                <h4>📊 Key Findings</h4>
                <ul>
                    <li>Dataset contains ${summary.totalRows.toLocaleString()} records across ${summary.totalColumns} variables</li>
                    <li>Data quality score: ${summary.dataQualityScore.toFixed(1)}%</li>
                    <li>Identified ${summary.numericColumns} numeric metrics for analysis</li>
                    <li>${summary.dateColumns > 0 ? 'Time-based analysis available' : 'Static dataset analysis'}</li>
                </ul>
            </div>
        `;
    }

    displayDataOverview() {
        const overview = document.getElementById('dataOverview');
        const quality = document.getElementById('dataQuality');
        
        overview.innerHTML = `
            <div class="data-stats">
                <div class="stat-item">
                    <div class="stat-value">${this.data.length.toLocaleString()}</div>
                    <div class="stat-label">Total Records</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.columns.length}</div>
                    <div class="stat-label">Total Columns</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.numericColumns.length}</div>
                    <div class="stat-label">Numeric Columns</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.categoricalColumns.length}</div>
                    <div class="stat-label">Categorical Columns</div>
                </div>
            </div>
            <div style="margin-top: 1.5rem;">
                <h4>Column Details:</h4>
                <p><strong>Numeric:</strong> ${this.numericColumns.join(', ') || 'None'}</p>
                <p><strong>Categorical:</strong> ${this.categoricalColumns.join(', ') || 'None'}</p>
                <p><strong>Date/Time:</strong> ${this.dateColumns.join(', ') || 'None'}</p>
            </div>
        `;

        // Data quality assessment
        const qualityMetrics = this.analysisResults.dataQuality;
        const qualityHtml = Object.entries(qualityMetrics.completeness)
            .map(([col, completeness]) => `
                <tr>
                    <td>${col}</td>
                    <td>${completeness}%</td>
                    <td>${qualityMetrics.uniqueness[col]}</td>
                    <td><span class="performance-indicator ${parseFloat(completeness) > 90 ? 'performance-high' : parseFloat(completeness) > 70 ? 'performance-medium' : 'performance-low'}">${parseFloat(completeness) > 90 ? 'Good' : parseFloat(completeness) > 70 ? 'Fair' : 'Poor'}</span></td>
                </tr>
            `).join('');

        quality.innerHTML = `
            <h4>Data Quality Assessment</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Column</th>
                        <th>Completeness</th>
                        <th>Unique Values</th>
                        <th>Quality</th>
                    </tr>
                </thead>
                <tbody>
                    ${qualityHtml}
                </tbody>
            </table>
        `;
    }

    displayPerformanceAnalysis() {
        const insights = document.getElementById('performanceInsights');
        
        // Create performance chart
        this.createPerformanceChart();
        
        // Display insights
        const performance = this.analysisResults.performance;
        let insightsHtml = '<ul class="insights-list">';
        
        if (performance.efficiency.cpc) {
            insightsHtml += `<li><strong>Cost Efficiency:</strong> Average cost per click is $${performance.efficiency.cpc.toFixed(3)}</li>`;
        }
        
        if (performance.efficiency.roi) {
            insightsHtml += `<li><strong>ROI Analysis:</strong> Current return on investment is ${performance.efficiency.roi.toFixed(2)}x</li>`;
        }
        
        if (performance.topPerformers.length > 0) {
            insightsHtml += `<li><strong>Top Performers:</strong> Identified ${performance.topPerformers.length} high-performing records for optimization</li>`;
        }
        
        insightsHtml += '</ul>';
        insights.innerHTML = insightsHtml;
    }

    displayDemographicAnalysis() {
        const demographics = this.analysisResults.demographics;
        
        if (Object.keys(demographics.segments).length === 0) {
            document.getElementById('demographicCard').style.display = 'none';
            return;
        }
        
        document.getElementById('demographicCard').style.display = 'block';
        
        const insights = document.getElementById('demographicInsights');
        let insightsHtml = '<ul class="insights-list">';
        
        Object.entries(demographics.segments).forEach(([column, segments]) => {
            const segmentCount = Object.keys(segments).length;
            insightsHtml += `<li><strong>${this.formatColumnName(column)} Segments:</strong> Found ${segmentCount} distinct segments</li>`;
        });
        
        insightsHtml += '</ul>';
        insights.innerHTML = insightsHtml;
        
        this.createDemographicChart();
    }

    displayTemporalAnalysis() {
        const temporal = this.analysisResults.temporal;
        
        if (this.dateColumns.length === 0) {
            document.getElementById('timeSeriesCard').style.display = 'none';
            return;
        }
        
        document.getElementById('timeSeriesCard').style.display = 'block';
        
        const insights = document.getElementById('timeSeriesInsights');
        let insightsHtml = '<ul class="insights-list">';
        
        if (temporal.trends.direction) {
            insightsHtml += `<li><strong>Trend Analysis:</strong> Data shows ${temporal.trends.direction} trend over time</li>`;
        }
        
        insightsHtml += '</ul>';
        insights.innerHTML = insightsHtml;
        
        this.createTimeSeriesChart();
    }

    displayStatisticalAnalysis() {
        const statistical = this.analysisResults.statistical;
        const insights = document.getElementById('statisticalInsights');
        
        let insightsHtml = '<ul class="insights-list">';
        
        Object.entries(statistical.distributions).forEach(([col, stats]) => {
            if (stats) {
                const skewnessDesc = Math.abs(stats.skewness) > 1 ? 
                    (stats.skewness > 0 ? 'right-skewed' : 'left-skewed') : 'normally distributed';
                insightsHtml += `<li><strong>${this.formatColumnName(col)}:</strong> Mean ${stats.mean.toFixed(2)}, ${skewnessDesc} distribution</li>`;
            }
        });
        
        insightsHtml += '</ul>';
        insights.innerHTML = insightsHtml;
        
        this.createDistributionChart();
    }

    displayCorrelationAnalysis() {
        const correlations = this.analysisResults.correlations;
        const insights = document.getElementById('correlationInsights');
        
        let insightsHtml = '<ul class="insights-list">';
        
        correlations.significant.forEach(corr => {
            const direction = corr.correlation > 0 ? 'positive' : 'negative';
            insightsHtml += `<li><strong>${this.formatColumnName(corr.column1)} vs ${this.formatColumnName(corr.column2)}:</strong> ${corr.strength} ${direction} correlation (${corr.correlation.toFixed(3)})</li>`;
        });
        
        if (correlations.significant.length === 0) {
            insightsHtml += '<li>No significant correlations found between numeric variables</li>';
        }
        
        insightsHtml += '</ul>';
        insights.innerHTML = insightsHtml;
        
        this.createCorrelationChart();
    }

    displayAdvancedInsights() {
        const insights = this.analysisResults.advancedInsights;
        const container = document.getElementById('advancedInsights');
        
        const insightsHtml = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        `).join('');
        
        container.innerHTML = insightsHtml || '<p>No advanced insights generated for this dataset.</p>';
    }

    displayRecommendations() {
        const recommendations = this.analysisResults.recommendations;
        const container = document.getElementById('recommendations');
        
        container.innerHTML = `
            <ul class="recommendations-list">
                ${recommendations.map(rec => `<li>${rec.description}</li>`).join('')}
            </ul>
        ` || '<p>No specific recommendations generated for this dataset.</p>';
    }

    displayDetailedTables() {
        const container = document.getElementById('detailedTables');
        
        // Show sample of data
        const sampleSize = Math.min(10, this.data.length);
        const sampleData = this.data.slice(0, sampleSize);
        
        const headers = this.columns.map(col => `<th>${col}</th>`).join('');
        const rows = sampleData.map(row => 
            `<tr>${this.columns.map(col => `<td>${row[col]}</td>`).join('')}</tr>`
        ).join('');
        
        container.innerHTML = `
            <h4>Sample Data (First ${sampleSize} Records)</h4>
            <table class="data-table">
                <thead>
                    <tr>${headers}</tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }

    // Chart creation methods
    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        if (this.numericColumns.length === 0) {
            ctx.fillText('No numeric data available for performance analysis', 10, 50);
            return;
        }

        const primaryMetric = this.numericColumns[0];
        const values = this.data.map(row => parseFloat(row[primaryMetric])).filter(v => !isNaN(v));
        
        // Create histogram
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binCount = Math.min(20, Math.ceil(Math.sqrt(values.length)));
        const binWidth = (max - min) / binCount;
        
        const bins = Array(binCount).fill(0);
        const binLabels = [];
        
        for (let i = 0; i < binCount; i++) {
            const binStart = min + i * binWidth;
            const binEnd = min + (i + 1) * binWidth;
            binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
        }
        
        values.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
            bins[binIndex]++;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: binLabels,
                datasets: [{
                    label: 'Frequency',
                    data: bins,
                    backgroundColor: '#6366f1',
                    borderColor: '#4f46e5',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${this.formatColumnName(primaryMetric)} Distribution`
                    }
                }
            }
        });
    }

    createDemographicChart() {
        const ctx = document.getElementById('demographicChart').getContext('2d');
        const demographics = this.analysisResults.demographics;
        
        if (Object.keys(demographics.segments).length === 0) {
            ctx.fillText('No demographic data available', 10, 50);
            return;
        }

        const firstDemographic = Object.keys(demographics.segments)[0];
        const segments = demographics.segments[firstDemographic];
        
        const labels = Object.keys(segments);
        const data = labels.map(label => segments[label].length);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', 
                        '#f59e0b', '#ef4444', '#84cc16', '#f97316'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${this.formatColumnName(firstDemographic)} Distribution`
                    }
                }
            }
        });
    }

    createTimeSeriesChart() {
        const ctx = document.getElementById('timeSeriesChart').getContext('2d');
        
        if (this.dateColumns.length === 0 || this.numericColumns.length === 0) {
            ctx.fillText('No time series data available', 10, 50);
            return;
        }

        const dateCol = this.dateColumns[0];
        const valueCol = this.numericColumns[0];
        
        const timeSeriesData = this.data.map(row => ({
            x: new Date(row[dateCol]),
            y: parseFloat(row[valueCol])
        })).filter(point => !isNaN(point.y) && !isNaN(point.x.getTime()))
          .sort((a, b) => a.x - b.x);

        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: this.formatColumnName(valueCol),
                    data: timeSeriesData,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            displayFormats: {
                                hour: 'MMM dd HH:mm',
                                day: 'MMM dd',
                                week: 'MMM dd',
                                month: 'MMM yyyy'
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `${this.formatColumnName(valueCol)} Over Time`
                    }
                }
            }
        });
    }

    createDistributionChart() {
        const ctx = document.getElementById('distributionChart').getContext('2d');
        
        if (this.numericColumns.length === 0) {
            ctx.fillText('No numeric data available', 10, 50);
            return;
        }

        // Use the same logic as performance chart for consistency
        this.createPerformanceChart();
    }

    createCorrelationChart() {
        const ctx = document.getElementById('correlationChart').getContext('2d');
        const correlations = this.analysisResults.correlations.significant;
        
        if (correlations.length === 0) {
            ctx.fillText('No significant correlations found', 10, 50);
            return;
        }

        const topCorrelations = correlations.slice(0, 10);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topCorrelations.map(corr => `${corr.column1} vs ${corr.column2}`),
                datasets: [{
                    label: 'Correlation Coefficient',
                    data: topCorrelations.map(corr => corr.correlation),
                    backgroundColor: topCorrelations.map(corr => 
                        corr.correlation > 0 ? '#10b981' : '#ef4444'
                    )
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: -1,
                        max: 1
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Significant Correlations'
                    }
                }
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ComprehensiveDataAnalyzer();
});
