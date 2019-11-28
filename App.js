import React from 'react';
import Mainscreen from './src/Mainscreen';
import Addimgscreen from './src/Addimgscreen';
import  {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

export default function App() {

  return (
    <Appcontainer/>
  );
}
const myApp = createStackNavigator({
  Home: {
    screen: Mainscreen, 
    navigationOptions: {
      header: null
    }
  },
  Add: {
    screen: Addimgscreen,
    navigationOptions: {
      title: 'Lisää kuva',
      headerTitleStyle: {color: '#f7f7f7', fontSize: 24},
      headerStyle: {
        height: 60,
        backgroundColor: '#ff6f00'
      },
      headerTintColor: '#f7f7f7'
    }
  }
});

const Appcontainer = createAppContainer(myApp);