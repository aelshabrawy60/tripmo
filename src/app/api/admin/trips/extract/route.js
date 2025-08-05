import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/middleware/requireAdmin";
import { supabaseAdmin } from "@/utils/supabase/service";
import { google } from 'googleapis';

const GOOGLE_CLIENT_EMAIL="sheets-api-service@elshabrawy-optics.iam.gserviceaccount.com"
const GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCZtV4SP3C6lLt2\nX3Qy1j7bOzZlkAqgqGmmgWZQDB6tX7o7ulCseXS0jmbhAtDw0tChu/qmnWXO3uiV\nLlGmuy6vT7nfQSsEREJBO3HMXrzBQXCm2hRhHmcoLar29E7BJpjkPgtxzx/UaDtV\noNJy9v6D0MLDK06VlfnROGhFEGytrawZNKvGciy6MzSXyIm15L34qV9EdFch7bfi\nOEO6eF1ivbvnIU4hFjew1ku0qm0TvzP8nQpCruwr5LH+yLQayafAlVjgoLuLROcl\nYoTiqZpccQB34TDAuHP/uj6c6o5ZBNdspoCO62Sooi69kFHuCFdHNrLUnWaxXF0U\nwtklaOzPAgMBAAECggEARKO7WIa//nIArMG/kBwggaIVjpEeTdQnKdXLLJ/c6ys+\nbQGsmPi75w1YX870IzbhN/hL3C+ZkSH11viSOdSI6ny90ja10PfyZlL3ZH5B6EMi\n3T+xrhT3l/ecyx8aNCLaT8JtNet6mU3agUiJ8hDeY1rMPn+OXjpVDtsTpRPKlFuy\nUeOHoksr4MrdY9/JC/XgOFClosNA1NM/n7qseQoYMfTXDb2TthhcONxX/n3KBdMb\nEcydtD1J0KjvwbgL2n8XxGj9BV6wNY+KEtUC3dWORyajkKemT/DxAodUWpCUwcbM\n1ObenYQwtl7nDBeVpx54Q3oGLARXsE0GIoHyoP3BIQKBgQDUiosmTbyfllSSSuBi\n/fEICSiM0YHijFST9hIkJ+UPLmjNJALt5tDh1fuCNN65mVDjvwjAemJAopktrZ6/\nJmFr3+3wBd3GwfqqfYvnESyDFE9K0BjR3r03LXUNyFXUN7ETUX1z3/IH3AdEAb4K\nEDEkwjWt9sDE6bBz2A4DhMqP5wKBgQC5IzqBEHx28I0baOfUCnLuO1pIGyagz29b\n6hl0lPMhc9iSTC8j/wh8a4foP2HRkpBQuPRkFkPDyM/KaZ+K4SwVtV2NSvmhfehS\ngNVKHcMIpmcR4EwmV+ty9GHJcAfdmzd4xsk3wIgeBflA4uqitd04jkGT2bqFFUEa\nI5DWgu0+2QKBgBoPsuhLd+mJoW0eyUzaHogBt3ss5WRGGMjbz3WnfqrR4f/lfoZ1\nWv+WIXThzr2rUwPaFNSlLQ8H4Qh81Y5Swndbye04iu0oM/hb1J/Mt0yLXP2rbp+t\nVD5D0KqT+hI/kfLwdxWSTDcyf6GTJR5Oxfff6H0gWJrMnNpXj8BWtA/ZAoGBAKHz\nWC0or8gXu0f757gL/+e4Ecy7u3m2m5JK4UOjPF/KB+xKKn6RjOnR4sxeDYKXdBi5\nAkg/Vb4Bfwtwg/in6rl+srxzlpUXH9B0FKBGEqMRdV4k2Fg+Vp9zecsNbkQDkG3d\nbo2PpUKmNRj2pwv4jPD5OBJOxyO9qPplnECZvVFZAoGAEtmQagK+Kd+dJpRKlemT\nZ3XyJvJbdo/sVHF0v/iJksNGfRWQqN7WbgciVLtrOQPP5kWrYaYnW66yABzI4KDD\n0xRsXKz4l5Tx8RgIcuY19Cg4ACYSNT9U2TmrSAL2zeCefiu0lk8BTwpjao/akw8T\nMdO2Dtj+LZH7VuWhoZI2uBs=\n-----END PRIVATE KEY-----\n"
const GOOGLE_SHEET_ID="1f9FmINki5E8dcwgjmhgiyvIGXfErIiWCMjoEYk-gRGk"
// Configuration object for Google Sheets
const SHEETS_CONFIG = {
    defaultSheetName: 'catalog_products.csv', // You can customize this
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    valueInputOption: 'USER_ENTERED', // or 'RAW' - USER_ENTERED interprets formulas
};

export async function GET(request) {
    try {
        // Authenticate admin
        const authResult = await requireAdmin("trips");
        if (!authResult.success) return authResult.response;
        const admin = authResult.admin;
    
        // Extract query parameters
        const { searchParams } = new URL(request.url);
        const tripId = searchParams.get("id");
        const spreadsheetId = searchParams.get("spreadsheetId");
        const sheetName = searchParams.get("sheetName") || SHEETS_CONFIG.defaultSheetName;

        if (!tripId) {
            return NextResponse.json(
                { success: false, error: "Trip ID is required" },
                { status: 400 }
            );
        }

        // Fetch and format data
        const result = await formateTripData(tripId);
        
        // Add to Google Sheet
        const sheetResult = await addToGoogleSheet(result, spreadsheetId, sheetName);
        
        return NextResponse.json({
            success: true,
            message: `Trip data added to Google Sheet "${sheetName}" successfully`,
            data: result,
            sheetInfo: sheetResult
        });

    } catch (error) {
        console.error("Error in trips API:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to add trip to Google Sheet",
                message: error.message
            },
            { status: 500 }
        );
    }
}

async function addToGoogleSheet(data, spreadsheetId, sheetName = SHEETS_CONFIG.defaultSheetName) {
    try {
        // Set up Google Sheets authentication
        const auth = await getGoogleAuth();
        const sheets = google.sheets({ version: 'v4', auth });
        
        // Use environment variable if spreadsheetId not provided
        const sheetId = spreadsheetId || GOOGLE_SHEET_ID;
        
        if (!sheetId) {
            throw new Error("Google Sheet ID is required. Provide it as a query parameter or set GOOGLE_SHEET_ID environment variable");
        }

        // Ensure the sheet exists, create if it doesn't
        await ensureSheetExists(sheets, sheetId, sheetName);

        // Get the headers and values
        const headers = Object.keys(data);
        const values = Object.values(data).map(value => 
            value === null || value === undefined ? '' : String(value)
        );
        
        // Add the data row
        const appendResult = await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `'${sheetName}'!A:A`, // Use sheet name with single quotes for safety
            valueInputOption: SHEETS_CONFIG.valueInputOption,
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [values],
            },
        });

        return {
            sheetName: sheetName,
            updatedRange: appendResult.data.updates.updatedRange,
            updatedRows: appendResult.data.updates.updatedRows,
            updatedColumns: appendResult.data.updates.updatedColumns,
        };

    } catch (error) {
        console.error("Google Sheets API error:", error);
        throw new Error(`Failed to add data to Google Sheet: ${error.message}`);
    }
}

async function getGoogleAuth() {
    const credentials = {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (!credentials.client_email || !credentials.private_key) {
        throw new Error("Google credentials not found. Please set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY environment variables");
    }

    return new google.auth.GoogleAuth({
        credentials,
        scopes: SHEETS_CONFIG.scopes,
    });
}

async function ensureSheetExists(sheets, spreadsheetId, sheetName) {
    try {
        // Get spreadsheet metadata to check if sheet exists
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        const sheetExists = spreadsheet.data.sheets.some(
            sheet => sheet.properties.title === sheetName
        );

        if (!sheetExists) {
            // Create the sheet
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: sheetName,
                            }
                        }
                    }]
                }
            });
            console.log(`Created new sheet: ${sheetName}`);
        }
    } catch (error) {
        throw new Error(`Failed to ensure sheet exists: ${error.message}`);
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
        description: data.about?.trim().split(/\s+/).slice(0, 70).join(' '),
        address_city: data.dest?.name || null,
        address_region: data.dest?.name || null,
        address_country: data.dest?.country || null,
        image_0: data.images?.[0] || null,
        image_1: data.images?.[1] || data.images?.[0] || null,
        type_0: "culture",
        type_1: "history",
        url: `https://www.rehlanow.com/trips/${data.slug}`,
        price: `${data.pricing?.PersonPrice || 0} EGP`,
        custom_label_0: "all",
    };
}