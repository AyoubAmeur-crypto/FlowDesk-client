import axios from "axios";

const backend_url = import.meta.env.VITE_API_URL


export const getAvialableCategoires = async ()=>{


    try {

        const res = await axios.get(backend_url+'/api/category/allCategoires',{withCredentials:true})


        return res.data
        
    } catch (error) {

        console.log("full server response",error);
        console.log("specific error message",error.response.data);
        

        if(error.response && error.response.data){


            const message = error.response.data.message


            throw new Error(message)
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

       console.log("full server response",error);
        console.log("specific error message",error.response.data);
        

        if(error.response && error.response.data){


            const message = error.response.data.message


            throw new Error(message)
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
        console.log("specific error message",error.response.data);
        

        if(error.response && error.response.data){


            const message = error.response.data.message


            throw new Error(message)
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


        console.log("full server response",error);
        console.log("specific error message",error.response.data);
        

        if(error.response && error.response.data){


            const message = error.response.data.message


            throw new Error(message)
        }
        
        
    }
}

export const deleteCategory = async(id)=>{

    console.log("check what we are sending to back office deleted Caetegory Id : ",id);
    

    try {

        const response = await axios.delete(backend_url+`/api/category/deleteCategory/${id}`,{withCredentials:true})

        return {
            status:true,
            data:response.data
        }
        
    } catch (error) {


        console.log("full server response",error);
        console.log("specific error message",error.response.data);
        

        if(error.response && error.response.data){


            const message = error.response.data.message


            throw new Error(message)
        }
        
        
    }
}