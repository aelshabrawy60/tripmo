import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/middleware/requireAdmin";
import { supabaseAdmin } from "@/utils/supabase/service";

export async function GET(request) {
    try {
        // Authenticate admin
        const authResult = await requireAdmin("trips");
        if (!authResult.success) return authResult.response;
        const admin = authResult.admin;
    
        // Extract query parameters
        const { searchParams } = new URL(request.url);
        const tripId = searchParams.get("id");

        // Fetch data
        const result = await formateTripData(tripId);
        
        // Convert data to CSV format
        const csvData = convertToCSV(result);
        
        // Create filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `trip-${tripId}-${timestamp}.csv`;
        
        // Return CSV file as download
        return new NextResponse(csvData, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });

    } catch (error) {
        console.error("Error in trips API:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch trip",
                message: error.message
            },
            { status: 500 }
        );
    }
}

async function formateTripData(tripId) {
    const { data, error } = await supabaseAdmin
        .from('trips')
        .select('*, dest:dest_city (name, country)')
        .eq('id', tripId)
        .single();

    if (error) {
        throw new Error(`Failed to fetch trip data: ${error.message}`);
    }
    
    console.log("data", data, "tripid", tripId);

    return {
        destination_id: data.id,
        name: data.name,
        description: data.about,
        address_city: data.dest?.name || null,
        address_region: null,
        address_country: data.dest?.country || null,
        image_0: data.images?.[0] || null,
        image_1: data.images?.[1] || data.images?.[0] || null,
        type_0: null,
        type_1: null,
        url: `https://www.rehlanow.com/trips/${data.slug}`,
        price: data.pricing?.PersonPrice || 0,
        custom_label_0: null,
    };
}

function convertToCSV(data) {
    // Get headers from the data object keys
    const headers = Object.keys(data);
    
    // Create CSV header row
    const csvHeaders = headers.join(',');
    
    // Create CSV data row - escape values that contain commas or quotes
    const csvRow = headers.map(header => {
        let value = data[header];
        
        // Handle null/undefined values
        if (value === null || value === undefined) {
            value = '';
        }
        
        // Convert to string
        value = String(value);
        
        // Escape quotes by doubling them and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
            value = '"' + value.replace(/"/g, '""') + '"';
        }
        
        return value;
    }).join(',');
    
    // Combine headers and data
    return csvHeaders + '\n' + csvRow;
}