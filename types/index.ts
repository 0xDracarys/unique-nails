export interface User {
  id: string
  name: string
  email: string
  profileImage?: string
  createdAt: number
  designs: string[] // Array of design IDs
  followers: string[] // Array of user IDs
  following: string[] // Array of user IDs
}

export interface Design {
  id: string
  name: string
  type: "holographic" | "gemstone" | "galaxy" | "floral" | string
  createdAt: number
  updatedAt: number
  userId: string
  userName: string
  likes: number
  fingerDesigns: Record<number, string> // Map of finger index to design type
  public: boolean
}

export interface Session {
  userId: string
  expires: number
}
