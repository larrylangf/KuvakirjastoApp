import React, {useState, useEffect} from 'react';
import {View, Modal, FlatList, Image, 
    TouchableWithoutFeedback} from 'react-native';
import {Button, Header, Icon} from 'react-native-elements';
import * as SQLite from 'expo-sqlite';
import {Appstyles} from './Appstyles';
import MapView from 'react-native-maps';

export default function Mainscreen(props) {

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
            tx.executeSql('drop table if exists test;')
        });
        db.transaction(tx => {
            tx.executeSql('create table if not exists app (id integer '+ 
            'primary key not null, url text, location text, lat real, lng real);');
        });
        //clearDb();
        return() => {
            screenFocus.remove();
        }
    },[]);
    
    const clearDb = () => {
        db.transaction(
            tx => { tx.executeSql(`delete from app;`);}) 
    }

    const delImg = (id) => {
        db.transaction(
            tx => { tx.executeSql(`delete from app where id = ?;`, [id]);}, null, updateImgList) 
    }
    
    const updateImgList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from app;', [], (_, { rows }) => {
                setData(rows._array)
                console.log(data)
            })
        })
    }
    
    const toggleModal = (visible, id, gvisible) => {
        db.transaction(tx => {
            tx.executeSql('select * from app where id = ?;', [id], (_, { rows }) => {
                    setMImg(rows._array[0].url);
                }
            );
        });
        setModalVisible(visible);
        setGmapVisible(gvisible);
    }

        return(
            <View style={Appstyles.container}>
                <View style={Appstyles.header}>
                    <Header centerComponent={{text: 'KuvakirjastoApp', style: {color: '#fff', fontSize: 20, fontWeight: '700'}}} />
                </View>
                <View style={Appstyles.listView}>
                    <FlatList 
                        keyExtractor={item => item.id.toString()} 
                        renderItem={({item}) =>
                        <View style={Appstyles.listItem}>
                            <TouchableWithoutFeedback onPress={() => toggleModal(true, item.id, false)}>
                                <Image source={{uri: item.url}} />
                            </TouchableWithoutFeedback>
                            <Button icon={<Icon name="delete" color="white" size={20} />} title="Poista" onPress={() => delImg(item.id)} />
                        </View>
                        } 
                        data={data} 
                    />
                </View> 
                    <View style={Appstyles.button}>
                        <Button icon={<Icon name="add" color="white" size={20} />} title="Lisää kuva" onPress={() => navigate('Lisää')} />
                    </View>
                    <View style={Appstyles.button}>
                    <Button icon={<Icon name="location-on" color="white" size={20} />} title="Näytä sijainnit" onPress={() => toggleModal(false, null, true)} />
                    </View>
                    <Modal
                        visible={modalVisible}
                        animationIn="slideIn"
                        animationInTiming={1500}
                        transparent={false}
                        >
                        <View style={Appstyles.MImg}>
                        <Image source={{uri: mImg}}/>
                        </View>
                        <Button icon={<Icon name="arrow-back" color="white" size={20} />} onPress={() => setModalVisible(!modalVisible)} title='Takaisin' />
                    </Modal>
                    <Modal
                        visible={gmapVisible}
                        animationIn="slideIn"
                        animationInTiming={1500}
                        transparent={false}
                        >
                        <MapView
                            style={{flex: 1}}
                            initialRegion={{
                            latitude: 60.3289292,
                            longitude: 24.9024031,
                            latitudeDelta: 0.09,
                            longitudeDelta: 0.0025
                            }}
                        >
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