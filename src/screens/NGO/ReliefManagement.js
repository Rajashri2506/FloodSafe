import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { getReliefResources, getAllIncidents } from '../../api/incidentApi';

const ReliefManagement = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [resources, setResources] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resourcesData, incidentsData] = await Promise.all([
        getReliefResources(),
        getAllIncidents(),
      ]);
      setResources(resourcesData);
      setIncidents(incidentsData);
    } catch (error) {
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#27AE60';
      case 'low':
        return '#F39C12';
      case 'out-of-stock':
        return '#E74C3C';
      default:
        return '#95A5A6';
    }
  };

  const renderResource = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardLocation}>{item.location}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Available Quantity</Text>
            <Text style={styles.quantityValue}>
              {item.quantity} {item.unit}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderIncident = ({ item }) => {
    const severityColor =
      item.severity === 'high'
        ? '#E74C3C'
        : item.severity === 'medium'
        ? '#E67E22'
        : '#F39C12';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>
              Reported by: {item.username}
            </Text>
          </View>
          <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
            <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              Coordinates: {item.location ? `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}` : 'Not available'}
            </Text>
          </View>
          <View style={[styles.statusBadge, {
            backgroundColor: item.status === 'resolved' ? '#27AE60' : item.status === 'in-progress' ? '#3498DB' : '#95A5A6'
          }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    if (!selectedItem) return null;

    const isResource = selectedItem.hasOwnProperty('quantity');

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isResource ? 'Resource Management' : 'Incident Response'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {isResource ? (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Resource Name</Text>
                    <Text style={styles.detailValue}>{selectedItem.name}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Current Stock</Text>
                    <Text style={styles.detailValue}>
                      {selectedItem.quantity} {selectedItem.unit}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Storage Location</Text>
                    <Text style={styles.detailValue}>{selectedItem.location}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Availability Status</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(selectedItem.status) }]}>
                      {selectedItem.status.toUpperCase()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.primaryAction}
                    onPress={() => {
                      Alert.alert('Resource Allocation', 'Resource has been allocated to active emergencies.');
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.primaryActionText}>Allocate to Emergency</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Emergency Report</Text>
                    <Text style={styles.detailValue}>{selectedItem.title}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailValue}>{selectedItem.description}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Reporter</Text>
                    <Text style={styles.detailValue}>{selectedItem.username}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Severity Level</Text>
                    <Text style={[styles.detailValue, { 
                      color: selectedItem.severity === 'high' ? '#E74C3C' : 
                             selectedItem.severity === 'medium' ? '#E67E22' : '#F39C12'
                    }]}>
                      {selectedItem.severity.toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Current Status</Text>
                    <Text style={styles.detailValue}>{selectedItem.status}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.primaryAction}
                    onPress={() => {
                      Alert.alert('Emergency Response', 'Response team has been notified and resources allocated.');
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.primaryActionText}>Deploy Response Team</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Loading relief management data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
          onPress={() => setActiveTab('resources')}
        >
          <Text style={[styles.tabText, activeTab === 'resources' && styles.activeTabText]}>
            Relief Resources ({resources.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'incidents' && styles.activeTab]}
          onPress={() => setActiveTab('incidents')}
        >
          <Text style={[styles.tabText, activeTab === 'incidents' && styles.activeTabText]}>
            Emergency Incidents ({incidents.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'resources' ? resources : incidents}
        renderItem={activeTab === 'resources' ? renderResource : renderIncident}
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
        showsVerticalScrollIndicator={false}
      />

      {renderDetailModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2C3E50',
  },
  tabText: {
    fontSize: 16,
    color: '#95A5A6',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#2C3E50',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  cardLocation: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  cardDescription: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flex: 1,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  locationContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  severityText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 22,
  },
  primaryAction: {
    backgroundColor: '#2C3E50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ReliefManagement;