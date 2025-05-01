import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Dimensions,
  RefreshControl 
} from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatistics = async () => {
    try {
      setRefreshing(true);
      const items = await getMostPurchasedItems();
      const monthTotal = await getMonthlyPurchases();
      const percentCompleted = await getCompletionPercentage();

      setMostPurchasedItems(items);
      setMonthlyPurchases(monthTotal);
      setCompletedPercentage(percentCompleted);
      setTotalItems(items.reduce((sum, item) => sum + item.total_quantity, 0));
    } catch (error) {
      console.log('Erreur lors de la récupération des statistiques:', error);
      Alert.alert('Erreur', 'Impossible de charger les statistiques');
    } finally {
      setRefreshing(false);
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
              await fetchStatistics();
              Alert.alert("Succès", "Données réinitialisées avec succès.");
            }
          }
        }
      ]
    );
  };


  const topProductsData = mostPurchasedItems.slice(0, 5).map((item, index) => ({
    name: item.name,
    quantity: item.total_quantity,
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index],
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));

  const barChartData = {
    labels: mostPurchasedItems.slice(0, 5).map(item => item.name.substring(0, 12) + (item.name.length > 12 ? '...' : '')),
    datasets: [{
      data: mostPurchasedItems.slice(0, 5).map(item => item.total_quantity)
    }]
  };

  const progressChartData = {
    labels: ["Complétion"],
    data: [completedPercentage / 100]
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchStatistics}
          colors={['#007AFF']}
        />
      }
    >
      <Text style={styles.title}>📊 Statistiques</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progression des achats</Text>
        <ProgressChart
          data={progressChartData}
          width={screenWidth - 40}
          height={160}
          chartConfig={chartConfig}
          hideLegend={false}
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
          verticalLabelRotation={30}
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

      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={resetData}
        disabled={refreshing}
      >
        <Text style={styles.resetButtonText}>
          {refreshing ? 'Chargement...' : '🗑️ Réinitialiser les données'}
        </Text>
      </TouchableOpacity>
      

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForLabels: {
    fontSize: 10
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40
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
  chartLabel: {
    textAlign: 'center',
    marginTop: 5,
    color: '#666',
    fontSize: 14
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
    elevation: 3,
    opacity: 1
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  spacer: {
    height: 40
  }
});