# FloodSafe - Detailed Installation Guide

This guide provides step-by-step instructions for setting up the FloodSafe React Native application on your local machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Project Installation](#project-installation)
4. [Platform-Specific Setup](#platform-specific-setup)
5. [Running the App](#running-the-app)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

#### 1. Node.js and npm
- **Version**: Node.js >= 16.x
- **Download**: https://nodejs.org/
- **Verify Installation**:
  ```bash
  node --version
  npm --version
  ```

#### 2. React Native CLI
- **Install globally**:
  ```bash
  npm install -g react-native-cli
  ```

#### 3. Watchman (macOS and Linux)
- **macOS**:
  ```bash
  brew install watchman
  ```
- **Linux**: Follow instructions at https://facebook.github.io/watchman/docs/install

---

## Environment Setup

### For Android Development

#### 1. Install Java Development Kit (JDK)
- **Version**: JDK 11 or newer
- **Download**: https://www.oracle.com/java/technologies/downloads/
- **Verify**:
  ```bash
  java -version
  ```

#### 2. Install Android Studio
- **Download**: https://developer.android.com/studio
- **During installation, make sure to install**:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device

#### 3. Configure Android Environment Variables

**macOS/Linux** - Add to `~/.bash_profile` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Windows** - Add to System Environment Variables:
```
ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

#### 4. Accept Android Licenses
```bash
sdkmanager --licenses
```

---

### For iOS Development (macOS Only)

#### 1. Install Xcode
- **Download**: From Mac App Store
- **Version**: Latest stable version
- **After installation**:
  ```bash
  sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
  ```

#### 2. Install Xcode Command Line Tools
```bash
xcode-select --install
```

#### 3. Install CocoaPods
```bash
sudo gem install cocoapods
```

---

## Project Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/floodsafe.git
cd floodsafe
```

### 2. Install Node Dependencies
```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. iOS: Install Pods (macOS only)
```bash
cd ios
pod install
cd ..
```

---

## Platform-Specific Setup

### Android Setup

#### 1. Create a Virtual Device (AVD)
1. Open Android Studio
2. Go to: Tools → Device Manager
3. Click "Create Device"
4. Select a device (e.g., Pixel 5)
5. Download and select a system image (e.g., Android 13)
6. Finish setup

#### 2. Link Resources (if needed)
```bash
npx react-native link react-native-vector-icons
```

#### 3. Configure Permissions
Edit `android/app/src/main/AndroidManifest.xml` to add permissions:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

---

### iOS Setup (macOS only)

#### 1. Update Info.plist
Add permission descriptions in `ios/FloodSafe/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>FloodSafe needs access to your camera to capture incident photos</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>FloodSafe needs access to your location to tag incident reports</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>FloodSafe needs access to your photo library to attach incident photos</string>
```

#### 2. Configure Signing
1. Open `ios/FloodSafe.xcworkspace` in Xcode
2. Select the project in the navigator
3. Go to "Signing & Capabilities"
4. Select your development team

---

## Running the App

### Start Metro Bundler
In the project root:
```bash
npm start
```

### Run on Android
**Option 1**: Using npm script
```bash
npm run android
```

**Option 2**: Manual
```bash
npx react-native run-android
```

### Run on iOS (macOS only)
**Option 1**: Using npm script
```bash
npm run ios
```

**Option 2**: Specific simulator
```bash
npx react-native run-ios --simulator="iPhone 14 Pro"
```

---

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Not Starting
```bash
npm start -- --reset-cache
```

#### 2. Port Already in Use
```bash
# Kill process on port 8081
npx react-native start --port 8082
```

#### 3. Android Build Failures

**Clear Gradle Cache**:
```bash
cd android
./gradlew clean
cd ..
```

**Clear All Caches**:
```bash
# Delete node_modules
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Clear watchman
watchman watch-del-all

# Reinstall
npm install
```

#### 4. iOS Build Failures

**Clean Build Folder**:
1. Open Xcode
2. Product → Clean Build Folder (Shift + Cmd + K)

**Reinstall Pods**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### 5. Permission Denied Errors

**macOS/Linux**:
```bash
# Make gradlew executable
chmod +x android/gradlew
```

#### 6. Could Not Connect to Development Server

**Check Metro Bundler is Running**:
- Make sure `npm start` is running in a separate terminal

**Reload App**:
- Android: Press `R` twice or Cmd/Ctrl + M → Reload
- iOS: Cmd + R

#### 7. Images Not Loading

**Link Assets**:
```bash
npx react-native-asset
```

---

## Firebase Setup (Optional)

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create a new project
3. Add Android and iOS apps

### 2. Download Config Files

**Android**:
1. Download `google-services.json`
2. Place in `android/app/`

**iOS**:
1. Download `GoogleService-Info.plist`
2. Add to Xcode project

### 3. Configure Firebase in Code
Update Firebase configuration in:
- `src/api/authApi.js`
- `src/api/incidentApi.js`

---

## Verification

### Check Installation
```bash
npx react-native doctor
```

This command checks your environment and suggests fixes.

### Test the App
1. Run the app on a device/emulator
2. Navigate through the intro slides
3. Try logging in with demo credentials:
   - **Citizen**: username: `citizen1`, password: `password123`
   - **NGO**: username: `ngo1`, password: `password123`

---

## Next Steps

After successful installation:
1. ✅ Test all features (reporting, alerts, tracking)
2. ✅ Configure Firebase for production
3. ✅ Set up backend APIs
4. ✅ Test on physical devices
5. ✅ Prepare for production build

---

## Support

If you encounter issues not covered here:
1. Check the [main README.md](README.md)
2. Search existing GitHub issues
3. Create a new issue with:
   - Your operating system
   - Node.js and npm versions
   - Complete error message
   - Steps to reproduce

---

**Happy Coding!** 🚀
