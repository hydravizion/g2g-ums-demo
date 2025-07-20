import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  CollectionReference,
} from 'firebase/firestore'
import { User } from '../interfaces/user'
import { format } from 'date-fns'

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

export const deleteUser = async (user: User) => {
  const recycleCollection = collection(db, 'recycle')
  const nowTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  const { id, ...userWithoutId } = user
  await addDoc(recycleCollection, {
    userWithoutId,
    deleted_at: nowTime,
  })

  const docRef = doc(db, 'users', user.id)
  await deleteDoc(docRef)
}
