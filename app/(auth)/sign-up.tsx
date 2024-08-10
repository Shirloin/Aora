import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { ChangeEvent, useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'

const SignUp = () => {

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (field: keyof typeof form) => (e: { nativeEvent: { text: string } }) => {
        setForm({ ...form, [field]: e.nativeEvent.text })
    }

    const handleSubmit = () => {
        if (!form.username || !form.email || !form.password) {
            Alert.alert('Error', 'All fields must be filled')
        }
        setIsSubmitting(true)

        try {
            const result = createUser(form.username, form.email, form.password)
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
                    <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Sign Up to Aora</Text>
                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={handleChange('username')}
                        otherStyles="mt-7"
                        placeholder='Username'
                    />
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
                    <CustomButton title='Sign Up' handlePress={handleSubmit} containerStyles='mt-7' isLoading={isSubmitting} />

                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-lg text-gray-100 font-pregular'>
                            Already have account?
                        </Text>
                        <Link href={"/sign-in"} className='text-lg font-psemibold text-secondary'>Sign In</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp