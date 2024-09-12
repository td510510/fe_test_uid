import styles from './createProduct.module.scss'

// const CreateProduct = () => {
//   return <div className={styles.container}>
//     {/* <form action="POST">
//       <div>
//         <label htmlFor="title" >Title</label>
//         <input type="text" name="title" id="title" required />
//       </div>
//       <div>
//         <label htmlFor="description" >Description</label>
//         <textarea name="description" id="description" required />
//       </div>
//       <div>
//         <label htmlFor="price" >Price</label>
//         <input type="text" name="price" id="price" required />
//       </div>
//       <div>
//         <label htmlFor="tags" >Tags</label>
//         <input type="text" name="tags" id="tags" />
//       </div>
//       <div>
//         <label htmlFor="productType" >Product Type</label>
//         <input type="text" name="productType" id="productType" />
//       </div>
//       <div>
//         <label htmlFor="media" >Media</label>
//         <input type="file" name="media" id="media" required />
//       </div>
//       <button type="submit">Submit</button>
//     </form> */}


//   </div>
// }

// export default CreateProduct

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import useProductApi from '../hooks/useProductApi';
import withLoadingIndicator from '../hocs/withLoadingIndicator';
import { useNavigate } from 'react-router-dom';

export interface FormData {
  title: string;
  description: string;
  price: number;
  media: FileList;
  tags?: string;
  productType?: string;
}

const CreateProductForm: React.FC = () => {
  const { addProduct, error } = useProductApi();
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>();
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    const mediaUrls = Array.from(data.media).map(file => URL.createObjectURL(file));
    try {
      await addProduct({
        title: data.title,
        description: data.description,
        price: data.price,
        media: mediaUrls,
        tags: data.tags,
        productType: data.productType,
      });
      navigate('/products');
    } catch (err) { }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setMediaPreview(previews);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Create Product</h2>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.baseInput}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <span>{errors.title.message}</span>}
          </div>

          <div>
            <label htmlFor="description">Description *</label>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.description && <span>{errors.description.message}</span>}
          </div>

          <div className={styles.baseInput}>
            <label htmlFor="price">Price *</label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
            />
            {errors.price && <span>{errors.price.message}</span>}
          </div>

          <div className={styles.baseInput}>
            <label htmlFor="media">Media *</label>
            <input
              id="media"
              type="file"
              multiple
              accept="image/*"
              {...register('media', {
                required: 'At least one image is required',
                validate: (files) => files.length > 0 || 'At least one image is required'
              })}
              onChange={handleMediaChange}
            />
            {errors.media && <span>{errors.media.message}</span>}
            {mediaPreview.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            ))}
          </div>

          <div className={styles.baseInput}>
            <label htmlFor="tags">Tags (optional)</label>
            <input
              id="tags"
              {...register('tags')}
            />
          </div>

          <div className={styles.baseInput}>
            <label htmlFor="productType">Product Type (optional)</label>
            <input
              id="productType"
              {...register('productType')}
            />
          </div>

          <button type="submit">Create Product</button>
        </form>
      </div>
    </>
  );
};

export default withLoadingIndicator(CreateProductForm);
