// app/api/storage/upload/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import crypto from 'crypto';

// Function to generate safe filename while preserving extension
function generateSafeFileName(originalName) {
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(`.${extension}`, '');
  
  // Generate a unique hash from the original name
  const hash = crypto.createHash('md5').update(nameWithoutExt).digest('hex').substring(0, 8);
  
  // Create timestamp
  const timestamp = Date.now();
  
  return `${hash}_${timestamp}.${extension}`;
}

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
    let filePath = fileParts.join('/');
    
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
    
    // Generate safe filename
    const pathParts = filePath.split('/');
    const originalFileName = pathParts.pop();
    const safeFileName = generateSafeFileName(file.name);
    filePath = pathParts.length > 0 ? `${pathParts.join('/')}/${safeFileName}` : safeFileName;
    
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
          public: true,
          fileSizeLimit: 5242880,
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
        upsert: false,
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
      path: `${bucket}/${filePath}`,
      originalFileName: file.name,
      storedFileName: safeFileName
    });
    
  } catch (error) {
    console.error("Storage API error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}