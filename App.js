import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BoardListScreen from './components/BoardListScreen';
import BoardDetailScreen from './components/BoardDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        <Stack.Screen name="Task Fellow" component={BoardListScreen} />
        <Stack.Screen name="BoardDetail" component={BoardDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
