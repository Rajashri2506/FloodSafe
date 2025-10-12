import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from 'lottie-react-native';

// Import your Lottie JSONs
import floodAlertAnimation from '../../assets/lottie/flood-alert.json';
import reportAnimation from '../../assets/lottie/incident.json';
import ngoAnimation from '../../assets/lottie/ngo.json';
import connectAnimation from '../../assets/lottie/connect.json';

const slides = [
  {
    key: '1',
    title: 'Stay Ahead of Floods!',
    text: 'Get instant alerts and stay safe before disaster strikes.',
    backgroundColor: '#5fa5f5ff',
    animation: floodAlertAnimation,
    animationSize: 280,
  },
  {
    key: '2',
    title: 'Report in a Snap',
    text: 'Send flood updates via text, images, or videos – help your community!',
    backgroundColor: '#334748ff',
    animation: reportAnimation,
    animationSize: 270,
  },
  {
    key: '3',
    title: 'Stay Connected & Informed',
    text: 'Receive updates, alerts, and connect with authorities in real-time.',
    backgroundColor: '#7B61FF',
    animation: connectAnimation,
    animationSize: 280,
  },
  {
    key: '4',
    title: 'Manage Relief Efforts',
    text: 'NGOs can track resources, coordinate teams, and deliver help faster.',
    backgroundColor: '#41403dff',
    animation: ngoAnimation,
    animationSize: 280,
  },
];

export default function IntroSlider({ navigation }) {
  const handleDone = () => {
    navigation.navigate('RoleSelection');
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <LottieView
        source={item.animation}
        autoPlay
        loop
        style={[styles.animation, { width: item.animationSize, height: item.animationSize }]}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  // Custom button renderer
  const renderButton = (label) => (
    <View style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </View>
  );

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={handleDone}
      renderNextButton={() => renderButton('Next')}
      renderSkipButton={() => renderButton('Skip')}
      renderDoneButton={() => renderButton('Get Started')}
      showSkipButton
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  animation: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    marginTop: 15,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  buttonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});