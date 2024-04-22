import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';

import logo from './assets/icon.png'; 

function Content() {
  const [isLoading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
              if (!response.ok) {
                  throw new Error("Network no responde");
              }
              const data = await response.json();

              const pokemonRequests = data.results.map(async pokemon => {
                  const pokemonResponse = await fetch(pokemon.url);
                  return pokemonResponse.json();
              });
              const pokemonData = await Promise.all(pokemonRequests);

              setItems(pokemonData);
              setLoading(false);
          } catch (error) {
              setLoading(false);
          }
      };

      fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filteredResults = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [searchTerm, items]);

  const handleSearch = () => {
    setSearchResults([]);
    setSearchTerm('');
  };

  if (isLoading) {
      return (
          <View style={styles.container}>
              <Text>Cargando...</Text>
          </View>
      );
  }

  return (
      <View style={styles.container}>
          <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              value={searchTerm}
              onChangeText={text => setSearchTerm(text)}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>

          <FlatList
              data={searchTerm.trim() === '' ? items : searchResults}
              renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                      <Image
                          source={{ uri: item.sprites.front_default}}
                          style={styles.itemImage}
                      />
                      <Text style={styles.itemName}>{item.name}</Text>
                  </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContainer}
          />
      </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.navbarTitle}>PokePedia</Text>
      </View>

      <Content />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    opacity: 0.9,
  },
  navbar: {
    height: 100,
    backgroundColor:'#650000', 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    height: 20,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
  },
  searchButton: {
    backgroundColor: '#CC4747',
    border: "3px solid #FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
      paddingHorizontal: 10,
      paddingTop: 10,
  },
  itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      padding: 10,
  },
  itemImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
  },
  itemName: {
      fontSize: 18,
      fontWeight: 'bold',
  },
});
