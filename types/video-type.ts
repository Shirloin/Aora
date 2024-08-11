import { TUser } from "./user-type"

export type TVideo = {
    id: string
    title: string
    thumbnail: string
    prompt: string
    video: string
    creator: TUser
}