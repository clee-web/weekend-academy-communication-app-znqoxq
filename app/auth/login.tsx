
import { IconSymbol } from '@/components/IconSymbol';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, textStyles, commonStyles, buttonStyles } from '@/styles/commonStyles';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    ...textStyles.title,
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    ...textStyles.label,
    color: colors.text,
  },
  input: {
    ...commonStyles.input,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    color: colors.text,
  },
  loginButton: {
    ...buttonStyles.primary,
    marginTop: 10,
  },
  loginButtonText: {
    ...buttonStyles.primaryText,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    gap: 15,
  },
  linkText: {
    ...textStyles.body,
    color: colors.primary,
    textAlign: 'center',
  },
  adminHint: {
    ...textStyles.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
};

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', result.message);
      router.replace('/(tabs)/(home)');
    } else {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <View style={styles.header}>
              <IconSymbol name="graduation-cap" size={60} color={colors.primary} />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your Weekend Academy account</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  autoComplete="password"
                />
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Link href="/auth/forgot-password" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/auth/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
              </Link>

              <Text style={styles.adminHint}>
                Admin login: admin@weekendacademy.com
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
