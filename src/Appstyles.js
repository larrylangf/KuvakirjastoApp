import {StyleSheet, Dimensions} from 'react-native';

export const Appstyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        flex: 0.1,
        width: Dimensions.get('window').width,
        marginBottom: 50,
    },
    listView: {
        flex: 1.2,
    },
    listItem: {
        flex: 0.2,
        padding: 5,
	    width: Dimensions.get('window').width,
        height: 360,
        resizeMode: "contain",
    },
    button: {
        flex: 0.1,
        width: Dimensions.get('window').width/2,
    },
    input: {
        flex: 0.2,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 5,    
        justifyContent: 'center',
    },
    MImg: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});