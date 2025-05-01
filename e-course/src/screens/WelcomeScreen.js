import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { CourseContext } from '../context/CourseContext';
import {
  getLastCourseId,
  getInProgressItemsByCourse,
  updateStatusToSkip,
  createCourse as createCourseDB
} from '../database';
import styles from '../../assets/style/welcome';

const WelcomeScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const { setIdCourse } = useContext(CourseContext);

  useEffect(() => {
    (async () => {
      try {
        await checkLastCourseStatus();
      } catch (e) {
        console.error("Erreur inattendue au lancement :", e);
      }
    })();
  }, []);

  const checkLastCourseStatus = async () => {
    try {
      const lastCourseId = await getLastCourseId();
      if (!lastCourseId) return;

      const items = await getInProgressItemsByCourse(lastCourseId);
      if (items.length > 0) {
        Alert.alert(
          "Course en cours",
          "Une course précédente est toujours en cours. Voulez-vous la reprendre ?",
          [
            {
              text: "Reprendre",
              onPress: () => {
                setIdCourse(lastCourseId);
                navigation.replace('CourseScreen', { idCourse: lastCourseId });
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

  const handleCreateCourse = async () => {
    if (!description.trim()) {
      Alert.alert("Erreur", "La description ne peut pas être vide.");
      return;
    }
  
    try {
      const newId = await createCourseDB(description);
      if (newId !== null) {
        setIdCourse(newId);
        navigation.replace('MainApp');
      }
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
      <TouchableOpacity style={styles.button} onPress={handleCreateCourse}>
        <Text style={styles.buttonText}>Créer la course et commencer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
