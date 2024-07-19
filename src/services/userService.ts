import { LoginFormType, SignupFormType } from "@/types/forms";
import { errorHandler } from "@/utils/handlers";
import axios from "axios";

export class UserService {
    static login = errorHandler(async (data: LoginFormType) => {
        const res = await axios.post("/api/auth/login", data)
        return res.data
    });

    static signup = errorHandler(async (data: SignupFormType) => {
        const res = await axios.post('/api/auth/signup', data);
        return res.data;
    });

    static logout = errorHandler(async () => {
        const res = await axios.post('/api/auth/logout');
        return res.data;
    });
}