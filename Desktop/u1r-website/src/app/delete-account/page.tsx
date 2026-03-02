import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delete Account | U1R",
  description: "How to permanently delete your U1R account and what data is removed.",
};

export default function DeleteAccountPage() {
  return (
    <main className="bg-white text-gray-800">
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Delete Your U1R Account</h1>

        <p className="mt-6">
          At U1R Foods, we respect your privacy and provide full control over your personal data.
        </p>
        <p className="mt-3">
          You can permanently delete your account at any time from within the app or website.
        </p>

        <div className="mt-10 space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold">How to Delete Your Account</h2>

            <h3 className="mt-5 text-lg font-semibold">From the U1R Mobile App</h3>
            <ol className="mt-3 list-decimal space-y-1 pl-6">
              <li>Open the U1R App</li>
              <li>Go to Profile</li>
              <li>Open Profile Details</li>
              <li>Tap Delete Account</li>
              <li>Confirm deletion</li>
            </ol>
            <p className="mt-3">
              Your account will be permanently deleted immediately after confirmation.
            </p>

            <h3 className="mt-6 text-lg font-semibold">From the U1R Website</h3>
            <ol className="mt-3 list-decimal space-y-1 pl-6">
              <li>Log in to your account</li>
              <li>Go to My Profile</li>
              <li>Open Profile Details</li>
              <li>Click Delete Account</li>
              <li>Confirm deletion</li>
            </ol>
            <p className="mt-3">
              Your account will be permanently deleted immediately after confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">What Data Is Deleted</h2>
            <p className="mt-3">When you delete your account, the following data is permanently removed:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Full Name</li>
              <li>Mobile Number</li>
              <li>Email Address</li>
              <li>Saved Addresses</li>
              <li>Wishlist / My List</li>
              <li>Account Preferences</li>
              <li>Login Credentials</li>
              <li>Associated Profile Information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Data Retention</h2>
            <p className="mt-3">
              Account and personal profile data are deleted immediately after confirmation.
            </p>
            <p className="mt-3">
              Order invoices and transaction records may be retained as required under applicable Indian
              tax and legal regulations.
            </p>
            <p className="mt-3">No personal data is sold or processed after deletion.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Manual Deletion Request</h2>
            <p className="mt-3">
              If you are unable to access your account, you may request deletion by contacting us:
            </p>
            <p className="mt-3">
              Email:{" "}
              <Link href="mailto:team@u1rfoods.com" className="text-[#ce453f] underline underline-offset-2">
                team@u1rfoods.com
              </Link>
            </p>
            <p className="mt-1">Subject: Account Deletion Request</p>
            <p className="mt-1">Please include your registered mobile number or email address.</p>
            <p className="mt-4">U1R Foods</p>
            <p className="mt-1">India</p>
          </section>
        </div>
      </section>
    </main>
  );
}
