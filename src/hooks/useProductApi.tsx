// import { useState, useCallback } from 'react';

// export interface Product {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   media: string[];
//   tags?: string;
//   productType?: string;
// }

// const useProductApi = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchProducts = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const storedProducts = localStorage.getItem('products');
//       if (storedProducts) {
//         setProducts(JSON.parse(storedProducts));
//       }
//     } catch (err) {
//       setError('Failed to fetch products');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const fetchProduct = useCallback(async (id: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const storedProducts = localStorage.getItem('products');
//       if (storedProducts) {
//         const allProducts = JSON.parse(storedProducts);
//         const product = allProducts.find((p: Product) => p.id === id);
//         if (product) {
//           return product;
//         } else {
//           throw new Error('Product not found');
//         }
//       }
//     } catch (err) {
//       setError('Failed to fetch product');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const createProduct = useCallback(async (product: Omit<Product, 'id'>) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const newProduct = { ...product, id: Date.now().toString() };
//       const storedProducts = localStorage.getItem('products');
//       const updatedProducts = storedProducts
//         ? [...JSON.parse(storedProducts), newProduct]
//         : [newProduct];
//       localStorage.setItem('products', JSON.stringify(updatedProducts));
//       setProducts(updatedProducts);
//       return newProduct;
//     } catch (err) {
//       setError('Failed to create product');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return { products, isLoading, error, fetchProducts, fetchProduct, createProduct };
// };

// export default useProductApi;

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchProducts, createProduct, Product } from '@/app/features/productSlice';

const useProductApi = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products: Product[] = useSelector((state: RootState) => state.products.items);
  const status = useSelector((state: RootState) => state.products.status);
  const error = useSelector((state: RootState) => state.products.error);

  const getProducts = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    dispatch(createProduct(product));
  }, [dispatch]);

  return {
    products,
    isLoading: status === 'loading',
    error,
    getProducts,
    addProduct,
  };
};

export default useProductApi;