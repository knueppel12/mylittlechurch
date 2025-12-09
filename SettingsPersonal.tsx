// SettingsPersonal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SettingsPersonalProps = {
  onBack: () => void;
  isDarkMode: boolean;
};

type PersonalKey =
  | 'name'
  | 'phone'
  | 'email'
  | 'address'
  | 'nationality'
  | 'birthday'
  | 'birthplace';

type PersonalItem = {
  key: PersonalKey;
  label: string;
  value: string;
};

const initialPersonalItems: PersonalItem[] = [
  { key: 'name', label: 'Name', value: 'Henrik Tummerer' },
  { key: 'phone', label: 'Telefonnummer', value: '+49 177 8600605' },
  { key: 'email', label: 'E-Mail', value: 'henriktummerer@gmail.com' },
  {
    key: 'address',
    label: 'Anschrift',
    value: 'Königsbrücker Straße 64, 01099 Dresden',
  },
  { key: 'nationality', label: 'Nationalität', value: 'Deutschland' },
  { key: 'birthday', label: 'Geburtsdatum', value: '8. Sept. 2002' },
  {
    key: 'birthplace',
    label: 'Geburtsort',
    value: 'Potsdam, Deutschland',
  },
];

export default function SettingsPersonal({
  onBack,
  isDarkMode,
}: SettingsPersonalProps) {
  const styles = isDarkMode ? darkStyles : lightStyles;

  // Modus: Liste oder Bearbeiten
  const [mode, setMode] = useState<'list' | 'edit'>('list');

  // Persönliche Werte als State (damit Änderungen gespeichert bleiben)
  const [fields, setFields] = useState<PersonalItem[]>(initialPersonalItems);

  // Aktuell bearbeitetes Feld
  const [editingKey, setEditingKey] = useState<PersonalKey | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const userName = 'henrik.t.12';

  const startEdit = (item: PersonalItem) => {
    setEditingKey(item.key);
    setEditingValue(item.value);
    setMode('edit');
  };

  const handleCancelEdit = () => {
    setMode('list');
    setEditingKey(null);
    setEditingValue('');
  };

  const handleSaveEdit = () => {
    if (!editingKey) return;

    setFields(prev =>
      prev.map(f =>
        f.key === editingKey ? { ...f, value: editingValue } : f,
      ),
    );

    setMode('list');
    setEditingKey(null);
    setEditingValue('');
  };

  const currentField = editingKey
    ? fields.find(f => f.key === editingKey)
    : undefined;

  /* ───────────── LISTEN-ANSICHT ───────────── */
  if (mode === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Persönliche Daten</Text>
        </View>

        {/* USERNAME */}
        <Text style={styles.userName}>{userName}</Text>

        {/* LISTE */}
        <View style={styles.listContainer}>
          {fields.map(item => (
            <Pressable
              key={item.key}
              style={styles.row}
              onPress={() => startEdit(item)}
            >
              <View>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowValue}>{item.value}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  /* ───────────── EDIT-ANSICHT ───────────── */
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER: Zurück = Abbrechen */}
      <View style={styles.header}>
        <Pressable onPress={handleCancelEdit} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {currentField?.label ?? 'Bearbeiten'}
        </Text>
      </View>

      <View style={styles.editContent}>
        <Text style={styles.editLabel}>Angabe bearbeiten</Text>

        <TextInput
          style={styles.editInput}
          value={editingValue}
          onChangeText={setEditingValue}
          placeholder={currentField?.label}
          placeholderTextColor={
            isDarkMode ? '#6B7280' : '#9CA3AF'
          }
        />

        <View style={styles.editButtonsRow}>
          <Pressable
            style={styles.editButtonSecondary}
            onPress={handleCancelEdit}
          >
            <Text style={styles.editButtonSecondaryText}>
              Abbrechen
            </Text>
          </Pressable>

          <Pressable
            style={styles.editButtonPrimary}
            onPress={handleSaveEdit}
          >
            <Text style={styles.editButtonPrimaryText}>
              Speichern
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- BASE STYLES (wie Settings.tsx) ---------------- */

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

  userName: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 20,
    marginTop: 30,
  },

  listContainer: {
    flex: 1,
  },

  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  rowLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  rowValue: {
    fontSize: 14,
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
  },

  // Edit-Ansicht
  editContent: {
    marginTop: 32,
  },
  editLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  editInput: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  editButtonsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    gap: 12 as any, // RN kennt gap noch nicht überall, optional
  },
  editButtonSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  editButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  editButtonPrimary: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  editButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
};

/* ---------------- DARK MODE ---------------- */

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
    color: '#E5E7EB',
  },
  headerTitle: {
    ...base.headerTitle,
    color: '#F9FAFB',
  },
  userName: {
    ...base.userName,
    color: '#9CA3AF',
  },
  listContainer: {
    ...base.listContainer,
  },
  row: {
    ...base.row,
    borderBottomColor: '#1F2937',
  },
  rowLabel: {
    ...base.rowLabel,
    color: '#F9FAFB',
  },
  rowValue: {
    ...base.rowValue,
    color: '#9CA3AF',
  },
  chevron: {
    ...base.chevron,
    color: '#6B7280',
  },

  editContent: {
    ...base.editContent,
  },
  editLabel: {
    ...base.editLabel,
    color: '#E5E7EB',
  },
  editInput: {
    ...base.editInput,
    backgroundColor: '#1e293b',
    color: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  editButtonsRow: {
    ...base.editButtonsRow,
  },
  editButtonSecondary: {
    ...base.editButtonSecondary,
    borderColor: '#4B5563',
    backgroundColor: 'transparent',
  },
  editButtonSecondaryText: {
    ...base.editButtonSecondaryText,
    color: '#E5E7EB',
  },
  editButtonPrimary: {
    ...base.editButtonPrimary,
    backgroundColor: '#3B82F6',
  },
  editButtonPrimaryText: {
    ...base.editButtonPrimaryText,
    color: '#F9FAFB',
  },
});

/* ---------------- LIGHT MODE ---------------- */

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
  userName: {
    ...base.userName,
    color: '#6B7280',
  },
  row: {
    ...base.row,
    borderBottomColor: '#E5E7EB',
  },
  rowLabel: {
    ...base.rowLabel,
    color: '#111827',
  },
  rowValue: {
    ...base.rowValue,
    color: '#6B7280',
  },
  chevron: {
    ...base.chevron,
    color: '#9CA3AF',
  },

  editLabel: {
    ...base.editLabel,
    color: '#374151',
  },
  editInput: {
    ...base.editInput,
    backgroundColor: '#F9FAFB',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  editButtonSecondary: {
    ...base.editButtonSecondary,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  editButtonSecondaryText: {
    ...base.editButtonSecondaryText,
    color: '#111827',
  },
  editButtonPrimary: {
    ...base.editButtonPrimary,
    backgroundColor: '#3B82F6',
  },
  editButtonPrimaryText: {
    ...base.editButtonPrimaryText,
    color: '#F9FAFB',
  },
});