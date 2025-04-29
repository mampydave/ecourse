import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../database';

export default function StatisticsScreen() {
  const [totalItems, setTotalItems] = useState(0);
  const [mostPurchasedItems, setMostPurchasedItems] = useState([]);
  const [monthlyPurchases, setMonthlyPurchases] = useState(0);
  const [completedPercentage, setCompletedPercentage] = useState(0);

  const fetchStatistics = async () => {
    try {
      const result = await db.transaction(async tx => {
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

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>📊 Statistiques</Text>

      <Text>Total des articles achetés : {totalItems}</Text>
      <Text>Articles achetés ce mois-ci : {monthlyPurchases}</Text>
      <Text>% d’achats terminés : {completedPercentage} %</Text>

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>
        🥇 Produits les plus achetés :
      </Text>

      <FlatList
        data={mostPurchasedItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.name} - {item.total_quantity} {item.unit}</Text>
          </View>
        )}
      />
    </View>
  );
}
