// Settings.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Lock, Eye, Bell } from 'lucide-react-native';

type SettingsProps = {
  onBack: () => void;
  onLogout: () => void;
  onOpenAppearance: () => void;
  onOpenPersonal: () => void;
  isDarkMode: boolean;
};

const settingsItems = [
  { key: 'personal', label: 'Persönliche Daten', icon: 'user' },
  { key: 'security', label: 'Sicherheit & Datenschutz', icon: 'lock' },
  { key: 'appearance', label: 'Ansichtsmodus', icon: 'eye' },
  { key: 'notifications', label: 'Benachrichtigungen', icon: 'bell' },
];

const Settings: React.FC<SettingsProps> = ({
  onBack,
  onLogout,
  onOpenAppearance,
  onOpenPersonal,
  isDarkMode,
}) => {
  const isDark = isDarkMode;
  const styles = isDark ? darkStyles : lightStyles;
  const iconColor = isDark ? '#E5E7EB' : '#111827';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Einstellungen</Text>
      </View>

      {/* Liste */}
      <View style={styles.listContainer}>
        {settingsItems.map(item => (
          <Pressable
            key={item.key}
            style={styles.row}
            onPress={() => {
                if (item.key === 'appearance') onOpenAppearance();
                if (item.key === 'personal') onOpenPersonal();
            }}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                {item.key === 'personal' && (
                  <User size={22} color={iconColor} />
                )}
                {item.key === 'security' && (
                  <Lock size={22} color={iconColor} />
                )}
                {item.key === 'appearance' && (
                  <Eye size={22} color={iconColor} />
                )}
                {item.key === 'notifications' && (
                  <Bell size={22} color={iconColor} />
                )}
              </View>
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}

        {/* Abmelden */}
        <Pressable style={styles.logoutRow} onPress={onLogout}>
          <View style={styles.rowLeft}>
            <View style={styles.logoutIconCircle}>
              <Text style={styles.logoutIcon}>←</Text>
            </View>
            <Text style={styles.logoutLabel}>Abmelden</Text>
          </View>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.brandText}>© MyLittleChurch</Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

/* ---------- SHARED BASE STYLES ---------- */

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
    fontSize: 28,
    fontWeight: '700' as const,
  },
  listContainer: {
    flex: 1,
    marginTop: 40,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 20,
  },
  rowLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  chevron: {
    fontSize: 18,
  },
  logoutRow: {
    marginTop: 18,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logoutIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  logoutIcon: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center' as const,
  },
  versionText: {
    fontSize: 12,
    marginBottom: 2,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
};

/* ---------- DARK MODE ---------- */

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
    color: '#e5e7eb',
  },
  headerTitle: {
    ...base.headerTitle,
    color: '#f9fafb',
  },
  row: {
    ...base.row,
    backgroundColor: '#111827',
  },
  iconCircle: {
    ...base.iconCircle,
    backgroundColor: '#0f172a',
  },
  iconText: {
    ...base.iconText,
    color: '#f9fafb',
  },
  rowLabel: {
    ...base.rowLabel,
    color: '#f9fafb',
  },
  chevron: {
    ...base.chevron,
    color: '#6b7280',
  },
  logoutRow: {
    ...base.logoutRow,
    backgroundColor: '#111827',
  },
  logoutIconCircle: {
    ...base.logoutIconCircle,
    backgroundColor: '#b91c1c',
  },
  logoutIcon: {
    ...base.logoutIcon,
    color: '#FFFFFF',
  },
  logoutLabel: {
    ...base.logoutLabel,
    color: '#ef4444',
  },
  versionText: {
    ...base.versionText,
    color: '#6b7280',
  },
  brandText: {
    ...base.brandText,
    color: '#9ca3af',
  },
});

/* ---------- LIGHT MODE ---------- */

const lightStyles = StyleSheet.create({
  ...base,
  container: {
    ...base.container,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    ...base.backButton,
    backgroundColor: '#E5E7EB',
  },
  backIcon: {
    ...base.backIcon,
    color: '#111827',
  },
  headerTitle: {
    ...base.headerTitle,
    color: '#111827',
  },
  row: {
    ...base.row,
    backgroundColor: '#FFFFFF',
  },
  iconCircle: {
    ...base.iconCircle,
    backgroundColor: '#FFFFFF',
  },
  iconText: {
    ...base.iconText,
    color: '#111827',
  },
  rowLabel: {
    ...base.rowLabel,
    color: '#111827',
  },
  chevron: {
    ...base.chevron,
    color: '#9ca3af',
  },
  logoutRow: {
    ...base.logoutRow,
    backgroundColor: '#FFFFFF',
  },
  logoutIconCircle: {
    ...base.logoutIconCircle,
    backgroundColor: '#fee2e2',
  },
  logoutIcon: {
    ...base.logoutIcon,
    color: '#b91c1c',
  },
  logoutLabel: {
    ...base.logoutLabel,
    color: '#dc2626',
  },
  versionText: {
    ...base.versionText,
    color: '#9ca3af',
  },
  brandText: {
    ...base.brandText,
    color: '#6b7280',
  },
});