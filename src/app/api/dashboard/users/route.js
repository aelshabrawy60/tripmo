// app/api/users/route.js
import { NextResponse } from "next/server";
import { addNewUser, checkUserExists, fetchAllUsers, removeUser } from "./helpers";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");
    const phone = searchParams.get("phone");
    
    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }
    
    // If phone is provided, check if specific user exists
    if (phone) {
      const user = await checkUserExists(phone, groupId);
      return NextResponse.json({ 
        exists: !!user,
        user: user
      });
    } 
    // Otherwise return all users in the group
    else {
      const users = await fetchAllUsers(groupId);
      return NextResponse.json({ users });
    }
  } catch (error) {
    console.error("GET request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { phone, name, groupId } = await request.json();
    
    if (!phone || !name || !groupId) {
      return NextResponse.json(
        { error: "Phone, name, and groupId are required" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await checkUserExists(phone, groupId);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists", user: existingUser },
        { status: 409 }
      );
    }
    
    const newUser = await addNewUser(phone, name, groupId);
    if (!newUser) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("POST request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId are required" },
        { status: 400 }
      );
    }
    
    const deletedUser = await removeUser(userId);
    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found or could not be deleted" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: "User deleted successfully",
      user: deletedUser
    });
  } catch (error) {
    console.error("DELETE request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}