import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { db } from '../config/FirebaseConfig';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

function GalleryScreen({ navigation }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const postsData = [];
            querySnapshot.forEach((doc) => {
                const postData = {
                    id: doc.id,
                    ...doc.data()
                };
                postsData.push(postData); 
            });
            
            setPosts(postsData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load posts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePost = (postId, title) => {
        Alert.alert(
            'Delete Post',
            `Are you sure you want to delete "${title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deletePost(postId) },
            ]
        );
    };

    const deletePost = async (postId) => {
        try {
            await deleteDoc(doc(db, 'posts', postId));
            setPosts(posts.filter(post => post.id !== postId));
            Alert.alert('Success', 'Post deleted successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete post. Please try again.');
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown date';

        let date;
        if (timestamp.toDate) {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }
        
        return isNaN(date.getTime())
            ? 'Unknown date'
            : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderPost = ({ item }) => (
        <View style={styles.postContainer}>
            <Image 
                source={{ uri: item.imageBase64 }} 
                style={styles.postImage}
                resizeMode="cover"
                onError={(error) => console.error('Image load error:', error)}
            />

            <View style={styles.postContent}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postCaption}>{item.caption}</Text>
                <Text style={styles.postDate}>
                    {formatDate(item.createdAt || item.timestamp)}
                </Text>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePost(item.id, item.title)}
                >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#eb11ee" />
                <Text style={styles.loadingText}>Loading your gallery...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.heading}>Gallery</Text>
            </View>

            {posts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No posts yet!</Text>
                    <Text style={styles.emptySubText}>Start by taking your first snap</Text>
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
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topContainer: {
        width: '100%',
        paddingHorizontal: width * 0.02,
        height: height * 0.1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#eb11ee',
    },
    heading: {
        flex: 1,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        fontSize: 16,
        marginTop: width * 0.01,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.02,
    },
    emptyText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: height * 0.01,
        color: '#666',
    },
    emptySubText: {
        fontSize: 16,
        marginBottom: height * 0.03,
        textAlign: 'center',
        color: '#999',
    },
    addFirstPostButton: {
        paddingHorizontal: width * 0.1,
        paddingVertical: height * 0.015,
        borderRadius: 25,
        backgroundColor: '#eb11ee',
    },
    addFirstPostText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    listContainer: {
        padding: width * 0.025,
        paddingBottom: height * 0.025,
    },
    postContainer: {
        borderRadius: 10,
        marginBottom: height * 0.02,
        padding: width * 0.04,
        shadowColor: '#000',
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: '#f9f9f9',
    },
    postImage: {
        width: '100%',
        height: height * 0.28,
        borderRadius: 10,
        marginBottom: height * 0.015,
        backgroundColor: '#f0f0f0',
    },
    postContent: {
        flex: 1,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    postCaption: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 22,
        color: '#666',
    },
    postDate: {
        fontSize: 12,
        marginBottom: height * 0.01,
         color: '#999',
    },
    deleteButton: {
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.01,
        borderRadius: 20,
        alignSelf: 'flex-start',
        backgroundColor: '#ff4444',
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default GalleryScreen;
