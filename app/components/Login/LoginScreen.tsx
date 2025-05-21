import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
const brand = require('../../../assets/images/ias_logo_black.png')
const styles = StyleSheet.create({
    logo:{
        height:80,
        width:200
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', 
    },
    formContainer: {
        width: '80%',
        padding: 20,
        alignItems: 'center',
        gap: 20, 
    
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    button:{
        flex:1
    },

});


export default function LoginScreen() {
    return (
        <View style={styles.screen}>
            
            <View style={styles.formContainer}>
                <Image style={styles.logo} source={brand}></Image>
                <TextInput placeholder="Email" style={styles.input} />
                <TextInput secureTextEntry={true} placeholder="Password" style={styles.input} />
                
                <Pressable>
                    <Text>Login</Text>
                </Pressable>
            </View>
        </View>
    );
};

