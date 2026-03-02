import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Policy | U1R",
  description: "Payment Policy for U1R Food Products India LLP",
};

export default function PaymentPolicyPage() {
  return (
    <main className="bg-white text-gray-800">
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Payment Policy</h1>
        <p className="mt-3 text-sm text-gray-600">U1R FOOD PRODUCTS INDIA LLP</p>

        <div className="mt-10 space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-3">
              This Payment Policy governs all payment-related terms for orders placed through the U1R
              mobile application and website (&quot;Platform&quot;).
            </p>
            <p className="mt-3">
              This policy applies to both B2C (Retail) and B2B (Wholesale) customers, with specific
              provisions for each category.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. General Payment Terms (Applicable to All Orders)</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>All payments must be made in Indian Rupees (INR).</li>
              <li>
                Orders are considered confirmed only after successful payment authorization or order
                confirmation (as applicable).
              </li>
              <li>U1R FOOD PRODUCTS INDIA LLP does not store debit/credit card details.</li>
              <li>
                U1R reserves the right to cancel orders in case of suspected fraud or payment failure.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. B2C (Retail) Payment Terms</h2>
            <p className="mt-3">For customers registered under B2C mode:</p>
            <p className="mt-3 font-medium">U1R currently accepts Prepaid Orders Only.</p>
            <p className="mt-3">
              Payments must be made at checkout through secure online payment methods.
            </p>
            <p className="mt-3">Payments are processed securely via Razorpay.</p>
            <p className="mt-3 font-medium">Accepted Payment Methods:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>UPI</li>
              <li>Debit Cards</li>
              <li>Credit Cards</li>
              <li>Net Banking</li>
              <li>Wallets (as supported by Razorpay)</li>
            </ul>
            <p className="mt-3 font-medium">Important Notes:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Cash on Delivery (COD) is currently not available.</li>
              <li>Orders will not be processed until payment is successfully completed.</li>
              <li>In case of payment failure, the order will not be confirmed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. B2B (Wholesale) Payment Terms</h2>
            <p className="mt-3">For customers registered under B2B mode:</p>
            <p className="mt-3">
              After an order is successfully placed, the U1R team will contact the registered business
              representative to confirm:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Order details</li>
              <li>Pricing (if applicable)</li>
              <li>Delivery schedule</li>
              <li>Payment terms</li>
            </ul>
            <p className="mt-3">Payment methods for B2B orders may include:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Bank transfer (NEFT / RTGS / IMPS)</li>
              <li>UPI</li>
              <li>Other agreed business payment methods</li>
            </ul>
            <p className="mt-3">Orders will be processed only after:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Payment confirmation, or</li>
              <li>Formal confirmation from U1R (if credit terms are applicable)</li>
            </ul>
            <p className="mt-3">
              U1R reserves the right to determine eligibility for credit or deferred payment terms on a
              case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Failed Transactions</h2>
            <p className="mt-3">In case of:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Failed payment</li>
              <li>Amount debited but order not confirmed</li>
            </ul>
            <p className="mt-3">
              Customers should contact their bank first. If the issue persists, they may contact U1R
              support.
            </p>
            <p className="mt-3">
              Refunds for failed transactions (if applicable) are typically processed within 5-10
              business days, depending on banking timelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Fraud Prevention</h2>
            <p className="mt-3">U1R FOOD PRODUCTS INDIA LLP reserves the right to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Verify transactions before processing</li>
              <li>Cancel suspicious orders</li>
              <li>Request additional documentation for high-value B2B transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Invoices &amp; GST (B2B &amp; B2C)</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Tax invoices will be generated as per applicable GST laws.</li>
              <li>B2B customers must provide valid GST details for tax credit claims.</li>
              <li>
                U1R shall not be responsible for incorrect GST details submitted by the customer.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Policy Updates</h2>
            <p className="mt-3">
              U1R reserves the right to update this Payment Policy at any time. Continued use of the
              Platform constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Contact Information</h2>
            <p className="mt-3">U1R FOOD PRODUCTS INDIA LLP</p>
            <p className="mt-1">Email: team@u1rfoods.com</p>
          </section>
        </div>
      </section>
    </main>
  );
}
