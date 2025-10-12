import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Mock user database for DEMONSTRATION ONLY
 * In production, remove this and use only AsyncStorage
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
 * Get all users from storage
 */
const getUsersFromStorage = async () => {
  try {
    const usersString = await AsyncStorage.getItem('registered_users');
    return usersString ? JSON.parse(usersString) : [];
  } catch (error) {
    console.error('Get users from storage error:', error);
    return [];
  }
};

/**
 * Save users to storage
 */
const saveUsersToStorage = async (users) => {
  try {
    await AsyncStorage.setItem('registered_users', JSON.stringify(users));
  } catch (error) {
    console.error('Save users to storage error:', error);
  }
};

/**
 * Login user
 */
export const loginUser = async (username, password, role) => {
  try {
    // First check mock users (for demo)
    const mockUser = MOCK_USERS.find(
      u => u.username === username && u.password === password && u.role === role
    );

    if (mockUser) {
      await AsyncStorage.setItem('user', JSON.stringify({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      }));

      return {
        success: true,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
        },
      };
    }

    // Then check registered users
    const registeredUsers = await getUsersFromStorage();
    const registeredUser = registeredUsers.find(
      u => (u.username === username || u.email === username) && 
           u.password === password && 
           u.role === role
    );

    if (registeredUser) {
      await AsyncStorage.setItem('user', JSON.stringify({
        id: registeredUser.id,
        username: registeredUser.username,
        email: registeredUser.email,
        role: registeredUser.role,
      }));

      return {
        success: true,
        user: {
          id: registeredUser.id,
          username: registeredUser.username,
          email: registeredUser.email,
          role: registeredUser.role,
        },
      };
    }

    return {
      success: false,
      error: 'Invalid credentials or role mismatch',
    };
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
 */
export const registerUser = async (userData) => {
  try {
    const { username, email, password, role, fullName, address, city, state, pincode, phone } = userData;

    // Get existing registered users
    const registeredUsers = await getUsersFromStorage();

    // Check if user already exists in REGISTERED users (not mock users)
    const existingUser = registeredUsers.find(
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
      fullName,
      address,
      city,
      state,
      pincode,
      phone,
      createdAt: new Date().toISOString(),
    };

    // Add to registered users and save to storage
    const updatedUsers = [...registeredUsers, newUser];
    await saveUsersToStorage(updatedUsers);

    // Store current user data
    await AsyncStorage.setItem('user', JSON.stringify({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
      phone: newUser.phone,
      address: newUser.address,
      city: newUser.city,
      state: newUser.state,
      pincode: newUser.pincode,
    }));

    console.log('User registered successfully:', { username, email, role });
    console.log('Total registered users:', updatedUsers.length);

    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        state: newUser.state,
        pincode: newUser.pincode,
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
 */
export const updateUserProfile = async (updates) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'No user logged in' };
    }

    // Update in registered users storage
    const registeredUsers = await getUsersFromStorage();
    const updatedUsers = registeredUsers.map(user => 
      user.id === currentUser.id ? { ...user, ...updates } : user
    );
    await saveUsersToStorage(updatedUsers);

    // Update current user
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