import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WelcomeScreen')}
      >
        <Text style={styles.buttonText}>Nouvelle course</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10
  },
  buttonText: { color: '#fff', fontSize: 16 }
});
