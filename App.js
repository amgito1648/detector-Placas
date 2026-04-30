import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [image, setImage] = useState(null);
  const [placa, setPlaca] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      subirImagen(result.assets[0]);
    }
  };

  const subirImagen = async (photo) => {
    const formData = new FormData();
    formData.append('file', {
      uri: photo.uri,
      type: 'image/jpeg',
      name: 'placa.jpg',
    });

    try {
      const response = await fetch('http://52.73.29.38:8000/predict/', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = await response.json();
      setPlaca(data.placa);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor AWS");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detector de Placas 🇨🇴</Text>
      <Button title="Tomar Foto de Placa" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.img} />}
      {placa ? <Text style={styles.result}>Placa: {placa}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  img: { width: 300, height: 300, marginTop: 20, borderRadius: 10 },
  result: { fontSize: 30, color: 'red', marginTop: 20, fontWeight: 'bold' }
});