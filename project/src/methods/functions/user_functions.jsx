import {getUsersFromDB} from "../APIs/user_api.jsx";

export const getUsers = async () => {
    return await getUsersFromDB();
}