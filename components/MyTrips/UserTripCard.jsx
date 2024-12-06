// UserTripCard.jsx
import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import moment from 'moment';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function UserTripCard({ trip }) {
    const router = useRouter();
    
    const formatData = (data) => {
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (error) {
            console.error('Error parsing trip data:', error);
            return {};
        }
    };

    const tripData = formatData(trip.tripData);
    const photoReference = tripData?.locationInfo?.photoRef;
    
    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/trip-details',
                params: {
                    trip: JSON.stringify({
                        ...trip,
                        tripData: typeof trip.tripData === 'string' 
                            ? trip.tripData 
                            : JSON.stringify(trip.tripData)
                    })
                }
            })}
            style={{
                marginTop: 20,
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center'
            }}
        >
            <Image 
                source={photoReference ? {
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
                } : require('../../assets/images/placeholder.jpeg')}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 15
                }}
            />
            <View>
                <Text style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 18,
                }}>
                    {trip.tripPlan?.travelPlan?.location || 'Unknown Location'}
                </Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 14,
                    color: Colors.GRAY
                }}>
                    {tripData?.startDate ? moment(tripData.startDate).format('DD MMM yyyy') : 'Date not set'}
                </Text>
                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 14,
                    color: Colors.GRAY
                }}>
                    Traveling: {tripData?.traveler?.title || 'Not specified'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
