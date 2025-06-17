import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";

export async function DELETE(request) {
  try {
    // Extract the path query parameter
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: "Path parameter is required" }, { status: 400 });
    }

    // Split the path into bucket and file path
    let [bucket, ...fileParts] = path.split('/');
    bucket = fileParts[3]
    const filePath = fileParts.join('/');

    if (!bucket || !filePath) {
      return NextResponse.json(
        { error: "Path must be in format 'bucket/file-path'" },
        { status: 400 }
      );
    }


    const cleanFilePath = `${fileParts[4]}/${fileParts[5]}`

    // Delete the file from Supabase Storage
    const {error} = await supabaseAdmin
      .storage
      .from(bucket)
      .remove([cleanFilePath]);

    if (error) {
      console.error("Failed to delete file:", error);
      return NextResponse.json(
        { error: `Failed to delete file: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "File deleted" });

  } catch (error) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
