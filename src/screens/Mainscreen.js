import React, {useState, useEffect} from 'react';
import {View, Modal, FlatList, Image, TouchableWithoutFeedback} from 'react-native';
import {Button, Header, Icon} from 'react-native-elements';
import {SQLite} from 'expo-sqlite';
import {Appstyles} from '../styles/Appstyles';

export default function Flatimg(props) {
    
    const [imgs, setImgs] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [gmapVisible, setGmapVisible] = useState(false);
    const [mImg, setMImg] = useState('');

    const db = SQLite.openDatabase('app.db');

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists app (id integer '+ 
            'primary key not null, url text not null, location text not null);');
        });
        updateImgList();
        return() => {
            
        }
    },[]);
    
    const delImg = (id) => {
        db.transaction(
            tx => { tx.executeSql(`delete from app where id = ?;`, [id]);}, null, updateImgList) 
    }
    
    const updateImgList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from app;', [], (_, { rows }) =>
            setImgs(rows._array)
            );
        });
    }
    
    const toggleModal = (visible, id, gvisible) => {
        db.transaction(tx => {
            tx.executeSql('select * from app where id = ?;', [id], (_, { rows }) => {
                    setMImg(rows.item(0).id.url);
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
                        <TouchableWithoutFeedback onPress={() => toggleModal(true, id, false)}>
                            <Image source={{uri: item.url}} key={id} />
                        </TouchableWithoutFeedback>
                        <Button icon={<Icon name="trash-can" color="black" size={20} />} title="Poista" onPress={() => delImg(id)} />
                      </View>
                      } 
                    data={imgs} 
                />
                <View style={Appstyles.button}>
                    <Button icon={<Icon name="add" color="black" size={20} />} title="Lisää" onPress={() => navigate('Addimgscreen')} />
                </View>
                <View style={Appstyles.button}>
                 <Button icon={<Icon name="pin" color="black" size={20} />} title="Näytä sijainnit" onPress={() => toggleModal(false, null, true)} />
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
                    <Button icon={<Icon name="arrow-back" color="black" size={20} />} onPress={() => setModalVisible(!modalVisible)} title='Takaisin' />
                </Modal>
               {/* <Modal
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
                        longitudeDelta: 0.01
                        }}
                    >
                    <Marker
                        coordinate={{
                            
                        }}
                        title={}
                    />
                    </MapView>
                    <Button icon={<Icon name="arrow-back" color="black" size={20} />} onPress={() => setGmapVisible(!gmapVisible)} title='Takaisin' />
                </Modal> */}
            </View>
        </View>
    );
}