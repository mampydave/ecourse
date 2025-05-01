import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CourseContext } from '../context/CourseContext';
import { db, updateStatusToSkip } from '../database';
import styles from '../../assets/style/welcome';

const WelcomeScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const { setIdCourse } = useContext(CourseContext);

  useEffect(() => {
    checkLastCourseStatus();
  }, []);

  const checkLastCourseStatus = async () => {
    try {
      const lastCourse = await db.getFirstAsync('SELECT MAX(idCourse) as id FROM course');
      if (!lastCourse?.id) return;

      const items = await db.getAllAsync(
        'SELECT * FROM shopping_items WHERE idCourse = ? AND status = ?',
        [lastCourse.id, 'en cours']
      );

      if (items.length > 0) {
        Alert.alert(
          "Course en cours",
          "Une course précédente est toujours en cours. Voulez-vous la reprendre ?",
          [
            {
              text: "Reprendre",
              onPress: () => {
                setIdCourse(lastCourse.id);
                navigation.replace('CourseScreen', { idCourse: lastCourse.id });
              }
            },
            {
              text: "Ignorer",
              style: "cancel",
              onPress: async () => {
                try {
                  await updateStatusToSkip();
                } catch (error) {
                  console.error("Erreur lors du skip de la course :", error);
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la dernière course:", error);
    }
  };

  const createCourse = async () => {
    try {
      await db.runAsync('INSERT INTO course (description) VALUES (?);', [description]);
      const result = await db.getFirstAsync('SELECT MAX(idCourse) as id FROM course');
      const newId = result.id;
      setIdCourse(newId);
      navigation.replace('MainApp');
    } catch (error) {
      console.error("Échec de la création de la course :", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouvelle course</Text>
      <TextInput
        placeholder="Description de la course"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={createCourse}>
        <Text style={styles.buttonText}>Créer la course et commencer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;


