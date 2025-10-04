
import React from "react";
import { Stack } from "expo-router";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, textStyles, commonStyles } from "@/styles/commonStyles";
import { useAuth } from "@/contexts/AuthContext";

export default function HomeScreen() {
  const theme = useTheme();
  const { user } = useAuth();

  const quickLinks = [
    {
      title: "Chat with Admin",
      description: "Get help and support",
      icon: "message.fill",
      color: colors.primary,
      onPress: () => console.log("Chat with Admin pressed"),
    },
    {
      title: "Online Services",
      description: "Request certificates & more",
      icon: "doc.text.fill",
      color: colors.accent,
      onPress: () => console.log("Online Services pressed"),
    },
    {
      title: "My Profile",
      description: "View and edit your profile",
      icon: "person.fill",
      color: colors.secondary,
      onPress: () => console.log("My Profile pressed"),
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Welcome to Weekend Academy!",
      message: "We're excited to have you join our community. Check out the latest updates and announcements here.",
      date: "2024-01-15",
      type: "general",
    },
    {
      id: 2,
      title: "New Course Registration Open",
      message: "Registration for Spring 2024 courses is now open. Don't miss out on our exciting new programs!",
      date: "2024-01-14",
      type: "course",
    },
    {
      id: 3,
      title: "System Maintenance Notice",
      message: "Scheduled maintenance will occur this weekend. Some services may be temporarily unavailable.",
      date: "2024-01-13",
      type: "system",
    },
  ];

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'course':
        return 'book.fill';
      case 'system':
        return 'gear.fill';
      default:
        return 'megaphone.fill';
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'course':
        return colors.accent;
      case 'system':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => console.log("Notifications pressed")}
      style={styles.headerButton}
    >
      <IconSymbol name="bell.fill" color={colors.text} size={20} />
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Weekend Academy",
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontSize: 20,
            fontWeight: '600',
          },
          headerRight: renderHeaderRight,
        }}
      />
      <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.contentContainer,
            Platform.OS !== 'ios' && styles.contentContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={[textStyles.heading2, styles.welcomeTitle]}>
              Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}!
            </Text>
            <Text style={[textStyles.bodySecondary, styles.welcomeSubtitle]}>
              Stay connected with Weekend Academy
            </Text>
          </View>

          {/* Quick Links */}
          <View style={styles.section}>
            <Text style={[textStyles.heading3, styles.sectionTitle]}>Quick Actions</Text>
            <View style={styles.quickLinksContainer}>
              {quickLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  style={[commonStyles.card, styles.quickLinkCard]}
                  onPress={link.onPress}
                >
                  <View style={[styles.quickLinkIcon, { backgroundColor: link.color }]}>
                    <IconSymbol name={link.icon} size={24} color={colors.card} />
                  </View>
                  <View style={styles.quickLinkContent}>
                    <Text style={[textStyles.body, styles.quickLinkTitle]}>
                      {link.title}
                    </Text>
                    <Text style={[textStyles.caption, styles.quickLinkDescription]}>
                      {link.description}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Latest Announcements */}
          <View style={styles.section}>
            <Text style={[textStyles.heading3, styles.sectionTitle]}>Latest Announcements</Text>
            <View style={styles.announcementsContainer}>
              {announcements.map((announcement) => (
                <View key={announcement.id} style={[commonStyles.card, styles.announcementCard]}>
                  <View style={styles.announcementHeader}>
                    <View style={[
                      styles.announcementIcon,
                      { backgroundColor: getAnnouncementColor(announcement.type) }
                    ]}>
                      <IconSymbol
                        name={getAnnouncementIcon(announcement.type)}
                        size={16}
                        color={colors.card}
                      />
                    </View>
                    <View style={styles.announcementHeaderText}>
                      <Text style={[textStyles.body, styles.announcementTitle]}>
                        {announcement.title}
                      </Text>
                      <Text style={[textStyles.caption, styles.announcementDate]}>
                        {new Date(announcement.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Text style={[textStyles.bodySecondary, styles.announcementMessage]}>
                    {announcement.message}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  quickLinksContainer: {
    gap: 12,
  },
  quickLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  quickLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickLinkContent: {
    flex: 1,
  },
  quickLinkTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  quickLinkDescription: {
    color: colors.textSecondary,
  },
  announcementsContainer: {
    gap: 12,
  },
  announcementCard: {
    padding: 16,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  announcementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  announcementHeaderText: {
    flex: 1,
  },
  announcementTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  announcementDate: {
    color: colors.textSecondary,
  },
  announcementMessage: {
    lineHeight: 22,
  },
});
