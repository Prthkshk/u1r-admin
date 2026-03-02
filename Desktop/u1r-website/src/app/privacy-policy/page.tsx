import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | U1R",
  description: "Privacy Policy for U1R Food Products India LLP",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-gray-800">
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">📜 PRIVACY POLICY</h1>
        <p className="mt-3 text-sm text-gray-600">U1R FOOD PRODUCTS INDIA LLP</p>
        <p className="text-sm text-gray-600">Effective Date: 14 February 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-3">
              U1R FOOD PRODUCTS INDIA LLP (&quot;Company&quot;, &quot;U1R&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to
              protecting your privacy and safeguarding your personal data.
            </p>
            <p className="mt-3">
              This Privacy Policy explains how we collect, use, store, disclose, and protect your
              information when you access or use:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>The U1R mobile application</li>
              <li>Our website (u1rfoods.com)</li>
              <li>Any related services (collectively, the &quot;Platform&quot;)</li>
            </ul>
            <p className="mt-3">
              By using the Platform, you agree to the practices described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p className="mt-3">We collect only the information necessary to provide our services.</p>

            <h3 className="mt-5 text-lg font-semibold">A. Personal Information (All Users)</h3>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Full Name</li>
              <li>Mobile Number (for OTP authentication)</li>
              <li>Email Address</li>
              <li>Shipping and Billing Address</li>
              <li>PIN Code</li>
              <li>Order History</li>
            </ul>

            <h3 className="mt-5 text-lg font-semibold">B. B2B-Specific Information (Wholesale Users Only)</h3>
            <p className="mt-3">
              To provide wholesale pricing and comply with legal and tax regulations, we collect:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Business / Outlet Name</li>
              <li>GST Number</li>
              <li>Business Address</li>
              <li>Authorized Contact Details</li>
              <li>Outlet Location Information</li>
            </ul>
            <p className="mt-3">
              This information is required to verify business customers and comply with applicable tax
              laws.
            </p>

            <h3 className="mt-5 text-lg font-semibold">C. Payment Information</h3>
            <p className="mt-3">
              All payments are processed securely through third-party payment gateways such as Razorpay.
            </p>
            <p className="mt-3">We do NOT store:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Debit card details</li>
              <li>Credit card details</li>
              <li>UPI PINs</li>
              <li>Bank account credentials</li>
            </ul>
            <p className="mt-3">
              Payment processing is handled by certified payment service providers in compliance with
              applicable financial regulations.
            </p>

            <h3 className="mt-5 text-lg font-semibold">D. Technical &amp; Usage Information</h3>
            <p className="mt-3">We may automatically collect:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Device type and operating system</li>
              <li>IP address</li>
              <li>App usage statistics</li>
              <li>Log data</li>
              <li>Cookies (if using our website)</li>
            </ul>
            <p className="mt-3">
              This information helps us improve performance, security, and user experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
            <p className="mt-3">We use your information to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Process and deliver orders</li>
              <li>Provide customer support</li>
              <li>Verify B2B accounts</li>
              <li>Send order confirmations and updates</li>
              <li>Improve our services and app performance</li>
              <li>Prevent fraud and misuse</li>
              <li>Comply with legal and tax obligations</li>
            </ul>
            <p className="mt-3">We do NOT sell your personal data to any third party.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Data Sharing</h2>
            <p className="mt-3">We may share information only when necessary with:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Payment partners (such as Razorpay)</li>
              <li>Logistics and delivery partners</li>
              <li>Government authorities when legally required</li>
              <li>Technology service providers assisting in app operations</li>
            </ul>
            <p className="mt-3">All third parties are contractually required to protect your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Data Retention</h2>
            <p className="mt-3">We retain personal data only for as long as necessary:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>To fulfill orders</li>
              <li>To comply with legal, taxation, and regulatory requirements</li>
              <li>To resolve disputes</li>
              <li>To prevent fraud</li>
            </ul>
            <p className="mt-3">After the required period, data may be securely deleted or anonymized.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Data Security</h2>
            <p className="mt-3">We implement reasonable technical and organizational safeguards, including:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure servers</li>
              <li>Restricted internal access controls</li>
              <li>OTP-based authentication</li>
            </ul>
            <p className="mt-3">However, no electronic transmission method is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Your Rights</h2>
            <p className="mt-3">
              Under applicable Indian laws, including the Digital Personal Data Protection Act, 2023, you
              may:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at the email provided below.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Account Deletion</h2>
            <p className="mt-3">You may request deletion of your account by:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Using the in-app account deletion option (if available), or</li>
              <li>Sending an email to: team@u1rfoods.com</li>
            </ul>
            <p className="mt-3">
              Upon verification, your account and associated personal data will be deleted, except where
              retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Children&apos;s Privacy</h2>
            <p className="mt-3">Our Platform is intended for individuals aged 18 years or older.</p>
            <p className="mt-3">
              We do not knowingly collect personal data from minors. If we become aware of such
              collection, we will take steps to delete the information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Changes to This Privacy Policy</h2>
            <p className="mt-3">We may update this Privacy Policy from time to time.</p>
            <p className="mt-3">
              Updated versions will be posted within the app and/or website with a revised effective date.
            </p>
            <p className="mt-3">
              Continued use of the Platform after updates constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">11. Contact Information</h2>
            <p className="mt-3">U1R FOOD PRODUCTS INDIA LLP</p>
            <p className="mt-1">Email: team@u1rfoods.com</p>
            <p className="mt-1">Website: www.u1rfoods.com</p>
          </section>
        </div>
      </section>
    </main>
  );
}
