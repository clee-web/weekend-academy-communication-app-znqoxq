
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, textStyles, commonStyles } from "@/styles/commonStyles";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessage {
  id: string;
  message: string;
  timestamp: Date;
  isFromUser: boolean;
  sender: string;
}

export default function ChatScreen() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! Welcome to Weekend Academy support. How can I help you today?',
      timestamp: new Date(Date.now() - 60000),
      isFromUser: false,
      sender: 'Admin Support',
    },
    {
      id: '2',
      message: 'Hi! I have a question about my course schedule.',
      timestamp: new Date(Date.now() - 30000),
      isFromUser: true,
      sender: user?.fullName || 'You',
    },
    {
      id: '3',
      message: 'I&apos;d be happy to help you with your course schedule. Could you please provide your student ID?',
      timestamp: new Date(Date.now() - 15000),
      isFromUser: false,
      sender: 'Admin Support',
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      timestamp: new Date(),
      isFromUser: true,
      sender: user?.fullName || 'You',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate admin response
    setTimeout(() => {
      const adminResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Thank you for your message. I&apos;ll look into this and get back to you shortly.',
        timestamp: new Date(),
        isFromUser: false,
        sender: 'Admin Support',
      };
      setMessages(prev => [...prev, adminResponse]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Chat with Admin",
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontSize: 20,
            fontWeight: '600',
          },
        }}
      />
      <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.container}>
          {/* Messages */}
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={[
              styles.messagesContent,
              Platform.OS !== 'ios' && styles.messagesContentWithTabBar
            ]}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageContainer,
                  msg.isFromUser ? styles.userMessageContainer : styles.adminMessageContainer,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.isFromUser ? styles.userMessageBubble : styles.adminMessageBubble,
                  ]}
                >
                  {!msg.isFromUser && (
                    <Text style={[textStyles.caption, styles.senderName]}>
                      {msg.sender}
                    </Text>
                  )}
                  <Text
                    style={[
                      textStyles.body,
                      msg.isFromUser ? styles.userMessageText : styles.adminMessageText,
                    ]}
                  >
                    {msg.message}
                  </Text>
                  <Text
                    style={[
                      textStyles.caption,
                      msg.isFromUser ? styles.userMessageTime : styles.adminMessageTime,
                    ]}
                  >
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message..."
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  message.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
                ]}
                onPress={sendMessage}
                disabled={!message.trim()}
              >
                <IconSymbol
                  name="arrow.up"
                  size={20}
                  color={message.trim() ? colors.card : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messagesContentWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  adminMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  adminMessageBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    ...commonStyles.shadow,
  },
  senderName: {
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  userMessageText: {
    color: colors.card,
    marginBottom: 4,
  },
  adminMessageText: {
    color: colors.text,
    marginBottom: 4,
  },
  userMessageTime: {
    color: colors.highlight,
    fontSize: 12,
    textAlign: 'right',
  },
  adminMessageTime: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: '#e0e0e0',
  },
});
