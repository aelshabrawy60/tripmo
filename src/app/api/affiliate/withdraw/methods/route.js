import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { requireAffiliate } from "@/utils/middleware/requireAffiliate";

async function addMethode(affiliateId, methode, bank, number) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .insert([{ affiliate_id: affiliateId, methode, bank, number }])
        .select();
    
    if (error) throw error;
    return data;
}

async function getMethodes(affiliateId) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .select("*")
        .eq("affiliate_id", affiliateId);

    if (error) throw error;
    return data;
}

async function updateMethode(id, affiliateId, updates) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .update(updates)
        .eq("id", id)
        .eq("affiliate_id", affiliateId)
        .select();
    
    if (error) throw error;
    return data;
}

async function deleteMethode(id, affiliateId) {
    const { data, error } = await supabaseAdmin
        .from("withdraw_methodes")
        .delete()
        .eq("id", id)
        .eq("affiliate_id", affiliateId)
        .select();
    
    if (error) throw error;
    return data;
}

// ✅ GET - Retrieve withdraw methods
export async function GET() {
    try {
        
        const authResult = await requireAffiliate();
        if (!authResult.success) return authResult.response;
        const affiliate = authResult.affiliate;

        const data = await getMethodes(affiliate.id);

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
}

// ✅ POST - Create new withdraw method
export async function POST(request) {
    try {
        const body = await request.json();
        const { methode, bank, number } = body;

        const authResult = await requireAffiliate();
        if (!authResult.success) return authResult.response;
        const affiliate = authResult.affiliate;

        if (!methode || !number) {
            return NextResponse.json(
                { error: "Fields 'methode' and 'number' are required" },
                { status: 400 }
            );
        }

        const data = await addMethode(affiliate.id, methode, bank, number);

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


export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        const authResult = await requireAffiliate();
        if (!authResult.success) return authResult.response;
        const affiliate = authResult.affiliate;

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

        const data = await updateMethode(id, affiliate.id, cleanUpdates);

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

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const authResult = await requireAffiliate();
        if (!authResult.success) return authResult.response;
        const affiliate = authResult.affiliate;

        if (!id) {
            return NextResponse.json(
                { error: "ID is required for deletion" },
                { status: 400 }
            );
        }

        const data = await deleteMethode(id, affiliate.id);

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
}