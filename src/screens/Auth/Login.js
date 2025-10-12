import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { loginUser } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ route, navigation }) => {
  const { role } = route.params;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(username, password, role);
      
      if (result.success) {
        console.log('Login successful, updating auth context');
        
        // Create user data object for context
        const userData = {
          id: result.user?.id || Date.now().toString(),
          username: username,
          email: result.user?.email || '',
          role: role,
          name: result.user?.name || username,
          ...result.user
        };
        
        // Update auth context
        login(userData);
        
        console.log('Navigating to permission screen');
        // Navigate to PermissionRequest screen
        navigation.replace('PermissionRequest', { role });
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login');
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (role === 'citizen') {
      navigation.navigate('CitizenRegister');
    } else {
      navigation.navigate('NgoRegister');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login as {role === 'citizen' ? 'Citizen' : 'NGO'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.link}>
          {role === 'citizen' 
            ? "Don't have an account? Register as Citizen"
            : "Don't have an account? Register as NGO"
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
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
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  button: { 
    backgroundColor: '#4A90E2', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  link: { 
    color: '#4A90E2', 
    marginTop: 15, 
    textAlign: 'center' 
  },
});

export default Login;