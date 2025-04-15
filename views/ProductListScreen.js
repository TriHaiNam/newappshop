import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Button, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/constants/firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhotoURL, setUserPhotoURL] = useState(null);
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User authenticated:', user.email); // Debug
        setIsAuthenticated(true);
        // Check if user has a photo URL
        setUserPhotoURL(user.photoURL);
        fetchData();
      } else {
        console.log('User not authenticated, redirecting to LoginScreen'); // Debug
        setIsAuthenticated(false);
        setLoading(false); // Đặt loading thành false để tránh treo màn hình
        navigation.replace('LoginScreen'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'product'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched products:', items); // Debug
      setProducts(items);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out successfully'); // Debug
        navigation.replace('LoginScreen');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        Alert.alert('Error', 'Failed to log out. Please try again.');
      });
  };

  const navigateToEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} // Fallback image
        style={styles.image}
      />
      <Text style={styles.name}>{item.product_name || 'Unnamed Product'}</Text>
      <Text style={styles.price}>{(item.price || 0).toLocaleString()}₫</Text>
      <Text style={styles.description}>{item.description || 'No description'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Tránh hiển thị gì nếu chưa xác thực
  }

  return (
    <View style={styles.container}>
      {/* Avatar in top right corner with improved styling */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Products</Text>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={navigateToEditProfile}
            activeOpacity={0.7}
          >
            <Image 
              source={userPhotoURL ? { uri: userPhotoURL } : require('../assets/img/default-avatar.jpg')}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>
    
      <FlatList
        contentContainerStyle={[styles.listContainer, { paddingTop: 70 }]}
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No products available</Text>}
      />
      <View style={styles.menuBar}>
        <Button title="Logout" onPress={handleLogout} color="#ff4444" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  price: {
    color: 'green',
    marginTop: 4,
  },
  description: {
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  menuBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarContainer: {
    position: 'relative',
    padding: 3,
    backgroundColor: '#fff',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#8B4513',
    backgroundColor: '#e1e1e1', // Add a background color as fallback
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50', // Green badge indicating "online" or "logged in"
    borderWidth: 2,
    borderColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
});