import { useState } from "react"
import {create} from 'zustand'
import {persist} from 'zustand/middleware'



const useAuthStore = create(persist(
    (set)=>({

    userData:null,
    isAuth:false,

    login:(userData)=>set({
        userData:userData,
        isAuth:true
    }),

    logout:()=>set({
        isAuth:false,
        userData:null
    })
}),{
    name:'auth-storage',
}
))


export default useAuthStore
