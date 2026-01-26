import axios from "axios"
import { data } from "react-router-dom"

const backend_url = import.meta.env.VITE_API_URL

export const makeLoginRequest = async (userInfo)=>{


    try {

        const loginResponse = await axios.post(backend_url+'/api/auth/signIn',userInfo)

        console.log("login response",loginResponse.data);
        

        return {
            success:true,
            data : loginResponse.data
        }
        
    } catch (error) {

        console.log("can't login due to this",error);
        console.log("server response ",error.response.data.message);
        console.log("server response ",error.response.data.error);

        
        

        return {
            success:false,
            error: error.response?.data?.message ||
            error.response?.data?.error ||
            'Invalid Email or Password' 
        }
        
        
    }
}