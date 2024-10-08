import { useEffect, useState } from "react"
import { TVideo } from "../types/video-type"
import { getAllPosts } from "./appwrite"
import { Alert } from "react-native"
import { TUser } from "../types/user-type";

const useAppwrite = <T>(fn: () => Promise<T[]>) => {
    const [data, setData] = useState<T[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const response = await fn()
            setData(response)
        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    const refetch = () => fetchData()

    return { data, isLoading, refetch }
}

export default useAppwrite