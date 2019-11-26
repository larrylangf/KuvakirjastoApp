import React, {useState, useEffect} from 'react';
import {View, Modal, Image} from 'react-native';
import {Button, Icon, ListItem} from 'react-native-elements';
import * as SQLite from 'expo-sqlite';
import {Appstyles} from './Appstyles';
import MapView from 'react-native-maps';

export default function Mainscreen(props) {
    navigationOptions = {
        title: 'KuvakirjastoApp',
        headerStyle: Appstyles.header
    }

    const {navigate} = props.navigation;
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
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
        <ListItem key={item.id}
            onPress={() => toggleModal(true, item.id, false)}
            title={<Image style={Appstyles.img} source={{uri: item.url}}  />}   
            rightIcon={<Icon name="delete" color="black" size={20} marginBottom={100} padding={5} />} 
            onLongPress={() => delImg(item.id)}
        />
    ))
    
    const toggleModal = (visible, id, gvisible) => {
        db.transaction(tx => {
            tx.executeSql('select * from app where id = ?;', [id], (_, { rows }) => {
                    const url = rows._array[0].url;
                    setMImg(url);
                }
            )
        });
        setModalVisible(visible);
        setGmapVisible(gvisible);
    }

        return(
            <View style={Appstyles.container}>
                <View style={Appstyles.listView}>
                   {rowData}
                </View> 
                    <Button style={Appstyles.button} icon={<Icon name="add" color="white" size={20} />} 
                        title="Lisää kuva" onPress={() => navigate('Add')} />
                    <Button style={Appstyles.button} icon={<Icon name="location-on" color="white" size={20} />} 
                        title="Näytä sijainnit" onPress={() => toggleModal(false, null, true)} />
                    <Modal
                        visible={modalVisible}
                        animationIn="slideIn"
                        animationInTiming={1500}
                        transparent={false}
                        style={Appstyles.modal}
                        onRequestClose={() => setModalVisible(!modalVisible)}
                        >
                            <Image style={Appstyles.mimg} source={{uri: mImg}}/>
                      <Button style={Appstyles.button} icon={<Icon name="arrow-back" color="white" size={20} />} onPress={() => setModalVisible(!modalVisible)}
                             title='Takaisin' />
                    </Modal>
                    <Modal
                        visible={gmapVisible}
                        animationIn="slideIn"
                        animationInTiming={1500}
                        transparent={false}
                        onRequestClose={() => setGmapVisible(!gmapVisible)}
                        >
                          <MapView
                            style={{flex: 1}}
                            initialRegion={{
                            latitude: 60.3289292,
                            longitude: 24.9024031,
                            latitudeDelta: 0.09,
                            longitudeDelta: 0.0025
                            }}>
                            {data.map(marker => (
                            <MapView.Marker coordinate={{latitude: marker.lat, longitude: marker.lng}} 
                                title={marker.location} key={marker.id} />
                            ))}
                          </MapView>
                        <Button icon={<Icon name="arrow-back" color="white" size={20} />} onPress={() => setGmapVisible(!gmapVisible)} title='Takaisin' />
                    </Modal> 
            </View>
        );
}