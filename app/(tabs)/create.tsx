import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import FormField from '../../components/FormField'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { createVideo } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import * as ImagePicker from 'expo-image-picker'

interface CreateForm {
    title: string
    video: ImagePicker.ImagePickerAsset | null
    thumbnail: ImagePicker.ImagePickerAsset | null
    prompt: string
}

const Create = () => {

    const { user } = useGlobalContext()
    const [uploading, setUploading] = useState(false)

    const [form, setForm] = useState<CreateForm>({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
    })

    const handleChange = (field: keyof typeof form) => (e: { nativeEvent: { text: string } }) => {
        setForm({ ...form, [field]: e.nativeEvent.text })
    }

    const openPicker = async (selectType: string) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            if (selectType === "image") {
                setForm({ ...form, thumbnail: result.assets[0] })
            } else {
                setForm({ ...form, video: result.assets[0] })
            }
        } else {
            setTimeout(() => {
                Alert.alert('Document picked', JSON.stringify(result, null, 2))
            }, 100)
        }
    }

    const submit = async () => {
        if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
            return Alert.alert("Please fill all the fields")
        }
        setUploading(true)
        try {
            const { title, video, thumbnail, prompt } = form;
            await createVideo({
                form: {
                    title,
                    video: video as ImagePicker.ImagePickerAsset,
                    thumbnail: thumbnail as ImagePicker.ImagePickerAsset,
                    prompt,
                    userId: user!.id
                }
            });
            Alert.alert('Success', 'Post success')
            router.push('/home')
        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setForm({
                title: '',
                video: null,
                thumbnail: null,
                prompt: ''
            })
            setUploading(false)
        }
    }

    return (
        <SafeAreaView className='bg-primary h-full '>
            <ScrollView className='px-4 my-6'>
                <Text className='text-2xl text-white font-psemibold'>
                    Upload Video
                </Text>
                <FormField title='Video Title' value={form.title} placeholder='Give your video a catch title' handleChangeText={handleChange('title')} otherStyles='mt-10' />

                <View className='mt-7 space-y-2'>
                    <Text className='text-base text-gray-100 font-pmedium'>
                        Upload Video
                    </Text>

                    <TouchableOpacity onPress={() => openPicker('video')}>
                        {form.video ? (
                            <Video style={styles.video} source={{ uri: form.video.uri }} className='w-full h-64 rounded-2xl' useNativeControls resizeMode={ResizeMode.COVER} isLooping />
                        ) : (
                            <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                                <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                                    <Image source={icons.upload} resizeMode='contain' className='w-1/2 h-1/2' />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View className='mt-7 space-y-2'>
                    <Text className='text-base text-gray-100 font-pmedium'>
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker('image')}>
                        {form.thumbnail ? (
                            <Image source={{ uri: form.thumbnail.uri }} className='w-full h-64 rounded-2xl' resizeMode={ResizeMode.COVER} />
                        ) : (
                            <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2'>
                                <Image source={icons.upload} resizeMode='contain' className='w-5 h-5' />
                                <Text className='text-sm text-gray-100 font-pmedium'>
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <FormField title='AI Prompt' value={form.prompt} placeholder='The prompt you usd to create this video' handleChangeText={handleChange('prompt')} otherStyles='mt-7' />
                <CustomButton title='Submit & Publish' handlePress={submit} containerStyles='mt-7' isLoading={uploading} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Create

const styles = StyleSheet.create({
    video: {
        width: "100%",
        height: 256,
        borderRadius: 16
    }
})