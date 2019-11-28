import React, {useState, useEffect} from 'react';
import {View, Modal, Image} from 'react-native';
import {Button, Icon, ListItem, Header} from 'react-native-elements';
import * as SQLite from 'expo-sqlite';
import {Appstyles} from './Appstyles';
import MapView from 'react-native-maps';

export default function Mainscreen(props) {
    
    const {navigate} = props.navigation;
    const [data, setData] = useState([]);
    const [mVisible, setMVisible] = useState(false);
    const [gmapVisible, setGmapVisible] = useState(false);
    const [mImg, setMImg] = useState('');

    const screenFocus = props.navigation.addListener('willFocus', () => {       
        updateImgList();
    });

    const db = SQLite.openDatabase('app.db');

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists app (id integer '+ 
            'primary key not null, url text, location text, lat real, lng real);');
        });
        return() => {
            screenFocus.remove();
        }
    },[]);
    
    const delImg = (id) => {
        db.transaction(
            tx => { tx.executeSql(`delete from app where id = ?;`, [id]);}, null, updateImgList) 
    }
    
    const updateImgList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from app;', [], (_, { rows }) => {
                setData(rows._array)
            })
        })
    }

    const rowData = data.map((item) => (
          <ListItem key={item.id} containerStyle={Appstyles.listitem}
            onPress={() => toggleModal(true, item.id, false)}
            title={<Image style={Appstyles.img} source={{uri: item.url}}  />}   
            onLongPress={() => delImg(item.id)}
          />
    ))
    
    const toggleModal = (mvisible, id, gvisible) => {
        db.transaction(tx => {
            tx.executeSql('select * from app where id = ?;', [id], (_, { rows }) => {
                    const url = rows._array[0].url;
                    setMImg(url);
                }
            )
        });
        setMVisible(mvisible);
        setGmapVisible(gvisible);
    }

    return(
        <View style={Appstyles.container}>
            <Header centerComponent={{text: 'KuvakirjastoApp', style: {color: '#f7f7f7', fontSize: 24, fontWeight: '700'}}}
               containerStyle={Appstyles.header} backgroundColor='#ff6f00' centerContainerStyle={{justifyContent: 'center', alignItems: 'center'}} />
            <View style={Appstyles.listView}>
                {rowData}
            </View> 
            <View style={Appstyles.bcontainer}>
                <Button containerStyle={Appstyles.button} buttonStyle={{backgroundColor: '#ff6f00'}} icon={<Icon name="add" color="#f7f7f7" size={24} />} 
                    title="Lisää kuva" titleStyle={{color: '#f7f7f7', fontSize: 20}} onPress={() => navigate('Add')} />
                <Button containerStyle={Appstyles.button} buttonStyle={{backgroundColor: '#ff6f00'}} icon={<Icon name="location-on" color="#f7f7f7" size={24} />} 
                    title="Näytä sijainnit" titleStyle={{color: '#f7f7f7', fontSize: 20}} onPress={() => toggleModal(false, null, true)} />
            </View>
                <Modal
                    visible={mVisible}
                    animationIn="slideIn"
                    animationInTiming={2000}
                    transparent={false}
                    onRequestClose={() => setMVisible(!mVisible)}
                    style={Appstyles.modal}
                    >
                    <Image style={Appstyles.mimg} source={{uri: mImg}}/>
                    <View style={{flex: 0.3, justifyContent: 'center', alignItems: 'center',}}>
                        <Button buttonStyle={Appstyles.mbutton} icon={<Icon name="arrow-back" color="#f7f7f7" size={22} />} iconContainerStyle={{marginRight: 120}} onPress={() => setMVisible(!mVisible)}
                            title='Takaisin' titleStyle={{color: '#f7f7f7', fontSize: 20}} />
                    </View>
                </Modal>
                <Modal
                    visible={gmapVisible}
                    animationIn="slideIn"
                    animationInTiming={2000}
                    transparent={false}
                    onRequestClose={() => setGmapVisible(!gmapVisible)}
                    >
                    <MapView
                        style={{flex: 1}}
                        initialRegion={{
                        latitude: 60.1990445,
                        longitude: 24.9248416,
                        latitudeDelta: 0.09,
                        longitudeDelta: 0.02
                        }}>
                        {data.map(marker => (
                        <MapView.Marker coordinate={{latitude: marker.lat, longitude: marker.lng}} 
                            title={marker.location} key={marker.id} />
                        ))}
                    </MapView>
                </Modal> 
        </View>
        );
}