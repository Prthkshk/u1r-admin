import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | U1R",
  description: "Terms & Conditions for U1R Food Products India LLP",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-white text-gray-800">
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-3 text-sm text-gray-600">U1R FOOD PRODUCTS INDIA LLP</p>

        <div className="mt-10 space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-3">
              Welcome to U1R FOOD PRODUCTS INDIA LLP (&quot;Company&quot;, &quot;U1R&quot;, &quot;we&quot;,
              &quot;us&quot;, &quot;our&quot;).
            </p>
            <p className="mt-3">
              These Terms &amp; Conditions govern your access to and use of the U1R mobile
              application, website, and related services (collectively referred to as the
              &quot;Platform&quot;).
            </p>
            <p className="mt-3">
              By accessing or using our Platform, you agree to be bound by these Terms.
            </p>
            <p className="mt-3">If you do not agree to these Terms, please do not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Eligibility</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>You must be at least 18 years old to use this Platform.</li>
              <li>
                If registering as a B2B customer, you must be legally authorized to represent the
                business.
              </li>
              <li>You agree to provide accurate and complete information during registration.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Account Registration</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Users must register using valid contact details.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>
                U1R reserves the right to suspend or terminate accounts found to be fraudulent or
                misused.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Products &amp; Services</h2>
            <p className="mt-3">U1R offers food products including but not limited to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Dry fruits</li>
              <li>Spices</li>
              <li>Pulses</li>
              <li>Edible oils</li>
              <li>Dates</li>
              <li>Related food products</li>
            </ul>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Product images are for representation purposes only.</li>
              <li>Minor variations in weight, color, or packaging may occur.</li>
              <li>Availability of products is subject to stock.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Pricing &amp; Payment</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Prices displayed are subject to change without prior notice.</li>
              <li>Applicable GST will be charged as per Indian law.</li>
              <li>
                Payments are processed securely through Razorpay or other authorized payment
                gateways.
              </li>
              <li>U1R does not store card details.</li>
              <li>Orders are confirmed only after successful payment authorization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Shipping &amp; Delivery</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Delivery timelines are estimates and may vary based on location.</li>
              <li>
                U1R is not liable for delays caused by logistics partners or unforeseen
                circumstances.
              </li>
              <li>Risk of loss passes to the customer upon delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Refunds &amp; Cancellations</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Orders may be cancelled before dispatch.</li>
              <li>Refund eligibility is governed by our Refund &amp; Cancellation Policy.</li>
              <li>
                Refunds, if approved, will be processed to the original payment method within a
                reasonable timeframe.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. User Conduct</h2>
            <p className="mt-3">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Provide false information</li>
              <li>Use the Platform for unlawful purposes</li>
              <li>Attempt to hack, disrupt, or damage the Platform</li>
              <li>
                Resell products without authorization (unless registered as B2B)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Intellectual Property</h2>
            <p className="mt-3">
              All content on the Platform including logos, trademarks, text, images, and designs are
              the property of U1R FOOD PRODUCTS INDIA LLP.
            </p>
            <p className="mt-3">Unauthorized use is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Limitation of Liability</h2>
            <p className="mt-3">U1R shall not be liable for:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Indirect or consequential damages</li>
              <li>Allergic reactions or misuse of products</li>
              <li>Delays beyond our control</li>
              <li>Loss of business or profits</li>
            </ul>
            <p className="mt-3">
              Maximum liability shall not exceed the amount paid for the product.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">11. Food Safety Disclaimer</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Customers are advised to check ingredient information before consumption.</li>
              <li>Products should be stored in a cool and dry place.</li>
              <li>U1R shall not be responsible for improper storage after delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">12. Termination</h2>
            <p className="mt-3">
              U1R reserves the right to suspend or terminate access to the Platform at its sole
              discretion for violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">13. Governing Law &amp; Jurisdiction</h2>
            <p className="mt-3">These Terms shall be governed by the laws of India.</p>
            <p className="mt-3">
              Any disputes shall be subject to the jurisdiction of courts located in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">14. Amendments</h2>
            <p className="mt-3">
              U1R reserves the right to modify these Terms at any time. Updated versions will be
              posted on the Platform with the revised effective date.
            </p>
            <p className="mt-3">
              Continued use of the Platform constitutes acceptance of revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">15. Contact Information</h2>
            <p className="mt-3">U1R FOOD PRODUCTS INDIA LLP</p>
            <p className="mt-1">Email: team@u1rfoods.com</p>
          </section>
        </div>
      </section>
    </main>
  );
}
