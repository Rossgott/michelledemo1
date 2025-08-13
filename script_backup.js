// Data Analysis Dashboard JavaScript

class DataAnalyzer {
    constructor() {
        this.data = null;
        this.columns = [];
        this.numericColumns = [];
        this.dateColumns = [];
        this.themes = [];
        this.correlations = [];
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

        // Show file info
        this.showFileInfo(file);
        
        // Show loading
        this.showLoading();

        try {
            const text = await this.readFile(file);
            
            if (file.name.endsWith('.csv')) {
                this.data = this.parseCSV(text);
            } else if (file.name.endsWith('.json')) {
                this.data = JSON.parse(text);
            }

            // Analyze the data
            await this.analyzeData();
            
            // Show results
            this.showResults();
        } catch (error) {
            console.error('Error processing file:', error);
            this.hideLoading();
            this.showError(`Error processing file: ${error.message}. Please check the file format and try again.`);
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
                if (values.length !== headers.length) {
                    console.warn(`Line ${i + 1} has ${values.length} values but expected ${headers.length}`);
                    continue;
                }
                
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            } catch (error) {
                console.warn(`Error parsing line ${i + 1}: ${error.message}`);
                continue;
            }
        }

        if (data.length === 0) throw new Error('No valid data rows found in CSV');
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
                i++; // Skip next quote
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

    async analyzeData() {
        if (!this.data || this.data.length === 0) {
            throw new Error('No data to analyze');
        }

        console.log('Analyzing data:', this.data.length, 'rows');
        console.log('Sample row:', this.data[0]);

        // Identify column types
        this.identifyColumnTypes();
        console.log('Columns identified - Numeric:', this.numericColumns, 'Date:', this.dateColumns);
        
        // Find themes
        this.findThemes();
        console.log('Themes found:', this.themes.length);
        
        // Calculate correlations
        this.calculateCorrelations();
        console.log('Correlations found:', this.correlations.length);
        
        // Add small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    identifyColumnTypes() {
        if (this.data.length === 0) return;
        
        this.columns = Object.keys(this.data[0]);
        this.numericColumns = [];
        this.dateColumns = [];

        this.columns.forEach(col => {
            const sample = this.data.slice(0, 10).map(row => row[col]).filter(val => val != null && val !== '');
            
            // Check if numeric
            const numericCount = sample.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length;
            if (numericCount / sample.length > 0.8) {
                this.numericColumns.push(col);
            }
            
            // Check if date
            const dateCount = sample.filter(val => {
                const date = new Date(val);
                return !isNaN(date.getTime()) && date.getFullYear() > 1900;
            }).length;
            if (dateCount / sample.length > 0.8 && (col.toLowerCase().includes('time') || col.toLowerCase().includes('date'))) {
                this.dateColumns.push(col);
            }
        });
    }

    findThemes() {
        this.themes = [];
        
        // Financial data themes
        if (this.hasColumns(['open', 'high', 'low', 'close'])) {
            this.themes.push({
                name: 'Financial Market Data',
                description: 'OHLC (Open, High, Low, Close) price data typical of stock market or trading data',
                confidence: 0.95,
                indicators: ['open', 'high', 'low', 'close'],
                type: 'financial'
            });
        }
        
        if (this.hasColumns(['volume'])) {
            this.themes.push({
                name: 'Trading Volume Analysis',
                description: 'Volume data indicating trading activity and market liquidity',
                confidence: 0.9,
                indicators: ['volume'],
                type: 'financial'
            });
        }

        // Time series themes
        if (this.dateColumns.length > 0) {
            this.themes.push({
                name: 'Time Series Data',
                description: 'Data with temporal components allowing for trend analysis over time',
                confidence: 0.85,
                indicators: this.dateColumns,
                type: 'temporal'
            });
        }

        // Volatility theme
        if (this.hasColumns(['high', 'low'])) {
            const volatilities = this.calculateVolatility();
            const avgVolatility = volatilities.reduce((a, b) => a + b, 0) / volatilities.length;
            
            this.themes.push({
                name: 'Price Volatility Patterns',
                description: `Price volatility analysis shows average volatility of ${avgVolatility.toFixed(4)}`,
                confidence: 0.8,
                indicators: ['high', 'low'],
                type: 'statistical',
                metrics: { avgVolatility }
            });
        }

        // Trend themes
        if (this.hasColumns(['close']) && this.data.length > 10) {
            const trend = this.calculateTrend('close');
            this.themes.push({
                name: `Price Trend: ${trend.direction}`,
                description: `Overall price trend showing ${trend.direction} movement with slope of ${trend.slope.toFixed(6)}`,
                confidence: Math.abs(trend.slope) > 0.001 ? 0.8 : 0.5,
                indicators: ['close'],
                type: 'trend',
                metrics: trend
            });
        }

        // Distribution themes
        this.numericColumns.forEach(col => {
            const stats = this.calculateStats(col);
            if (stats.skewness !== null) {
                let distributionType = 'Normal';
                if (Math.abs(stats.skewness) > 1) {
                    distributionType = stats.skewness > 0 ? 'Right-skewed' : 'Left-skewed';
                }
                
                this.themes.push({
                    name: `${col} Distribution: ${distributionType}`,
                    description: `Statistical distribution of ${col} showing ${distributionType.toLowerCase()} characteristics`,
                    confidence: 0.7,
                    indicators: [col],
                    type: 'distribution',
                    metrics: stats
                });
            }
        });
    }

    calculateVolatility() {
        if (!this.hasColumns(['high', 'low'])) return [];
        
        return this.data.map(row => {
            const high = parseFloat(row.high);
            const low = parseFloat(row.low);
            return (high - low) / low;
        }).filter(v => !isNaN(v));
    }

    calculateTrend(column) {
        const values = this.data.map((row, index) => ({
            x: index,
            y: parseFloat(row[column])
        })).filter(point => !isNaN(point.y));

        if (values.length < 2) return { direction: 'Insufficient Data', slope: 0 };

        // Simple linear regression
        const n = values.length;
        const sumX = values.reduce((sum, point) => sum + point.x, 0);
        const sumY = values.reduce((sum, point) => sum + point.y, 0);
        const sumXY = values.reduce((sum, point) => sum + point.x * point.y, 0);
        const sumXX = values.reduce((sum, point) => sum + point.x * point.x, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const direction = slope > 0.001 ? 'Upward' : slope < -0.001 ? 'Downward' : 'Sideways';

        return { direction, slope };
    }

    calculateStats(column) {
        const values = this.data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
        if (values.length === 0) return { mean: null, median: null, std: null, skewness: null };

        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const sortedValues = [...values].sort((a, b) => a - b);
        const median = sortedValues.length % 2 === 0 
            ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
            : sortedValues[Math.floor(sortedValues.length / 2)];
        
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const std = Math.sqrt(variance);
        
        // Calculate skewness
        const skewness = std === 0 ? 0 : values.reduce((sum, val) => sum + Math.pow((val - mean) / std, 3), 0) / values.length;

        return { mean, median, std, skewness, min: Math.min(...values), max: Math.max(...values) };
    }

    calculateCorrelations() {
        this.correlations = [];
        
        if (this.numericColumns.length < 2) return;

        for (let i = 0; i < this.numericColumns.length; i++) {
            for (let j = i + 1; j < this.numericColumns.length; j++) {
                const col1 = this.numericColumns[i];
                const col2 = this.numericColumns[j];
                const correlation = this.pearsonCorrelation(col1, col2);
                
                if (correlation !== null && Math.abs(correlation) > 0.1) {
                    this.correlations.push({
                        column1: col1,
                        column2: col2,
                        correlation: correlation,
                        strength: this.getCorrelationStrength(correlation),
                        description: this.getCorrelationDescription(col1, col2, correlation)
                    });
                }
            }
        }

        // Sort by absolute correlation strength
        this.correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
    }

    pearsonCorrelation(col1, col2) {
        const pairs = this.data.map(row => ({
            x: parseFloat(row[col1]),
            y: parseFloat(row[col2])
        })).filter(pair => !isNaN(pair.x) && !isNaN(pair.y));

        if (pairs.length < 2) return null;

        const n = pairs.length;
        const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
        const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
        const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
        const sumXX = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);
        const sumYY = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

        return denominator === 0 ? null : numerator / denominator;
    }

    getCorrelationStrength(correlation) {
        const abs = Math.abs(correlation);
        if (abs >= 0.8) return 'Very Strong';
        if (abs >= 0.6) return 'Strong';
        if (abs >= 0.4) return 'Moderate';
        if (abs >= 0.2) return 'Weak';
        return 'Very Weak';
    }

    getCorrelationDescription(col1, col2, correlation) {
        const direction = correlation > 0 ? 'positive' : 'negative';
        const strength = this.getCorrelationStrength(correlation).toLowerCase();
        
        return `${col1} and ${col2} show a ${strength} ${direction} correlation (${correlation.toFixed(3)}). ` +
               `This means that as ${col1} ${correlation > 0 ? 'increases' : 'decreases'}, ` +
               `${col2} tends to ${correlation > 0 ? 'increase' : 'decrease'} as well.`;
    }

    hasColumns(requiredColumns) {
        return requiredColumns.every(col => 
            this.columns.some(existingCol => 
                existingCol.toLowerCase() === col.toLowerCase()
            )
        );
    }

    showResults() {
        this.hideLoading();
        
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');

        this.displayDataOverview();
        this.displayThemes();
        this.displayExplanations();
        this.displayCorrelations();
        this.displayTimeSeriesChart();
        this.displayDistributionChart();
    }

    displayDataOverview() {
        const overview = document.getElementById('dataOverview');
        const rowCount = this.data.length;
        const columnCount = this.columns.length;
        const numericCount = this.numericColumns.length;
        const dateCount = this.dateColumns.length;

        overview.innerHTML = `
            <div class="data-stats">
                <div class="stat-item">
                    <div class="stat-value">${rowCount.toLocaleString()}</div>
                    <div class="stat-label">Rows</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${columnCount}</div>
                    <div class="stat-label">Columns</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${numericCount}</div>
                    <div class="stat-label">Numeric Columns</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${dateCount}</div>
                    <div class="stat-label">Date Columns</div>
                </div>
            </div>
            <div style="margin-top: 1.5rem;">
                <h4>Columns:</h4>
                <p>${this.columns.join(', ')}</p>
            </div>
        `;
    }

    displayThemes() {
        const themesList = document.getElementById('themesList');
        
        themesList.innerHTML = this.themes.map(theme => `
            <div class="theme-item">
                <h4>${theme.name}</h4>
                <p>${theme.description}</p>
                <p><strong>Confidence:</strong> ${(theme.confidence * 100).toFixed(1)}%</p>
                <p><strong>Indicators:</strong> ${theme.indicators.join(', ')}</p>
            </div>
        `).join('');

        // Create themes chart
        this.createThemesChart();
    }

    createThemesChart() {
        const ctx = document.getElementById('themesChart').getContext('2d');
        
        const themeTypes = [...new Set(this.themes.map(t => t.type))];
        const typeCounts = themeTypes.map(type => 
            this.themes.filter(t => t.type === type).length
        );

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: themeTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)),
                datasets: [{
                    data: typeCounts,
                    backgroundColor: [
                        '#6366f1',
                        '#8b5cf6',
                        '#06b6d4',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Theme Distribution'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    displayExplanations() {
        const explanationsContent = document.getElementById('explanationsContent');
        
        explanationsContent.innerHTML = this.themes.map(theme => `
            <div class="explanation-item">
                <h3>${theme.name}</h3>
                <p>${this.getDetailedExplanation(theme)}</p>
            </div>
        `).join('');
    }

    getDetailedExplanation(theme) {
        switch (theme.type) {
            case 'financial':
                if (theme.name.includes('OHLC')) {
                    return `This data contains OHLC (Open, High, Low, Close) price information, which is standard for financial market data. 
                           The Open price is the first traded price of a time period, High is the maximum price reached, 
                           Low is the minimum price, and Close is the final price. This format is commonly used for 
                           stock prices, forex rates, commodity prices, and cryptocurrency values.`;
                } else if (theme.name.includes('Volume')) {
                    return `Trading volume represents the number of shares, contracts, or units traded during a specific time period. 
                           High volume often indicates strong interest and can confirm price movements, while low volume might 
                           suggest uncertainty or lack of interest in the asset.`;
                }
                break;
            
            case 'temporal':
                return `Time series data allows for temporal analysis, revealing patterns like trends, seasonality, and cycles. 
                       This type of data is crucial for forecasting, identifying recurring patterns, and understanding 
                       how variables change over time. Common analyses include trend analysis, seasonal decomposition, 
                       and autocorrelation studies.`;
            
            case 'statistical':
                if (theme.name.includes('Volatility')) {
                    return `Volatility measures the degree of price variation over time. High volatility indicates larger 
                           price swings and higher risk, while low volatility suggests more stable prices. The average 
                           volatility of ${theme.metrics?.avgVolatility?.toFixed(4) || 'N/A'} provides insight into the 
                           asset's price stability during this period.`;
                }
                break;
            
            case 'trend':
                return `The trend analysis reveals the general direction of price movement over time. A ${theme.metrics?.direction?.toLowerCase()} 
                       trend with a slope of ${theme.metrics?.slope?.toFixed(6) || 'N/A'} indicates the rate of change. 
                       Trend analysis is fundamental for technical analysis and helps identify potential future price directions.`;
            
            case 'distribution':
                const stats = theme.metrics;
                if (stats) {
                    return `The distribution analysis shows statistical properties of ${theme.indicators[0]}. 
                           Mean: ${stats.mean?.toFixed(4)}, Median: ${stats.median?.toFixed(4)}, 
                           Standard Deviation: ${stats.std?.toFixed(4)}, Skewness: ${stats.skewness?.toFixed(4)}. 
                           ${Math.abs(stats.skewness) > 1 ? 'The high skewness indicates an asymmetric distribution.' : 
                           'The low skewness suggests a relatively symmetric distribution.'}`;
                }
                break;
        }
        
        return theme.description;
    }

    displayCorrelations() {
        const correlationsList = document.getElementById('correlationsList');
        
        if (this.correlations.length === 0) {
            correlationsList.innerHTML = '<p>No significant correlations found between numeric columns.</p>';
            return;
        }

        correlationsList.innerHTML = this.correlations.map(corr => `
            <div class="correlation-item">
                <h4>${corr.column1} ↔ ${corr.column2}</h4>
                <p><strong>Correlation:</strong> ${corr.correlation.toFixed(3)} (${corr.strength})</p>
                <p>${corr.description}</p>
            </div>
        `).join('');

        // Create correlations chart
        this.createCorrelationsChart();
    }

    createCorrelationsChart() {
        const ctx = document.getElementById('correlationsChart').getContext('2d');
        
        const topCorrelations = this.correlations.slice(0, 10); // Show top 10
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topCorrelations.map(corr => `${corr.column1} vs ${corr.column2}`),
                datasets: [{
                    label: 'Correlation Coefficient',
                    data: topCorrelations.map(corr => corr.correlation),
                    backgroundColor: topCorrelations.map(corr => 
                        corr.correlation > 0 ? '#10b981' : '#ef4444'
                    ),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: -1,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Correlation Coefficient'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Variable Pairs'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Top Correlations Between Variables'
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    displayTimeSeriesChart() {
        if (this.dateColumns.length === 0 || this.numericColumns.length === 0) {
            document.getElementById('timeSeriesCard').style.display = 'none';
            return;
        }

        document.getElementById('timeSeriesCard').style.display = 'block';
        
        const ctx = document.getElementById('timeSeriesChart').getContext('2d');
        const dateCol = this.dateColumns[0];
        const valueCol = this.numericColumns.find(col => col.toLowerCase() === 'close') || this.numericColumns[0];

        console.log('Time series chart - Date column:', dateCol, 'Value column:', valueCol);

        const timeSeriesData = this.data.map(row => {
            const date = new Date(row[dateCol]);
            const value = parseFloat(row[valueCol]);
            return { x: date, y: value };
        }).filter(point => !isNaN(point.y) && !isNaN(point.x.getTime()))
          .sort((a, b) => a.x - b.x);

        console.log('Time series data points:', timeSeriesData.length);

        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: valueCol,
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
                        },
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: valueCol
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `${valueCol} Over Time`
                    }
                }
            }
        });
    }

    displayDistributionChart() {
        const ctx = document.getElementById('distributionChart').getContext('2d');
        
        if (this.numericColumns.length === 0) {
            ctx.fillText('No numeric data available for distribution analysis', 10, 50);
            return;
        }

        // Create histogram for first numeric column
        const column = this.numericColumns[0];
        const values = this.data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
        
        // Calculate histogram bins
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binCount = Math.min(20, Math.ceil(Math.sqrt(values.length)));
        const binWidth = (max - min) / binCount;
        
        const bins = Array(binCount).fill(0);
        const binLabels = [];
        
        for (let i = 0; i < binCount; i++) {
            const binStart = min + i * binWidth;
            const binEnd = min + (i + 1) * binWidth;
            binLabels.push(`${binStart.toFixed(2)}-${binEnd.toFixed(2)}`);
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
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Frequency'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: `${column} Value Ranges`
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Distribution of ${column}`
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new DataAnalyzer();
});
