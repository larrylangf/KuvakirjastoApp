import React, {useState} from 'react';
import {View, TextInput} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import Appstyles from '../styles/Appstyles';
import {SQLite} from 'expo-sqlite';

export default function Addimgscreen(props) {
    navigationOptions = {
      title: 'Lisää kuva ja paikka'
    };

    const [url, setUrl] = useState('');
    const [location, setLocation] = useState('');

    const addImg = () => {
        const db = SQLite.openDatabase('app.db');
        db.transaction(tx => {
            tx.executeSql('insert into app (url, location) values (?, ?);',
            [url, location]);
            }, null, updateImgList)
    }

    return(
        <View style={Appstyles.container} >
          <Button icon={<Icon name='arrow-back' color='white' size={20} />} title='Takaisin' onPress={() => navigate('Mainscreen')} />
          <Text>Kuvan url:</Text>
          <View style={Appstyles.input1}>
            <TextInput 
                onChangeText={url => setUrl(url)}
                value={url}
                maxLength={50}
            />
          </View>
          <Text>Sijainti:</Text>
          <View style={Appstyles.input2}>
            <TextInput 
                onChangeText={location => setLocation(location)}
                value={location}
                maxLength={30}
            />
          </View>
          <Button icon={<Icon name='save' color='white' size={20} />} title='Tallenna' onPress={() => addImg()} />
        </View> 
    );
}