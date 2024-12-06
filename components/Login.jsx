import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React from 'react';
import { Colors } from './../constants/Colors.ts';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <Image
        source={require('./../assets/images/TripMate.png')}
        style={styles.image}
        resizeMode="contain" // Ensures the image scales without distortion
      />
      <View style={styles.container}>
        <Text style={styles.title}>TripMate</Text>

        <Text style={styles.description}>
          Discover your next adventure effortlessly. Personalized itineraries at
          your fingertips. Travel smarter with AI-driven insights.
        </Text>

        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('auth/sign-in')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityLabel="Get Started"
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,  // Let height scale based on the image's aspect ratio
    aspectRatio: 1,     // This maintains the original aspect ratio (3072x3072)
  },
  container: {
    backgroundColor: Colors.WHITE,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '100%',
    padding: 25,
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginTop: 10,
  },
  description: {
    fontFamily: 'outfit',
    fontSize: 17,
    textAlign: 'center',
    color: Colors.GRAY,
    marginTop: 10,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontFamily: 'outfit',
    fontSize: 17,
  },
});
