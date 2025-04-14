import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons'; 

export default function CourseScreen({ route, navigation }) {
  const [courseItems, setCourseItems] = useState(route.params?.cartItems || []);

  const handleAzo = (itemId) => {
    setCourseItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          if (item.unit === 'kg') {
            return { ...item, quantity: Math.max(item.quantity - 0.5, 0) };
          } else {
            return { ...item, quantity: Math.max(item.quantity - 1, 0) };
          }
        }
        return item;
      })
    );
  };

  const renderItem = ({ item }) => {
    const itemObtained = item.quantity <= 0;
    return (
      <View style={styles.itemContainer}>
        <Text style={[styles.itemText, itemObtained && styles.obtainedText]}>
          {item.name} - Quantité : {item.quantity} {item.category === 'kg' ? 'kg' : ''}
        </Text>
        {!itemObtained && (
          <TouchableOpacity onPress={() => handleAzo(item.id)} style={styles.azoButton}>
            <Text style={styles.azoButtonText}>Azo</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.title}>Produits à obtenir :</Text>
      <FlatList
        data={courseItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'rgb(154, 152, 141)' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  itemText: { flex: 1, fontSize: 16 },
  obtainedText: { textDecorationLine: 'line-through', color: 'gray' },
  azoButton: { backgroundColor: '#4CAF50', padding: 5, borderRadius: 5 },
  azoButtonText: { color: '#fff' },
  arrowButton: {
    position: 'absolute', 
    top: 20,
    left: 10,
    zIndex: 1, 
  },
});
