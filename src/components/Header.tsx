import React from 'react';
import {View,Text,StyleSheet, Image} from 'react-native'
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import {getStatusBarHeight} from 'react-native-iphone-x-helper'
import UserImg from '../assets/Alex.png'

export function Header(){
    return(
        <View style={styles.container}>
            <View>
                <Text style={styles.greetings}>Olá,</Text>
                <Text style={styles.userName}>Alex</Text>
            </View>
            <Image source={UserImg} style={styles.image}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: getStatusBarHeight(),
    },
    greetings:{
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text
    },
    userName:{
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 40,
    },
    image:{
        width: 70,
        height: 70,
        borderRadius: 40
    }
})