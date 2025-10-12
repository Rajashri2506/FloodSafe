import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LottieTabIcon = ({ focused, animation, size = 26, fallbackIcon }) => {
  const animationRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (focused && !hasError) {
      animationRef.current?.play();
    } else {
      animationRef.current?.reset();
    }
  }, [focused, hasError]);

  // Fallback to regular icon if Lottie fails to load
  if (hasError && fallbackIcon) {
    return (
      <Icon 
        name={fallbackIcon} 
        size={size} 
        color={focused ? '#2C3E50' : '#95A5A6'} 
      />
    );
  }

  return (
    <View style={{ width: size, height: size }}>
      <LottieView
        ref={animationRef}
        source={animation}
        autoPlay={false}
        loop={focused}
        style={{
          width: size,
          height: size,
        }}
        onAnimationFailure={() => setHasError(true)}
      />
    </View>
  );
};

export default LottieTabIcon;