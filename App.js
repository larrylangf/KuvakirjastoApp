import React, {useEffect} from 'react';
import Mainscreen from './src/Mainscreen';
import {ScreenOrientation} from 'expo';
import Addimgscreen from './src/Addimgscreen';
import  {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

export default function App() {

  /*useEffect(() => {
    ScreenOrientation.unlockAsync(ScreenOrientation.Orientation);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
    }
  })*/

  return (
    <Appcontainer/>
  );
}
const myApp = createStackNavigator({
  Koti: {screen: Mainscreen},
  Lisää: {screen: Addimgscreen}
});

const Appcontainer = createAppContainer(myApp);