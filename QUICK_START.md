# FloodSafe - Quick Start Guide

## ⚡ Installation (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. iOS only: Install pods (macOS)
cd ios && pod install && cd ..
```

## 🚀 Run the App

```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Start Metro Bundler manually
npm start
```

## 🔐 Test Login Credentials

### Citizen Account
```
Username: citizen1
Password: password123
```

### NGO Account
```
Username: ngo1
Password: password123
```

## 📱 App Flow

```
IntroSlider (4 slides)
    ↓
RoleSelection (Citizen/NGO)
    ↓
Login (or Register)
    ↓
PermissionRequest
    ↓
Dashboard (role-based)
```

## 🎯 Main Features to Test

### As Citizen:
1. **Report Incident** - Add title, description, photo, location
2. **Alerts** - View flood warnings
3. **My Reports** - See your submitted reports
4. **Profile** - View account, logout

### As NGO:
1. **Relief Management** - View resources & incidents
2. **Relief Tracking** - Track blockchain deliveries
3. **Alerts** - View flood warnings
4. **Profile** - View organization, logout

## 🛠️ Useful Commands

```bash
# Clear cache and restart
npm start -- --reset-cache

# Clean Android build
cd android && ./gradlew clean && cd ..

# Clean iOS build
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Check environment
npx react-native doctor

# Run tests
npm test

# Lint code
npm run lint
```

## 📂 Key Files to Modify

```
src/api/authApi.js          # Authentication logic
src/api/incidentApi.js      # Incident/relief APIs
src/screens/               # All UI screens
src/navigation/            # Navigation setup
```

## 🎨 Customize Theme

### Citizen Color (Blue)
```javascript
// Search and replace: #0066cc
```

### NGO Color (Green)
```javascript
// Search and replace: #00a86b
```

## 🐛 Common Issues

### Metro Bundler Won't Start
```bash
npm start -- --reset-cache
```

### Android Build Error
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Error
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Permission Denied
```bash
chmod +x android/gradlew
```

## 📦 Project Structure

```
FloodSafe/
├── src/
│   ├── api/              # API calls
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation
│   ├── screens/          # All screens
│   └── utils/            # Utilities
├── App.js               # Root component
└── package.json         # Dependencies
```

## 🔗 Documentation

- **Full README**: [README.md](README.md)
- **Installation Guide**: [INSTALLATION.md](INSTALLATION.md)
- **Project Summary**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## ✅ Quick Checklist

- [ ] Install Node.js (v16+)
- [ ] Install Android Studio / Xcode
- [ ] Run `npm install`
- [ ] Run `npm run android` or `npm run ios`
- [ ] Test login with demo credentials
- [ ] Report an incident
- [ ] View alerts
- [ ] Check profile

## 🎉 You're Ready!

If everything works, you should see:
1. ✅ Intro slider with 4 slides
2. ✅ Role selection screen
3. ✅ Login screen
4. ✅ Permission request screen
5. ✅ Dashboard with bottom tabs

## 💡 Tips

- Use **Hot Reload**: Press `r` twice in terminal
- Use **Dev Menu**: Shake device or Cmd/Ctrl + M
- **Reload App**: Cmd/Ctrl + R (iOS/Android)
- **Debug**: Cmd/Ctrl + D (Chrome DevTools)

## 📞 Need Help?

Check these files:
1. `INSTALLATION.md` - Detailed setup
2. `README.md` - Full documentation
3. `PROJECT_SUMMARY.md` - Feature overview

---

**Happy Coding!** 🚀
