
import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { colors, textStyles, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const success = await login(email.trim(), password);
    
    if (success) {
      router.replace('/(tabs)/(home)/');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView
        style={commonStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>WA</Text>
              </View>
            </View>
            <Text style={[textStyles.heading1, styles.title]}>Welcome Back</Text>
            <Text style={[textStyles.bodySecondary, styles.subtitle]}>
              Sign in to your Weekend Academy account
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[textStyles.caption, styles.inputLabel]}>Email or Phone</Text>
              <TextInput
                style={[
                  commonStyles.input,
                  emailFocused && commonStyles.inputFocused,
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email or phone"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[textStyles.caption, styles.inputLabel]}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    commonStyles.input,
                    passwordFocused && commonStyles.inputFocused,
                    styles.passwordInput,
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <IconSymbol
                    name={showPassword ? 'eye.slash' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Link href="/auth/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={[textStyles.caption, styles.forgotPasswordText]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={[buttonStyles.primary, styles.loginButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={[textStyles.buttonText, styles.loginButtonText]}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={commonStyles.divider} />
              <Text style={[textStyles.caption, styles.dividerText]}>OR</Text>
              <View style={commonStyles.divider} />
            </View>

            <View style={styles.signupContainer}>
              <Text style={[textStyles.body, styles.signupText]}>
                Don&apos;t have an account?{' '}
              </Text>
              <Link href="/auth/signup" asChild>
                <TouchableOpacity>
                  <Text style={[textStyles.body, styles.signupLink]}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.card,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: colors.textSecondary,
  },
  signupLink: {
    color: colors.primary,
    fontWeight: '600',
  },
};
