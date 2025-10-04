
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, textStyles, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          router.replace('/(tabs)/(home)/');
        } else {
          router.replace('/auth/login');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, isLoading, router]);

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>WA</Text>
        </View>
        <Text style={[textStyles.heading1, styles.title]}>Weekend Academy</Text>
        <Text style={[textStyles.bodySecondary, styles.tagline]}>
          Communication App
        </Text>
      </View>
      
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
        <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...commonStyles.shadow,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.card,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  loadingDotDelay1: {
    opacity: 0.6,
  },
  loadingDotDelay2: {
    opacity: 1,
  },
});
