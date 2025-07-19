import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { auth, db } from '../config/FirebaseConfig';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

function GalleryScreen({ navigation, route }) {
  const initialMode = route.params?.viewMode || 'public';
  const [viewMode, setViewMode] = useState(initialMode);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, [viewMode]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Please sign in to view posts');
        return;
      }

      let q;
      if (viewMode === 'public') {
        q = query(
          collection(db, 'posts'), 
          where('privacy', '==', 'public'), 
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'posts'), 
          where('privacy', '==', 'private'), 
          where('ownerId', '==', user.uid), 
          orderBy('createdAt', 'desc')
        );
      }
      
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(data);
    } catch(error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts. Please try again.');
    } finally { 
      setIsLoading(false); 
    }
  };

  const deletePost = async (postId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'posts', postId));
              setPosts(p => p.filter(x => x.id !== postId));
              Alert.alert('Success', 'Post deleted successfully');
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          }
        }
      ]
    );
  };

  const renderPost = ({ item }) => {
    const currentUser = auth.currentUser;
    const isOwner = currentUser && item.ownerId === currentUser.uid;
    
    return (
      <View style={styles.postContainer}>
        <Image 
          source={{ uri: item.imageData || item.imageUrl }} 
          style={styles.postImage} 
          onError={(error) => console.log('Image load error:', error)}
        />
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postCaption}>{item.caption}</Text>
          <Text style={styles.postDate}>
            {(item.createdAt?.toDate() || new Date(item.timestamp)).toLocaleString()}
          </Text>
          {isOwner && (
            <TouchableOpacity 
              onPress={() => deletePost(item.id)} 
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#eb11ee"/>
      <Text style={styles.loadingText}>Loading posts...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Gallery</Text>
      </View>
      
      <View style={styles.toggleRow}>
        {['private', 'public'].map(mode => (
          <TouchableOpacity 
            key={mode} 
            style={[
              styles.toggleButton, 
              viewMode === mode && styles.toggleButtonActive
            ]} 
            onPress={() => setViewMode(mode)}
          >
            <Text style={[
              styles.toggleText, 
              viewMode === mode && styles.toggleTextActive
            ]}>
              {mode === 'public' ? 'Community' : 'My Posts'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts yet!</Text>
          <Text style={styles.emptySubText}>
            {viewMode === 'public' 
              ? 'Be the first to share with the community!' 
              : 'Create your first post to get started'}
          </Text>
          <TouchableOpacity 
            style={styles.addFirstPostButton}
            onPress={() => navigation.navigate('Snapshare')}
          >
            <Text style={styles.addFirstPostText}>Create First Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList 
          data={posts} 
          renderItem={renderPost} 
          keyExtractor={item => item.id} 
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topContainer: {
    width: '100%',
    paddingHorizontal: width * 0.02,
    height: height * 0.1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#eb11ee'
  },
  heading: { flex: 1, fontSize: 26, fontWeight: 'bold', color: '#fff' },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff'
  },
  loadingText: { 
    fontSize: 16, 
    marginTop: width * 0.02, 
    color: '#666' 
  },
  emptyContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: width * 0.05
  },
  emptyText: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: height * 0.01, 
    color: '#666'
  },
  emptySubText: {
    fontSize: 16, 
    marginBottom: height * 0.03, 
    textAlign: 'center', 
    color: '#999'
  },
  addFirstPostButton: {
    paddingHorizontal: width * 0.1, 
    paddingVertical: height * 0.015,
    borderRadius: 25, 
    backgroundColor: '#eb11ee'
  },
  addFirstPostText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  listContainer: { 
    padding: width * 0.025, 
    paddingBottom: height * 0.025 
  },
  postContainer: {
    borderRadius: 10, 
    marginBottom: height * 0.02, 
    padding: width * 0.04,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4, 
    elevation: 5, 
    backgroundColor: '#f9f9f9'
  },
  postImage: { 
    width: '100%', 
    height: height * 0.28, 
    borderRadius: 10, 
    marginBottom: height * 0.015, 
    backgroundColor: '#f0f0f0' 
  },
  postContent: { flex: 1 },
  postTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    color: '#333' 
  },
  postCaption: { 
    fontSize: 16, 
    marginBottom: 10, 
    lineHeight: 22, 
    color: '#666' 
  },
  postDate: { 
    fontSize: 12, 
    marginBottom: height * 0.01, 
    color: '#999' 
  },
  deleteButton: { 
    paddingHorizontal: width * 0.05, 
    paddingVertical: height * 0.01, 
    borderRadius: 20, 
    alignSelf: 'flex-start', 
    backgroundColor: '#ff4444' 
  },
  deleteButtonText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  toggleRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 12 
  },
  toggleButton: {
    paddingVertical: 8, 
    paddingHorizontal: 24, 
    marginHorizontal: 8,
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#eb11ee'
  },
  toggleButtonActive: { backgroundColor: '#eb11ee' },
  toggleText: { 
    color: '#eb11ee', 
    fontWeight: 'bold',
    fontSize: 16
  },
  toggleTextActive: { color: '#fff' }
});

export default GalleryScreen;