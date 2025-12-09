// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import ListItem from '../components/ListItem';
import { fetchUsers } from '../services/ApiService';
import * as Location from 'expo-location'; 

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // --- EJERCICIO 2: INTEGRACIÓN API ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await fetchUsers(); 
        const productList = users.map((user, index) => ({
          id: user.id.toString(),
          name: user.name,
          description: user.email,
          details: user.company.catchPhrase
        }));
        setData(productList);
      } catch (e) {
        Alert.alert("Error", "No se pudieron cargar los datos de la API.");
        setData([
          { id: '1', name: 'Producto Mock 1', description: 'Descripción', details: 'Detalles mock' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- RECURSO: OPCIÓN A (GPS/Ubicación) ---
  const handleLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permiso de acceso a la ubicación denegado.');
      Alert.alert("Permiso Denegado", "Se requiere permiso de ubicación para esta función.");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
    Alert.alert("Ubicación Obtenida", Lat: ${loc.coords.latitude.toFixed(4)}, Lon: ${loc.coords.longitude.toFixed(4)});
  };

  // --- NAVEGACIÓN (Ejercicio 1) ---
  const handleItemPress = (item) => {
    navigation.navigate('Detail', { itemData: item }); 
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Elementos</Text>
      
      <Button title="Obtener Mi Ubicación (Recurso)" onPress={handleLocation} />
      {location && <Text style={styles.locationText}>Ubicación: {location.coords.latitude.toFixed(2)}, {location.coords.longitude.toFixed(2)}</Text>}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem item={item} onPress={handleItemPress} /> 
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  loading: { flex: 1, justifyContent: 'center' },
  locationText: { textAlign: 'center', marginVertical: 5, color: 'green' },
  errorText: { textAlign: 'center', marginVertical: 5, color: 'red' },
});

export default HomeScreen;
