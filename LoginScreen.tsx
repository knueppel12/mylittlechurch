// LoginScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Animated,
  useColorScheme,
  TextInput,
  Alert,
} from 'react-native';

// muss zu deinem Mode-Typ in App.tsx passen
export type Mode = 'light' | 'dark' | 'system';

type LoginScreenProps = {
  onLogin: () => void;
  appearance: Mode;
  onChangeAppearance: (mode: Mode) => void;
};

export default function LoginScreen({
  onLogin,
  appearance,
  onChangeAppearance,
}: LoginScreenProps) {
  const systemColorScheme = useColorScheme(); // 'light' | 'dark' | null

  // effektiver Modus inkl. "System"
  const effective =
    appearance === 'system' ? systemColorScheme ?? 'light' : appearance;

  const isDark = effective === 'dark';

  const placeholderColor = isDark ? '#000' : '#6b7280';
  const theme = isDark ? darkStyles : lightStyles;
  const iconTint = isDark ? 'white' : 'black';

  // Glow Animation
  const glow = useRef(new Animated.Value(0)).current;
  const glowRadius = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5],
  });

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

  // Login Handler
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Fehler', 'Bitte E-Mail und Passwort eingeben.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Fehler', 'Bitte eine gültige E-Mail-Adresse eingeben.');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Fehler', 'Das Passwort muss mindestens 4 Zeichen haben.');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 800));
      Alert.alert('Erfolgreich', 'Du bist eingeloggt!');
      onLogin();
    } catch (error) {
      Alert.alert('Fehler', 'Es ist ein unerwarteter Fehler aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = () => {
    Alert.alert('Info', 'Registrierung ist noch nicht implementiert.');
  };

  // Toggle: wechselt nur zwischen Hell und Dunkel
  const toggleAppearance = () => {
    onChangeAppearance(isDark ? 'light' : 'dark');
  };

  return (
    <View style={theme.container}>
      {/* Logo + Titel */}
      <View style={theme.logoContainer}>
        <Image
          source={require('./assets/icons/church-logo.png')}
          style={theme.logo}
          resizeMode="contain"
        />

        <Animated.Text
          style={[
            theme.title,
            {
              textShadowColor: '#000000',
              shadowOpacity: 0.4,
              textShadowOffset: { width: -2, height: 4 },
              textShadowRadius: glowRadius as unknown as number,
            },
          ]}
        >
          MyLittleChurch
        </Animated.Text>
      </View>

      {/* Email Input */}
      <TextInput
        style={theme.input}
        placeholder="E-Mail"
        placeholderTextColor={placeholderColor}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={theme.input}
        placeholder="Passwort"
        placeholderTextColor={placeholderColor}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Buttons */}
      <Pressable
        style={theme.button}
        onPress={handleLogin}
        disabled={isSubmitting}
      >
        <Text style={theme.buttonText}>
          {isSubmitting ? 'loading…' : 'login'}
        </Text>
      </Pressable>

      <Pressable style={theme.button} onPress={handleRegister}>
        <Text style={theme.buttonText}>register</Text>
      </Pressable>

      {/* Darkmode Toggle */}
      <Pressable style={theme.darkmodebutton} onPress={toggleAppearance}>
        <Image
          source={require('./assets/icons/darkmode-icon.png')}
          style={{ width: 40, height: 40, tintColor: iconTint }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

/* ──────────────────────────────────────────────
   Light Theme Styles
────────────────────────────────────────────── */
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#707070ff',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: 'black',
    width: 230,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  button: {
    backgroundColor: '#1c1c1c',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 15,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  darkmodebutton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 120,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
});

/* ──────────────────────────────────────────────
   Dark Theme Styles
────────────────────────────────────────────── */
const darkStyles = StyleSheet.create({
  ...lightStyles,
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0ca',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: 'black',
    width: 230,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 8,
  },
  button: {
    backgroundColor: '#707070ff',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 15,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 8,
  },
  darkmodebutton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 120,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
});