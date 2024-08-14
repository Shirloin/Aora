import { FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ViewComponent } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { getUserPosts, searchPosts, signOut } from '../../lib/appwrite'
import EmptyState from '../../components/EmptyState'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'

const Profile = () => {
    const { user, setIsLoggedIn, setUser } = useGlobalContext()
    const { data: posts, refetch } = useAppwrite(() => getUserPosts(user!.id))


    const logOut = async () => {
        await signOut()
        setUser(null)
        setIsLoggedIn(false)
        router.replace('/sign-in')
    }

    return (
        <SafeAreaView className='bg-primary h-full pt-10'>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <VideoCard key={item.id} video={item} />
                )}
                ListHeaderComponent={() => (
                    <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
                        <TouchableOpacity className='w-full items-end mb-10' onPress={logOut}>
                            <Image source={icons.logout} resizeMode='contain' className='w-6 h-6' />
                        </TouchableOpacity>
                        <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
                            <Image className='w-[90%] h-[90%] rounded-lg' resizeMode='cover' source={{ uri: user?.avatar }} />
                        </View>
                        <InfoBox title={user?.username} containerStyles='mt-5' titleStyles='text-lg' />
                        <View className='mt-5 flex-row'>
                            <InfoBox title={posts.length.toString() || '0'} subtitle='Posts' containerStyles='mr-10' titleStyles='text-xl' />
                            <InfoBox title='1.2k' subtitle='Followers' titleStyles='text-xl' />

                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState title="No Videos Found" subtitle="No videos found for this search query" />
                )}
            />
        </SafeAreaView>
    )
}

export default Profile