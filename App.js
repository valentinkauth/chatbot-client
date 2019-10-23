import React from 'react';
import { AsyncStorage, View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ChatScreen from './screens/ChatScreen'
import SettingsScreen from './screens/SettingsScreen'
import DataScreen from './screens/DataScreen'

// Chatbot name ideas: 
// Freya, Leah, Muki


const AppNavigator = createStackNavigator(
  {
    Chat: ChatScreen,
    Settings: SettingsScreen,
    Data: DataScreen,
  },
  {
    initialRouteName: 'Chat',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#3966FB"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    },
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}