
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, textStyles, commonStyles } from "@/styles/commonStyles";

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  requestDate: Date;
  type: string;
}

export default function ServicesScreen() {
  const [activeTab, setActiveTab] = useState<'services' | 'requests'>('services');
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: '1',
      title: 'Certificate Request',
      description: 'Course completion certificate for Computer Science',
      status: 'completed',
      requestDate: new Date(Date.now() - 86400000), // 1 day ago
      type: 'certificate',
    },
    {
      id: '2',
      title: 'Technical Support',
      description: 'Help with accessing online course materials',
      status: 'in-progress',
      requestDate: new Date(Date.now() - 172800000), // 2 days ago
      type: 'support',
    },
  ]);

  const services = [
    {
      id: 'certificate',
      title: 'Request Certificate',
      description: 'Get your course completion certificate',
      icon: 'doc.badge.plus',
      color: colors.primary,
      onPress: () => handleServiceRequest('certificate', 'Certificate Request'),
    },
    {
      id: 'transcript',
      title: 'Request Transcript',
      description: 'Official academic transcript',
      icon: 'doc.text',
      color: colors.accent,
      onPress: () => handleServiceRequest('transcript', 'Transcript Request'),
    },
    {
      id: 'support',
      title: 'Technical Support',
      description: 'Get help with technical issues',
      icon: 'wrench.and.screwdriver',
      color: colors.secondary,
      onPress: () => handleServiceRequest('support', 'Technical Support'),
    },
    {
      id: 'feedback',
      title: 'Submit Feedback',
      description: 'Share your thoughts and suggestions',
      icon: 'message.badge',
      color: colors.success,
      onPress: () => handleServiceRequest('feedback', 'Feedback Submission'),
    },
    {
      id: 'enrollment',
      title: 'Course Enrollment',
      description: 'Enroll in new courses',
      icon: 'book.closed',
      color: colors.warning,
      onPress: () => handleServiceRequest('enrollment', 'Course Enrollment'),
    },
    {
      id: 'schedule',
      title: 'Schedule Meeting',
      description: 'Book a meeting with advisor',
      icon: 'calendar.badge.plus',
      color: colors.primary,
      onPress: () => handleServiceRequest('meeting', 'Schedule Meeting'),
    },
  ];

  const handleServiceRequest = (type: string, title: string) => {
    Alert.alert(
      'Service Request',
      `Would you like to submit a request for: ${title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            const newRequest: ServiceRequest = {
              id: Date.now().toString(),
              title,
              description: `Request for ${title.toLowerCase()}`,
              status: 'pending',
              requestDate: new Date(),
              type,
            };
            setRequests(prev => [newRequest, ...prev]);
            setActiveTab('requests');
            Alert.alert('Success', 'Your request has been submitted successfully!');
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'in-progress':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark.circle.fill';
      case 'in-progress':
        return 'clock.fill';
      case 'cancelled':
        return 'xmark.circle.fill';
      default:
        return 'hourglass';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Online Services",
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
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'services' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('services')}
            >
              <Text style={[
                textStyles.body,
                styles.tabText,
                activeTab === 'services' && styles.activeTabText,
              ]}>
                Services
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'requests' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('requests')}
            >
              <Text style={[
                textStyles.body,
                styles.tabText,
                activeTab === 'requests' && styles.activeTabText,
              ]}>
                My Requests ({requests.length})
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={[
              styles.contentContainer,
              Platform.OS !== 'ios' && styles.contentContainerWithTabBar
            ]}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'services' ? (
              // Services Grid
              <View style={styles.servicesGrid}>
                {services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={[commonStyles.card, styles.serviceCard]}
                    onPress={service.onPress}
                  >
                    <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                      <IconSymbol name={service.icon} size={24} color={colors.card} />
                    </View>
                    <Text style={[textStyles.body, styles.serviceTitle]}>
                      {service.title}
                    </Text>
                    <Text style={[textStyles.caption, styles.serviceDescription]}>
                      {service.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              // Requests List
              <View style={styles.requestsList}>
                {requests.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <IconSymbol name="doc.text" size={48} color={colors.textSecondary} />
                    <Text style={[textStyles.body, styles.emptyText]}>
                      No service requests yet
                    </Text>
                    <Text style={[textStyles.caption, styles.emptySubtext]}>
                      Submit a service request to get started
                    </Text>
                  </View>
                ) : (
                  requests.map((request) => (
                    <View key={request.id} style={[commonStyles.card, styles.requestCard]}>
                      <View style={styles.requestHeader}>
                        <View style={styles.requestInfo}>
                          <Text style={[textStyles.body, styles.requestTitle]}>
                            {request.title}
                          </Text>
                          <Text style={[textStyles.caption, styles.requestDate]}>
                            Submitted on {formatDate(request.requestDate)}
                          </Text>
                        </View>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(request.status) }
                        ]}>
                          <IconSymbol
                            name={getStatusIcon(request.status)}
                            size={12}
                            color={colors.card}
                          />
                          <Text style={[textStyles.caption, styles.statusText]}>
                            {request.status.replace('-', ' ').toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={[textStyles.bodySecondary, styles.requestDescription]}>
                        {request.description}
                      </Text>
                    </View>
                  ))
                )}
              </View>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontWeight: '500',
    color: colors.text,
  },
  activeTabText: {
    color: colors.card,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    minHeight: 140,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  serviceDescription: {
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  requestsList: {
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptySubtext: {
    marginTop: 8,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  requestCard: {
    padding: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
    marginRight: 12,
  },
  requestTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  requestDate: {
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: colors.card,
    fontSize: 10,
    fontWeight: '600',
  },
  requestDescription: {
    lineHeight: 20,
  },
});
