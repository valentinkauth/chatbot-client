import React from 'react';
import { AsyncStorage, View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import HomeScreen from './screens/HomeScreen'
import SettingsScreen from './screens/SettingsScreen'
import DataScreen from './screens/DataScreen'


const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Settings: SettingsScreen,
    Data: DataScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}