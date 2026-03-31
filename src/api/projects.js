
import axios, { Axios, AxiosError } from "axios"
import { ProjectStatus } from "../validationClass/ProjectStatus"




const backend_url = import.meta.env.VITE_API_URL;

export  const getDataResponse = async (pageNumber,selectedStatus,pageSize=5)=>{
try {

    const pendingRequests = await axios.get(backend_url+`/api/project/getRequestedService?pageNumber=${pageNumber}&pageSize=${pageSize}&selectedStatus=${selectedStatus}`,{withCredentials:true})

    
    return pendingRequests.data

    
    
    
} catch (error ) {

    console.log("full server error",error);



    console.log("specifed error ",error.response.data);

    const message = error.response?.data?.message || "Uknown Error"


    throw new Error(message)
    
    
    
}





}

export const getAcceptedProject = async (pageNumber)=>{


    try {

        const response = await axios.get(backend_url+`/api/project/getAcceptedProject?pageNumber=${pageNumber}`,{withCredentials:true})


        return response.data
        
    } catch (error) {
        console.log("full server error",error);

        console.log("specific error",error.response?.data);

        const message = error.response.data.message || "Something went Wrong Please Try Again!"

        throw new Error(message)


        
        
        
    }
}
 

export  const updateRequestStatus = async (projectId,status)=>{

    try {

        const response = await axios.put(backend_url+`/api/project/updateBookService/${projectId}?newStatus=${status}`,{},{withCredentials:true})

        return response.data
        
    } catch (error) {

        console.log("full server error response",error);

        console.log("specific error",error?.response?.data);

        const message = error?.response?.data?.message || "Something went Wrong Please Try Again!"

        throw new Error(message)
        

        
        
    }
}