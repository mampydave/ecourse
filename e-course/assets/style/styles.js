import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fffaf0', // Fond jaunâtre doux (Blanc Floral)
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'rgb(154, 152, 141)', // Jaune lumineux pour attirer l’attention
  },
  input: {
    backgroundColor: '#f0f8ff', // Bleu clair subtil (AliceBlue)
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fdd835', // Bordure jaune
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333', // Texte gris foncé pour une bonne lisibilité
  },
  picker: {
    backgroundColor: '#f0f8ff', // Fond bleu clair
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fdd835', // Bordure jaune
    padding: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'rgb(172, 162, 117)', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ffecb3', // Ombre jaune pâle
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#ffffff', // Texte blanc pour un bon contraste
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'rgb(154, 152, 141)', 
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f8ff', // Fond bleu clair
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fdd835', // Bordure jaune
    shadowColor: '#ddd', // Ombre douce
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cartItemText: {
    fontSize: 16,
    color: '#333333', // Texte gris foncé pour une bonne lisibilité
  },
  editText: {
    color: '#007acc', // Texte bleu clair pour les actions "Modifier"
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
