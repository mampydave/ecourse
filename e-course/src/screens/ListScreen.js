import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getCoursesWithItems } from './../database';

const ListScreen = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursesWithItems();
        console.log("Données récupérées :", data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const renderCourse = ({ item }) => (
    <View style={styles.courseContainer}>
      <Text style={styles.courseTitle}>Course: {item.description}</Text>
      <FlatList
        data={item.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>Name: {item.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.idCourse.toString()}
        renderItem={renderCourse}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  courseContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginBottom: 5,
  },
});

export default ListScreen;
