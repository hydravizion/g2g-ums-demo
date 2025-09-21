import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { Recipe, Category } from '../interfaces/recipes'

// Collections
const recipesCollection = collection(db, 'recipes')
const categoriesCollection = collection(db, 'categories')

// ✅ Recipe Services
export const getAllRecipes = async (): Promise<Recipe[]> => {
  const snapshot = await getDocs(recipesCollection)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
    updatedAt: d.data().updatedAt?.toDate(),
  })) as Recipe[]
}

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  const ref = doc(db, 'recipes', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return {
    id: snap.id,
    ...snap.data(),
    createdAt: snap.data().createdAt?.toDate(),
    updatedAt: snap.data().updatedAt?.toDate(),
  } as Recipe
}

// ✅ Category Services
export const getAllCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(categoriesCollection)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  })) as Category[]
}

export const getRecipesByCategory = async (categoryId: string): Promise<Recipe[]> => {
  const snapshot = await getDocs(recipesCollection)
  return snapshot.docs
    .map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
    }))
    .filter((r: any) => r.categoryId === categoryId) as Recipe[]
}

export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const docRef = await addDoc(categoriesCollection, {
    ...category,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: docRef.id, ...category }
}

export const createRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(recipesCollection, {
    ...recipe,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: docRef.id, ...recipe }
}
