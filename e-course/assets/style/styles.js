import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fffaf0', 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'rgb(154, 152, 141)', 
  },
  input: {
    backgroundColor: '#f0f8ff', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fdd835', 
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333', 
  },
  picker: {
    backgroundColor: '#f0f8ff', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fdd835', 
    padding: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'rgb(172, 162, 117)', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ffecb3', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#ffffff', 
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
    backgroundColor: '#f0f8ff', 
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fdd835', 
    shadowColor: '#ddd', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cartItemText: {
    fontSize: 16,
    color: '#333333', 
  },
  editText: {
    color: '#007acc', 
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
