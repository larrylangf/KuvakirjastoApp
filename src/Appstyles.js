import {StyleSheet, Dimensions} from 'react-native';
import {ScreenOrientation} from 'expo';

export const Appstyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    addcontainer: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 0.3,
        color: '#fff', 
        fontSize: 20, 
        fontWeight: '700',
        backgroundColor: '#3399ff',
        alignItems: 'center'
    },
    listView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    img: {
        height: 120,
        width: 120,
        resizeMode: "contain", 
    },
    button: {
        flex: 0.25,
        width: Dimensions.get('window').width/2,
    },
    input1: {
        flex: 0.8,
        marginTop: 5,    
        marginBottom: 5
    },
    input2: {
        flex: 0.5,
        marginTop: 5,    
        marginBottom: 10
    },
    modal: {
        flex: 1,
        backgroundColor: 'black'
    },
    mimg: {
        width: Dimensions.get('window').width/1.4,
        height: Dimensions.get('window').height/1.2,
        resizeMode: "contain",
    },
});