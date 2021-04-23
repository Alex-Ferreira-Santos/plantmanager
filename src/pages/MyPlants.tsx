import React, { useEffect, useState } from 'react';
import {View,Text,StyleSheet,Image, FlatList, Alert} from 'react-native'
import { Header } from '../components/Header';
import colors from '../styles/colors';
import waterDrop from '../assets/waterdrop.png'
import { PlantProps,loadPlant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

export function MyPlants(){
    const [myPlants,setMyPlants] = useState<PlantProps[]>([])
    const [loading,setLoading] = useState(true)
    const [nextWaterd,setNextWaterd] = useState<string>()
    const [isEmpty,setIsEmpty] = useState(false)

    function handleRemove(plant:PlantProps){
        Alert.alert('Remover',`deseja remover a ${plant.name}`,[{
            text:'Não 🙏',
            style: 'cancel'
        },{
            text:'Sim 😥',
            onPress: async () => {
                try{
                    await removePlant(plant.id)
                    setMyPlants((oldData) =>
                        oldData.filter((item)=> item.id !== plant.id)
                    )
                }catch(error){
                    Alert.alert('Não foi possivel remover 😥')
                }
            }
        }])
    }

    useEffect(()=>{
        async function loadStorageData(){
            const plantsStoraged = await loadPlant()
            if(plantsStoraged.length === 0){
                setLoading(false)
                setIsEmpty(true)
                return
            }
            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                {locale: ptBR}
            )

            setNextWaterd(
                `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}`
            )
            setIsEmpty(false)
            setMyPlants(plantsStoraged)
            setLoading(false)

        }

        loadStorageData()
    },[])

    
    if(loading){
        return <Load/>
    }
    return(
        <View style={styles.container}>
            <Header/>
            {isEmpty && (<Text style={styles.tip}>Cadastre uma planta primeiro {'\n'} para aparecer aqui!</Text>)}
            {!isEmpty && (<><View style={styles.spotlight}>
                    <Image source={waterDrop} style={styles.spotlightImage}/>
                    <Text style={styles.spotlightText}>{nextWaterd}</Text>
                </View>

                <View style={styles.plants}>
                    <Text style={styles.plantsTitle}>Próximas regadas</Text>
                    <FlatList 
                        data={myPlants}
                        keyExtractor={(item)=> String(item.id)}
                        renderItem={({ item }) => (
                            <PlantCardSecondary 
                                data={item}
                                handleRemove={()=>{handleRemove(item)}}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flex:1}}
                    />
                </View></>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight:{
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
    },
    spotlightImage:{
        width: 60,
        height: 60
    },
    spotlightText:{
        flex:1,
        color: colors.blue,
        paddingHorizontal: 15,
    },
    plants:{
        flex:1,
        width: '100%',
    },
    plantsTitle:{
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20,
    },
    tip:{
        fontSize: 20,
        fontFamily: fonts.heading,
        color: colors.heading,
        textAlign: 'center',
        position: 'absolute',
        top: 250,
    }
})