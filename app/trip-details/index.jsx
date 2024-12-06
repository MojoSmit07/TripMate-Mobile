import { View, Text, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { Colors } from '../../constants/Colors';
import moment from 'moment'
import FlightInfo from '../../components/TripDetails/FlightInfo';
import HotelList from '../../components/TripDetails/HotelList';
import PlannedTrip from '../../components/TripDetails/PlannedTrip';

export default function TripDetails() {
    const navigation = useNavigation();
    const { trip } = useLocalSearchParams();
    const [tripDetails, setTripDetails] = useState(null);
    const [parsedTripData, setParsedTripData] = useState(null);

    // Safely parse JSON data with error handling
    const formatData = (data) => {
        if (!data) return null;
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (error) {
            console.error('Error parsing trip data:', error);
            return null;
        }
    }

    // Initialize trip details
    useEffect(() => {
        if (!trip) return;

        try {
            const parsedTrip = formatData(trip);
            if (parsedTrip) {
                setTripDetails(parsedTrip);
                const tripData = formatData(parsedTrip.tripData);
                setParsedTripData(tripData);
            }
        } catch (error) {
            console.error('Error setting trip details:', error);
        }
    }, [trip]);

    // Set navigation options
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerTitle: ''
        });
    }, []);

    // Show loading state or error if data isn't ready
    if (!tripDetails || !parsedTripData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'outfit-medium', fontSize: 16 }}>
                    {!tripDetails ? 'Loading trip details...' : 'Unable to load trip details'}
                </Text>
            </View>
        );
    }

    // Safely format date
    const formatDate = (date) => {
        try {
            return date ? moment(date).format('DD MMM yyyy') : 'Date not set';
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date not set';
        }
    };

    const photoUrl = parsedTripData?.locationInfo?.photoRef 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${parsedTripData.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
        : null;

    return (
        <ScrollView>
            {photoUrl && (
                <Image 
                    source={{ uri: photoUrl }}
                    style={{
                        width: '100%',
                        height: 330,
                    }}
                />
            )}
            <View style={{
                padding: 15,
                backgroundColor: Colors.WHITE,
                height: '100%',
                marginTop: -30,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
            }}>
                <Text style={{
                    fontSize: 25,
                    fontFamily: 'outfit-bold'
                }}>
                    {parsedTripData?.locationInfo?.name || 'Location Not Available'}
                </Text>
                
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 5,
                    marginTop: 5
                }}>
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 18,
                        color: Colors.GRAY
                    }}>
                        {formatDate(parsedTripData?.startDate)}
                    </Text>
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 18,
                        color: Colors.GRAY
                    }}>
                        {' - '}
                        {formatDate(parsedTripData?.endDate)}
                    </Text>
                </View>

                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 17,
                    color: Colors.GRAY
                }}>
                    🚌 {parsedTripData?.traveler?.title || 'Traveler info not available'}
                </Text>

                {/* Flight Info */}
                {tripDetails?.tripPlan?.travelPlan?.flight && (
                    <FlightInfo flightData={tripDetails.tripPlan.travelPlan.flight} />
                )}

                {/* Hotels List */}
                {tripDetails?.tripPlan?.travelPlan?.hotels && (
                    <HotelList hotelList={tripDetails.tripPlan.travelPlan.hotels} />
                )}

                {/* Trip Day Planner Info */}
                {tripDetails?.tripPlan?.travelPlan?.itinerary && (
                    <PlannedTrip details={tripDetails.tripPlan.travelPlan.itinerary} />
                )}
            </View>
        </ScrollView>
    );
}