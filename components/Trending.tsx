import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native'
import React, { useState } from 'react'
import { TVideo } from '../types/video-type'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'

interface TrendingProps {
    posts: TVideo[]
}

interface TrendingItem {
    activeItem: TVideo
    item: TVideo
}

const zoomIn: Animatable.CustomAnimation = {
    0: {
        transform: [{ scale: 0.9 }],
    },
    1: {
        transform: [{ scale: 1 }],
    },
}

const zoomOut: Animatable.CustomAnimation = {
    0: {
        transform: [{ scale: 1 }],
    },
    1: {
        transform: [{ scale: 0.9 }],
    },
}


const TrendingItem = ({ activeItem, item }: TrendingItem) => {

    const [play, setPlay] = useState(false)
    return (
        <Animatable.View className='mr-5' animation={activeItem.id === item.id ? zoomIn : zoomOut} duration={500}>
            {play ? (
                <Video
                    source={{ uri: item.video }}
                    style={styles.video}
                    className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
                    resizeMode={ResizeMode.CONTAIN} useNativeControls
                    shouldPlay={true}
                    onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded && status.didJustFinish) {
                            setPlay(false);
                        }
                    }}
                />
            ) : (
                <TouchableOpacity className='relative justify-center items-center' activeOpacity={0.7} onPress={() => setPlay(true)}>
                    <ImageBackground source={{ uri: item.thumbnail }} className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40 ' resizeMode='cover' />
                    <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain' />
                </TouchableOpacity>
            )}
        </Animatable.View>
    )
}

const Trending = ({ posts }: TrendingProps) => {

    const [activeItem, setActiveItem] = useState(posts[0])

    const viewableItemsChanges = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const viewableItem = viewableItems[0]?.item as TVideo
            setActiveItem(viewableItem)
        }
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TrendingItem key={item.id} activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChanges}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}
            contentOffset={{ x: 170, y: 0 }}
            horizontal
        />
    )
}

export default Trending

const styles = StyleSheet.create({
    video: {
        width: 208,
        height: 288,
        borderRadius: 35,
        marginTop: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
})