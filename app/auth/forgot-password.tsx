
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { colors, textStyles, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const router = useRouter();
  const { forgotPassword } = useAuth();

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    const success = await forgotPassword(email.trim());
    
    if (success) {
      setEmailSent(true);
    } else {
      Alert.alert('Error', 'Unable to send reset email. Please try again.');
    }
    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={[commonStyles.container, styles.centerContainer]}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <IconSymbol name="checkmark.circle.fill" size={80} color={colors.success} />
            </View>
            <Text style={[textStyles.heading2, styles.successTitle]}>
              Email Sent!
            </Text>
            <Text style={[textStyles.body, styles.successMessage]}>
              We&apos;ve sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
            </Text>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.backButton]}
              onPress={() => router.back()}
            >
              <Text style={textStyles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView
        style={commonStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[textStyles.heading1, styles.title]}>Forgot Password?</Text>
              <Text style={[textStyles.bodySecondary, styles.subtitle]}>
                Don&apos;t worry! Enter your email address and we&apos;ll send you a link to reset your password.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[textStyles.caption, styles.inputLabel]}>Email Address</Text>
                <TextInput
                  style={[
                    commonStyles.input,
                    emailFocused && commonStyles.inputFocused,
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>

              <TouchableOpacity
                style={[buttonStyles.primary, styles.resetButton]}
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text style={textStyles.buttonText}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={[textStyles.body, styles.loginText]}>
                  Remember your password?{' '}
                </Text>
                <Link href="/auth/login" asChild>
                  <TouchableOpacity>
                    <Text style={[textStyles.body, styles.loginLink]}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
  resetButton: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.textSecondary,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: colors.success,
  },
  successMessage: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
};
