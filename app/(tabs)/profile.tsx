
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, textStyles, commonStyles, buttonStyles } from "@/styles/commonStyles";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    console.log("Edit profile pressed");
    Alert.alert("Coming Soon", "Profile editing will be available soon!");
  };

  const profileSections = [
    {
      title: "Personal Information",
      items: [
        { label: "Full Name", value: user?.fullName || "N/A", icon: "person.fill" },
        { label: "Email", value: user?.email || "N/A", icon: "envelope.fill" },
        { label: "Phone", value: user?.phone || "N/A", icon: "phone.fill" },
        { label: "Student ID", value: user?.studentId || "N/A", icon: "number" },
      ],
    },
    {
      title: "Academic Information",
      items: [
        { label: "Course", value: user?.course || "N/A", icon: "book.fill" },
        { label: "Status", value: "Active", icon: "checkmark.circle.fill" },
      ],
    },
  ];

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={handleEditProfile}
      style={styles.headerButton}
    >
      <Text style={[textStyles.caption, styles.editButtonText]}>Edit</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Profile",
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
          {/* Profile Header */}
          <View style={[commonStyles.card, styles.profileHeader]}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <IconSymbol name="person.fill" size={48} color={colors.card} />
              </View>
            </View>
            <Text style={[textStyles.heading2, styles.profileName]}>
              {user?.fullName || "Student"}
            </Text>
            <Text style={[textStyles.bodySecondary, styles.profileEmail]}>
              {user?.email || "student@weekendacademy.com"}
            </Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={[textStyles.heading3, styles.statValue]}>Active</Text>
                <Text style={[textStyles.caption, styles.statLabel]}>Status</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[textStyles.heading3, styles.statValue]}>2024</Text>
                <Text style={[textStyles.caption, styles.statLabel]}>Year</Text>
              </View>
            </View>
          </View>

          {/* Profile Sections */}
          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={[textStyles.heading3, styles.sectionTitle]}>
                {section.title}
              </Text>
              <View style={[commonStyles.card, styles.sectionCard]}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <IconSymbol name={item.icon} size={20} color={colors.primary} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={[textStyles.caption, styles.infoLabel]}>
                          {item.label}
                        </Text>
                        <Text style={[textStyles.body, styles.infoValue]}>
                          {item.value}
                        </Text>
                      </View>
                    </View>
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.infoDivider} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[buttonStyles.outline, styles.actionButton]}
              onPress={() => Alert.alert("Coming Soon", "Settings will be available soon!")}
            >
              <IconSymbol name="gear" size={20} color={colors.primary} />
              <Text style={[textStyles.buttonTextOutline, styles.actionButtonText]}>
                Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.outline, styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <IconSymbol name="arrow.right.square" size={20} color={colors.error} />
              <Text style={[textStyles.buttonTextOutline, styles.actionButtonText, styles.logoutButtonText]}>
                Logout
              </Text>
            </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  profileName: {
    marginBottom: 4,
    textAlign: 'center',
  },
  profileEmail: {
    marginBottom: 20,
    textAlign: 'center',
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionCard: {
    padding: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontWeight: '500',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 72,
  },
  actionsSection: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  logoutButtonText: {
    color: colors.error,
  },
});
