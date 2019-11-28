import {StyleSheet, Dimensions} from 'react-native';

export const Appstyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    addcontainer: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listView: {
        flex: 1.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listitem: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
        width: 120
    },
    img: {
        height: 120,
        width: 120,
        resizeMode: "contain" 
    },
    bcontainer: {
        flex: 0.3
    },
    button: {
        height: 40,
        width: 180,
        marginTop: 10
    },
    button1: {
        height: 30,
        width: 120,
        marginBottom: 5
    }, 
    button2: {
        height: 30,
        width: 120
    },
    icontainer: {
        height: 50,
        width: 250,
        alignItems: 'center',
        marginTop: 15
    },
    mbutton: {
        height: 50,
        width: Dimensions.get('window').width,
        backgroundColor: '#ff6f00',
        marginBottom: 18
    },
    modal: {
        flex: 1,
        backgroundColor: '#000'
    },
    mimg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/1.05,
        resizeMode: "contain"
    },
});