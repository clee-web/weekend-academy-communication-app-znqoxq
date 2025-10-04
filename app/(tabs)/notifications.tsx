
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, textStyles, commonStyles } from "@/styles/commonStyles";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'general' | 'class' | 'event' | 'admin';
  isRead: boolean;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Weekend Academy!',
      message: 'We&apos;re excited to have you join our community. Check out the latest updates and announcements.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      type: 'general',
      isRead: false,
    },
    {
      id: '2',
      title: 'New Course Registration Open',
      message: 'Registration for Spring 2024 courses is now open. Don&apos;t miss out on our exciting new programs!',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      type: 'class',
      isRead: false,
    },
    {
      id: '3',
      title: 'Upcoming Event: Tech Workshop',
      message: 'Join us this Saturday for an exciting tech workshop. Limited seats available!',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      type: 'event',
      isRead: true,
    },
    {
      id: '4',
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance will occur this weekend. Some services may be temporarily unavailable.',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      type: 'admin',
      isRead: true,
    },
    {
      id: '5',
      title: 'Assignment Reminder',
      message: 'Don&apos;t forget to submit your assignment by Friday. Contact support if you need help.',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      type: 'class',
      isRead: true,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'class':
        return 'book.fill';
      case 'event':
        return 'calendar';
      case 'admin':
        return 'gear.fill';
      default:
        return 'bell.fill';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'class':
        return colors.accent;
      case 'event':
        return colors.secondary;
      case 'admin':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={markAllAsRead}
      style={styles.headerButton}
      disabled={unreadCount === 0}
    >
      <Text style={[
        textStyles.caption,
        styles.markAllReadText,
        unreadCount === 0 && styles.markAllReadTextDisabled
      ]}>
        Mark All Read
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Notifications",
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
        <View style={styles.container}>
          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === 'all' && styles.filterTabActive,
              ]}
              onPress={() => setFilter('all')}
            >
              <Text style={[
                textStyles.body,
                styles.filterTabText,
                filter === 'all' && styles.filterTabTextActive,
              ]}>
                All ({notifications.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === 'unread' && styles.filterTabActive,
              ]}
              onPress={() => setFilter('unread')}
            >
              <Text style={[
                textStyles.body,
                styles.filterTabText,
                filter === 'unread' && styles.filterTabTextActive,
              ]}>
                Unread ({unreadCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <ScrollView
            style={styles.notificationsContainer}
            contentContainerStyle={[
              styles.notificationsContent,
              Platform.OS !== 'ios' && styles.notificationsContentWithTabBar
            ]}
            showsVerticalScrollIndicator={false}
          >
            {filteredNotifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <IconSymbol name="bell.slash" size={48} color={colors.textSecondary} />
                <Text style={[textStyles.body, styles.emptyText]}>
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </Text>
              </View>
            ) : (
              filteredNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    commonStyles.card,
                    styles.notificationCard,
                    !notification.isRead && styles.unreadNotificationCard,
                  ]}
                  onPress={() => markAsRead(notification.id)}
                >
                  <View style={styles.notificationHeader}>
                    <View style={[
                      styles.notificationIcon,
                      { backgroundColor: getNotificationColor(notification.type) }
                    ]}>
                      <IconSymbol
                        name={getNotificationIcon(notification.type)}
                        size={16}
                        color={colors.card}
                      />
                    </View>
                    <View style={styles.notificationHeaderText}>
                      <Text style={[
                        textStyles.body,
                        styles.notificationTitle,
                        !notification.isRead && styles.unreadNotificationTitle,
                      ]}>
                        {notification.title}
                      </Text>
                      <Text style={[textStyles.caption, styles.notificationTimestamp]}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </View>
                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={[textStyles.bodySecondary, styles.notificationMessage]}>
                    {notification.message}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
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
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  markAllReadText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  markAllReadTextDisabled: {
    color: colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontWeight: '500',
    color: colors.text,
  },
  filterTabTextActive: {
    color: colors.card,
    fontWeight: '600',
  },
  notificationsContainer: {
    flex: 1,
  },
  notificationsContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  notificationsContentWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
  notificationCard: {
    padding: 16,
    marginBottom: 12,
  },
  unreadNotificationCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationHeaderText: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '500',
    marginBottom: 2,
  },
  unreadNotificationTitle: {
    fontWeight: '600',
  },
  notificationTimestamp: {
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notificationMessage: {
    lineHeight: 20,
  },
});
