import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleNameChange = (text) => {
    // Check if the name contains only string characters
    const isValid = /^[a-zA-Z]+$/.test(text);
    setName(text);
    setIsNameValid(isValid);
  };

  const handleEmailChange = (text) => {
    // Check if the email is properly formatted
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
    setEmail(text);
    setIsEmailValid(isValid);
  };

  const handleNextButton = () => {
    // Implement the logic to proceed to the next step or complete the onboarding process
    console.log('Name:', name);
    console.log('Email:', email);
  };
  
  const handleCompleteOnboarding = async () => {
    try {
      // Set onboarding completion flag in AsyncStorage
      let onboardingFlag = await AsyncStorage.getItem('onboardingCompleted');
      console.log("myStateeee111",onboardingFlag);
      await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(true));
      onboardingFlag = await AsyncStorage.getItem('onboardingCompleted');
      console.log("myStateeee222",onboardingFlag);
      // Navigate to the next screen (ProfileScreen in this case)
      navigation.replace('Home');
    } catch (error) {
      console.error('Error setting onboarding completion state:', error);
    }
  };  
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={ require('../assets/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Let us get to know you</Text>
      </View>

      <TextInput
        style={[styles.input, !isNameValid && styles.inputError]}
        placeholder="Your Name"
        onChangeText={handleNameChange}
      />

      <TextInput
        style={[styles.input, !isEmailValid && styles.inputError]}
        placeholder="Your Email"
        onChangeText={handleEmailChange}
        keyboardType="email-address"
      />

      <Button title="Next" onPress={handleCompleteOnboarding} disabled={!isNameValid || !isEmailValid} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '80%',
  },
  inputError: {
    borderColor: 'red',
  },
});

export default Onboarding;
