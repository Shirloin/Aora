import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
import { TUser } from '../types/user-type';
import { TVideo } from '../types/video-type';
export const config = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    videCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEO_COLLECTION_ID,
    storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videCollectionId,
    storageId
} = config

const client = new Client();

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!)
    ;

const account = new Account(client)
const avatars = new Avatars(client)
const db = new Databases(client)


export const createUser = async (username: string, email: string, password: string) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount) {
            throw Error
        }
        const avatarUrl = avatars.getInitials(username)
        await signIn(email, password)

        const newUser = await db.createDocument(config.databaseId!, config.userCollectionId!, ID.unique(), {
            username: username,
            email: email,
            avatar: avatarUrl,
            accountId: newAccount.$id
        })
        return newUser
    } catch (error: any) {
        console.log(error)
        throw new Error(error)
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session
    } catch (error: any) {
        throw new Error(error)
    }
}

export const getCurrentUser = async (): Promise<TUser | null> => {
    try {
        const currentAccount = await account.get()
        if (!currentAccount) throw Error
        const currentUser = await db.listDocuments(
            config.databaseId!,
            config.userCollectionId!,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if (!currentUser) throw Error
        const user: TUser = {
            id: currentUser.documents[0].$id,
            username: currentUser.documents[0].username,
            email: currentUser.documents[0].email,
            avatar: currentUser.documents[0].avatar,
            accountId: currentUser.documents[0].accountId
        }
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await db.listDocuments(
            databaseId!,
            videCollectionId!,
        )
        return posts.documents as unknown as TVideo[]
    } catch (error: any) {
        throw new Error(error)
    }
}
export const getLatestPosts = async () => {
    try {
        const posts = await db.listDocuments(
            databaseId!,
            videCollectionId!,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents as unknown as TVideo[]
    } catch (error: any) {
        throw new Error(error)
    }
}
export const searchPosts = async (query: string) => {
    try {
        const posts = await db.listDocuments(
            databaseId!,
            videCollectionId!,
            [Query.search('title', query)]
        )
        return posts.documents as unknown as TVideo[]
    } catch (error: any) {
        throw new Error(error)
    }
}


