import React, {useState, useRef, useEffect} from 'react';
import {View, Text, Alert} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {Appstyles} from './Appstyles';
import * as SQLite from 'expo-sqlite';
import * as Location from 'expo-location';
import {Camera} from 'expo-camera';
import Mainscreen from './Mainscreen';

export default function Addimgscreen() {

    const [hasCPermission, setCPermission] = useState(null);
    const [url, setUrl] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState('');
    const [pin, setPin] = useState(null);
    const camera = useRef(null);

    useEffect(() => {
      getLocation();
      askCameraPermission();
      return () => {}
    },[]);

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
      Alert.alert('Soveluksella ei ole sijainnin käyttölupaa');
      }
      else {
      let location = await Location.getCurrentPositionAsync({});
          setPin(location);
          <Mainscreen lpin={location} />
      }  
    };

    askCameraPermission = async () => {
      let {status} = await Camera.requestCameraPermissionsAsync();
      setCPermission(status);
    }

    snap = async () => {
        if(camera) {
            let photo = await camera.current.takePictureAsync({base64: false});
            setUrl(photo.uri);
        }
        console.log(url);
    }

    const searchByAddress = () => {
      let url = 'http://www.mapquestapi.com/geocoding/v1/address?key='+process.env.MAPQUEST_API_KEY+'+&street='+address+'&country=Finland';
      fetch(url)
      .then((response) => response.json())
      .then((resJson) => { 
      let lat = resJson.results[0].locations[0].latLng.lat;
      let lng = resJson.results[0].locations[0].latLng.lng;
      setPin({coords: {latitude: lat, longitude: lng}})
      .catch((err) => {
          console.log(err);
      })
    })  
  } 

    const db = SQLite.openDatabase('app.db');

    const addImgView = () => {
        db.transaction(tx => {
          tx.executeSql('insert into app (url, location, lat, lng) values (?, ?, ?, ?);',
          [url, location, pin.coords.latitude, pin.coords.longitude])
          });
      updateImgView();
    } 

    const updateImgView = () => {
      const q = db.transaction(tx => {
          tx.executeSql('select * from app;', [], (_, { rows }) =>
              console.log(rows._array)
          );
      });
    }

    if (hasCPermission == null) {
      return <View />;
    } 
    else if (hasCPermission == false) {
      return <Text>Kameran käyttö estetty</Text>;
    } 
    else {
      return(
        <View style={{flex: 1}} >
            <Camera style={{ flex: 1.5 }} ref={camera} /> 
          <View style={Appstyles.addcontainer}>
            <Button containerStyle={Appstyles.button1} buttonStyle={{backgroundColor: '#ff6f00'}} title="Ota kuva" titleStyle={{fontSize: 20}} icon={<Icon name='camera' color='#f7f7f7' size={24} />} onPress={snap} />
              <Input placeholder="Etsi osoitteella" containerStyle={Appstyles.icontainer}
                onChangeText={address => setAddress(address)}
                value={address}
                maxLength={50}
              />
             <Button containerStyle={Appstyles.button2} buttonStyle={{backgroundColor: '#ff6f00'}} title='Etsi' titleStyle={{fontSize: 20}} icon={<Icon name='search' color='#f7f7f7' size={24} />} onPress={() => searchByAddress()} />
              <Input placeholder="Sijainti" containerStyle={Appstyles.icontainer}
                onChangeText={location => setLocation(location)}
                value={location}
                maxLength={25}
              />
            <Button title='Tallenna' titleStyle={{fontSize: 20}} containerStyle={Appstyles.button2} buttonStyle={{backgroundColor: '#ff6f00'}} icon={<Icon name='save' color='#f7f7f7' size={24} />} onPress={() => {addImgView();Alert.alert('Tallennettu')}} />
          </View>
        </View> 
    );
  }
}