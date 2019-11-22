import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TextInput} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {Appstyles} from './Appstyles';
import * as SQLite from 'expo-sqlite';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import {Camera} from 'expo-camera';

export default function Addimgscreen() {
    navigationOptions = {
      title: 'Lisää kuva'
    };

    const [hasCPermission, setCPermission] = useState(null);
    const [url, setUrl] = useState('');
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
      Alert.alert('Soveluksella ei ole kameran käyttölupaa');
      }
      else {
      let location = await Location.getCurrentPositionAsync({});
          setPin(location);
          console.log(pin.coords)
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

    const db = SQLite.openDatabase('app.db');

    const addImgView = () => {
      const lat = pin.coords.latitude;
      const lng = pin.coords.longitude;
        db.transaction(tx => {
          tx.executeSql('insert into app (url, location, lat, lng) values (?, ?, ?, ?);',
          [url, location, lat, lng])
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
            <Camera style={{ flex: 1 }} ref={camera} /> 
          <Button title="Ota kuva" style={Appstyles.button} icon={<Icon name='camera' color='white' size={20} />} onPress={snap} />
          <Text style={Appstyles.ititle}>Sijainti:</Text>
          <TextInput style={Appstyles.input}
            onChangeText={location => setLocation(location)}
            value={location}
            maxLength={25}
           />
          <Button title='Tallenna' style={Appstyles.button} icon={<Icon name='save' color='white' size={20} />} onPress={() => addImgView()} />
        </View> 
    );
  }
}