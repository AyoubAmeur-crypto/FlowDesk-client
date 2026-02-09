import axios from "axios";
import { data } from "react-router-dom";

const backend_url = import.meta.env.VITE_API_URL

export const createService = async(formData)=>{


   try {
        const multipartFormData = new FormData();
        
        multipartFormData.append("serviceName", formData.serviceName);
        multipartFormData.append("serviceDescription", formData.serviceDescription);
        multipartFormData.append("servicePrice", formData.servicePrice);
        if (formData.serviceImage instanceof File) {
            multipartFormData.append("image", formData.serviceImage);

      }

        const res = await axios.post(
            backend_url + `/api/service/createService/${formData.categoryId}`,
            multipartFormData,
            {
                withCredentials: true
            }
        );

        return {
            status: true,
            data: res.data
        }
        
    } catch (error) {
        console.log("full server response", error);
        console.log("response data:", error.response?.data); 


        if(error.response && error.response.data) {
            return {
                status: false,
                error: error.response.data.message
            }
        }
    }
} 


export const getAllServices = async(
    pageNumber=0,
    pageSize=8,
    sortMethod='desc',
    sortBy='serviceId',
    searchQuerry='',
    selectedCategory={}
)=>{

    try {

        console.log("before sending check ",pageNumber,pageSize,sortMethod,sortBy,searchQuerry,selectedCategory);
        

        const services = await axios.get(backend_url+`/api/service/services?pageNumber=${pageNumber}&pageSize=${pageSize}&sortMethod=${sortMethod}&sortBy=${sortBy}&categoryId=${selectedCategory}&keyword=${searchQuerry}`,{withCredentials:true})

        return {

            status:true,
            data:services.data
        }

        
    } catch (error) {

        console.log("full service error ",error);
        console.log("specific server response ",error.response.data);


        if(error.response && error.response.data){

            return {
                status:false,
                error:error.response.data.message
            }
        }
        
        
        
    }
}


export const updateService = async(serviceId,formData)=>{

    try {

        console.log("check the data before sending it ",serviceId,formData);
        

        const res = await axios.put(backend_url+`/api/service/updateService/${serviceId}`,formData,{
            withCredentials:true
        })

        return {
            status:true,
            data:res.data
        }
        
    } catch (error) {
        console.log("full server error",error);
        console.log("specific error ",error.response.data);

        if(error.response && error.response.data){

            return {

                status:false,
                error:error.response.data.message
            }
        }
        
        
    }
}


export const deleteService = async (serviceId)=>{

    try {


        const res = await axios.delete(backend_url+`/api/service/deleteService/${serviceId}`,{
            withCredentials:true
        })


        return {

            status:true,
            data:res.data
        }
        
    } catch (error) {
        console.log("full server error ",error);
        
        console.log("specific server response ",error.response.data);




        if(error.response && error.response.data){
            return {

                status:false,
                error:error.response.data.message
            }
        }
        
        
    }
}