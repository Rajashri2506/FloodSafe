import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

/**
 * Mock user database (replace with Firebase in production)
 */
const MOCK_USERS = [
  {
    id: '1',
    username: 'citizen1',
    email: 'citizen@floodsafe.com',
    password: 'password123',
    role: 'citizen',
  },
  {
    id: '2',
    username: 'ngo1',
    email: 'ngo@floodsafe.com',
    password: 'password123',
    role: 'ngo',
  },
];

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @param {string} role
 * @returns {Promise<Object>} User object
 */
export const loginUser = async (username, password, role) => {
  try {
    // Mock authentication (replace with Firebase Auth)
    const user = MOCK_USERS.find(
      u => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      // Store user data locally
      await AsyncStorage.setItem('user', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }));

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials or role mismatch',
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Register new user
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const registerUser = async (userData) => {
  try {
    const { username, email, password, role } = userData;

    // Check if user already exists
    const existingUser = MOCK_USERS.find(
      u => u.username === username || u.email === email
    );

    if (existingUser) {
      return {
        success: false,
        error: 'User already exists',
      };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      role,
    };

    MOCK_USERS.push(newUser);

    // Store user data locally
    await AsyncStorage.setItem('user', JSON.stringify({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    }));

    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get current user from storage
 * @returns {Promise<Object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const userString = await AsyncStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

/**
 * Logout user
 * @returns {Promise<boolean>}
 */
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

/**
 * Update user profile
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (updates) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'No user logged in' };
    }

    const updatedUser = { ...currentUser, ...updates };
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
