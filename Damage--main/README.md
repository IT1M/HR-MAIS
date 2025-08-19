# AI Presentation & Dashboard Builder

A comprehensive bilingual (Arabic/English) web application that combines two powerful AI agents:

- **Agent A**: Presentation Builder - Creates professional slides with chat interface
- **Agent B**: Data Dashboard - Analyzes files and generates interactive charts

## Features

### 🎯 Core Capabilities
- **Bilingual Support**: Full RTL/LTR support with automatic language detection
- **AI-Powered**: Integrates with Gemini and Groq for intelligent content generation
- **PWA Ready**: Offline functionality and installable as a native app
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Agent A: Presentation Builder
- Interactive chat interface for presentation creation
- Multiple slide types (title, bullets, two-column, data, summary)
- Brand Kit integration with logo upload and color extraction
- Theme customization (Modern, Minimal, Corporate, Playful)
- High-quality PDF and standalone HTML export
- Visual slide editor with drag-and-drop functionality

### 📈 Agent B: Data Dashboard
- Support for Excel, CSV, PDF, and DOCX files
- Intelligent data profiling and analysis
- AI-powered chart suggestions (bar, line, pie, scatter, heatmap, maps)
- Interactive chart creation with ECharts
- Advanced filtering, sorting, and aggregation
- Automated insights generation
- Export capabilities (PNG, PDF, HTML)

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- API keys for Gemini and/or Groq

### Quick Start

1. **Clone and Install**
\`\`\`bash
git clone <repository-url>
cd bilingual-ai-dashboard
npm install
\`\`\`

2. **Environment Configuration**
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your API keys:
\`\`\`env
PROVIDER=auto
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
\`\`\`

3. **Run the Application**
\`\`\`bash
# Development
npm run dev

# Production
npm start
\`\`\`

4. **Access the App**
Open http://localhost:3000 in your browser

## Configuration

### Provider Settings
- `PROVIDER=auto`: Automatically selects best provider for each task
- `PROVIDER=gemini`: Uses Gemini for all requests
- `PROVIDER=groq`: Uses Groq for all requests

### Model Configuration
\`\`\`env
GEMINI_MODEL=gemini-1.5-flash    # Default Gemini model
GROQ_MODEL=llama3-70b-8192       # Default Groq model
\`\`\`

## Usage Guide

### Creating Presentations (Agent A)

**English Examples:**
- "Create a presentation about renewable energy"
- "Build slides for a marketing strategy meeting"
- "Generate a company overview presentation"

**Arabic Examples:**
- "أنشئ عرضاً تقديمياً عن الطاقة المتجددة"
- "اصنع شرائح لاجتماع استراتيجية التسويق"
- "ولد عرضاً تقديمياً لنظرة عامة على الشركة"

### Data Analysis (Agent B)

1. **Upload Files**: Drag and drop or click to browse
2. **Analyze Data**: Click "Analyze Data" to profile your dataset
3. **Ask Questions**: 
   - "Show sales trends by region"
   - "Compare performance across quarters"
   - "أظهر اتجاهات المبيعات حسب المنطقة"
4. **Generate Charts**: Click "Suggest Charts" for AI recommendations
5. **Get Insights**: Use "Generate Insights" for automated analysis

### Keyboard Shortcuts
- `⌘/Ctrl + K`: Open Command Palette
- `Enter`: Send chat message
- `Escape`: Close modals

### Brand Kit
1. Upload your logo in the Brand Kit modal
2. Colors are automatically extracted from the logo
3. Customize primary and accent colors
4. Apply to all generated presentations

## Security & Privacy

### Data Protection
- **PII Filtering**: Automatically removes emails, phone numbers, SSNs
- **Local Processing**: Data analysis happens locally when possible
- **No Raw Data Sharing**: Only schemas and samples sent to AI providers
- **Temporary Storage**: Uploaded files are automatically cleaned up

### API Security
- Rate limiting on all endpoints
- CORS protection
- Helmet security headers
- No API keys exposed to client

### Privacy Modes
- **Local-only Mode**: Process data without AI analysis
- **Schema-only Mode**: Send only data structure, not content
- **Anonymized Mode**: Strip all identifiable information

## Troubleshooting

### Common Issues

**PDF Files Not Parsing Correctly**
- PDFs with scanned images require OCR (optional feature)
- Try converting to Excel format for better results

**Charts Not Displaying**
- Ensure field names match exactly between data and chart specs
- Check browser console for JavaScript errors

**RTL Layout Issues**
- Clear browser cache after language changes
- Ensure Arabic fonts are loaded properly

**API Errors**
- Verify API keys are correctly set in `.env`
- Check rate limits haven't been exceeded
- Ensure internet connection for AI provider access

### File Format Support

| Format | Read | Features |
|--------|------|----------|
| Excel (.xlsx/.xls) | ✅ | Full support, multiple sheets |
| CSV | ✅ | Automatic delimiter detection |
| PDF | ⚠️ | Text extraction, basic tables |
| DOCX | ⚠️ | Text content, simple tables |

### Performance Tips
- Use Excel format for best data parsing results
- Limit datasets to <10MB for optimal performance
- Enable browser caching for faster load times
- Use "Auto" provider mode for optimal AI routing

## Advanced Features

### Calculated Fields
Create custom formulas in the dashboard:
\`\`\`javascript
// Example: Profit Margin
(Revenue - Cost) / Revenue * 100
\`\`\`

### Geographic Mapping
- Automatic detection of country/region columns
- Interactive maps with Leaflet integration
- Choropleth and point mapping support

### Time Series Analysis
- Automatic date/time detection
- Trend analysis and forecasting
- Seasonal pattern recognition

## API Reference

### Core Endpoints

**Chat Interface**
\`\`\`
POST /api/llm/chat
{
  "messages": [...],
  "systemPrompt": "...",
  "temperature": 0.7,
  "maxTokens": 2000,
  "provider": "auto"
}
\`\`\`

**Slide Generation**
\`\`\`
POST /api/llm/slides
{
  "topic": "Presentation topic",
  "language": "en|ar",
  "requirements": "Additional requirements"
}
\`\`\`

**Chart Suggestions**
\`\`\`
POST /api/llm/chart-spec
{
  "schema": {...},
  "sampleData": [...],
  "question": "What to visualize?"
}
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and support:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed description
4. Include browser console logs if applicable

---

Built with ❤️ for bilingual productivity
