// App.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './LoginScreen';

export default function App() {
  // 🔹 Hooks immer ganz oben, ohne Bedingungen
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Glow-Animation für Titel
  const glow = useRef(new Animated.Value(0)).current;
  const glowRadius = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  // Screen-Animation (0 = Login, 1 = Dashboard)
  const screenAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [glow]);

  useEffect(() => {
    Animated.timing(screenAnim, {
      toValue: isLoggedIn ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isLoggedIn, screenAnim]);

  const theme = darkMode ? darkStyles : lightStyles;

  const loginOpacity = screenAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const loginTranslateX = screenAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const dashboardOpacity = screenAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const dashboardTranslateX = screenAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        {/* LOGIN-SCREEN */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: loginOpacity,
              transform: [{ translateX: loginTranslateX }],
            },
          ]}
          pointerEvents={isLoggedIn ? 'none' : 'auto'}
        >
          <LoginScreen onLogin={() => setIsLoggedIn(true)} />
        </Animated.View>

        {/* DASHBOARD */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            theme.container,
            {
              opacity: dashboardOpacity,
              transform: [{ translateX: dashboardTranslateX }],
            },
          ]}
          pointerEvents={isLoggedIn ? 'auto' : 'none'}
        >
          <Animated.Text
            style={[
              theme.title,
              {
                textShadowColor: darkMode ? '#000000' : '#FFFFFF',
                shadowOpacity: 0.4,
                textShadowOffset: { width: -2, height: 4 },
                textShadowRadius: glowRadius as unknown as number,
              },
            ]}
          >
            Welcome Back 👋
          </Animated.Text>

          <Text style={theme.subtitle}>You are logged in</Text>

          <Pressable
            style={theme.button}
            onPress={() => setIsLoggedIn(false)}
            android_ripple={{ color: darkMode ? '#333' : '#ccc' }}
          >
            <Text style={theme.buttonText}>Logout</Text>
          </Pressable>

          <Pressable
            style={theme.darkmodebutton}
            onPress={() => setDarkMode(prev => !prev)}
          >
            <Text
              style={{ color: darkMode ? 'white' : 'black', fontSize: 20 }}
            >
              {darkMode ? '☀️' : '🌙'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
}

// Styles im Tap-It-Style
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#1e293b',
  },
  button: {
    backgroundColor: '#5a92ea',
    paddingVertical: 14,
    borderRadius: 10,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkmodebutton: {
    marginTop: 60,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
});

const darkStyles = StyleSheet.create({
  ...lightStyles,
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#ccc',
  },
  button: {
    backgroundColor: '#5a92ea',
    paddingVertical: 14,
    borderRadius: 10,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 8,
    marginTop: 20,
  },
  darkmodebutton: {
    marginTop: 60,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
});