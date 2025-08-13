# 📊 Data Analysis Dashboard

A beautiful, interactive web application for analyzing CSV and JSON data files. Upload your data and discover themes, patterns, correlations, and statistical insights with stunning visualizations.

![Dashboard Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=Data+Analysis+Dashboard)

## ✨ Features

- **📁 File Upload**: Drag & drop or select CSV/JSON files
- **🔍 Theme Detection**: Automatically identifies data patterns (financial, temporal, statistical)
- **📈 Correlation Analysis**: Discovers relationships between variables
- **⏰ Time Series Visualization**: Interactive charts for time-based data
- **📊 Distribution Analysis**: Statistical distribution charts
- **💡 Smart Explanations**: Detailed insights about your data patterns
- **📱 Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Live Demo

Choose any of these live deployments:

- **GitHub Pages**: [https://yourusername.github.io/Michelle](https://yourusername.github.io/Michelle)
- **Netlify**: [https://michelle-data-dashboard.netlify.app](https://michelle-data-dashboard.netlify.app)
- **Vercel**: [https://michelle-data-dashboard.vercel.app](https://michelle-data-dashboard.vercel.app)

## 🛠️ Quick Deployment

### Option 1: GitHub Pages (Free)

1. **Create a GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/Michelle.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Your site will be live at**: `https://yourusername.github.io/Michelle`

### Option 2: Netlify (Free)

1. **Drag & Drop Deployment**:
   - Go to [netlify.com](https://netlify.com)
   - Drag your project folder to the deploy area
   - Your site is live instantly!

2. **Git-based Deployment**:
   - Connect your GitHub repository
   - Auto-deploys on every push
   - Custom domain support

### Option 3: Vercel (Free)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** and your site is live!

### Option 4: Surge.sh (Free)

1. **Install Surge**:
   ```bash
   npm install -g surge
   ```

2. **Deploy**:
   ```bash
   surge
   ```

## 🏗️ Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Michelle.git
   cd Michelle
   ```

2. **Serve locally**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open**: `http://localhost:8000`

## 📁 Project Structure

```
Michelle/
├── index.html          # Main HTML file
├── script.js          # JavaScript application logic
├── styles.css         # CSS styles
├── intraday_5min_MU.csv # Sample data file
├── README.md          # This file
├── netlify.toml       # Netlify configuration
├── vercel.json        # Vercel configuration
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Actions deployment
```

## 🎯 Supported Data Formats

### CSV Files
- Headers in first row
- Comma-separated values
- Quoted strings supported
- Financial data (OHLC) automatically detected

### JSON Files
- Array of objects
- Consistent object structure
- Nested objects flattened automatically

## 🔧 Technical Details

- **Frontend**: Vanilla JavaScript (ES6+)
- **Charts**: Chart.js with date adapters
- **Styling**: Modern CSS with CSS Grid/Flexbox
- **No Backend Required**: Pure client-side application
- **File Processing**: Local file reading with FileReader API
- **Responsive**: Mobile-first design

## 🎨 Customization

### Themes
Modify CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #06b6d4;
    /* ... more variables */
}
```

### Analysis Logic
Extend the `DataAnalyzer` class in `script.js` to add:
- New theme detection patterns
- Custom correlation algorithms
- Additional chart types
- Export functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/Michelle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/Michelle/discussions)

## 🙏 Acknowledgments

- Chart.js for beautiful visualizations
- Modern CSS techniques for responsive design
- The open-source community for inspiration

---

**Built with ❤️ for data analysis enthusiasts**
