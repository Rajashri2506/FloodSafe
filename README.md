# FloodSafe - Disaster Management Mobile App

A comprehensive React Native mobile application for efficient disaster management in India, featuring AI-powered flood prediction, real-time alerts, incident reporting, and blockchain-based relief tracking.

## 🚀 Features

### For Citizens
- 📱 **Incident Reporting**: Report flood incidents with photos, videos, and geolocation
- 🚨 **Real-Time Alerts**: Receive instant flood warnings and emergency notifications
- 📊 **Report Tracking**: Track status of your submitted incident reports
- 🗺️ **Location Tagging**: Automatic GPS-based location tagging for incidents
- 💾 **Offline Support**: Store reports locally when offline

### For NGOs
- 📦 **Relief Management**: Manage and track relief resources and inventory
- 🚛 **Distribution Tracking**: Blockchain-powered transparent relief distribution
- 👥 **Incident Management**: View and respond to citizen-reported incidents
- 📈 **Analytics**: Track relief operations and resource allocation
- ⛓️ **Blockchain Integration**: Transparent and tamper-proof tracking

## 🛠️ Tech Stack

- **React Native** 0.73.0 (No Expo)
- **React Navigation** (Stack + Bottom Tabs)
- **Firebase** (Authentication & Realtime Database)
- **AsyncStorage** (Local data persistence)
- **Axios** (API calls)
- **React Native Vector Icons** (UI icons)
- **React Native Paper** (Material Design components)
- **React Native Permissions** (Camera, Location, Storage, Notifications)
- **React Native Image Picker** (Photo/Video capture)
- **React Native Geolocation** (GPS location)
- **Lottie** (Animations - optional)

## 📁 Project Structure

```
FloodSafe/
├── src/
│   ├── api/
│   │   ├── authApi.js           # Authentication API
│   │   └── incidentApi.js       # Incident & Relief API
│   ├── assets/
│   │   ├── icons/               # App icons
│   │   ├── images/              # Images
│   │   └── lottie/              # Lottie animations
│   ├── components/              # Reusable components
│   ├── navigation/
│   │   ├── RootNavigator.js     # Root navigation handler
│   │   ├── AuthNavigator.js     # Auth flow navigation
│   │   ├── CitizenNavigator.js  # Citizen dashboard tabs
│   │   └── NgoNavigator.js      # NGO dashboard tabs
│   ├── screens/
│   │   ├── Intro/
│   │   │   └── IntroSlider.js   # Onboarding slides
│   │   ├── Auth/
│   │   │   ├── RoleSelection.js # Role selection screen
│   │   │   ├── Login.js         # Login screen
│   │   │   └── Register.js      # Registration screen
│   │   ├── Permissions/
│   │   │   └── PermissionRequest.js  # Permission handler
│   │   ├── Citizen/
│   │   │   ├── ReportIncident.js     # Report incidents
│   │   │   ├── Alerts.js             # View alerts
│   │   │   ├── MyReports.js          # User reports
│   │   │   └── Profile.js            # User profile
│   │   └── NGO/
│   │       ├── ReliefManagement.js   # Manage resources
│   │       ├── ReliefTracking.js     # Track distribution
│   │       ├── NgoAlerts.js          # View alerts
│   │       └── NgoProfile.js         # NGO profile
│   └── utils/
│       └── permissions.js       # Permission utilities
├── App.js                       # Main app component
├── index.js                     # App entry point
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- npm (comes with Node.js)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- JDK 11 or newer

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/floodsafe.git
   cd floodsafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Android Setup**
   - Make sure Android Studio is installed
   - Set ANDROID_HOME environment variable
   - Create a virtual device or connect a physical device

### Running the App

#### Android
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

#### Start Metro Bundler (if not started automatically)
```bash
npm start
```

## 🔐 Demo Credentials

### Citizen Account
- **Username**: citizen1
- **Password**: password123

### NGO Account
- **Username**: ngo1
- **Password**: password123

## 📱 App Flow

1. **Intro Slider** → Shows app features and benefits
2. **Role Selection** → Choose between Citizen or NGO
3. **Login/Register** → Authenticate user
4. **Permission Request** → Request necessary permissions
5. **Dashboard** → Role-based dashboard (Citizen or NGO)

### Citizen Dashboard
- **Report Incident**: Submit flood reports with media and location
- **Alerts**: View real-time flood warnings
- **My Reports**: Track submitted incidents
- **Profile**: Manage account settings

### NGO Dashboard
- **Relief Management**: Manage resources and view incidents
- **Relief Tracking**: Blockchain-based distribution tracking
- **Alerts**: View flood warnings for operations planning
- **Profile**: Manage organization settings

## 🔧 Configuration

### Firebase Setup (Optional for Production)

1. Create a Firebase project at https://console.firebase.google.com
2. Add Android and iOS apps to your Firebase project
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place config files in respective directories:
   - Android: `android/app/google-services.json`
   - iOS: `ios/GoogleService-Info.plist`

### API Configuration

Update API endpoints in:
- `src/api/authApi.js`
- `src/api/incidentApi.js`

Replace mock data with actual API calls for production.

## 🧪 Testing

```bash
npm test
```

## 🏗️ Build for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
```

### Android AAB (for Play Store)
```bash
cd android
./gradlew bundleRelease
```

### iOS (macOS only)
1. Open `ios/FloodSafe.xcworkspace` in Xcode
2. Select Product → Archive
3. Follow distribution steps

## 🎨 Customization

### Colors
Update theme colors in navigation files and screen stylesheets:
- Citizen theme: `#0066cc` (Blue)
- NGO theme: `#00a86b` (Green)

### Icons
- Replace icons in `src/assets/icons/`
- App icon: Update in `android/app/src/main/res/` and `ios/FloodSafe/Images.xcassets/`

## 📚 Key Libraries Used

| Library | Purpose |
|---------|---------|
| `@react-navigation/native` | Navigation framework |
| `@react-navigation/stack` | Stack navigation |
| `@react-navigation/bottom-tabs` | Bottom tab navigation |
| `@react-native-async-storage/async-storage` | Local storage |
| `react-native-vector-icons` | Icon library |
| `react-native-paper` | Material Design components |
| `react-native-permissions` | Permission management |
| `react-native-image-picker` | Photo/video selection |
| `react-native-geolocation-service` | GPS location |
| `axios` | HTTP client |

## 🐛 Troubleshooting

### Common Issues

**Metro Bundler Issues**
```bash
npm start -- --reset-cache
```

**Android Build Failures**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**iOS Build Failures**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

**Permission Issues**
- Make sure to accept all permissions when prompted
- Check device settings if permissions were denied

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ for disaster-affected communities in India.

## 📞 Support

For support, email support@floodsafe.com or open an issue on GitHub.

## 🔮 Future Enhancements

- [ ] Real AI/ML flood prediction models
- [ ] Live blockchain integration for relief tracking
- [ ] Multi-language support (Hindi, Tamil, Bengali, etc.)
- [ ] Voice-based incident reporting
- [ ] Emergency contact integration
- [ ] Offline map support
- [ ] Push notification service
- [ ] Analytics dashboard for authorities
- [ ] Social media integration
- [ ] Community forum

## 🙏 Acknowledgments

- React Native community
- Firebase team
- All contributors and testers

---

**Made with React Native** 🚀
