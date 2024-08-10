import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';
export const config = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    videCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEO_COLLECTION_ID,
    storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID
}
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

export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session
    } catch (error: any) {
        throw new Error(error)
    }
}