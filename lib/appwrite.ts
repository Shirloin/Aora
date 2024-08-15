import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite';
import { TUser } from '../types/user-type';
import { TVideo } from '../types/video-type';
import { ImagePickerAsset } from 'expo-image-picker';
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
const storage = new Storage(client)


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
        return newUser as unknown as TUser
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
            [Query.orderDesc('$createdAt')]
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
            [Query.orderDesc('$createdAt'), Query.limit(7)]
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
export const getUserPosts = async (userId: string) => {
    try {
        const posts = await db.listDocuments(
            databaseId!,
            videCollectionId!,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        )
        return posts.documents as unknown as TVideo[]
    } catch (error: any) {
        throw new Error(error)
    }
}


export const signOut = async () => {
    try {
        const session = await account.deleteSession('current')
        return session
    } catch (error: any) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId: string, type: string) => {
    let fileUrl;
    try {
        if (type === "video") {
            fileUrl = storage.getFileView(storageId!, fileId)
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(storageId!, fileId, 2000, 2000, ImageGravity.Top, 100)
        } else {
            throw new Error('Invalid file type')
        }

        if (!fileUrl) throw Error
        return fileUrl
    } catch (error: any) {
        throw new Error(error)
    }
}

export const uploadFile = async (file: ImagePickerAsset, type: string) => {
    if (!file) return
    const { uri, type: mimeType, fileName, fileSize } = file;
    if (!uri || !mimeType || !fileName || fileSize === undefined) {
        throw new Error("Missing required file properties");
    }
    const asset = {
        name: fileName,
        type: mimeType,
        size: fileSize,
        uri: uri,
    };
    try {
        const uploadedFile = await storage.createFile(
            storageId!,
            ID.unique(),
            asset
        )
        const fileUrl = await getFilePreview(uploadedFile.$id, type)
        return fileUrl
    } catch (error: any) {
        throw new Error(error)
    }
}

export const createVideo = async ({ form }: { form: { title: string, prompt: string, video: ImagePickerAsset, thumbnail: ImagePickerAsset, userId: string } }) => {
    try {
        const [thumbailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await db.createDocument(
            databaseId!,
            videCollectionId!,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )
        return newPost
    } catch (error: any) {
        throw new Error(error)
    }
}

