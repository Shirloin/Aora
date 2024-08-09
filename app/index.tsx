import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'


const App = () => {
    return (
        <View className='flex-1 justify-center items-center bg-white'>
            <Text className='text-3xl font-bold'>ClipXtra</Text>
            <Link href={"/home"} className='text-blue-500'>Go to home</Link>
        </View>
    )
}

export default App
