"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount, updateProfile } from "@/lib/api";

type StoredUser = {
  userId: string;
  name: string;
  mobileNumber: string;
  email: string;
};

function getStoredUser(authUserKey: string): StoredUser {
  if (typeof window === "undefined") {
    return { userId: "", name: "", mobileNumber: "", email: "" };
  }

  try {
    const storedUser = localStorage.getItem(authUserKey);
    if (!storedUser) {
      return { userId: "", name: "", mobileNumber: "", email: "" };
    }

    const parsed = JSON.parse(storedUser) as {
      userId?: unknown;
      id?: unknown;
      _id?: unknown;
      name?: unknown;
      mobileNumber?: unknown;
      email?: unknown;
    };

    return {
      userId:
        typeof parsed.userId === "string"
          ? parsed.userId
          : typeof parsed.id === "string"
            ? parsed.id
            : typeof parsed._id === "string"
              ? parsed._id
              : "",
      name: typeof parsed.name === "string" ? parsed.name : "",
      mobileNumber: typeof parsed.mobileNumber === "string" ? parsed.mobileNumber : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
    };
  } catch {
    return { userId: "", name: "", mobileNumber: "", email: "" };
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const AUTH_TOKEN_KEY = "u1r_auth_token";
  const AUTH_USER_KEY = "u1r_auth_user";
  const [userId] = useState(() => getStoredUser(AUTH_USER_KEY).userId);
  const [name, setName] = useState(() => getStoredUser(AUTH_USER_KEY).name);
  const [mobileNumber, setMobileNumber] = useState(() => getStoredUser(AUTH_USER_KEY).mobileNumber);
  const [email, setEmail] = useState(() => getStoredUser(AUTH_USER_KEY).email);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveProfileError, setSaveProfileError] = useState("");
  const [saveProfileSuccess, setSaveProfileSuccess] = useState("");

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      window.location.href = "/";
      return;
    }
    setIsLogoutConfirmOpen(false);
    router.replace("/");
  };

  const handleSaveChanges = async () => {
    if (typeof window === "undefined") {
      return;
    }

    setSaveProfileError("");
    setSaveProfileSuccess("");
    setIsSavingProfile(true);

    try {
      if (!userId) {
        throw new Error("Missing user id. Please log out and log in again.");
      }

      const token = localStorage.getItem(AUTH_TOKEN_KEY) ?? "";
      await updateProfile({
        userId,
        token,
        name: name.trim(),
        email: email.trim(),
      });

      localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify({
          userId,
          name: name.trim(),
          mobileNumber: mobileNumber.trim(),
          email: email.trim(),
        })
      );

      setSaveProfileSuccess("Profile updated successfully");
    } catch (error) {
      setSaveProfileError(error instanceof Error ? error.message : "Unable to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (typeof window === "undefined") {
      return;
    }

    setDeleteAccountError("");
    setIsDeletingAccount(true);
    try {
      if (!userId) {
        throw new Error("Missing user id. Please log out and log in again.");
      }

      const token = localStorage.getItem(AUTH_TOKEN_KEY) ?? "";
      await deleteAccount({
        userId,
        token,
      });

      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      setIsDeleteConfirmOpen(false);
      window.location.href = "/";
    } catch (error) {
      setDeleteAccountError(error instanceof Error ? error.message : "Unable to delete account");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2f2f2] [font-family:var(--font-inder)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="mb-6 text-4xl text-[#121212] [font-family:var(--font-tilt-warp)]">My Profile</h1>

        <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
          <aside className="overflow-hidden rounded-2xl border border-[#d6d6d6] bg-white">
            <div className="flex items-center gap-4 border-b border-[#e6e6e6] px-5 py-5">
              <img src="/icons/login.svg" alt="" width={34} height={34} aria-hidden="true" />
              <div>
                <p className="text-[24px] leading-none text-[#222] [font-family:var(--font-tilt-warp)]">
                  {name || "User"}
                </p>
                <p className="mt-1 text-sm text-[#4a4a4a]">{mobileNumber || "-"}</p>
              </div>
              <span className="ml-auto text-2xl leading-none text-[#ff0000]">&rsaquo;</span>
            </div>

            <div className="border-b border-[#ececec] px-5 py-4">
              <p className="text-lg text-[#121212] [font-family:var(--font-tilt-warp)]">My Account</p>
            </div>

            <nav aria-label="Profile sections">
              <a
                href="#"
                className="flex items-center gap-4 border-b border-[#ececec] px-5 py-4 text-[22px] text-[#1f1f1f] hover:bg-[#fafafa]"
              >
                <img src="/icons/orders.svg" alt="" width={20} height={20} aria-hidden="true" />
                <span>My Orders</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 border-b border-[#ececec] px-5 py-4 text-[22px] text-[#1f1f1f] hover:bg-[#fafafa]"
              >
                <img src="/icons/heart.svg" alt="" width={20} height={20} aria-hidden="true" />
                <span>My List</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-5 py-4 text-[22px] text-[#1f1f1f] hover:bg-[#fafafa]"
              >
                <img src="/icons/book.svg" alt="" width={20} height={20} aria-hidden="true" />
                <span>Address Book</span>
              </a>
            </nav>

            <div className="border-t border-[#ececec] p-4">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="flex h-12 w-full items-center justify-center rounded-lg border border-[#ff0000] bg-white text-base text-[#ff0000] transition hover:bg-[#fff3f3]"
              >
                Log out
              </button>
            </div>
          </aside>

          <section className="max-w-[700px]">
            <div className="rounded-2xl border border-[#d6d6d6] bg-white p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#ff0000]">
                  <img src="/icons/login.svg" alt="" width={32} height={32} aria-hidden="true" />
                </span>
                <h2 className="text-3xl text-[#2a2a2a] [font-family:var(--font-tilt-warp)]">Profile Details</h2>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1 block text-sm text-[#8a8a8a]">Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-12 w-full rounded-lg border border-[#d8d8d8] px-4 text-base text-[#1d1d1d] outline-none focus:border-[#ff0000]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-[#8a8a8a]">Mobile Number</span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(event) => setMobileNumber(event.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                    className="h-12 w-full rounded-lg border border-[#d8d8d8] px-4 text-base text-[#1d1d1d] outline-none focus:border-[#ff0000]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-[#8a8a8a]">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full rounded-lg border border-[#d8d8d8] px-4 text-base text-[#1d1d1d] outline-none focus:border-[#ff0000]"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isSavingProfile}
                  className="mt-1 h-12 w-full rounded-lg bg-[#ff0000] text-base text-white transition hover:bg-[#e40000]"
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>

                {saveProfileError ? <p className="text-sm text-[#d31717]">{saveProfileError}</p> : null}
                {saveProfileSuccess ? <p className="text-sm text-[#118744]">{saveProfileSuccess}</p> : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setDeleteAccountError("");
                setIsDeleteConfirmOpen(true);
              }}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#ff0000] bg-white text-base text-[#ff0000] transition hover:bg-[#fff3f3]"
            >
              <img src="/icons/delete.svg" alt="" width={16} height={16} aria-hidden="true" />
              Delete Account
            </button>
          </section>
        </div>
      </div>

      {isLogoutConfirmOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirm logout"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
          >
            <h3 className="text-xl text-[#1f1f1f] [font-family:var(--font-tilt-warp)]">Confirm Log out</h3>
            <p className="mt-2 text-sm text-[#555]">Are you sure you want to log out?</p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="h-10 rounded-lg border border-[#d0d0d0] px-4 text-sm text-[#333] transition hover:bg-[#f7f7f7]"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="h-10 rounded-lg bg-[#ff0000] px-4 text-sm text-white transition hover:bg-[#e40000]"
              >
                Yes, Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteConfirmOpen ? (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Delete account confirmation"
            className="w-full max-w-[540px] rounded-[24px] border border-[#d0d0d0] bg-[#f7f7f7] px-6 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:px-9 sm:py-10"
          >
            <h3 className="text-center text-[44px] leading-tight text-[#111] [font-family:var(--font-tilt-warp)]">
              Are you Sure ?
            </h3>
            <p className="mx-auto mt-3 max-w-[390px] text-center text-[18px] leading-tight text-[#666] [font-family:var(--font-inder)] sm:text-[20px]">
              You want to delete your account permanently
            </p>
            <p className="mx-auto mt-4 max-w-[390px] text-center text-[16px] leading-tight text-[#b8b8b8] [font-family:var(--font-inder)] sm:text-[18px]">
              All your data, including account information and preferences will be permanently removed
            </p>

            {deleteAccountError ? (
              <p className="mt-4 text-center text-sm text-[#d31717]">{deleteAccountError}</p>
            ) : null}

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="h-14 rounded-[16px] border border-[#ff0000] bg-white px-4 text-[18px] text-[#ff0000] transition hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeletingAccount ? "Deleting..." : "Delete Account"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteAccountError("");
                  setIsDeleteConfirmOpen(false);
                }}
                disabled={isDeletingAccount}
                className="h-14 rounded-[16px] border border-[#ff0000] px-4 bg-[#ff0000] text-[18px] text-white transition hover:bg-[#e10000] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Keep Account
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
