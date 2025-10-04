import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

/**
 * Intro Slider Screen
 * Shows 4 slides describing FloodSafe features
 */
const IntroSlider = ({ navigation }) => {
  const swiperRef = useRef(null);

  const slides = [
    {
      key: '1',
      title: 'Welcome to FloodSafe',
      text: 'Your trusted companion for disaster management and flood prediction in India',
      icon: 'shield-check',
      backgroundColor: '#0066cc',
    },
    {
      key: '2',
      title: 'AI-Powered Predictions',
      text: 'Advanced AI algorithms predict flood risks with high accuracy to keep you safe',
      icon: 'brain',
      backgroundColor: '#00a86b',
    },
    {
      key: '3',
      title: 'Real-Time Alerts',
      text: 'Get instant notifications about flood warnings and emergency updates in your area',
      icon: 'bell-alert',
      backgroundColor: '#ff6b6b',
    },
    {
      key: '4',
      title: 'Relief Tracking',
      text: 'Blockchain-powered transparent tracking of relief resources and distribution',
      icon: 'link-variant',
      backgroundColor: '#9b59b6',
    },
  ];

  const handleGetStarted = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        showsButtons={false}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={styles.pagination}
      >
        {slides.map((slide, index) => (
          <View
            key={slide.key}
            style={[styles.slide, { backgroundColor: slide.backgroundColor }]}
          >
            <View style={styles.iconContainer}>
              <Icon name={slide.icon} size={120} color="#fff" />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>
            
            {index === slides.length - 1 && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleGetStarted}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  pagination: {
    bottom: 50,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
});

export default IntroSlider;
