
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './landingPage/LandingPage'
import Panel from './Panel'
import ProtectedRoute from './utils/ProtectedRoute'

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}  />
        <Route path='/panel' element={<ProtectedRoute><Panel/></ProtectedRoute>}/>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
