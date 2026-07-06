import { create } from "zustand";
import {persist} from 'zustand/middleware'

const useAuthStore = create(
    persist((set)=>({

    userData:null,
    isAuth:false,

    login:(userData)=>set({

        userData:userData,
        isAuth:true
    }),

    logout:()=>set({

        userData:null,
        isAuth:false
    })
}),{name:'authStorage'})
)

export default useAuthStore