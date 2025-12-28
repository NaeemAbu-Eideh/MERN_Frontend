import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export const getUsersFromDB = async ()=>{
    try{
        const users = await axios.get("/users");
        return users.data;
    }catch(err){
        console.log(err);
    }
}