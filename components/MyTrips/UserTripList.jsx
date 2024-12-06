import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import moment from 'moment';
import { Colors } from '../../constants/Colors';
import UserTripCard from './UserTripCard';
import { useRouter } from 'expo-router';

export default function UserTripList({ userTrips }) {
    const router = useRouter();
    
    if (!userTrips || userTrips.length === 0) {
        return null;
    }

    const formatData = (data) => {
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (error) {
            console.error('Error parsing trip data:', error);
            return {};
        }
    };

    const latestTrip = formatData(userTrips[0].tripData);
    const photoReference = latestTrip?.locationInfo?.photoRef;

    return (
        <View>
            <View style={{ marginTop: 20 }}>
                <Image 
                    source={photoReference ? {
                        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
                    } : require('../../assets/images/placeholder.jpeg')}
                    style={{
                        width: '100%',
                        height: 240,
                        objectFit: 'cover',
                        borderRadius: 15
                    }}
                />
                <View style={{ marginTop: 10 }}>
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        fontSize: 24
                    }}>
                        {userTrips[0]?.tripPlan?.travelPlan?.location || 'Unknown Location'}
                    </Text>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 5
                    }}>
                        <Text style={{
                            fontFamily: 'outfit',
                            fontSize: 17,
                            color: Colors.GRAY
                        }}>
                            {latestTrip?.startDate ? moment(latestTrip.startDate).format('DD MMM yyyy') : 'Date not set'}
                        </Text>
                        <Text style={{
                            fontFamily: 'outfit',
                            fontSize: 17,
                            color: Colors.GRAY
                        }}>
                            🚌 {latestTrip?.traveler?.title || 'Not specified'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/trip-details',
                            params: {
                                trip: JSON.stringify({
                                    ...userTrips[0],
                                    tripData: typeof userTrips[0].tripData === 'string' 
                                        ? userTrips[0].tripData 
                                        : JSON.stringify(userTrips[0].tripData)
                                })
                            }
                        })}
                        style={{
                            backgroundColor: Colors.PRIMARY,
                            padding: 15,
                            borderRadius: 15,
                            marginTop: 10
                        }}
                    >
                        <Text style={{
                            color: Colors.WHITE,
                            textAlign: 'center',
                            fontFamily: 'outfit-medium',
                            fontSize: 15
                        }}>
                            See your plan
                        </Text>
                    </TouchableOpacity>
                </View>

                {userTrips.map((trip, index) => (
                    <UserTripCard trip={trip} key={index} />
                ))}
            </View>
        </View>
    );
}