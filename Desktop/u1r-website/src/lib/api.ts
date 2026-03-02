const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// ===============================
// Helper
// ===============================
function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const maybe = payload as Record<string, unknown>;
    const message = maybe.message ?? maybe.error;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

// ===============================
// PRODUCTS
// ===============================
export async function getProducts() {
  const res = await fetch(`${BASE_URL}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

// ===============================
// CATEGORIES
// ===============================
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

// ===============================
// SEND OTP
// ===============================
export async function sendOtp(mobileNumber: string) {
  const phone = mobileNumber.replace(/[^0-9]/g, "").slice(0, 10);
  const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone,
      mobileNumber: phone,
      phoneNumber: phone,
    }),
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(getErrorMessage(payload, "Failed to send OTP"));
  }

  return payload;
}

// ===============================
// VERIFY OTP
// ===============================
export async function verifyOtp(mobileNumber: string, otp: string) {
  const phone = mobileNumber.replace(/[^0-9]/g, "").slice(0, 10);
  const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone,
      mobileNumber: phone,
      phoneNumber: phone,
      otp,
    }),
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(getErrorMessage(payload, "Failed to verify OTP"));
  }

  return payload;
}

// ===============================
// GET PROFILE
// ===============================
export async function getProfile(userId: string, token?: string) {
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/api/user/profile/${userId}`, {
    method: "GET",
    headers,
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(getErrorMessage(payload, "Failed to fetch profile"));
  }

  return payload;
}

// ===============================
// UPDATE PROFILE
// ===============================
type UpdateProfileInput = {
  userId: string;
  token?: string;
  name?: string;
  email?: string;
};

export async function updateProfile(input: UpdateProfileInput) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (input.token) {
    headers.Authorization = `Bearer ${input.token}`;
  }

  const res = await fetch(
    `${BASE_URL}/api/user/profile/${input.userId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        name: input.name,
        email: input.email,
      }),
    }
  );

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(getErrorMessage(payload, "Failed to update profile"));
  }

  return payload;
}

// ===============================
// DELETE ACCOUNT
// ===============================
type DeleteAccountInput = {
  userId: string;
  token?: string;
};

export async function deleteAccount(input: DeleteAccountInput) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (input.token) {
    headers.Authorization = `Bearer ${input.token}`;
  }

  const res = await fetch(`${BASE_URL}/api/delete-account`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      userId: input.userId,
    }),
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(getErrorMessage(payload, "Failed to delete account"));
  }

  return payload;
}
