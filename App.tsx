import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  ActivityIndicator,
  Image
} from 'react-native';
import axios from 'axios';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  location: {
    name: string;
  };
  episode: string[];
}

const App = () => {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://rickandmortyapi.com/api/character')
      .then(response => {
        setData(response.data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator color="#000000" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Character }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>Status: {item.status}</Text>
        <Text>Species: {item.species}</Text>
        <Text>Gender: {item.gender}</Text>
        <Text>Last Known Location: {item.location.name}</Text>
        <Text>First Seen In: {item.episode[0]}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#f9c2ff",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
