import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";

async function addMethode(groupId, methode, bank, number) {

            console.log(groupId, methode, bank, number)

    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .insert([{ group_id: groupId, methode, bank, number }])
        .select();
    
    
    if (error){
                console.log(error)

        throw error;
    } 
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

async function updateMethode(id, updates) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .update(updates)
        .eq("id", id)
        .select();
    
    if (error){
        console.log(error)
        throw error;
    } 
    return data;
}

async function deleteMethode(id) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .delete()
        .eq("id", id)
        .select();
    
    if (error) throw error;
    return data;
}

// GET - Retrieve withdraw methods
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get('group_id');
        
        if (!groupId) {
            return NextResponse.json(
                { error: "group_id is required" },
                { status: 400 }
            );
        }

        const data = await getMethodes(groupId);
        
        return NextResponse.json({
            success: true,
            data: data
        });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// POST - Create new withdraw method
export async function POST(request) {
    try {
        const body = await request.json();
        const { group_id, methode, bank, number } = body;

        // Validate required fields
        if (!group_id || !methode || !number) {
            return NextResponse.json(
                { error: "All fields (group_id, methode, bank, number) are required" },
                { status: 400 }
            );
        }

        const data = await addMethode(group_id, methode, bank, number);

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
}

// PUT - Update existing withdraw method
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: "ID is required for update" },
                { status: 400 }
            );
        }

        // Remove any undefined/null values from updates
        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
        );

        if (Object.keys(cleanUpdates).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        const data = await updateMethode(id, cleanUpdates);

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
}

// DELETE - Delete withdraw method
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "ID is required for deletion" },
                { status: 400 }
            );
        }

        const data = await deleteMethode(id);

        if (data.length === 0) {
            return NextResponse.json(
                { error: "Withdraw method not found" },
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
}