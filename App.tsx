// App.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from './LoginScreen';
import Settings from './Settings';
import SettingsAppearance from './SettingsAppearance';
import SettingsPersonal from './SettingsPersonal';
import VerseScreen from './VerseScreen'; 
import BibleChatScreen from './BibleChatScreen';

// Welcher Screen ist gerade aktiv?
type Screen =
  | 'login'
  | 'home'
  | 'settings'
  | 'appearance'
  | 'personal'
  | 'verse'
  | 'bibleChat'; 

// Ansichtsmodus-Typ (global)
export type Mode = 'light' | 'dark' | 'system';

type HomeProps = {
  onGoSettings: () => void;
  onOpenVerse: () => void;
  onOpenBibleChat: () => void;
  isDark: boolean;
};

function HomeScreen({ onGoSettings, onOpenVerse, onOpenBibleChat, isDark }: HomeProps) {
  const styles = isDark ? darkStyles : lightStyles;

  return (
    <SafeAreaView style={styles.container}>
      {/* obere Sektion */}
      <View style={styles.topSection}>
        {/* kleines Kirchen-Icon oben */}
        <Image
          source={require('./assets/icons/church-logo.png')}
          style={styles.churchIcon}
          resizeMode="contain"
        />

        {/* Bibelvers-Karte (klickbar) */}
        <Pressable
          style={styles.verseCard}
          onPress={onOpenVerse}          
        >
          <Text style={styles.verseTitle}>Bibelvers des Tages:</Text>
          <Text style={styles.verseText}>
            „Wer anderen eine Gräbe grubt, sich selber in die Hose pupt.“
          </Text>
        </Pressable>

        {/* großer Bibel-Button */}
        <Pressable style={styles.bigButton} onPress={onOpenBibleChat}>
          <Image
            source={require('./assets/icons/bibel_icon.png')}
            style={styles.bigButtonIcon}
            resizeMode="contain"
          />
        </Pressable>

        {/* zwei kleine Buttons */}
        <View style={styles.bottomRow}>
          <Pressable style={[styles.smallButton, styles.smallButtonLeft]}>
            <Image
              source={require('./assets/icons/socials_icon.png')}
              style={styles.smallButtonIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable style={[styles.smallButton, styles.smallButtonRight]}>
            <Image
              source={require('./assets/icons/pray_icon.png')}
              style={styles.smallButtonIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>

      {/* App-Name & Einstellungen ganz unten */}
      <View style={styles.bottomSection}>
        <Text style={styles.appName}>MyLittleChurch</Text>

        <Pressable onPress={onGoSettings} style={styles.settingsTouch}>
          <Text style={styles.settingsText}>Einstellungen</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [appearance, setAppearance] = useState<Mode>('system');

  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const effectiveMode: Mode =
    appearance === 'system'
      ? (systemScheme === 'dark' ? 'dark' : 'light')
      : appearance;

  const isDark = effectiveMode === 'dark';

  return (
    <SafeAreaProvider>
      {screen === 'login' && (
        <LoginScreen
          onLogin={() => setScreen('home')}
          appearance={appearance}
          onChangeAppearance={setAppearance}
        />
      )}

      {screen === 'home' && (
        <HomeScreen
          onGoSettings={() => setScreen('settings')}
          onOpenVerse={() => setScreen('verse')} 
          onOpenBibleChat={() => setScreen('bibleChat')}
          isDark={isDark}
        />
      )}

      {screen === 'settings' && (
        <Settings
          onBack={() => setScreen('home')}
          onLogout={() => setScreen('login')}
          onOpenAppearance={() => setScreen('appearance')}
          onOpenPersonal={() => setScreen('personal')}
          isDarkMode={isDark}
        />
      )}

      {screen === 'appearance' && (
        <SettingsAppearance
          currentMode={appearance}
          onChangeMode={(m: Mode) => setAppearance(m)}
          onBack={() => setScreen('settings')}
        />
      )}

      {screen === 'personal' && (
        <SettingsPersonal
          onBack={() => setScreen('settings')}
          isDarkMode={isDark}
        />
      )}

      {screen === 'verse' && (                        // ⭐ NEU
        <VerseScreen
          onBack={() => setScreen('home')}
          isDarkMode={isDark}
        />
      )}

      {screen === 'bibleChat' && (
        <BibleChatScreen
          onBack={() => setScreen('home')}
          isDarkMode={isDark}
        />
      )}
    </SafeAreaProvider>
  );
}

/* ------------ BASIS-STYLES (abgeleitet) --------------- */

const base = {
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between' as const,
  },
  topSection: {
    alignItems: 'center' as const,
  },
  churchIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
    tintColor: '#ffffff',
  },
  verseCard: {
    width: '100%' as const,
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginTop: 20,
    marginBottom: 32,
    shadowOffset: { width: 0, height: 6 } as const,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 12,
  },
  verseTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    marginBottom: 12,
  },
  verseText: {
    fontSize: 16,
    textAlign: 'center' as const,
    lineHeight: 22,
  },
  bigButton: {
    width: '100%' as const,
    borderRadius: 32,
    paddingVertical: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 28,
    shadowOffset: { width: 0, height: 8 } as const,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  bigButtonIcon: {
    width: 140,
    height: 140,
    tintColor: '#ffffff',
  },
  bottomRow: {
    flexDirection: 'row' as const,
    width: '100%' as const,
    justifyContent: 'space-between' as const,
  },
  smallButton: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 26,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowOffset: { width: 0, height: 6 } as const,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  smallButtonIcon: {
    width: 80,
    height: 80,
    tintColor: '#ffffff',
  },
  bottomSection: {
    alignItems: 'center' as const,
  },
  appName: {
    fontSize: 22,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  settingsTouch: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  settingsText: {
    fontSize: 14,
  },
};

/* ------------ DARK MODE --------------- */

const darkStyles = StyleSheet.create({
  container: {
    ...base.container,
    backgroundColor: '#111827',
  },
  topSection: base.topSection,
  churchIcon: {
    ...base.churchIcon,
    tintColor: '#ffffff',
  },
  verseCard: {
    ...base.verseCard,
    backgroundColor: '#020617',
    shadowColor: '#ffffffff',
  },
  verseTitle: {
    ...base.verseTitle,
    color: '#ffffff',
  },
  verseText: {
    ...base.verseText,
    color: '#e5e7eb',
  },
  bigButton: {
    ...base.bigButton,
    backgroundColor: '#FF7F3F',
    shadowColor: '#000000',
  },
  bigButtonIcon: base.bigButtonIcon,
  bottomRow: base.bottomRow,
  smallButton: {
    ...base.smallButton,
    shadowColor: '#000000',
  },
  smallButtonLeft: {
    backgroundColor: '#45D37A',
    marginRight: 12,
    paddingVertical: 4,
  },
  smallButtonRight: {
    backgroundColor: '#5AA0F3',
    marginLeft: 12,
    paddingVertical: 4,
  },
  smallButtonIcon: base.smallButtonIcon,
  bottomSection: base.bottomSection,
  appName: {
    ...base.appName,
    color: '#ffffff',
  },
  settingsTouch: base.settingsTouch,
  settingsText: {
    ...base.settingsText,
    color: '#9ca3af',
  },
});

/* ------------ LIGHT MODE --------------- */

const lightStyles = StyleSheet.create({
  container: {
    ...base.container,
    backgroundColor: '#f3f4f6',
  },
  topSection: base.topSection,
  churchIcon: {
    ...base.churchIcon,
    tintColor: '#111827',
  },
  verseCard: {
    ...base.verseCard,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
  },
  verseTitle: {
    ...base.verseTitle,
    color: '#111827',
  },
  verseText: {
    ...base.verseText,
    color: '#374151',
  },
  bigButton: {
    ...base.bigButton,
    backgroundColor: '#FF7F3F',
    shadowColor: '#000000',
  },
  bigButtonIcon: base.bigButtonIcon,
  bottomRow: base.bottomRow,
  smallButton: {
    ...base.smallButton,
    shadowColor: '#9ca3af',
  },
  smallButtonLeft: {
    backgroundColor: '#45D37A',
    marginRight: 12,
    paddingVertical: 4,
  },
  smallButtonRight: {
    backgroundColor: '#5AA0F3',
    marginLeft: 12,
    paddingVertical: 4,
  },
  smallButtonIcon: base.smallButtonIcon,
  bottomSection: base.bottomSection,
  appName: {
    ...base.appName,
    color: '#111827',
  },
  settingsTouch: base.settingsTouch,
  settingsText: {
    ...base.settingsText,
    color: '#6b7280',
  },
});