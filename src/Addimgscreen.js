import React, {useState, useRef, useEffect} from 'react';
import {View, Text, Alert} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {Appstyles} from './Appstyles';
import * as SQLite from 'expo-sqlite';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import {Camera} from 'expo-camera';

export default function Addimgscreen() {
    navigationOptions = {
      title: 'Lisää kuva',
      headerStyle: Appstyles.header
    };

    const [hasCPermission, setCPermission] = useState(null);
    const [url, setUrl] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState('');
    const [pin, setPin] = useState(null);
    const camera = useRef(null);

    useEffect(() => {
      getLocation();
      askCameraPermission();
    },[]);

    const getLocation = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
      Alert.alert('Soveluksella ei ole sijainnin käyttölupaa');
      }
      else {
      let location = await Location.getCurrentPositionAsync({});
          setPin(location);
      }  
    };

    askCameraPermission = async () => {
      let {status} = await Permissions.askAsync(Permissions.CAMERA);
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
      let url = 'http://www.mapquestapi.com/geocoding/v1/address?key=ihyoBPbv8v81NYUfrVRffI8xIi3LSfuY&street='+address+'&country=Finland';
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
      db.transaction(tx => {
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
            <Button title="Ota kuva" style={Appstyles.button} icon={<Icon name='camera' color='white' size={20} />} onPress={snap} />
            <Input style={Appstyles.input1} label="Etsi osoitteella"
              onChangeText={address => setAddress(address)}
              value={address}
              maxLength={50}
             />
             <Button title='Etsi' icon={<Icon name='search' color='white' size={20} />} onPress={() => searchByAddress()} />
            <Input style={Appstyles.input2} label="Sijainti"
              onChangeText={location => setLocation(location)}
              value={location}
              maxLength={25}
            />
            <Button title='Tallenna' style={Appstyles.button} icon={<Icon name='save' color='white' size={20} />} onPress={() => addImgView()} />
          </View>
        </View> 
    );
  }
}