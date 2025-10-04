
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, textStyles, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import { Tables } from '@/app/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Announcement = Tables<'announcements'>;
type ServiceRequest = Tables<'service_requests'>;

interface AdminDashboardProps {
  onClose: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...textStyles.title,
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    ...textStyles.subtitle,
    color: colors.text,
  },
  addButton: {
    ...buttonStyles.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    ...buttonStyles.secondaryText,
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    ...textStyles.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  cardMeta: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cardContent: {
    ...textStyles.body,
    color: colors.text,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    ...textStyles.caption,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    ...textStyles.subtitle,
    color: colors.text,
  },
  form: {
    gap: 16,
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
    backgroundColor: colors.background,
    borderColor: colors.border,
    color: colors.text,
  },
  textArea: {
    ...commonStyles.input,
    backgroundColor: colors.background,
    borderColor: colors.border,
    color: colors.text,
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    ...buttonStyles.primary,
  },
  buttonText: {
    ...buttonStyles.primaryText,
  },
  secondaryButton: {
    flex: 1,
    ...buttonStyles.secondary,
  },
  secondaryButtonText: {
    ...buttonStyles.secondaryText,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'general' as 'general' | 'course' | 'system' | 'event',
  });

  useEffect(() => {
    loadData();
    setupRealtimeSubscriptions();
  }, []);

  const loadData = async () => {
    try {
      // Load announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (announcementsError) {
        console.error('Error loading announcements:', announcementsError);
      } else {
        setAnnouncements(announcementsData || []);
      }

      // Load service requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error loading service requests:', requestsError);
      } else {
        setServiceRequests(requestsData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to announcements changes
    const announcementsChannel = supabase
      .channel('announcements', { config: { private: true } })
      .on('broadcast', { event: 'INSERT' }, (payload) => {
        console.log('New announcement:', payload);
        loadData();
      })
      .on('broadcast', { event: 'UPDATE' }, (payload) => {
        console.log('Updated announcement:', payload);
        loadData();
      })
      .on('broadcast', { event: 'DELETE' }, (payload) => {
        console.log('Deleted announcement:', payload);
        loadData();
      })
      .subscribe();

    // Subscribe to service requests changes
    const requestsChannel = supabase
      .channel('service_requests_admin', { config: { private: true } })
      .on('broadcast', { event: 'INSERT' }, (payload) => {
        console.log('New service request:', payload);
        loadData();
      })
      .on('broadcast', { event: 'UPDATE' }, (payload) => {
        console.log('Updated service request:', payload);
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(announcementsChannel);
      supabase.removeChannel(requestsChannel);
    };
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: announcementForm.title,
          content: announcementForm.content,
          type: announcementForm.type,
          created_by: user?.id,
        });

      if (error) {
        console.error('Error creating announcement:', error);
        Alert.alert('Error', 'Failed to create announcement');
      } else {
        Alert.alert('Success', 'Announcement created successfully');
        setAnnouncementForm({ title: '', content: '', type: 'general' });
        setShowAnnouncementModal(false);
        loadData();
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      Alert.alert('Error', 'Failed to create announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          status: newStatus,
          assigned_to: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating request:', error);
        Alert.alert('Error', 'Failed to update request status');
      } else {
        Alert.alert('Success', 'Request status updated');
        loadData();
      }
    } catch (error) {
      console.error('Error updating request:', error);
      Alert.alert('Error', 'Failed to update request status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { backgroundColor: colors.warning + '20', color: colors.warning };
      case 'in-progress': return { backgroundColor: colors.primary + '20', color: colors.primary };
      case 'completed': return { backgroundColor: colors.success + '20', color: colors.success };
      case 'cancelled': return { backgroundColor: colors.error + '20', color: colors.error };
      default: return { backgroundColor: colors.textSecondary + '20', color: colors.textSecondary };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <IconSymbol name="xmark" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Announcements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Announcements</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAnnouncementModal(true)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {announcements.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No announcements yet</Text>
            </View>
          ) : (
            announcements.map((announcement) => (
              <View key={announcement.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{announcement.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.statusText, { color: colors.primary }]}>
                      {announcement.type}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardMeta}>
                  {formatDate(announcement.created_at)}
                </Text>
                <Text style={styles.cardContent}>{announcement.content}</Text>
              </View>
            ))
          )}
        </View>

        {/* Service Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Service Requests</Text>
          </View>

          {serviceRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No service requests yet</Text>
            </View>
          ) : (
            serviceRequests.map((request) => (
              <View key={request.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{request.title}</Text>
                  <View style={[styles.statusBadge, getStatusColor(request.status || 'pending')]}>
                    <Text style={[styles.statusText, { color: getStatusColor(request.status || 'pending').color }]}>
                      {request.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardMeta}>
                  {request.type} • {formatDate(request.created_at)}
                </Text>
                <Text style={styles.cardContent}>{request.description}</Text>
                
                {request.status === 'pending' && (
                  <View style={[styles.buttonRow, { marginTop: 12 }]}>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: colors.primary }]}
                      onPress={() => handleUpdateRequestStatus(request.id, 'in-progress')}
                    >
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.secondaryButton]}
                      onPress={() => handleUpdateRequestStatus(request.id, 'cancelled')}
                    >
                      <Text style={styles.secondaryButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {request.status === 'in-progress' && (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.success, marginTop: 12 }]}
                    onPress={() => handleUpdateRequestStatus(request.id, 'completed')}
                  >
                    <Text style={styles.buttonText}>Mark Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Announcement Modal */}
      <Modal
        visible={showAnnouncementModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAnnouncementModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Announcement</Text>
              <TouchableOpacity onPress={() => setShowAnnouncementModal(false)}>
                <IconSymbol name="xmark" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={announcementForm.title}
                  onChangeText={(text) => setAnnouncementForm(prev => ({ ...prev, title: text }))}
                  placeholder="Enter announcement title"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Content</Text>
                <TextInput
                  style={styles.textArea}
                  value={announcementForm.content}
                  onChangeText={(text) => setAnnouncementForm(prev => ({ ...prev, content: text }))}
                  placeholder="Enter announcement content"
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Type</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {['general', 'course', 'system', 'event'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.statusBadge,
                        announcementForm.type === type
                          ? { backgroundColor: colors.primary }
                          : { backgroundColor: colors.border }
                      ]}
                      onPress={() => setAnnouncementForm(prev => ({ ...prev, type: type as any }))}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: announcementForm.type === type ? colors.surface : colors.text }
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setShowAnnouncementModal(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, isLoading && { opacity: 0.7 }]}
                onPress={handleCreateAnnouncement}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
