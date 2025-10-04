
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
    marginBottom: 30,
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
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    gap: 6,
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
  signupButton: {
    ...buttonStyles.primary,
    marginTop: 10,
  },
  signupButtonText: {
    ...buttonStyles.primaryText,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    ...textStyles.body,
    color: colors.primary,
    textAlign: 'center',
  },
};

export default function SignupScreen() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    course: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, email, phone, password, confirmPassword, course } = formData;
    
    if (!fullName || !email || !phone || !password || !confirmPassword || !course) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signup({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      course: formData.course,
    });
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        'Success', 
        result.message,
        [
          {
            text: 'OK',
            onPress: () => {
              if (result.message.includes('verify')) {
                router.replace('/auth/login');
              } else {
                router.replace('/(tabs)/(home)');
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('Signup Failed', result.message);
    }
  };

  const renderInput = (
    field: string,
    label: string,
    placeholder: string,
    options: {
      keyboardType?: 'default' | 'email-address' | 'phone-pad';
      autoCapitalize?: 'none' | 'sentences' | 'words';
      secureTextEntry?: boolean;
    } = {}
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[field as keyof typeof formData]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        {...options}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <View style={styles.header}>
              <IconSymbol name="person-add" size={50} color={colors.primary} />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join Weekend Academy today</Text>
            </View>

            <View style={styles.form}>
              {renderInput('fullName', 'Full Name', 'Enter your full name', {
                autoCapitalize: 'words'
              })}

              <View style={styles.row}>
                {renderInput('email', 'Email', 'Enter your email', {
                  keyboardType: 'email-address',
                  autoCapitalize: 'none'
                })}
              </View>

              <View style={styles.row}>
                {renderInput('phone', 'Phone', 'Enter your phone', {
                  keyboardType: 'phone-pad'
                })}
              </View>

              {renderInput('course', 'Course/Program', 'Enter your course')}

              {renderInput('password', 'Password', 'Create a password', {
                secureTextEntry: true
              })}

              {renderInput('confirmPassword', 'Confirm Password', 'Confirm your password', {
                secureTextEntry: true
              })}

              <TouchableOpacity
                style={[styles.signupButton, isLoading && { opacity: 0.7 }]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
