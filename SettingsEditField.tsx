// SettingsEditField.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  label: string;              // z. B. "Name"
  initialValue: string;       // aktueller Wert
  isDarkMode: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
};

const DARK_PLACEHOLDER = "#6b7280";
const LIGHT_PLACEHOLDER = "#9ca3af";

export default function SettingsEditField({
  label,
  initialValue,
  isDarkMode,
  onSave,
  onCancel,
}: Props) {
  const styles = isDarkMode ? darkStyles : lightStyles;
  const placeholderColor = isDarkMode ? DARK_PLACEHOLDER : LIGHT_PLACEHOLDER;

  const [value, setValue] = useState(initialValue);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={onCancel} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>{label} bearbeiten</Text>
      </View>

      {/* LABEL */}
      <Text style={styles.editLabel}>Angabe bearbeiten</Text>

      {/* INPUT */}
      <TextInput
        value={value}
        onChangeText={setValue}
        style={styles.input}
        placeholder={label}
        placeholderTextColor={placeholderColor}
      />

      {/* BUTTONS */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Abbrechen</Text>
        </Pressable>

        <Pressable style={styles.saveButton} onPress={() => onSave(value)}>
          <Text style={styles.saveText}>Speichern</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- BASE ---------------- */

const base = {
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 24,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700" as const,
  },
  editLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginTop: 10,
  },
};

/* ---------------- DARK MODE ---------------- */

const darkStyles = StyleSheet.create({
  ...base,

  container: {
    ...base.container,
    backgroundColor: "#111827",
  },
  backButton: {
    ...base.backButton,
    backgroundColor: "#1f2937",
  },
  backIcon: {
    ...base.backIcon,
    color: "#f3f4f6",
  },
  headerTitle: {
    ...base.headerTitle,
    color: "#f9fafb",
  },
  editLabel: {
    ...base.editLabel,
    color: "#cbd5e1",
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 28,
    borderWidth: 1,
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    color: "#f9fafb",
  },

  buttonRow: base.buttonRow,

  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#111827",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  cancelText: {
    color: "#e5e7eb",
    fontSize: 16,
  },

  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
  },
  saveText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

/* ---------------- LIGHT MODE ---------------- */

const lightStyles = StyleSheet.create({
  ...base,

  container: {
    ...base.container,
    backgroundColor: "#f3f4f6",
  },
  backButton: {
    ...base.backButton,
    backgroundColor: "#e5e7eb",
  },
  backIcon: {
    ...base.backIcon,
    color: "#111827",
  },
  headerTitle: {
    ...base.headerTitle,
    color: "#111827",
  },
  editLabel: {
    ...base.editLabel,
    color: "#374151",
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 28,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    color: "#111827",
  },

  buttonRow: base.buttonRow,

  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  cancelText: {
    color: "#374151",
    fontSize: 16,
  },

  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
  },
  saveText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});