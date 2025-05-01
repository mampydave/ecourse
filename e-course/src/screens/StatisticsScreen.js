import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db } from '../database';

export default function StatisticsScreen() {
  const [totalItems, setTotalItems] = useState(0);
  const [mostPurchasedItems, setMostPurchasedItems] = useState([]);
  const [monthlyPurchases, setMonthlyPurchases] = useState(0);
  const [completedPercentage, setCompletedPercentage] = useState(0);

  const fetchStatistics = async () => {
    try {
      await db.transaction(async tx => {
        const getItems = () => new Promise((resolve, reject) => {
          tx.executeSql(
            'SELECT name, unit, SUM(quantity) as total_quantity FROM shopping_items GROUP BY name ORDER BY total_quantity DESC',
            [],
            (_, { rows }) => resolve(rows._array),
            (_, error) => reject(error)
          );
        });

        const getMonthly = () => new Promise((resolve, reject) => {
          tx.executeSql(
            `SELECT SUM(quantity) as month_total FROM shopping_items 
             WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`,
            [],
            (_, { rows }) => resolve(rows._array[0]?.month_total || 0),
            (_, error) => reject(error)
          );
        });

        const getCompletion = () => new Promise((resolve, reject) => {
          tx.executeSql(
            `SELECT 
               SUM(CASE WHEN status = 'finished' THEN 1 ELSE 0 END) as finished,
               COUNT(*) as total 
             FROM shopping_items`,
            [],
            (_, { rows }) => {
              const finished = rows._array[0]?.finished || 0;
              const total = rows._array[0]?.total || 0;
              const percent = total > 0 ? (finished / total * 100).toFixed(1) : 0;
              resolve(percent);
            },
            (_, error) => reject(error)
          );
        });

        const items = await getItems();
        const monthTotal = await getMonthly();
        const percentCompleted = await getCompletion();

        setMostPurchasedItems(items);
        setMonthlyPurchases(monthTotal);
        setCompletedPercentage(percentCompleted);
        setTotalItems(items.reduce((sum, item) => sum + item.total_quantity, 0));
      });
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
    <View style={styles.container}>
      <Text style={styles.title}>📊 Statistiques</Text>

      <Text>Total des articles achetés : {totalItems}</Text>
      <Text>Articles achetés ce mois-ci : {monthlyPurchases}</Text>
      <Text>% d’achats terminés : {completedPercentage} %</Text>

      <Text style={styles.subtitle}>🥇 Produits les plus achetés :</Text>

      <FlatList
        data={mostPurchasedItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>{item.name} - {item.total_quantity} {item.unit}</Text>
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
