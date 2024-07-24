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
  Image,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';

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
  const [filteredData, setFilteredData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    axios.get('https://rickandmortyapi.com/api/character')
      .then(response => {
        setData(response.data.results);
        setFilteredData(response.data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterData();
  }, [status, location]);

  const filterData = () => {
    let filtered = data;
    if (status) {
      filtered = filtered.filter(character => character.status.toLowerCase() === status.toLowerCase());
    }
    if (location) {
      filtered = filtered.filter(character => character.location.name.toLowerCase().includes(location.toLowerCase()));
    }
    setFilteredData(filtered);
  };

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
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={status}
          style={styles.picker}
          onValueChange={(itemValue: string) => setStatus(itemValue)}>
          <Picker.Item label="All" value="" />
          <Picker.Item label="Alive" value="Alive" />
          <Picker.Item label="Dead" value="Dead" />
          <Picker.Item label="Unknown" value="unknown" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Last Known Location"
          value={location}
          onChangeText={(text) => setLocation(text)}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    flex: 1,
    marginLeft: 10,
  },
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
