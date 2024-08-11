import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TVideo } from '../types/video-type'

interface TrendingProps {
    posts: TVideo[]
}

const Trending = ({ posts }: TrendingProps) => {
    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <Text className='text-3xl text-white'>{item.id}</Text>
            )}
            horizontal
        />
    )
}

export default Trending

const styles = StyleSheet.create({})