import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { ChangeEvent, useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { Alert } from 'react-native'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
    const { setUser, setIsLoggedIn } = useGlobalContext()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (field: keyof typeof form) => (e: { nativeEvent: { text: string } }) => {
        setForm({ ...form, [field]: e.nativeEvent.text })
    }

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'All fields must be filled')
        }
        setIsSubmitting(true)

        try {
            await signIn(form.email, form.password)

            const result = await getCurrentUser()
            // console.log(result)

            setUser(result)
            setIsLoggedIn(true)
            router.replace('/home')
        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SafeAreaView className='bg-primary h-full'>
            <ScrollView>
                <View className='w-full justify-center min-h-[85vh] h-full  px-4 my-6'>
                    <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]' />
                    <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Log in to Aora</Text>
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={handleChange('email')}
                        otherStyles="mt-7"
                        placeholder='Email'
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={handleChange('password')}
                        otherStyles="mt-7"
                        placeholder='Password'
                    />
                    <CustomButton title='Sign In' handlePress={handleSubmit} containerStyles='mt-7' isLoading={isSubmitting} />

                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-lg text-gray-100 font-pregular'>
                            Don't have account?
                        </Text>
                        <Link href={"/sign-up"} className='text-lg font-psemibold text-secondary'>Sign Up</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn