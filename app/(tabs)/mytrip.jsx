import { View, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from './../../constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './../../configs/FirebaseConfig'
import UserTripList from '../../components/MyTrips/UserTripList';
import { useRouter } from 'expo-router';

export default function MyTrip() {

  const [userTrips, setUserTrips] = useState([]);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    user && GetMyTrips();
  }, [user]);

  const GetMyTrips = async () => {
    setLoading(true);
    setUserTrips([]);
    const q = query(collection(db, 'UserTrips'),
      where('userEmail', '==', user?.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserTrips(prev => [...prev, doc.data()]);
    });
    setLoading(false);
  };

  return (
    <ScrollView style={{
      padding: 25,
      paddingTop: 55,
      backgroundColor: Colors.WHITE,
      height: '100%'
    }}>

      <View
        style={{
          position: 'relative', // For absolute positioning of the button
          display: 'flex',
          alignItems: 'center', // Center the logo
          justifyContent: 'center', // Center the logo
        }}
      >
        {/* Centered Image */}
        <Image
          source={require('../../assets/images/TripMate-Logo-1.png')}  // Correct path to the image
          style={{ width: 200, height: 60 }} // Adjust size as needed
        />

        {/* Right-aligned button using absolute positioning */}
        <TouchableOpacity
          onPress={() => router.push('/create-trip/search-place')}
          style={{
            position: 'absolute',
            right: 25, // Adjust right margin as needed
            top: '50%', // Centers it vertically relative to the parent container
            transform: [{ translateY: -25 }] // Centers it precisely
          }}
        >
          <Ionicons name="add-circle" size={50} color="black" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size={'large'} color={Colors.PRIMARY} />}

      {userTrips?.length == 0 ?
        <StartNewTripCard />
        :
        <UserTripList userTrips={userTrips} />
      }

      <View style={{ height: 100 }}></View>

    </ScrollView>
  );
}
