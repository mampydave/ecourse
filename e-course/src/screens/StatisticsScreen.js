import React, { useEffect, useState } from 'react';
<<<<<<< Updated upstream
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('shopping.db'); 
=======
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db } from '../database';
>>>>>>> Stashed changes

export default function StatisticsScreen() {
  const [totalItems, setTotalItems] = useState(0);
  const [mostPurchasedItems, setMostPurchasedItems] = useState([]);


  const fetchStatistics = async () => {
    try {
<<<<<<< Updated upstream

      const result = await db.transaction(async tx => {
        return new Promise((resolve, reject) => {
=======
      await db.transaction(async tx => {
        const getItems = () => new Promise((resolve, reject) => {
>>>>>>> Stashed changes
          tx.executeSql(
            'SELECT name, category, SUM(quantity) as total_quantity FROM shopping_items GROUP BY name ORDER BY total_quantity DESC',
            [],
            (_, { rows }) => resolve(rows._array),
            (tx, error) => reject(error)
          );
        });
      });

      const total = result.reduce((sum, item) => sum + item.total_quantity, 0);
      setTotalItems(total);


      setMostPurchasedItems(result);
    } catch (error) {
      console.log('Erreur lors de la récupération des statistiques:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const resetData = async () => {
    Alert.alert(
      "Réinitialiser les données",
      "Êtes-vous sûr de vouloir supprimer toutes les données ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Confirmer",
          style: "destructive",
          onPress: async () => {
            try {
              await db.transaction(tx => {
                tx.executeSql('DELETE FROM shopping_items');
                tx.executeSql('DELETE FROM course');
                tx.executeSql("DELETE FROM sqlite_sequence WHERE name = 'shopping_items'");
                tx.executeSql("DELETE FROM sqlite_sequence WHERE name = 'course'");
              });              
              setMostPurchasedItems([]);
              setMonthlyPurchases(0);
              setCompletedPercentage(0);
              setTotalItems(0);
              Alert.alert("Données réinitialisées avec succès.");
            } catch (error) {
              console.error("Erreur lors de la réinitialisation :", error);
            }
          }
        }
      ]
    );
  };

  return (
<<<<<<< Updated upstream
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Statistiques :</Text>
=======
    <View style={styles.container}>
      <Text style={styles.title}>📊 Statistiques</Text>

>>>>>>> Stashed changes
      <Text>Total des articles achetés : {totalItems}</Text>

<<<<<<< Updated upstream
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>
        Articles les plus achetés :
      </Text>
=======
      <Text style={styles.subtitle}>🥇 Produits les plus achetés :</Text>
>>>>>>> Stashed changes

      <FlatList
        data={mostPurchasedItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
<<<<<<< Updated upstream
          <View style={{ marginBottom: 10 }}>
            <Text>{item.name} - {item.total_quantity} achetés</Text>
=======
          <View style={styles.itemRow}>
            <Text>{item.name} - {item.total_quantity} {item.unit}</Text>
>>>>>>> Stashed changes
          </View>
        )}
      />

      <TouchableOpacity style={styles.resetButton} onPress={resetData}>
        <Text style={styles.resetButtonText}>🗑️ Réinitialiser les données</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20
  },
  itemRow: {
    marginBottom: 10
  },
  resetButton: {
    backgroundColor: '#d9534f',
    padding: 14,
    marginTop: 30,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
