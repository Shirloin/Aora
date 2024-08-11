import { useEffect, useState } from "react"
import { TVideo } from "../types/video-type"
import { getAllPosts } from "./appwrite"
import { Alert } from "react-native"
import { TUser } from "../types/user-type";

type TData = TVideo[] | TUser[];
const useAppwrite = (fn: () => Promise<TData>) => {
    const [data, setData] = useState<TData>([])
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