
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './landingPage/LandingPage'
import ProtectedRoute from './utils/ProtectedRoute'
import AdminPanel from './admin/AdminPanel'
import AdminDashboard from './admin/AdminDashboard'
import AdminMarketplace from './admin/AdminMarketplace'
import AdminBlog from './admin/AdminBlog'

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}  />

        <Route path='/admin' element={<ProtectedRoute><AdminPanel/></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

          <Route path='dashboard' element={<AdminDashboard/>}/>
          <Route path='marketplace' element={<AdminMarketplace/>}/>
          <Route path='blog' element={<AdminBlog/>}/>

        </Route>
        
      
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
