import { db } from '../firebase'
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

interface UserData {
  name: string
  email: string
  dob: string
  gender: string
  picture: string
  created_at: string
  updated_at: string
  id?: string
}

const usersCollection = collection(db, 'users')

export const createUser = async (user: Omit<UserData, 'id'>) => {
  const docRef = await addDoc(usersCollection, user)
  return { id: docRef.id, ...user }
}

export const getAllUsers = async (): Promise<UserData[]> => {
  const snapshot = await getDocs(usersCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as UserData)
}

export const getUserById = async (id: string): Promise<UserData | null> => {
  const docRef = doc(db, 'users', id)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as UserData
  }
  return null
}

export const updateUser = async (id: string, user: Partial<UserData>) => {
  const docRef = doc(db, 'users', id)
  await updateDoc(docRef, user)
  return { id, ...user }
}

export const deleteUser = async (id: string) => {
  const docRef = doc(db, 'users', id)
  await deleteDoc(docRef)
}
