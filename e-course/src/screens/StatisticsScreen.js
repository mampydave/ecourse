import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('shopping.db'); 

export default function StatisticsScreen() {
  const [totalItems, setTotalItems] = useState(0);
  const [mostPurchasedItems, setMostPurchasedItems] = useState([]);


  const fetchStatistics = async () => {
    try {

      const result = await db.transaction(async tx => {
        return new Promise((resolve, reject) => {
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

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Statistiques :</Text>
      <Text>Total des articles achetés : {totalItems}</Text>

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>
        Articles les plus achetés :
      </Text>

      <FlatList
        data={mostPurchasedItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.name} - {item.total_quantity} achetés</Text>
          </View>
        )}
      />
    </View>
  );
}
