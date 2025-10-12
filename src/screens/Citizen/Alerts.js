import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAlerts } from '../../api/incidentApi';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Fetch alerts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#E74C3C'; // red
      case 'high':
        return '#E67E22'; // orange
      case 'medium':
        return '#F1C40F'; // yellow
      default:
        return '#27AE60'; // green
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderAlert = ({ item }) => {
    const severityColor = getSeverityColor(item.severity);

    return (
      <TouchableOpacity style={styles.alertCard}>
        <View style={[styles.severityIndicator, { backgroundColor: severityColor }]} />
        <View style={styles.alertContent}>
          <View style={styles.alertHeader}>
            <Text style={[styles.severityBadge, { color: severityColor }]}>
              {item.severity.toUpperCase()}
            </Text>
            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
          </View>

          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.alertDescription}>{item.description}</Text>

          <View style={styles.alertFooter}>
            <View style={styles.areaTag}>
              <Icon name="map-marker" size={14} color="#7F8C8D" />
              <Text style={styles.areaText}>{item.area}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Active Alerts</Text>
      <Text style={styles.emptyText}>
        All clear in your area. You will receive flood warnings immediately if any alerts are issued.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Loading alerts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flood Alerts</Text>
        <Text style={styles.headerSubtitle}>
          {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={alerts}
        renderItem={renderAlert}
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
  header: { backgroundColor: '#FFFFFF', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#2C3E50' },
  headerSubtitle: { fontSize: 14, color: '#7F8C8D', marginTop: 4 },
  listContent: { padding: 16 },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  severityIndicator: { width: 6 },
  alertContent: { flex: 1, padding: 16 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  severityBadge: { fontSize: 12, fontWeight: '700' },
  timestamp: { fontSize: 12, color: '#95A5A6', fontWeight: '500' },
  alertTitle: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 6, lineHeight: 22 },
  alertDescription: { fontSize: 14, color: '#34495E', lineHeight: 20, marginBottom: 12 },
  alertFooter: { flexDirection: 'row', alignItems: 'center' },
  areaTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  areaText: { marginLeft: 4, fontSize: 12, color: '#7F8C8D', fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#95A5A6', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#BDC3C7', textAlign: 'center', lineHeight: 22 },
});

export default Alerts;
