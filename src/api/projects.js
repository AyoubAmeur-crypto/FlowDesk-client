
import axios from "axios"
const backend_url = import.meta.env.VITE_API_URL

export  const getDataResponse = async (pageNumber,pageSize)=>{
try {

    const pendingRequests = await axios.get(backend_url+`/api/project/getRequestedService?pageNumber=${pageNumber}&pageSize=${pageSize}`,{withCredentials:true})

    if(pendingRequests.data){

        return {
        data:pendingRequests.data,
        status:true

    }

    }
    
    
} catch (error) {

    console.log("full server error",error);

    console.log("specifed error ",error.response.data);

    if(error.response && error.response.data){

        return {

            error:error.response.data.message,
            status:false
        }
    }
    
    
    
}


}