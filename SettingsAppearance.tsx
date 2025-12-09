// SettingsAppearance.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Mode = 'light' | 'dark' | 'system';

type SettingsAppearanceProps = {
  currentMode: Mode;
  onChangeMode: (mode: Mode) => void;
  onBack: () => void;
};

const modes: { key: Mode; label: string }[] = [
  { key: 'light', label: 'Hell' },
  { key: 'dark', label: 'Dunkel' },
  { key: 'system', label: 'System (automatisch)' },
];

export default function SettingsAppearance({
  currentMode,
  onChangeMode,
  onBack,
}: SettingsAppearanceProps) {
  const systemScheme = useColorScheme(); // 'light' | 'dark'
  const activeScheme =
    currentMode === 'system' ? systemScheme : currentMode;

  const isDark = activeScheme === 'dark';
  const styles = isDark ? darkStyles : lightStyles;

  const [selected, setSelected] = useState<Mode>(currentMode);

  const select = (mode: Mode) => {
    setSelected(mode);
    onChangeMode(mode);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Ansichtsmodus</Text>
      </View>

      {/* Auswahl-Liste */}
      <View style={styles.card}>
        {modes.map(item => (
          <Pressable
            key={item.key}
            style={[
              styles.row,
              selected === item.key && styles.rowSelected,
            ]}
            onPress={() => select(item.key)}
          >
            <Text style={styles.rowText}>{item.label}</Text>
            {selected === item.key && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Im Systemmodus folgt MyLittleChurch automatisch der
          Anzeigeeinstellung deines Geräts.
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* ------------------------------------- */
/* -------------- STYLES --------------- */
/* ------------------------------------- */

const base = {
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700' as const,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 6,
    marginBottom: 22,
  },
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 4,
  },
  rowSelected: {
    borderWidth: 2,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  infoBox: {
    padding: 16,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
};

/* ---------- DARK ---------- */

const darkStyles = StyleSheet.create({
  ...base,
  container: {
    ...base.container,
    backgroundColor: '#111827',
  },
  backButton: {
    ...base.backButton,
    backgroundColor: '#1f2937',
  },
  backIcon: {
    ...base.backIcon,
    color: '#f3f4f6',
  },
  headerTitle: {
    ...base.headerTitle,
    color: '#f9fafb',
  },
  card: {
    ...base.card,
    backgroundColor: '#0f172a',
  },
  row: {
    ...base.row,
    backgroundColor: '#1e293b',
  },
  rowSelected: {
    ...base.rowSelected,
    borderColor: '#3b82f6',
  },
  rowText: {
    ...base.rowText,
    color: '#f9fafb',
  },
  checkmark: {
    ...base.checkmark,
    color: '#3b82f6',
  },
  infoBox: {
    ...base.infoBox,
    backgroundColor: '#1e293b',
  },
  infoText: {
    ...base.infoText,
    color: '#cbd5e1',
  },
});

/* ---------- LIGHT ---------- */

const lightStyles = StyleSheet.create({
  ...base,
  container: {
    ...base.container,
    backgroundColor: '#f3f4f6',
  },
  backButton: {
    ...base.backButton,
    backgroundColor: '#e5e7eb',
  },
  backIcon: {
    ...base.backIcon,
    color: '#111827',
  },
  headerTitle: {
    ...base.headerTitle,
    color: '#111827',
  },
  card: {
    ...base.card,
    backgroundColor: '#f3f4f6',
  },
  row: {
    ...base.row,
    backgroundColor: '#ffffff',
  },
  rowSelected: {
    ...base.rowSelected,
    borderColor: '#3b82f6',
  },
  rowText: {
    ...base.rowText,
    color: '#111827',
  },
  checkmark: {
    ...base.checkmark,
    color: '#3b82f6',
  },
  infoBox: {
    ...base.infoBox,
    backgroundColor: '#ffffff',
  },
  infoText: {
    ...base.infoText,
    color: '#374151',
  },
});