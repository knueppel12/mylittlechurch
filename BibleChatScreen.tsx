// BibleChatScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BibleChatScreenProps = {
  onBack: () => void;
  isDarkMode: boolean;
};

type ChatMessage = {
  id: string;
  from: 'user' | 'ai';
  text: string;
};

const BibleChatScreen: React.FC<BibleChatScreenProps> = ({
  onBack,
  isDarkMode,
}) => {
  const styles = isDarkMode ? darkStyles : lightStyles;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      from: 'ai',
      text: 'Hi 👋\nWie kann ich dir heute mit einem Bibelvers oder einer Frage zum Glauben helfen?',
    },
  ]);
  const [input, setInput] = useState('');

  const placeholderColor = isDarkMode ? '#6b7280' : '#9ca3af';

  const headerLogoStyle: ImageStyle = {
    width: 40,
    height: 40,
    tintColor: isDarkMode ? '#f9fafb' : '#111827',
    marginLeft: 8,
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      from: 'user',
      text: trimmed,
    };

    // Noch keine echte KI-Antwort – Platzhalter
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      from: 'ai',
      text:
        'Danke für deine Nachricht 🙏\n' +
        'Die KI-Antwort ist hier noch nicht angebunden, aber das UI steht schon bereit.',
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Bibel-Chat</Text>
          <Image
            source={require('./assets/icons/church-logo.png')}
            style={headerLogoStyle}
            resizeMode="contain"
          />
        </View>

        {/* Platzhalter-Button rechts (z. B. später für Optionen) */}
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Untertitel / letzte Versinfo */}
      <View style={styles.headerSubtitleRow}>
        <Text style={styles.headerSubtitleLabel}>Persönlicher Vers</Text>
        <Text style={styles.headerSubtitleText}>
          Beschreibe deinen Tag oder Traum und wir geben dir einen passenden Bibelvers.
        </Text>
      </View>

      {/* CHAT-BEREICH */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.from === 'user'
                  ? styles.messageBubbleUser
                  : styles.messageBubbleAi,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.from === 'user'
                    ? styles.messageTextUser
                    : styles.messageTextAi,
                ]}
              >
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* EINGABE-ZEILE */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Frage stellen oder Vers anfordern…"
            placeholderTextColor={placeholderColor}
            multiline
          />
          <Pressable
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BibleChatScreen;

/* ---------------- BASE STYLES ---------------- */

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
    justifyContent: 'space-between' as const,
    marginBottom: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  headerTitleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  headerRightPlaceholder: {
    width: 32,
    height: 32,
  },
  headerSubtitleRow: {
    marginBottom: 16,
  },
  headerSubtitleLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  headerSubtitleText: {
    fontSize: 15,
  },

  chatContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
    paddingBottom: 16,
  },
  messageBubble: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 4,
    maxWidth: '80%' as const,
  },
  messageBubbleUser: {
    alignSelf: 'flex-end' as const,
  },
  messageBubbleAi: {
    alignSelf: 'flex-start' as const,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextUser: {},
  messageTextAi: {},

  inputRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  sendButtonDisabled: {},
  sendButtonText: {
    fontSize: 18,
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
    color: '#f3f4f6',
  },
  headerTitle: {
    ...base.headerTitle,
    color: '#f9fafb',
  },
  headerSubtitleLabel: {
    ...base.headerSubtitleLabel,
    color: '#9ca3af',
  },
  headerSubtitleText: {
    ...base.headerSubtitleText,
    color: '#e5e7eb',
  },

  messagesScroll: base.messagesScroll,
  messagesContent: base.messagesContent,

  messageBubble: {
    ...base.messageBubble,
  },
  messageBubbleUser: {
    ...base.messageBubbleUser,
    backgroundColor: '#3b82f6',
  },
  messageBubbleAi: {
    ...base.messageBubbleAi,
    backgroundColor: '#1f2937',
  },
  messageText: {
    ...base.messageText,
  },
  messageTextUser: {
    ...base.messageTextUser,
    color: '#f9fafb',
  },
  messageTextAi: {
    ...base.messageTextAi,
    color: '#e5e7eb',
  },

  inputRow: base.inputRow,
  input: {
    ...base.input,
    backgroundColor: '#0f172a',
    color: '#f9fafb',
  },
  sendButton: {
    ...base.sendButton,
    backgroundColor: '#3b82f6',
  },
  sendButtonDisabled: {
    ...base.sendButtonDisabled,
    opacity: 0.4,
  },
  sendButtonText: {
    ...base.sendButtonText,
    color: '#ffffff',
  },
});

/* ---------------- LIGHT MODE ---------------- */

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
  headerSubtitleLabel: {
    ...base.headerSubtitleLabel,
    color: '#6b7280',
  },
  headerSubtitleText: {
    ...base.headerSubtitleText,
    color: '#374151',
  },

  messagesScroll: base.messagesScroll,
  messagesContent: base.messagesContent,

  messageBubble: {
    ...base.messageBubble,
  },
  messageBubbleUser: {
    ...base.messageBubbleUser,
    backgroundColor: '#3b82f6',
  },
  messageBubbleAi: {
    ...base.messageBubbleAi,
    backgroundColor: '#ffffff',
  },
  messageText: {
    ...base.messageText,
  },
  messageTextUser: {
    ...base.messageTextUser,
    color: '#ffffff',
  },
  messageTextAi: {
    ...base.messageTextAi,
    color: '#111827',
  },

  inputRow: base.inputRow,
  input: {
    ...base.input,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  sendButton: {
    ...base.sendButton,
    backgroundColor: '#3b82f6',
  },
  sendButtonDisabled: {
    ...base.sendButtonDisabled,
    opacity: 0.4,
  },
  sendButtonText: {
    ...base.sendButtonText,
    color: '#ffffff',
  },
});