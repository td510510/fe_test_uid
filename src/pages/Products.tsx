import React, { useEffect, useState } from 'react';
import useProductApi from '@/hooks/useProductApi';
import withLoadingIndicator from '../hocs/withLoadingIndicator';
import styles from './products.module.scss'

const ProductList: React.FC = () => {
  const { products, isLoading, error, getProducts } = useProductApi();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (products.length > 0) {
      const tags = Array.from(new Set(products.flatMap(item => item.tags?.split(',').map(tag => tag.trim()) || [])));
      setAllTags(tags);
    }
  }, [products]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredProducts = selectedTags.length > 0
    ? products.filter(product =>
      selectedTags.every(tag => product.tags?.includes(tag))
    )
    : products;

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 style={{ textAlign: 'center' }}>Products</h2>
      <div className={styles.tags}>
        <h3>Filter by Tags:</h3>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagSelect(tag)}
            style={{ backgroundColor: selectedTags.includes(tag) ? 'lightblue' : 'white' }}
          >
            {tag}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Title</th>
            <th>Image</th>
            <th>Price</th>
            <th>Product Type</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>{product.title.length > 50 ? `${product.title.substring(0, 50)}...` : product.title}</td>
              {/* <td>{product.description || 'N/A'}</td> */}
              <td>
                {product.media && product.media.length > 0 && (
                  <img
                    src={product.media[0]}
                    alt={product.title}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                )}
              </td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.productType || 'N/A'}</td>
              <td>{product.tags || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withLoadingIndicator(ProductList);