import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import useAuthStore from './globalState/zustand'

import LandingPage from './landingPage/LandingPage'
import ProtectedRoute from './utils/ProtectedRoute'
import AdminPanel from './admin/AdminPanel'
import AdminDashboard from './admin/AdminDashboard'
import AdminMarketplace from './admin/AdminMarketplace'
import AdminBlog from './admin/AdminBlog'
import ServicesComponent from './admin/adminDashComponent/ServiceComponent'
import CategoryCompnent from './admin/adminDashComponent/CategoryCompnent'
import SettingComponent from './admin/adminDashComponent/SettingsComponent'
import Freelancers from './admin/adminDashComponent/FreelancersComponant'
import Earnings from './admin/adminDashComponent/EarningComponent'
import Requests from './admin/adminDashComponent/RequestComponent'
import UserComponant from './admin/adminDashComponent/UserComponant'
import Projects from './admin/adminDashComponent/ProjectComponent'

function AdminRedirect() {
  const userData = useAuthStore((state) => state.userData)
  
  if (userData?.roles?.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/dashboard/categories" replace />
  }
  
  return <LandingPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {// temporary code// *
        }
        <Route path='/' element={<LandingPage />} />

        <Route path='/admin' element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard/categories" replace />} />

          <Route path='dashboard' element={<AdminDashboard />}>
            <Route path='categories' element={<CategoryCompnent />} />
            <Route path='services' element={<ServicesComponent />} />
            <Route path='users' element={<UserComponant />} />
            <Route path='requests' element={<Requests />} />
            <Route path='earnings' element={<Earnings />} />
            <Route path='freelancers' element={<Freelancers />} />
            <Route path='projects' element={<Projects />} />
            <Route path='settings' element={<SettingComponent />} />
          </Route>
          <Route path='marketplace' element={<AdminMarketplace />} />
          <Route path='blog' element={<AdminBlog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App