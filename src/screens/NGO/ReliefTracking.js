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
import { getReliefTracking } from '../../api/incidentApi';

/**
 * Relief Tracking Screen (NGO)
 * Track relief distribution using blockchain data
 */
const ReliefTracking = () => {
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTrackingData();
  }, []);

  const fetchTrackingData = async () => {
    try {
      const data = await getReliefTracking();
      setTrackingData(data);
    } catch (error) {
      console.error('Fetch tracking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTrackingData();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#4caf50';
      case 'in-transit':
        return '#ffa500';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return 'check-circle';
      case 'in-transit':
        return 'truck';
      default:
        return 'clock';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTrackingItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderContent}>
            <Text style={styles.resourceType}>{item.resourceType}</Text>
            <Text style={styles.quantity}>{item.quantity} units</Text>
          </View>
          <View style={[styles.statusContainer, { borderColor: statusColor }]}>
            <Icon name={statusIcon} size={16} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeItem}>
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Origin</Text>
              <Text style={styles.routeValue}>{item.from}</Text>
            </View>
          </View>

          <View style={styles.routeDivider} />

          <View style={styles.routeItem}>
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{item.to}</Text>
            </View>
          </View>
        </View>

        <View style={styles.blockchainInfo}>
          <Text style={styles.blockchainLabel}>Transaction Hash</Text>
          <Text style={styles.blockchainValue}>{item.transactionHash}</Text>
          
          {item.blockNumber && (
            <>
              <Text style={styles.blockchainLabel}>Block Number</Text>
              <Text style={styles.blockchainValue}>{item.blockNumber}</Text>
            </>
          )}
          
          <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Tracking Data</Text>
      <Text style={styles.emptyText}>
        Relief distribution tracking information will appear here when available
      </Text>
    </View>
  );

  const renderStats = () => {
    const delivered = trackingData.filter((item) => item.status === 'delivered').length;
    const inTransit = trackingData.filter((item) => item.status === 'in-transit').length;
    const pending = trackingData.filter((item) => item.status === 'pending').length;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{delivered}</Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{inTransit}</Text>
          <Text style={styles.statLabel}>In Transit</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderStats()}

      <View style={styles.blockchainBanner}>
        <Text style={styles.blockchainBannerText}>
          Blockchain Secured Tracking
        </Text>
      </View>

      <FlatList
        data={trackingData}
        renderItem={renderTrackingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  blockchainBanner: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  blockchainBannerText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderContent: {
    flex: 1,
  },
  resourceType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 15,
    color: '#64748b',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  routeContainer: {
    marginBottom: 20,
  },
  routeItem: {
    marginBottom: 12,
  },
  routeContent: {
    marginLeft: 0,
  },
  routeLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  routeValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  routeDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
    marginLeft: 0,
  },
  blockchainInfo: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  blockchainLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  blockchainValue: {
    fontSize: 13,
    color: '#1e293b',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ReliefTracking;