import axios from "axios"

const backend_url = import.meta.env.VITE_API_URL
export const fetchKanbanData = async(projectId)=>{
    
    try {

        const data = await axios.get(backend_url+`/api/task/getColumns/${projectId}`,{withCredentials:true})
        
        return data.data
    } catch (error) {

        console.log("full server error",error);
        console.log("specific server error",error.response.data);

        if(error.response && error.response.data){

            const message = error.response.data.message

            throw new Error(message)
        }
        
        
        
    }

}

export const createColumn = async(projectId,column)=>{


    try {

        console.log("check details before sending them ",projectId,column);
        

        const data = await axios.post(backend_url+`/api/task/createColumn/${projectId}`,column,{withCredentials:true})
        

        return data.data
    } catch (error) {

        console.log("full error server",error);
        console.log("specific server details",error.response.data);


        if(error.response && error.response.data){

            const message = error.response.data.message

            throw new Error(message)
        }
        
        
        
    }
}

export const getAllTasks = async (projectId)=>{


    try {

        const data = await axios.get(backend_url+`/api/task/allTasks/${projectId}`,{
            withCredentials:true
        })

        return data.data
        
    } catch (error) {

console.log("full error server",error);
        console.log("specific server details",error.response.data);


        if(error.response && error.response.data){

            const message = error.response.data.message

            throw new Error(message)
        }
        
        
        
    }
}

export const createTask = async (taskDto,projectId)=>{


    try {

        const data = await axios.post(backend_url+`/api/task/createTask/${projectId}`,taskDto,{
            withCredentials:true
        })

        return data.data
        
    } catch (error) {

console.log("full error server",error);
        console.log("specific server details",error.response.data);


        if(error.response && error.response.data){

            const message = error.response.data.message

            throw new Error(message)
        }
        
        
        
    }
}
