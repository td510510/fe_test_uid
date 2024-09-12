import useProductApi from '@/hooks/useProductApi'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('@/pages/Home'))
const Products = lazy(() => import('@/pages/Products'))
const CreateProduct = lazy(() => import('@/pages/CreateProduct'))

const RoutePage = () => {
  const { isLoading } = useProductApi()
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="create-product" element={<CreateProduct isLoading={isLoading} />} />
        <Route path="/products" element={<Products isLoading={false} />} />
        <Route path="/*" element={<div>Page Not Found</div>} />
      </Routes>
    </Suspense>
  )
}

export default RoutePage
