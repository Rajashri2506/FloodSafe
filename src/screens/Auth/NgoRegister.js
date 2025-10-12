import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { registerUser } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';

const NgoRegister = ({ navigation, route }) => {
  const [ngoName, setNgoName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const validate = () => {
    if (!ngoName || !email || !phone || !registrationId || !address || !city || !state || !pincode || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Error', 'Invalid email format');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Phone number must be 10 digits');
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      Alert.alert('Error', 'Pincode must be 6 digits');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await registerUser({
        username: ngoName,
        email,
        password,
        role: 'ngo',
        ngoName,
        phone,
        registrationId,
        address,
        city,
        state,
        pincode
      });

      if (result.success) {
        console.log('NGO Registration successful, updating auth context');
        
        // Create user data object for context
        const userData = {
          id: result.user?.id || Date.now().toString(),
          username: ngoName,
          email: email,
          role: 'ngo',
          name: ngoName,
          phone: phone,
          registrationId: registrationId,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          ...result.user
        };
        
        // Update auth context
        register(userData);
        
        console.log('Navigating to permission screen');
        // Navigate to PermissionRequest screen
        navigation.replace('PermissionRequest', { role: 'ngo' });
      } else {
        Alert.alert('Registration Failed', result.error || 'Registration failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An error occurred during registration');
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>NGO Registration</Text>

      <TextInput 
        placeholder="NGO Name *" 
        style={styles.input} 
        value={ngoName} 
        onChangeText={setNgoName} 
      />
      <TextInput 
        placeholder="Email *" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none" 
      />
      <TextInput 
        placeholder="Phone Number *" 
        style={styles.input} 
        value={phone} 
        onChangeText={setPhone} 
        keyboardType="phone-pad" 
        maxLength={10}
      />
      <TextInput 
        placeholder="Registration ID *" 
        style={styles.input} 
        value={registrationId} 
        onChangeText={setRegistrationId} 
      />
      <TextInput 
        placeholder="Address *" 
        style={styles.input} 
        value={address} 
        onChangeText={setAddress} 
        multiline 
      />
      <TextInput 
        placeholder="City *" 
        style={styles.input} 
        value={city} 
        onChangeText={setCity} 
      />
      <TextInput 
        placeholder="State *" 
        style={styles.input} 
        value={state} 
        onChangeText={setState} 
      />
      <TextInput 
        placeholder="Pincode *" 
        style={styles.input} 
        value={pincode} 
        onChangeText={setPincode} 
        keyboardType="number-pad" 
        maxLength={6}
      />
      <TextInput 
        placeholder="Password *" 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <TextInput 
        placeholder="Confirm Password *" 
        style={styles.input} 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
        secureTextEntry 
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login', { role: 'ngo' })}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20, 
    paddingBottom: 40,
    backgroundColor: '#f7f9fc'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  button: { 
    backgroundColor: '#4A90E2', 
    padding: 14, 
    borderRadius: 8, 
    marginTop: 10 
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 16
  },
  link: { 
    color: '#4A90E2', 
    marginTop: 15, 
    textAlign: 'center' 
  },
});

export default NgoRegister;