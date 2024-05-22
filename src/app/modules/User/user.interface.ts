export type TUserProfile = {
    bio: string;
    age: number;
    userId: string
}

export type TUser = {
    name: string;
    email: string;
    password: string;
    profile: TUserProfile;
}