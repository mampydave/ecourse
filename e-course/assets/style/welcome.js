import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f8f3',
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      borderColor: '#ccc',
      borderWidth: 1,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 12,
      marginBottom: 20,
      fontSize: 16,
      color: '#333',
    },
    button: {
      backgroundColor: '#4CAF50',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 4,
      elevation: 4,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  export default styles;