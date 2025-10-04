
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

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    course: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const router = useRouter();
  const { signup } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, email, phone, password, confirmPassword, course } = formData;

    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!course.trim()) {
      Alert.alert('Error', 'Please enter your course/class');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const success = await signup({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      course: formData.course.trim(),
    });

    if (success) {
      router.replace('/(tabs)/(home)/');
    } else {
      Alert.alert('Signup Failed', 'Unable to create account. Please try again.');
    }
    setIsLoading(false);
  };

  const renderInput = (
    field: string,
    label: string,
    placeholder: string,
    options: {
      keyboardType?: 'default' | 'email-address' | 'phone-pad';
      autoCapitalize?: 'none' | 'sentences' | 'words';
      secureTextEntry?: boolean;
      showToggle?: boolean;
      toggleValue?: boolean;
      onToggle?: () => void;
    } = {}
  ) => {
    const isFocused = focusedField === field;
    const value = formData[field as keyof typeof formData];

    return (
      <View style={styles.inputContainer}>
        <Text style={[textStyles.caption, styles.inputLabel]}>{label}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              commonStyles.input,
              isFocused && commonStyles.inputFocused,
              options.showToggle && styles.inputWithToggle,
            ]}
            value={value}
            onChangeText={(text) => handleInputChange(field, text)}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            keyboardType={options.keyboardType || 'default'}
            autoCapitalize={options.autoCapitalize || 'sentences'}
            autoCorrect={false}
            secureTextEntry={options.secureTextEntry}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
          />
          {options.showToggle && (
            <TouchableOpacity
              style={styles.inputToggle}
              onPress={options.onToggle}
            >
              <IconSymbol
                name={options.toggleValue ? 'eye.slash' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
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
            <Text style={[textStyles.heading1, styles.title]}>Create Account</Text>
            <Text style={[textStyles.bodySecondary, styles.subtitle]}>
              Join Weekend Academy today
            </Text>
          </View>

          <View style={styles.form}>
            {renderInput('fullName', 'Full Name', 'Enter your full name', {
              autoCapitalize: 'words',
            })}

            {renderInput('email', 'Email Address', 'Enter your email', {
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            })}

            {renderInput('phone', 'Phone Number', 'Enter your phone number', {
              keyboardType: 'phone-pad',
            })}

            {renderInput('course', 'Course/Class', 'Enter your course or class', {
              autoCapitalize: 'words',
            })}

            {renderInput('password', 'Password', 'Create a password', {
              secureTextEntry: !showPassword,
              showToggle: true,
              toggleValue: showPassword,
              onToggle: () => setShowPassword(!showPassword),
            })}

            {renderInput('confirmPassword', 'Confirm Password', 'Confirm your password', {
              secureTextEntry: !showConfirmPassword,
              showToggle: true,
              toggleValue: showConfirmPassword,
              onToggle: () => setShowConfirmPassword(!showConfirmPassword),
            })}

            <TouchableOpacity
              style={[buttonStyles.primary, styles.signupButton]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text style={[textStyles.buttonText, styles.signupButtonText]}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={[textStyles.body, styles.loginText]}>
                Already have an account?{' '}
              </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={[textStyles.body, styles.loginLink]}>Sign In</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  inputWrapper: {
    position: 'relative',
  },
  inputWithToggle: {
    paddingRight: 50,
  },
  inputToggle: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  signupButton: {
    marginTop: 12,
    marginBottom: 24,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
};
