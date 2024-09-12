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

  const addProduct = useCallback(async (product) => {
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