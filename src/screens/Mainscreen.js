import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Modal, Dimensions, FlatList, Image, TouchableWithoutFeedback} from 'react-native';
import {Button, Header, Icon} from 'react-native-elements';

export default function Flatimg() {

    const [imgs, setImgs] = useState([
        {uri: require('../../assets/img/ledipuut.jpg'), reqion: 'Pasila Helsinki'},
        {uri: require('../../assets/img/snap30.12.jpg')},
        {uri: require('../../assets/img/gmap.jpg')}
          ]
      );

    const [modalVisible, setModalVisible] = useState(false);
    const [mImg, setMImg] = useState();

    const toggleModal = (visible, index) => {
        setMImg(imgs[index].uri);
        setModalVisible(visible);
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Header centerComponent={{text: 'KuvakirjastoApp', style: {color: '#fff', fontSize: 20, fontWeight: '700'}}} />
            </View>
            <View style={styles.listView}>
                <FlatList 
                    keyExtractor={index => String(index)} 
                    renderItem={({item, index}) =>
                      <View style={styles.listItem}>
                        <TouchableWithoutFeedback onPress={() => toggleModal(true, index)}>
                            <Image source={item.uri} key={index} />
                        </TouchableWithoutFeedback>
                      </View>
                      } 
                    data={imgs} 
                />
                <Modal
                    visible={modalVisible}
                    animationIn="slideIn"
                    animationInTiming={1500}
                    transparent={false}
                    >
                    <View style={styles.MImg}>
                      <Image source={mImg}/>
                    </View>
                    <Button icon={<Icon name="arrow-back" color="black" size={20} />} onPress={() => setModalVisible(!modalVisible)} title='Takaisin' />
                </Modal>
                <View style={styles.button}>
                    <Button icon={{name: 'add'}} title="Lisää" />
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        flex: 0.18,
        width: Dimensions.get('window').width,
    },
    listView: {
        flex: 1,
    },
    listItem: {
        flex: 0.3,
        padding: 2,
	    width: Dimensions.get('window').width,
        height: 360,
        resizeMode: "contain",
    },
    button: {
        flex: 0.2,
        width: Dimensions.get('window').width/2,
    },
    MImg: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});