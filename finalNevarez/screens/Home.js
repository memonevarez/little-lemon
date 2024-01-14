import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import {
  createTable,
  getMenuItems,
  deleteMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from '../database';
import Filters from '../components/Filters';
import { getSectionListData, useUpdateEffect } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu-items-by-category.json';
const sections = ['Appetizers', 'Salads', 'Beverages'];

const Item = ({ title, price }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.title}>${price}</Text>
  </View>
);

export default function Home( {navigation}) {
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );
  const [avatarImage, setAvatarImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  
  const goToProfilePage = () => {
    // Navigate to the profile page
    navigation.replace('Profile');
  };

  const fetchData = async() => {
    // 1. Implement this function

    // Fetch the menu from the API_URL endpoint. You can visit the API_URL in your browser to inspect the data returned
    // The category field comes as an object with a property called "title". You just need to get the title value and set it under the key "category".
    // So the server response should be slighly transformed in this function (hint: map function) to flatten out each menu item in the array,

    try {
      const response = await fetch(API_URL);
      var responseData = await response.json();
      var menu = responseData.menu.map((item) => ({
        //id: item['id'],
        //title: item['title'],
        //price: item['price'],
        ...item,
        category: item['category']['title'],
      }));
    } catch (error) {
      console.error(error);
    }
    console.log(menu);
    return menu;
  }

  useEffect(() => {
    // Fetch user data from AsyncStorage when the component mounts
    const fetchUserData = async () => {
      try {
        
        const storedAvatarImage = await AsyncStorage.getItem('avatarImage');
        const storedFirstName = await AsyncStorage.getItem('firstName');
        
        setAvatarImage(storedAvatarImage ? JSON.parse(storedAvatarImage) : null);
        setFirstName(storedFirstName || '');

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await createTable();
       // let aux = await deleteMenuItems();
        let menuItems = await getMenuItems();

        // The application only fetches the menu data once from a remote URL
        // and then stores it into a SQLite database.
        // After that, every application restart loads the menu from the database
        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        //console.log("menu itemsss:",menuItems);
        const sectionListData = getSectionListData(menuItems);
        console.log("guau", JSON.stringify(sectionListData, null, 2));
        setData(sectionListData);
      } catch (e) {
        // Handle error
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (

    
    <SafeAreaView style={styles.container}>
    <View style={styles.containerW}>
    {/* Centered Image */}
    <View style={styles.centeredContainer}>
        <Image
        source={require('../assets/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
        />
    </View>

    {/* Aligned to the Right Image */}
    <TouchableOpacity onPress={goToProfilePage} style={styles.rightContainer}>
        {avatarImage ? (
        <Image source={{ uri: avatarImage }} style={styles.avatarImage} />
        ) : (
        <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>{firstName[0]}</Text>
        </View>
        )}
    </TouchableOpacity>
    </View>
    
    <View >
        

      <View style={styles.containerG}>
        <Image
          source={ require('../assets/HeroImage.png')}
          style={styles.restaurantImage}
          resizeMode="contain"
        />
      </View>
        {/* Hero Banner */}
        <View >
            
            
            {/* Restaurant Name and Description */}
            <View style={styles.textContainer}>
            <Text style={styles.restaurantName}>Little Lemon</Text>
            <Text style={styles.restaurantDescription}>We are a family owned mediterranean restaurant focused on traditional recipes with a modern twist.</Text>
            </View>
        </View>
        </View>

      <Searchbar
        placeholder="Search"
        placeholderTextColor="white"
        onChangeText={handleSearchChange}
        value={searchBarText}
        style={styles.searchBar}
        iconColor="white"
        inputStyle={{ color: 'white' }}
        elevation={0}
      />
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <SectionList
        style={styles.sectionList}
        sections={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item title={item.title} price={item.price} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#495E57',
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    marginBottom: 24,
    backgroundColor: '#495E57',
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    paddingVertical: 8,
    color: '#FBDABB',
    backgroundColor: '#495E57',
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  heroBanner: {
    position: 'relative',
    width: '100%'
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    marginLeft:50,
    paddingLeft: 200,
  },
  textContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 200
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  restaurantDescription: {
    fontSize: 16,
    color: '#fff',
  },
  logo: {
    width: 250,
    height: 250,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 100, // Adjust the width based on your requirements
      height: 100, // Adjust the height based on your requirements
    },
    rightContainer: {
      marginLeft: 'auto', // Pushes the TouchableOpacity to the right
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40, // To make it circular
      // Additional styling for the avatar image
    },
    placeholderImage: {
      width: 80,
      height: 80,
      borderRadius: 40, // To make it circular
      backgroundColor: '#ccc', // Light gray background for placeholder
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff', // White text color
    },
    containerW: {
        flexDirection: 'row', // Horizontal layout
        alignItems: 'center', // Center items vertically
        backgroundColor: '#fff', // White background
      },
      containerG: {
        flexDirection: 'row', // Horizontal layout
        alignItems: 'right', // Center items vertically
        backgroundColor: '#495E57', // White background
      },
});