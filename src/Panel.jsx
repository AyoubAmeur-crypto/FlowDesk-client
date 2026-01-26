import React, { useEffect } from 'react'
import useAuthStore from './globalState/zustand'

function Panel() {


  const userData = useAuthStore((state)=>state.userData)

  useEffect(()=>{
    console.log("user data check",userData);
    
  },[])
  return (
    <div className="text-white">
      <h1>Welcome {userData.firstName}</h1>
    </div>
  )
}

export default Panel