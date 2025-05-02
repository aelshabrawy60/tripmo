import { supabaseAdmin } from "@/utils/supabase/service";


const USERS_TABLE = "clients";

export async function addNewUser(phone, name ,groupId) {
    const { data, error } = await supabaseAdmin
        .from(USERS_TABLE)
        .insert([
            {
                phone: phone,
                name: name,
                group_id: groupId,
            },
        ])
        .select("*")
        .single();

    if (error) {
        console.error("Error adding new user:", error);
        return null;
    }

    return data;
}

export async function fetchAllUsers(groupId) {
    const { data, error } = await supabaseAdmin
        .from(USERS_TABLE)
        .select("*")
        .eq("group_id", groupId);

    if (error) {
        console.error("Error fetching users:", error);
        return null;
    }

    return data;
}

// function to check if the user exists

export async function checkUserExists(phone, group_id) {
    const { data, error } = await supabaseAdmin
        .from(USERS_TABLE)
        .select("*")
        .eq("phone", phone)
        .eq("group_id", group_id)
        .single();

    if (error) {
        console.error("Error checking user existence:", error);
        return null;
    }

    if (data) {
        return data; // User exists
    } else {
        return null; // User does not exist
    }
}


// function to remove a user
export async function removeUser(userId) {
    const { data, error } = await supabaseAdmin
        .from(USERS_TABLE)
        .delete()
        .eq("id", userId)
        .select("*")
        .single();

    if (error) {
        console.error("Error removing user:", error);
        return null;
    }

    return data;
}