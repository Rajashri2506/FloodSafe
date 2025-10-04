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
 * Track relief distribution using blockchain data (mock)
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
        return 'truck-delivery';
      default:
        return 'clock-outline';
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
          <View style={[styles.statusIconContainer, { backgroundColor: statusColor + '20' }]}>
            <Icon name={statusIcon} size={32} color={statusColor} />
          </View>
          <View style={styles.cardHeaderContent}>
            <Text style={styles.resourceType}>{item.resourceType}</Text>
            <Text style={styles.quantity}>{item.quantity} units</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeItem}>
            <Icon name="source-repository" size={20} color="#00a86b" />
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>From</Text>
              <Text style={styles.routeValue}>{item.from}</Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routeItem}>
            <Icon name="flag-checkered" size={20} color="#00a86b" />
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>To</Text>
              <Text style={styles.routeValue}>{item.to}</Text>
            </View>
          </View>
        </View>

        <View style={styles.blockchainInfo}>
          <View style={styles.blockchainRow}>
            <Icon name="link-variant" size={18} color="#666" />
            <Text style={styles.blockchainLabel}>Transaction Hash:</Text>
          </View>
          <Text style={styles.blockchainValue}>{item.transactionHash}</Text>
          
          {item.blockNumber && (
            <>
              <View style={styles.blockchainRow}>
                <Icon name="cube-outline" size={18} color="#666" />
                <Text style={styles.blockchainLabel}>Block Number:</Text>
              </View>
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
      <Icon name="truck-delivery-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Tracking Data</Text>
      <Text style={styles.emptyText}>
        Relief distribution tracking will appear here
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
          <Icon name="check-circle" size={32} color="#4caf50" />
          <Text style={styles.statNumber}>{delivered}</Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="truck-delivery" size={32} color="#ffa500" />
          <Text style={styles.statNumber}>{inTransit}</Text>
          <Text style={styles.statLabel}>In Transit</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="clock-outline" size={32} color="#999" />
          <Text style={styles.statNumber}>{pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00a86b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderStats()}

      <View style={styles.blockchainBanner}>
        <Icon name="shield-check" size={24} color="#00a86b" />
        <Text style={styles.blockchainBannerText}>
          Secured by Blockchain Technology
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
            colors={['#00a86b']}
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  blockchainBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 12,
    marginBottom: 5,
  },
  blockchainBannerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#00a86b',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderContent: {
    flex: 1,
  },
  resourceType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  routeContainer: {
    marginBottom: 15,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeContent: {
    marginLeft: 12,
  },
  routeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  routeValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#00a86b',
    marginLeft: 9,
    marginVertical: -8,
  },
  blockchainInfo: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00a86b',
  },
  blockchainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  blockchainLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  blockchainValue: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'monospace',
    marginTop: 4,
    marginLeft: 26,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
});

export default ReliefTracking;
