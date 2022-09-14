import axios from "axios";



export  const editOptionsUrl = (id: number)=>{
    return `/api/transport/${id}/edit`
} 


export const editOptions = (id:number , data: any) => {
    return axios.post(editOptionsUrl(id), data);
  };