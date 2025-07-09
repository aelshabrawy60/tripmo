import { supabaseAdmin } from "../supabase/service";
import jwt from "jsonwebtoken";

export async function signin(user, password){
    const {data, error} = await supabaseAdmin.from("admins")
        .select("*")
        .eq("username", user)
        .eq("password", password)
        .single()

    if (error) {
        throw new Error(error.message)
    }


    if(!data){
        return null
    }

    const token = jwt.sign(
            {
                id: data.id,
                username: data.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1000d" }
    );

    return token;

}

export async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { data, error } = await supabaseAdmin
            .from("admins")
            .select("id, role")
            .eq("id", decoded.id)
            .maybeSingle();

        if (error) {
            throw new Error("Failed to fetch client: " + error.message);
        }

        if (!data) {
            throw new Error("Admin not found");
        }

        return data;
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}
