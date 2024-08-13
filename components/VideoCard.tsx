import { Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { TVideo } from '../types/video-type'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'

interface VideoCardProps {
    video: TVideo
}

const VideoCard = ({ video }: VideoCardProps) => {

    const [play, setPlay] = useState(false)

    return (
        <View className='flex-col items-center px-4 mb-14'>
            <View className='flex-row gap-3 items-start'>
                <View className='justify-center items-center flex-row flex-1'>
                    <View className='w-[46px] h-[46px] rounded-lg border border-secondary items-center justify-center p-0.5'>
                        <Image source={{ uri: video.creator.avatar }} className='w-full h-full rounded-lg' resizeMode='cover' />
                    </View>

                    <View className='justify-center flex-1 ml-3 gap-y-1'>
                        <Text className='text-white font-psemibold text-sm' numberOfLines={1}>
                            {video.title}
                        </Text>
                        <Text className='text-xs text-gray-100 font-pregular' numberOfLines={1}>
                            {video.creator.username}
                        </Text>
                    </View>
                </View>
                <View className='pt-2'>
                    <Image source={icons.menu} className='w-5 h-5' resizeMode='contain' />
                </View>
            </View>

            {play ? (
                <Video
                    source={{ uri: video.video }}
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
                <TouchableOpacity activeOpacity={0.7} onPress={() => setPlay(true)} className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'>
                    <Image source={{ uri: video.thumbnail }} className='w-full h-full rounded-xl mt-3' resizeMode='cover' />
                    <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain' />
                </TouchableOpacity>
            )
            }

        </View >
    )
}

export default VideoCard

const styles = StyleSheet.create({
    video: {
        width: "100%",
        height: 240,
        borderRadius: 12,
        marginTop: 12

    }
})