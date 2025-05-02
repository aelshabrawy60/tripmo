// app/api/storage/upload/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";

export async function POST(request) {
  try {
    // Extract path from query params
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: "Path parameter is required" }, { status: 400 });
    }
    
    // Extract the bucket and file path
    const [bucket, ...fileParts] = path.split('/');
    const filePath = fileParts.join('/');
    
    if (!bucket || !filePath) {
      return NextResponse.json(
        { error: "Path must be in format 'bucket/file-path'" }, 
        { status: 400 }
      );
    }
    
    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Check if bucket exists and create it if it doesn't
    const { data: buckets } = await supabaseAdmin
      .storage
      .listBuckets();
    
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      console.log(`Bucket "${bucket}" not found. Creating it...`);
      const { error: createBucketError } = await supabaseAdmin
        .storage
        .createBucket(bucket, {
          public: true, // Make bucket publicly accessible
          fileSizeLimit: 5242880, // 5MB limit per file
        });
      
      if (createBucketError) {
        console.error("Error creating bucket:", createBucketError);
        return NextResponse.json(
          { error: `Failed to create storage bucket: ${createBucketError.message}` },
          { status: 500 }
        );
      }
      console.log(`Bucket "${bucket}" created successfully.`);
    }
    
    // Convert the file to an array buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin
      .storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false, // Don't overwrite existing files with same name
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        { error: `Failed to upload file: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: `${bucket}/${filePath}`
    });
    
  } catch (error) {
    console.error("Storage API error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}