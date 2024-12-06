import { View, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import PlaceCard from './PlaceCard';

export default function PlannedTrip({ details }) {
  // First convert details object into an array of entries
  const sortedDays = Object.entries(details)
    // Map to include the numeric day value
    .map(([dayString, dayData]) => {
      // Extract the number from the day string and convert to number
      const dayNumber = parseInt(dayString.replace(/\D/g, ''));
      return {
        dayString,
        dayNumber,
        dayData
      };
    })
    // Sort based on the numeric day value
    .sort((a, b) => a.dayNumber - b.dayNumber);

  // For debugging - remove in production
  console.log('Sorted days:', sortedDays.map(d => d.dayString));

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 20, fontFamily: 'outfit-bold' }}>
        🏕️ Plan Details
      </Text>
      
      {sortedDays.map(({ dayString, dayData }) => (
        <View key={dayString}>
          <Text 
            style={{ 
              fontFamily: 'outfit-medium', 
              fontSize: 20, 
              marginTop: 20 
            }}
          >
            {dayString}
          </Text>
          
          {dayData.plan.map((place, index) => (
            <PlaceCard 
              place={place} 
              key={index} 
            />
          ))}
        </View>
      ))}
    </View>
  );
}