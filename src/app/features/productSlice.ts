import { FormData } from '@/pages/CreateProduct';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  media: string[];
  tags?: string;
  productType?: string;
}

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const products = localStorage.getItem('products');
  if (products) {
    return JSON.parse(products) as Product[];
  }
  return [];
});

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const product: Product = {
        id: Date.now().toString(),
        title: formData?.title,
        description: formData?.description,
        price: +formData?.price,
        media: [],
        tags: formData?.tags,
        productType: formData?.productType,
      };

      if (formData?.media && formData.media instanceof FileList) {
        product.media = Array.from(formData.media).map(file => URL.createObjectURL(file));
      } else if (Array.isArray(formData?.media)) {
        product.media = formData.media.map(file => {
          if (file instanceof File) {
            return URL.createObjectURL(file);
          }
          return file as string;
        });
      }

      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const updatedProducts = [...existingProducts, product];
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      return product;
    } catch (error) {
      return rejectWithValue('Failed to create product');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create product';
      });
  },
});

export default productsSlice.reducer;