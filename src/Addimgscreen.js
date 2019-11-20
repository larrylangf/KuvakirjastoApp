import React, {useState, useRef, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {Appstyles} from './Appstyles';
import * as SQLite from 'expo-sqlite';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';

export default function Addimgscreen() {
    navigationOptions = {
      title: 'Lisää kuva'
    };

    const [hasCPermission, setCPermission] = useState(null);
    const [url, setUrl] = useState('');
    const [pin, setPin] = useState('');
    const camera = useRef(null);

    useEffect(() => {
      askCameraPermission();
    },[]);

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

    const db = SQLite.openDatabase('test.db');

    addImgView = async () => {
      if (url != null) {
        db.transaction(tx => {
          tx.executeSql('insert into test (url) values (?);', [url])
          });
      } 
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
          <Button title="Ota kuva" style={Appstyles.button} icon={<Icon name='camera' color='white' />} onPress={snap} />
          <Button title='Tallenna' style={Appstyles.button} icon={<Icon name='save' color='white' size={20} />} onPress={addImgView} />
        </View> 
    );
  }
}