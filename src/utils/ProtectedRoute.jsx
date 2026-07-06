import React from 'react'
import createAuthStore from '../globalState/zustand'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {

    const isAuth = createAuthStore((state)=>state.isAuth)


    if(!isAuth) return <Navigate to='/'/>

        return children

  
}

export default ProtectedRoute