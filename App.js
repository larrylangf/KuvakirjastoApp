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
  Home: {screen: Mainscreen},
  Add: {screen: Addimgscreen}
});

const Appcontainer = createAppContainer(myApp);