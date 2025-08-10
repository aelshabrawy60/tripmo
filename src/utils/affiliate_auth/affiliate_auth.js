import { supabaseAdmin } from "../supabase/service";
import jwt from "jsonwebtoken";
import { generateRefCode, generatePassword } from "./helper";

export async function createAffiliate(email, name, phone) {
    const referralCode = generateRefCode(email);
    const password = generatePassword();

    const { data, error } = await supabaseAdmin
        .from("affiliates")
        .insert([{ email, name, phone, ref_code: referralCode, password }])
        .select("*");

    if (error) {
        throw new Error("Failed to create affiliate: " + error.message);
    }

    const affiliate = data[0];
    
    const token = jwt.sign(
        {
            id: affiliate.id,
            email: affiliate.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1000d" }
    );

    return { affiliate, token };
}


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
            .select("id, ref_code")
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
