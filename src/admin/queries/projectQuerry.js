import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {getDataResponse} from '../../api/projects'
import {getAllCategories,getAvialableCategoires} from '../../api/category'
import {getAllServices} from '../../api/service'
import {getAcceptedProject} from '../../api/projects'

export const getProjectQuerryOption = (pageNumber,selectedStatus)=>{


    return queryOptions({
        queryKey:["pendingProjects",pageNumber,selectedStatus],
        queryFn:()=>getDataResponse(pageNumber,selectedStatus)
    })
}

export const getServicesQueryOption = (
  pageNumber,
  pageSize,
  sortMethod,
  sortBy,
  searchQuery,
  selectedCategory
) => {
  return queryOptions({
    queryKey: [
      "services",
      {
        pageNumber,
        pageSize,
        sortMethod,
        sortBy,
        searchQuery,
        selectedCategory,
      },
    ],
    queryFn: () => getAllServices(pageNumber, pageSize, sortMethod, sortBy, searchQuery, selectedCategory),
          // Garbage collect after 10 minutes
    placeholderData: keepPreviousData, // No loading flash when paginating
  });
};


export const getProjectAcceptedQueryOption = (pageNumber)=>{

  return queryOptions({
    queryKey:["projects",pageNumber],
    queryFn:()=>getAcceptedProject(pageNumber)
  })
}
export const getCategoryQueryOption = (pageNumber)=>{


    return queryOptions({
        queryKey:["categories",pageNumber],
        queryFn:()=>getAllCategories(pageNumber)
    })
}

export const getCategoryQueryOptionList = ()=>{


    return queryOptions({
        queryKey:["categoriesList"],
        queryFn:()=>getAvialableCategoires()
    })
}