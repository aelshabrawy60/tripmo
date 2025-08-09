"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';
import { createClient } from "@/utils/supabase/server";

// Fixed auth functions
export async function login(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      status: false,
      error: error
    }
  }

  return {
    status: true,
    error : null
  }
}

export async function signup(formData) {
  const supabase = await createClient();

  const firstName = formData.get("first-name");
  const lastName = formData.get("last-name");
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`, // Fixed: Added backticks
        email: formData.get("email"),
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return {
      status: false,
      error: error
    }
  }

  return {
    status: true,
    error : null
  }
}


export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/home`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}


// Make sure your server action looks like this:
export async function signInAdmin(formData) {
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  if (!data.username || !data.password) {
    return { error: "اسم المستخدم وكلمة المرور مطلوبان." };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.error || "فشل في تسجيل الدخول" };
    }

    const { token } = await res.json();

    cookies().set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    revalidatePath("/admin");
    return { success: true }; // Return success, don't redirect

  } catch (error) {
    console.error("SignIn Error:", error);
    return { error: "حدث خطأ غير متوقع." };
  }
}

export async function signInAffiliate(formData){
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  if (!data.username || !data.password) {
    return { error: "اسم المستخدم وكلمة المرور مطلوبان." };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/affiliate/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.error || "فشل في تسجيل الدخول" };
    }

    const { token } = await res.json();

    cookies().set("affiliate_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    revalidatePath("/affiliate");
    return { success: true }; // Return success, don't redirect

  } catch (error) {
    console.error("SignIn Error:", error);
    return { error: "حدث خطأ غير متوقع." };
  }
}