import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { ChangeEvent, useState } from 'react'
import { icons, images } from '../constants'
import { router, usePathname } from 'expo-router'

interface SearchInputProps {
    initialQuery?: string
}

const SearchInput = ({ initialQuery }: SearchInputProps) => {

    const pathname = usePathname()

    const [query, setQuery] = useState(initialQuery || '')

    return (
        <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
            <TextInput className='text-base mt-0.5 text-white flex-1 font-pregular' value={query} placeholder="Search for a video topic" placeholderTextColor={"#CDCDE0"}
                onChangeText={(e: string) => { setQuery(e) }} />
            <TouchableOpacity
                onPress={() => {
                    if (!query) { return Alert.alert('Missing Query', "Please input something to search") }
                    if (pathname.startsWith('/search')) router.setParams({ query })
                    else router.push(`/search/${query}`)
                }}

            >
                <Image source={icons.search} className='w-5 h-5' resizeMode='contain' />
            </TouchableOpacity>
        </View>
    )
}

export default SearchInput
