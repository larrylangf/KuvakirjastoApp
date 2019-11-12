import React, {useEffect} from 'react';
import Mainscreen from './src/screens/Mainscreen';
import {ScreenOrientation} from 'expo';
import Addimgscreen from './src/screens/Addimgscreen';
import  {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

export default function App() {

  useEffect(() => {
    ScreenOrientation.unlockAsync(ScreenOrientation.Orientation.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
    }
  })

  return (
    <Appcontainer/>
  );
}
const myApp = createStackNavigator({
  Home: {screen: Mainscreen},
  Add: {screen: Addimgscreen}
});

const Appcontainer = createAppContainer(myApp);