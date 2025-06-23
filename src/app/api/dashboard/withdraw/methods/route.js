import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { withAuth } from "@/lib/auth";

async function addMethode(groupId, methode, bank, number) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .insert([{ group_id: groupId, methode, bank, number }])
        .select();
    
    if (error) throw error;
    return data;
}

async function getMethodes(groupId) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .select("*")
        .eq("group_id", groupId);
    
    if (error) throw error;
    return data;
}

async function updateMethode(id, groupId, updates) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .update(updates)
        .eq("id", id)
        .eq("group_id", groupId)
        .select();
    
    if (error) throw error;
    return data;
}

async function deleteMethode(id, groupId) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .delete()
        .eq("id", id)
        .eq("group_id", groupId)
        .select();
    
    if (error) throw error;
    return data;
}

// ✅ GET - Retrieve withdraw methods
export const GET = withAuth(async (request) => {
    try {
        const { groupId } = request.auth;

        const data = await getMethodes(groupId);

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
});

// ✅ POST - Create new withdraw method
export const POST = withAuth(async (request) => {
    try {
        const body = await request.json();
        const { methode, bank, number } = body;
        const { groupId } = request.auth;

        if (!methode || !number) {
            return NextResponse.json(
                { error: "Fields 'methode' and 'number' are required" },
                { status: 400 }
            );
        }

        const data = await addMethode(groupId, methode, bank, number);

        return NextResponse.json({
            success: true,
            data: data[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
});

// ✅ PUT - Update existing withdraw method
export const PUT = withAuth(async (request) => {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        const { groupId } = request.auth;

        if (!id) {
            return NextResponse.json(
                { error: "ID is required for update" },
                { status: 400 }
            );
        }

        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null)
        );

        if (Object.keys(cleanUpdates).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        const data = await updateMethode(id, groupId, cleanUpdates);

        if (data.length === 0) {
            return NextResponse.json(
                { error: "Withdraw method not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: data[0]
        });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
});

// ✅ DELETE - Delete withdraw method
export const DELETE = withAuth(async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const { groupId } = request.auth;

        if (!id) {
            return NextResponse.json(
                { error: "ID is required for deletion" },
                { status: 400 }
            );
        }

        const data = await deleteMethode(id, groupId);

        if (data.length === 0) {
            return NextResponse.json(
                { error: "Withdraw method not found or not owned by group" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Withdraw method deleted successfully",
            data: data[0]
        });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
});
