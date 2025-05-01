import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import {
  BarChart,
  PieChart,
  ProgressChart
} from 'react-native-chart-kit';
import {
  getMostPurchasedItems,
  getMonthlyPurchases,
  getCompletionPercentage,
  resetAllData
} from '../database';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const [totalItems, setTotalItems] = useState(0);
  const [mostPurchasedItems, setMostPurchasedItems] = useState([]);
  const [monthlyPurchases, setMonthlyPurchases] = useState(0);
  const [completedPercentage, setCompletedPercentage] = useState(0);

  const fetchStatistics = async () => {
    try {
      const items = await getMostPurchasedItems();
      const monthTotal = await getMonthlyPurchases();
      const percentCompleted = await getCompletionPercentage();

      setMostPurchasedItems(items);
      setMonthlyPurchases(monthTotal);
      setCompletedPercentage(percentCompleted);
      setTotalItems(items.reduce((sum, item) => sum + item.total_quantity, 0));
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
            const success = await resetAllData();
            if (success) {
              setMostPurchasedItems([]);
              setMonthlyPurchases(0);
              setCompletedPercentage(0);
              setTotalItems(0);
              Alert.alert("Données réinitialisées avec succès.");
            }
          }
        }
      ]
    );
  };

  // Préparation des données pour les graphiques
  const topProductsData = mostPurchasedItems.slice(0, 5).map(item => ({
    name: item.name,
    quantity: item.total_quantity,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));

  const barChartData = {
    labels: mostPurchasedItems.slice(0, 5).map(item => item.name),
    datasets: [{
      data: mostPurchasedItems.slice(0, 5).map(item => item.total_quantity)
    }]
  };

  const progressChartData = {
    labels: ["Complétion"],
    data: [completedPercentage / 100]
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Statistiques</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progression des achats</Text>
        <ProgressChart
          data={progressChartData}
          width={screenWidth - 40}
          height={160}
          chartConfig={chartConfig}
          hideLegend={false}
          style={styles.chart}
        />
        <Text style={styles.chartLabel}>{completedPercentage}% complétés</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top 5 des produits</Text>
        <BarChart
          data={barChartData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Répartition des achats</Text>
        <PieChart
          data={topProductsData}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          accessor="quantity"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chart}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total achetés</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{monthlyPurchases}</Text>
          <Text style={styles.statLabel}>Ce mois-ci</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetData}>
        <Text style={styles.resetButtonText}>🗑️ Réinitialiser les données</Text>
      </TouchableOpacity>
    </View>
  );
}

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#007AFF'
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444'
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8
  },
  chartLabel: {
    textAlign: 'center',
    marginTop: 5,
    color: '#666'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  resetButton: {
    backgroundColor: '#d9534f',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});