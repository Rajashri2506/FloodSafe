import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUserIncidents } from '../../api/incidentApi';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getUserIncidents();
      setReports(data);
    } catch (error) {
      console.error('Fetch reports error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return '#27AE60'; // green
      case 'in-progress': return '#3498DB'; // blue
      default: return '#E67E22'; // orange/pending
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return 'check-circle';
      case 'in-progress': return 'progress-clock';
      default: return 'clock-alert';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#E74C3C'; // red
      case 'medium': return '#E67E22'; // orange
      default: return '#F1C40F'; // yellow
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const renderReport = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);
    const severityColor = getSeverityColor(item.severity);

    return (
      <TouchableOpacity style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={styles.reportHeaderLeft}>
            <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
            <Text style={styles.reportTitle} numberOfLines={1}>{item.title}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Icon name={statusIcon} size={14} color="#fff" />
            <Text style={styles.statusText}>{item.status.replace('-', ' ')}</Text>
          </View>
        </View>

        {item.media && <Image source={{ uri: item.media }} style={styles.reportImage} />}

        <Text style={styles.reportDescription} numberOfLines={2}>{item.description}</Text>

        <View style={styles.reportFooter}>
          <View style={styles.locationInfo}>
            <Icon name="map-marker" size={14} color="#7F8C8D" />
            <Text style={styles.locationText}>
              {item.location
                ? `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`
                : 'Location not available'}
            </Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="file-document-outline" size={64} color="#BDC3C7" />
      <Text style={styles.emptyTitle}>No Reports Submitted</Text>
      <Text style={styles.emptyText}>
        Your submitted incident reports will appear here. Use the Report tab to submit new incidents.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  return (
    <View style={styles.container}>
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{reports.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, pendingCount > 0 && styles.statPending]}>
            {pendingCount}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, resolvedCount > 0 && styles.statResolved]}>
            {resolvedCount}
          </Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2C3E50']}
            tintColor="#2C3E50"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#7F8C8D' },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '700', color: '#2C3E50' },
  statPending: { color: '#E67E22' },
  statResolved: { color: '#27AE60' },
  statLabel: { fontSize: 12, color: '#7F8C8D', marginTop: 4, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: '#ECF0F1' },
  listContent: { padding: 16 },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reportHeaderLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  severityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  reportTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statusText: { marginLeft: 4, fontSize: 11, color: '#fff', fontWeight: '700', textTransform: 'uppercase' },
  reportImage: { width: '100%', height: 160, borderRadius: 8, marginBottom: 12 },
  reportDescription: { fontSize: 14, color: '#34495E', lineHeight: 20, marginBottom: 12 },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#ECF0F1' },
  locationInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationText: { marginLeft: 6, fontSize: 12, color: '#7F8C8D', fontWeight: '500' },
  dateText: { fontSize: 12, color: '#95A5A6', fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#95A5A6', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#BDC3C7', textAlign: 'center', lineHeight: 22 },
});

export default MyReports;
