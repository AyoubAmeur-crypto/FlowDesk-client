import axios from "axios"
import { data } from "react-router-dom"

const backend_url = import.meta.env.VITE_API_URL

export const makeLoginRequest = async (userInfo)=>{


    try {

        const loginResponse = await axios.post(backend_url+'/api/auth/signIn',userInfo,{withCredentials:true})

        console.log("login response",loginResponse.data);
        

        return {
            success:true,
            data : loginResponse.data
        }
        
    } catch (error) {

        const validationErrors = error.response?.data
        let errorMessage = "Can't Login Please Try Again!"


        if(validationErrors){

            errorMessage = validationErrors.message || errorMessage

        
        
        }

        console.log("can't login due to this",error);
        

        return{
            success:false,
            error:errorMessage
        }
        
        
    }
}

export const makeSignUpRequest = async (userData)=>{

    const registerRequestDto = {

        firstName:userData.firstName,
        lastName:userData.lastName,
        email:userData.email,
        password:userData.password,
        phoneNumber:userData.phoneNumber
    }

    try {

        const serverResponse = await axios.post(backend_url+'/api/auth/register',registerRequestDto,{withCredentials:true})

        return {

            success:true,
            data:serverResponse.data
        }
        
    } catch (error) {


           const validationErrors = error.response?.data
         let errorMessage = "Can't Login Please Try Again!";
        if (validationErrors) {
            errorMessage = validationErrors.message || errorMessage
        }

        console.log("can't login due to this",error);
        console.log("server response ",validationErrors);

        
        

        return {
            success:false,
            error: errorMessage
        }
        

        
        
        
    }



    
}


export const signOut = async ()=>{

        try {


            const serverResponse = await axios.post(backend_url+'/api/auth/signOut',{},{withCredentials:true})

            return serverResponse.data
            
        } catch (error) {

            console.log("server response ",error);
            console.log("error message",error.response.data);
            
            

            if(error.response && error.response?.data){

                return {
                    success:false,
                    message:error.response.data.message
                }
            }
            
        }
    }