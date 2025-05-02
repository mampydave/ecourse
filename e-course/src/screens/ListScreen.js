import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  Alert ,
  RefreshControl
} from 'react-native';
import { getCoursesWithItems } from './../database';

const ListScreen = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      const data = await getCoursesWithItems();
      console.log("Données récupérées :", data);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      Alert.alert("Erreur", "Impossible de charger les courses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const renderCourseItem = ({ item: shopItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>
        {shopItem.name || "Produit sans nom"}
      </Text>
      <Text style={styles.itemDetail}>
        Quantité: {shopItem.quantity || 0} {shopItem.unit || ""}
      </Text>
      <Text style={styles.itemDetail}>
        Statut: {shopItem.status || "inconnu"}
      </Text>
      {shopItem.date && (
        <Text style={styles.itemDate}>
          Ajouté le: {formatDate(shopItem.date)}
        </Text>
      )}
    </View>
  );

  const renderCourse = ({ item }) => {
    const displayDate = formatDate(item.date);
    
    return (
      <View style={styles.courseContainer}>
        <Text style={styles.courseTitle}>
          {item.description || "Course sans description"}
          {displayDate && ` - ${displayDate}`}
        </Text>
        
        {item.items?.length > 0 ? (
          <FlatList
            data={item.items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCourseItem}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyItemsText}>Aucun produit dans cette course</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Chargement en cours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.idCourse.toString()}
        renderItem={renderCourse}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucune course disponible</Text>
            <Text>Créez votre première course pour commencer</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    padding: 15,
    paddingBottom: 30
  },
  courseContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF'
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  itemDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2
  },
  itemDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic'
  },
  emptyItemsText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50
  },
  emptyTitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10
  }
});

export default ListScreen;