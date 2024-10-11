
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import Product from './pages/product'
// import Pricing from './pages/pricing'
// import Login from './pages/Login'
// import PageNotFound from './pages/PageNotFound'
// import HomePage from './pages/HomePage'
// import AppLayout from './pages/AppLayout'
import CityList from "./components/CityList"
import CountryList from "./components/CountryList"
import City from "./components/City"
import Form from './components/Form'
import { CitiesProvider } from './contexts/CitiesContext'
import { AuthProvider } from './contexts/FakeAuthContent'
import ProtectedRoutes from './pages/ProtectedRoutes'
import { lazy , Suspense } from 'react'
import SpinnerFullPage from './components/SpinnerFullPage'

const HomePage = lazy(() => import("./pages/HomePage"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const  Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));

function App() {   
  return (
    <>
    <AuthProvider>
    <CitiesProvider>
      <BrowserRouter>
      <Suspense fallout={<SpinnerFullPage/>}>
      <Routes>
        <Route index element={<HomePage/>}></Route>
        <Route path="product" element={<Product />}></Route>
        <Route path="pricing" element={<Pricing />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="app" element={
          <ProtectedRoutes> 
          <AppLayout /> 
          </ProtectedRoutes>}>
        <Route index element={<Navigate replace to="cities" />} />
            <Route path="cities" element={<CityList/>}/>
            <Route path='cities/:id' element={<City/>}/>
            <Route path="countries" element={<CountryList/>}/>
            <Route path="form" element={<Form/>}/>
        </Route>
        <Route path="*" element={<PageNotFound/>}></Route> 
      </Routes>
      </Suspense>
      </BrowserRouter>
      </CitiesProvider>
      </AuthProvider>
    </>
  )
}
export default App
