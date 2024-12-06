// import { View, Text, Image } from 'react-native'
// import React, { useContext, useEffect, useState } from 'react'
// import { Colors } from '../../constants/Colors'
// import { CreateTripContext } from '../../context/CreateTripContext'
// import { AI_PROMPT } from '../../constants/Options';
// import { chatSession } from '../../configs/AiModal';
// import { useRouter } from 'expo-router';
// import { doc, setDoc } from 'firebase/firestore';
// import { auth, db } from './../../configs/FirebaseConfig'

// export default function GenerateTrip() {
//     const { tripData, setTripData } = useContext(CreateTripContext);
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();
//     const user = auth.currentUser;
//     useEffect(() => {
//         GenerateAiTrip()
//     }, [])

//     const GenerateAiTrip = async () => {
//         setLoading(true);
//         const FINAL_PROMPT = AI_PROMPT
//             .replace('{location}', tripData?.locationInfo?.name)
//             .replace('{totalDays}', tripData.totalNoOfDays)
//             .replace('{totalNight}', tripData.totalNoOfDays - 1)
//             .replace('{traveler}', tripData.traveler?.title)
//             .replace('{budget}', tripData.budget)
//             .replace('{totalDays}', tripData.totalNoOfDays)
//             .replace('{totalNight}', tripData.totalNoOfDays - 1);

//         const result = await chatSession.sendMessage(FINAL_PROMPT);
//         const resultJSONText = JSON.parse(result.response.text())
//         setLoading(false)
//         const docId = (Date.now()).toString();

//         const result_ = await setDoc(doc(db, "UserTrips", docId), {
//             userEmail: user.email,
//             tripPlan: resultJSONText,
//             tripData: JSON.stringify(tripData),
//             docId: docId
//         }).then(resp => {
//             console.log('resp: ', resp)
//         }).catch(e =>
//             console.log(e)
//         )
//         router.push('(tabs)/mytrip');
//     }

//     return (
//         <View style={{
//             padding: 25,
//             paddingTop: 75,
//             backgroundColor: Colors.WHITE,
//             height: '100%'
//         }}>
//             <Text style={{
//                 fontFamily: 'outfit-bold',
//                 fontSize: 35,
//                 textAlign: 'center'
//             }}>
//                 Please Wait...
//             </Text>
//             <Text style={{
//                 fontFamily: 'outfit-medium',
//                 fontSize: 20,
//                 textAlign: 'center',
//                 marginTop: 40
//             }}>
//                 We are working to generate your dream trip
//             </Text>

//             <Image source={require('./../../assets/images/plane.gif')}
//                 style={{
//                     width: '100%',
//                     height: 200,
//                     objectFit: 'contain'
//                 }}

//             />

//             <Text style={{
//                 fontFamily: 'outfit',
//                 color: Colors.GRAY,
//                 fontSize: 20,
//                 textAlign: 'center'
//             }}>Do not Go Back</Text>
//         </View>
//     )
// }

import { View, Text, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';
import { AI_PROMPT } from '../../constants/Options';
import { chatSession } from '../../configs/AiModal';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './../../configs/FirebaseConfig';

export default function GenerateTrip() {
    const { tripData, setTripData } = useContext(CreateTripContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const user = auth.currentUser;

    useEffect(() => {
        GenerateAiTrip();
    }, []);

    const GenerateAiTrip = async () => {
        try {
            setLoading(true);
            setError(null);

            const FINAL_PROMPT = AI_PROMPT
                .replace('{location}', tripData?.locationInfo?.name)
                .replace('{totalDays}', tripData.totalNoOfDays)
                .replace('{totalNight}', tripData.totalNoOfDays - 1)
                .replace('{traveler}', tripData.traveler?.title)
                .replace('{budget}', tripData.budget)
                .replace('{totalDays}', tripData.totalNoOfDays)
                .replace('{totalNight}', tripData.totalNoOfDays - 1);

            const result = await chatSession.sendMessage(FINAL_PROMPT);
            
            // Ensure response.text() is properly awaited and parsed
            const responseText = await result.response.text();
            let resultJSONText;
            
            try {
                resultJSONText = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                throw new Error('Failed to parse AI response. Please try again.');
            }

            const docId = Date.now().toString();

            await setDoc(doc(db, "UserTrips", docId), {
                userEmail: user.email,
                tripPlan: resultJSONText,
                tripData: JSON.stringify(tripData),
                docId: docId
            });

            router.push('(tabs)/mytrip');
        } catch (err) {
            console.error('Error generating trip:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <View style={{
                padding: 25,
                paddingTop: 75,
                backgroundColor: Colors.WHITE,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 20,
                    textAlign: 'center',
                    color: 'red'
                }}>
                    {error}
                </Text>
                <TouchableOpacity 
                    onPress={GenerateAiTrip}
                    style={{
                        padding: 15,
                        backgroundColor: Colors.PRIMARY,
                        borderRadius: 15,
                        marginTop: 20
                    }}>
                    <Text style={{
                        color: Colors.WHITE,
                        fontFamily: 'outfit-medium',
                        fontSize: 16
                    }}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{
            padding: 25,
            paddingTop: 75,
            backgroundColor: Colors.WHITE,
            height: '100%'
        }}>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 35,
                textAlign: 'center'
            }}>
                Please Wait...
            </Text>
            <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 20,
                textAlign: 'center',
                marginTop: 40
            }}>
                We are working to generate your dream trip
            </Text>

            <Image 
                source={require('./../../assets/images/plane.gif')}
                style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'contain'
                }}
            />

            <Text style={{
                fontFamily: 'outfit',
                color: Colors.GRAY,
                fontSize: 20,
                textAlign: 'center'
            }}>
                Do not Go Back
            </Text>
        </View>
    );
}