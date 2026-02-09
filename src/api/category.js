import axios from "axios";

const backend_url = import.meta.env.VITE_API_URL


export const getAvialableCategoires = async ()=>{


    try {

        const res = await axios.get(backend_url+'/api/category/allCategoires',{withCredentials:true})


        return {

            status:true,
            data:res.data
        }
        
    } catch (error) {

        console.log("full server error ",error);

        if(error.response && error.response.data){

              return {

            status:false,
            error:error.response.data.message

        }


        }

      
        
        
    }
}

export const getAllCategories = async (pageNumber)=>{


    try {

        const allCategories = await axios.get(backend_url+`/api/category/categories?pageNumber=${pageNumber}`,{withCredentials:true})

        return {

            sucess:true,
            data:allCategories.data
        }
        
    } catch (error) {

        console.log("server error response",error);
        console.log("specific server response",error.response.data);

        if(error && error.response.data){

            return{
                sucess:false,
                message:error.response.data.message
            }
        }
        
        
        
    }
}


export const createCategory = async (categoryDto)=>{

    try {


        const response = await axios.post(backend_url+'/api/category/addCategory',categoryDto,{withCredentials:true})

        return{
            status:true,
            data:response.data
        }
        
    } catch (error) {
        console.log("full server response",error);

        if(error.response && error.response.data){


            return {
                status:false,
                error:error.response.data.message
            }
        }
        
    }


}

export const updateCategory = async (id,categoryDto)=>{


    try {
                console.log("Sending update request with:");
        console.log("ID:", id);
        console.log("Data:", categoryDto);

        const res = await axios.put(backend_url+`/api/category/updateCategory/${id}`,categoryDto,{withCredentials:true})


        return {
            status:true,
            data:res.data
        }
        
    } catch (error) {

        console.log("full server response ",error);

        if(error.response && error.response.data){

            return{

            status:false,
            error:error.response.data.message
        }
        }

         return {
            status: false,
            error: error.message || "Update failed"
        }
        
        
    }
}

export const deleteCategory = async(id)=>{

    try {

        const response = await axios.delete(backend_url+`/api/category/deleteCategory/${id}`,{withCredentials:true})

        return {
            status:true,
            data:response.data
        }
        
    } catch (error) {


        console.log("full server response ",error);

        if(error.response && error.response.data){
            
            return{
                status:false,
                error:error.response.data.message
            }
            
        }
        
        
    }
}