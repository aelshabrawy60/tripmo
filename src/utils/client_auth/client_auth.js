import { supabaseAdmin } from "../supabase/service";
import jwt from "jsonwebtoken";

// Create client and return token
export async function createClient(phone, name = null) {
    const { data, error } = await supabaseAdmin
        .from("clients")
        .insert([{ phone, name }])
        .select("*");

    if (error) {
        throw new Error("Failed to create client: " + error.message);
    }

    const client = data[0];

    const token = jwt.sign(
        {
            id: client.id,
            phone: client.phone,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1000d" }
    );

    return { client, token };
}

// Change client name using JWT
export async function changeClientName(name, token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const clientId = decoded.id;

        const { data, error } = await supabaseAdmin
            .from("clients")
            .update({ name })
            .eq("id", clientId)
            .select("*");

        if (error) {
            throw new Error("Failed to update name: " + error.message);
        }

        return {
            clientPhone: data[0].phone,
            clientName: data[0].name,
            clientId: data[0].id
        };
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}

// ✅ Check if user exists by phone number
export async function isUserExists(phone) {
    const { data, error } = await supabaseAdmin
        .from("clients")
        .select("id, phone, name")
        .eq("phone", phone)
        .maybeSingle(); // returns null if not found

    if (error) {
        throw new Error("Failed to check user: " + error.message);
    }

    return data !== null ? data : null;
}



// ✅ Get token for existing user by phone number
export async function getClientTokenByPhone(phone) {
    const { data, error } = await supabaseAdmin
        .from("clients")
        .select("id, phone")
        .eq("phone", phone)
        .maybeSingle(); // returns null if not found

    if (error) {
        throw new Error("Failed to fetch user: " + error.message);
    }

    if (!data) {
        return null; // user not found
    }

    const token = jwt.sign(
        {
            id: data.id,
            phone: data.phone,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1000d" }
    );

    return token;
}

// ✅ Verify token and return user data
export async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { data, error } = await supabaseAdmin
            .from("clients")
            .select("id, phone, name")
            .eq("id", decoded.id)
            .maybeSingle();

        if (error) {
            throw new Error("Failed to fetch client: " + error.message);
        }

        if (!data) {
            throw new Error("Client not found");
        }

        return data;
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
}
