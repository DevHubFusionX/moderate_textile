import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export const getProducts = async () => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((docSnap) => {
      products.push({ _id: docSnap.id, ...docSnap.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting products from Firestore:', error);
    return [];
  }
};

export const getProductById = async (id) => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error('Product not found');
  }
  return { _id: docSnap.id, ...docSnap.data() };
};

export const getCombos = async () => {
  try {
    const q = query(collection(db, 'combos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const comboPromises = querySnapshot.docs.map(async (docSnap) => {
      const comboData = docSnap.data();
      const productIds = comboData.products || [];
      
      const productPromises = productIds.map(async (pId) => {
        try {
          return await getProductById(pId);
        } catch (e) {
          return null;
        }
      });
      const populatedProducts = (await Promise.all(productPromises)).filter(Boolean);
      
      return {
        _id: docSnap.id,
        ...comboData,
        products: populatedProducts
      };
    });
    
    return await Promise.all(comboPromises);
  } catch (error) {
    console.error('Error getting combos from Firestore:', error);
    return [];
  }
};

export const getComboById = async (id) => {
  const docRef = doc(db, 'combos', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error('Combo not found');
  }
  
  const comboData = docSnap.data();
  const productIds = comboData.products || [];
  
  const productPromises = productIds.map(async (pId) => {
    try {
      return await getProductById(pId);
    } catch (e) {
      return null;
    }
  });
  const populatedProducts = (await Promise.all(productPromises)).filter(Boolean);
  
  return {
    _id: docSnap.id,
    ...comboData,
    products: populatedProducts
  };
};
