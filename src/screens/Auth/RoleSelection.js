import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';

// Import your Lottie JSONs
import citizenAnimation from '../../assets/lottie/citizen.json';
import ngoAnimation from '../../assets/lottie/ngo1.json';

/**
 * Role Selection Screen
 * User selects between Citizen or NGO role
 */
const RoleSelection = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleNext = () => {
    if (selectedRole) {
      navigation.navigate('Login', { role: selectedRole });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.card,
            selectedRole === 'citizen' && styles.selectedCard,
          ]}
          onPress={() => setSelectedRole('citizen')}
        >
          <LottieView 
            source={citizenAnimation} 
            autoPlay 
            loop 
            style={styles.lottie} 
          />
          <Text style={styles.label}>Citizen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedRole === 'ngo' && styles.selectedCard,
          ]}
          onPress={() => setSelectedRole('ngo')}
        >
          <LottieView 
            source={ngoAnimation} 
            autoPlay 
            loop 
            style={styles.lottie} 
          />
          <Text style={styles.label}>NGO</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedRole && styles.disabledButton,
        ]}
        disabled={!selectedRole}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  card: {
    width: '40%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  lottie: {
    width: 150,
    height: 160,
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RoleSelection;