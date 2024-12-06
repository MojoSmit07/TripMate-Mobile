// import { View, Text, Image } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { GetPhotoRef } from '../../services/GooglePlaceApi';

// export default function HotelCard({ item }) {

//     const [photoRef, setPhotoRef] = useState();
//     useEffect(() => {
//         GetGooglePhotoRef();
//     }, [])

//     const GetGooglePhotoRef = async () => {
//         const result = await GetPhotoRef(item.hotelName);
//         setPhotoRef(result);
//     }
//     return (
//         <View style={{
//             marginRight: 20,
//             width: 180,
//         }}>
//             <Image source={{
//                 uri:
//                     'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference='
//                     + photoRef
//                     + '&key=' + process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY
//             }}
//                 style={{
//                     width: 180,
//                     height: 120,
//                     borderRadius: 15,

//                 }}
//             />
//             <View style={{
//                 padding: 5
//             }}>
//                 <Text style={{
//                     fontFamily: 'outfit-medium',
//                     fontSize: 17,

//                 }}>{item?.hotelName}</Text>

//                 <View style={{
//                     display: 'flex',
//                     flexDirection: 'row',
//                     justifyContent: 'space-between'
//                 }}>
//                     <Text style={{
//                         fontFamily: 'outfit'
//                     }}>⭐ {item?.rating}</Text>
//                     <Text style={{
//                         fontFamily: 'outfit'
//                     }}>💰 {item?.price}</Text>
//                 </View>
//             </View>
//         </View>
//     )
// }
import { View, Text, Image, TouchableOpacity, Linking, Platform, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GetPhotoRef } from '../../services/GooglePlaceApi'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/Colors'

export default function HotelCard({ item }) {
    const [photoRef, setPhotoRef] = useState()
    
    useEffect(() => {
        GetGooglePhotoRef()
    }, [])

    const GetGooglePhotoRef = async () => {
        const result = await GetPhotoRef(item.hotelName)
        setPhotoRef(result)
    }

    const openBookingOptions = () => {
        if (Platform.OS === 'ios') {
            Alert.alert(
                "Book Hotel",
                `Book "${item.hotelName}" through your preferred platform`,
                [
                    {
                        text: "MakeMyTrip",
                        onPress: () => openMakeMyTrip(),
                    },
                    {
                        text: "Booking.com",
                        onPress: () => openBookingDotCom(),
                    },
                    {
                        text: "Agoda",
                        onPress: () => openAgoda(),
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                    }
                ],
                { cancelable: true }
            )
        } else {
            Alert.alert(
                "Book Hotel",
                `Book "${item.hotelName}" through your preferred platform`,
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "MakeMyTrip",
                        onPress: () => openMakeMyTrip(),
                    },
                    {
                        text: "Booking.com",
                        onPress: () => openBookingDotCom(),
                    },
                    {
                        text: "Agoda",
                        onPress: () => openAgoda(),
                    },
                ],
                { cancelable: true }
            )
        }
    }

    const handleDeepLinking = async (appUrl, webUrl) => {
        try {
            const supported = await Linking.canOpenURL(appUrl)
            if (supported) {
                await Linking.openURL(appUrl)
            } else {
                await Linking.openURL(webUrl)
            }
        } catch (error) {
            console.error('Error opening URL:', error)
            await Linking.openURL(webUrl)
        }
    }

    const openMakeMyTrip = async () => {
        const hotelName = encodeURIComponent(item.hotelName)
        await handleDeepLinking(
            `makemytrip://hotels/search?q=${hotelName}`,
            `https://www.makemytrip.com/hotels/hotel-search/?checkin=&checkout=&locusId=&locusType=&city=${hotelName}&country=&searchText=${hotelName}`
        )
    }

    const openBookingDotCom = async () => {
        const hotelName = encodeURIComponent(item.hotelName)
        await handleDeepLinking(
            `booking://hotel?name=${hotelName}`,
            `https://www.booking.com/search.html?ss=${hotelName}`
        )
    }

    const openAgoda = async () => {
        const hotelName = encodeURIComponent(item.hotelName)
        await handleDeepLinking(
            `agoda://hotel?name=${hotelName}`,
            `https://www.agoda.com/search?q=${hotelName}`
        )
    }

    return (
        <TouchableOpacity 
            onPress={openBookingOptions}
            style={styles.container}
            activeOpacity={0.7}>
            <Image 
                source={{
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
                }}
                style={styles.image}
            />
            <View style={styles.contentContainer}>
                <View style={styles.nameContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hotelName}>
                        {item?.hotelName}
                    </Text>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>
                            {item?.rating}
                        </Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Ionicons name="wallet-outline" size={16} color={Colors.PRIMARY} />
                        <Text style={styles.priceText}>
                            {item?.price}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 270,  // Width as per your request
        backgroundColor: '#fff',
        borderRadius: 15,
        marginRight: 20,
        marginBottom: 20, // Added margin bottom
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: 12,
        gap: 8,
    },
    nameContainer: {
        marginBottom: 4,
    },
    hotelName: {
        fontFamily: 'outfit-medium',
        fontSize: 16,
        color: '#333',
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: '#666',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F0F8FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priceText: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.PRIMARY,
    },
})