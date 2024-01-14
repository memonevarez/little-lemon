import React, { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import  { MaskedTextInput }  from 'react-native-mask-text';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation}) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarImage, setAvatarImage] = useState(null);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(false);

  useEffect(() => {
    // Fetch user data from AsyncStorage when the component mounts
    const fetchUserData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
        const storedAvatarImage = await AsyncStorage.getItem('avatarImage');
        const storedEmailNotifications = await AsyncStorage.getItem('enableEmailNotifications');
        const storedSpecialOffers = await AsyncStorage.getItem('specialOffers');

        setFirstName(storedFirstName || '');
        setLastName(storedLastName || '');
        setEmail(storedEmail || '');
        setPhoneNumber(storedPhoneNumber || '');
        setAvatarImage(storedAvatarImage ? JSON.parse(storedAvatarImage) : null);
        setEnableEmailNotifications(storedEmailNotifications === 'true');
        setSpecialOffers(storedSpecialOffers === 'true');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatarImage(result.uri);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Save user data to AsyncStorage
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
      await AsyncStorage.setItem('avatarImage', JSON.stringify(avatarImage));
      await AsyncStorage.setItem('enableEmailNotifications', enableEmailNotifications.toString());
      await AsyncStorage.setItem('specialOffers', specialOffers.toString());

      Alert.alert('Changes Saved', 'Your profile changes have been saved successfully.');
    } catch (error) {
      console.error('Error saving changes:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

   const handleLogout = async () => {
    try {
      // Clear all user data from AsyncStorage
      //await AsyncStorage.clear();

      // Navigate to Onboarding screen
      navigation.replace('Onboarding');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  const goHome = async () => {
    try {
      
      navigation.replace('Home');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };


  return (
    <ScrollView style={styles.container}>
            <TouchableOpacity onPress={handleImagePicker} style={styles.imageContainer}>
        {avatarImage ? (
          <Image source={{ uri: avatarImage }} style={styles.avatarImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>{firstName[0]}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <MaskedTextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          mask="+44 9999-999999"
        />
      </View>
     
      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          value={enableEmailNotifications}
          onValueChange={() => setEnableEmailNotifications(!enableEmailNotifications)}
        />
        <Text style={styles.labelCheckbox}>Email Notifications</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          value={specialOffers}
          onValueChange={() => setSpecialOffers(!specialOffers)}
        />
        <Text style={styles.labelCheckbox}>Special Offers</Text>
      </View>

     

      <Button title="Save Changes" onPress={handleSaveChanges} />
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Home" onPress={goHome} />

    </ScrollView>  
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  labelCheckbox: {
    fontSize: 16,
    marginBottom: 0,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
  placeholderText: {
    fontSize: 20,
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    marginLeft: 8,
  },
});

export default Profile;