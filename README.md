# LogoDaleel - Saudi Business Directory

[![Deploy to GitHub Pages](https://github.com/mustafa3430/logodaleel/actions/workflows/deploy.yml/badge.svg)](https://github.com/mustafa3430/logodaleel/actions/workflows/deploy.yml)

A comprehensive business directory platform for Saudi Arabia with company listings, advanced search, and admin management capabilities.

## 🌐 Live Demo
**🔗 [Visit LogoDaleel Live Site](https://mustafa3430.github.io/logodaleel/)**

## 🚀 Features

### Public Website
- **Company Directory**: Browse Saudi businesses with categorized listings
- **Advanced Search**: Search by name, category, location, and announcements
- **Interactive UI**: Modern, responsive design with Arabic/English support
- **Company Profiles**: Detailed business information with social media integration
- **News & Updates**: Company announcements and offers
- **Mobile Responsive**: Optimized for all device sizes

### Admin Dashboard  
- **Company Management**: Add, edit, delete, and manage business listings
- **Category Management**: Comprehensive business category system with bilingual support
- **Reports System**: Handle user reports and moderation
- **Phone Blacklist**: Prevent spam registrations
- **Data Export**: Export data for public website deployment
- **Site Settings**: Configure legal documents and site information

## 📁 Clean Project Structure

```
logodaleel/
├── index.html                          # Main public website
├── script.js                          # Main site JavaScript (optimized)
├── styles.css                         # Main site styles (cleaned)
├── admin.html                          # Admin dashboard
├── admin-script.js                     # Admin JavaScript (optimized)
├── admin-styles.css                    # Admin styles (cleaned)
├── admin-categories.html               # Advanced categories manager
├── saudi_data.js                      # Saudi location data
├── companies-data.json                # Company data storage
├── logo.svg                           # Site logo
├── saudi_business_categories_updated.csv # Business categories data
├── saudi_provinces_cities_districts.csv # Location data
├── level-specific-keywords-template.csv # Category keywords template
├── CATEGORIES_IMPLEMENTATION.md       # Category system documentation
├── PUBLISHING_GUIDE.md               # Deployment guide
└── .github/                          # GitHub workflows
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage for development, JSON for data export
- **UI Framework**: Custom responsive CSS with Font Awesome icons
- **Data**: CSV-based location and category data for Saudi Arabia

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd logodaleel
   ```

2. **Open the application**
   - For public site: Open `index.html` in your browser
   - For admin dashboard: Open `admin.html` in your browser

3. **Start adding companies**
   - Use the "Add Company" button on the main site
   - Or access the admin dashboard for bulk management

## 💼 Admin Features

### Dashboard
- View all companies with status filtering
- Search and filter by multiple criteria
- Bulk actions and data export
- Real-time statistics

### Category Management
- Hierarchical business categories
- Bilingual support (English/Arabic)
- Keyword-based search
- Usage statistics

### Reports Management
- User-submitted reports
- Moderation workflow
- Status tracking

### Blacklist Management
- Phone number blocking
- Spam prevention
- Reason tracking

## 📊 Data Management

The application uses a flexible data structure:

- **Companies**: Stored in localStorage and exported to JSON
- **Categories**: Hierarchical system with English/Arabic names
- **Locations**: Complete Saudi Arabia geographic data
- **Reports**: User feedback and moderation system

## 🔧 Configuration

### Site Settings
- Trading name and registration info
- Contact information
- Legal documents (Terms & Privacy Policy)
- Saudi Business Center logo

### Data Export
- Export for GitHub Pages deployment
- JSON format for easy integration
- Version tracking

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop browsers (1200px+)
- Tablets (768px - 1199px)  
- Mobile phones (320px - 767px)

## 🧹 Code Quality

The codebase has been thoroughly cleaned and optimized:
- ✅ Removed all development, debug, and test files
- ✅ Cleaned console.log statements for production
- ✅ Optimized CSS structure and removed unused styles
- ✅ Organized file structure for maintainability
- ✅ Updated documentation to reflect clean architecture

## 🌐 Deployment

See `PUBLISHING_GUIDE.md` for detailed deployment instructions including:
- GitHub Pages setup
- Data export process
- Domain configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Files

- `CATEGORIES_IMPLEMENTATION.md` - Detailed category system documentation
- `PUBLISHING_GUIDE.md` - Step-by-step deployment guide

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**LogoDaleel** - Making Saudi business discovery simple and efficient.
