import * as React from 'react';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/Onboarding';
import Profile from './screens/Profile';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Check AsyncStorage for onboarding completion state
    const checkOnboardingCompletion = async () => {
      try {
       // await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(false));
        const onboardingFlag = await AsyncStorage.getItem('onboardingCompleted');
        if (onboardingFlag !== null) {
          setIsOnboardingCompleted(JSON.parse(onboardingFlag));
        }
      } catch (error) {
        console.error('Error reading onboarding completion state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingCompletion();
  }, []);

  if (isLoading) {
    // Display Splash Screen while loading from AsyncStorage
    console.log('isOnboardingCompleted:', isOnboardingCompleted);
    return <Onboarding />;
  };

 return (
   <NavigationContainer>
     <Stack.Navigator>
     {isOnboardingCompleted ? 
     (<>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={Home} />
      </>)
     : 
     (
     <>
     <Stack.Screen name="Profile" component={Profile} />
     <Stack.Screen name="Onboarding" component={OnboardingScreen} />
     <Stack.Screen name="Home" component={Home} />
     </>)
     }     
     </Stack.Navigator>
   </NavigationContainer>
 );
}
export default App;