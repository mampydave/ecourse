import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addItem, getMaxIdCourse } from './../database';
import { Picker } from '@react-native-picker/picker';
import styles from '../../assets/style/styles';
import { CourseContext } from '../context/CourseContext';

export default function AddProductScreen() {
  const { idCourse } = useContext(CourseContext);
  const navigation = useNavigation();

  const [activeIdCourse, setActiveIdCourse] = useState(null);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    const initializeCourseId = async () => {
      if (idCourse !== null && idCourse !== undefined) {
        setActiveIdCourse(idCourse);
      } else {
        const fallbackId = await getMaxIdCourse();
        if (fallbackId) {
          setActiveIdCourse(fallbackId);
        } else {
          Alert.alert(
            'Aucune course en cours',
            'Veuillez créer une course avant d’ajouter des produits.'
          );
          navigation.navigate('CourseScreen');
        }
      }
    };
    initializeCourseId();
  }, [idCourse]);

  const handleAddOrEditItem = () => {
    if (!name || !unit || quantity <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un nom, une unité et une quantité valide.');
      return;
    }

    if (editItemId) {
      const updatedItems = cartItems.map((item) =>
        item.id === editItemId ? { ...item, name, unit, quantity } : item
      );
      setCartItems(updatedItems);
      setEditItemId(null);
    } else {
      const newItem = { id: Date.now().toString(), name, unit, quantity };
      setCartItems([...cartItems, newItem]);
    }

    setName('');
    setUnit('kg');
    setQuantity(1);
  };

  const handleEdit = (item) => {
    setName(item.name);
    setUnit(item.unit);
    setQuantity(item.quantity);
    setEditItemId(item.id);
  };

  const handleDoCourse = () => {
    if (cartItems.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez des produits avant de faire vos courses.');
      return;
    }
  
    let hasEmptyName = false;
  
    cartItems.forEach((item) => {

      item.name = item.name.trim();
  

      if (!item.name || item.name === '') {
        hasEmptyName = true;
        console.log('Nom vide pour l\'élément:', item);
      }
    });
  
    if (hasEmptyName) {
      Alert.alert('Erreur', 'Un ou plusieurs produits ont un nom vide. Veuillez corriger.');
      return;
    }
  

    cartItems.forEach((item) => {
      console.log('Ajout de l\'élément:' , item);

      addItem(item.name, item.unit, item.quantity, new Date().toISOString().split('T')[0], activeIdCourse)
        .catch((error) => {
          console.error("Erreur d'ajout d'élément:", error);
        });
    });
  
    setCartItems([]);
    Alert.alert('Succès', 'Les produits ont été ajoutés avec succès.');
    navigation.navigate('CourseScreen', { cartItems });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajoutez un produit :</Text>
      <TextInput
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text>Unité :</Text>
      <Picker
        selectedValue={unit}
        onValueChange={(itemValue) => setUnit(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="kg" value="kg" />
        <Picker.Item label="L" value="L" />
        <Picker.Item label="Divers" value="divers" />
      </Picker>

      <TextInput
        placeholder="Quantité"
        value={quantity.toString()}
        onChangeText={(val) => setQuantity(parseInt(val) || 1)}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleAddOrEditItem} style={styles.button}>
        <Text style={styles.buttonText}>
          {editItemId ? 'Modifier l\'article' : 'Ajouter au panier'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.cartTitle}>Panier :</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItemContainer}>
            <Text style={styles.cartItemText}>
              {item.name} - {item.quantity} {item.unit}
            </Text>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Text style={styles.editText}>Modifier</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity onPress={handleDoCourse} style={styles.button}>
        <Text style={styles.buttonText}>DoCourse</Text>
      </TouchableOpacity>
    </View>
  );
}
