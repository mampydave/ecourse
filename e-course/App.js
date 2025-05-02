import 'react-native-gesture-handler';
import * as React from 'react';
import { Text , StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddProductScreen from './src/screens/AddProductScreen';
import CourseScreen from './src/screens/CourseScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import { CourseProvider } from './src/context/CourseContext';
import ListScreen from './src/screens/ListScreen';
import { DatabaseProvider, useDatabase } from './src/context/DatabaseContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'AddProduct') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Statistics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'list' : 'list-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: 'black',
          shadowColor: 'rgba(0, 0, 0, 0.8)',
          shadowOpacity: 0.8,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="AddProduct" component={AddProductScreen} options={{ tabBarLabel: 'Ajout' }} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ tabBarLabel: 'Statistiques' }} />
      <Tab.Screen name="List" component={ListScreen} options={{ tabBarLabel: 'List' }} />
    </Tab.Navigator>
  );
}

function RootApp() {
  const { isDbReady } = useDatabase();

  if (!isDbReady) {
    return <Text>Chargement de la base de données...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'welcome' }} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ title: 'Course' }} />
        <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
        <Stack.Screen name="CourseScreen" component={CourseScreen} options={{ title: 'Course' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <CourseProvider>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <RootApp />
      </CourseProvider>
    </DatabaseProvider>
  );
}
