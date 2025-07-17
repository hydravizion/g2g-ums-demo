import { db } from '../firebase'
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { User } from '../interfaces/user'

const usersCollection = collection(db, 'users')

export const createUser = async (user: Omit<User, 'id'>) => {
  const docRef = await addDoc(usersCollection, user)
  return { id: docRef.id, ...user }
}

export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(usersCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as User)
}

export const getUserById = async (id: string): Promise<User | null> => {
  const docRef = doc(db, 'users', id)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as User
  }
  return null
}

export const updateUser = async (id: string, user: Partial<User>) => {
  const docRef = doc(db, 'users', id)
  await updateDoc(docRef, user)
  return { id, ...user }
}

export const deleteUser = async (id: string) => {
  const docRef = doc(db, 'users', id)
  await deleteDoc(docRef)
}
