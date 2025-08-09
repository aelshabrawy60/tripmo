import { supabaseAdmin } from "../supabase/service";
import jwt from "jsonwebtoken";

export async function signin(email, password){
    const {data, error} = await supabaseAdmin.from("affiliates")
        .select("*")
        .eq("email", email)
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
                username: data.email,
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
            .from("affiliates")
            .select("id")
            .eq("id", decoded.id)
            .maybeSingle();

        if (error) {
            throw new Error("Failed to fetch Affiliate: " + error.message);
        }

        if (!data) {
            throw new Error("Affiliate not found");
        }

        return data;
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}
