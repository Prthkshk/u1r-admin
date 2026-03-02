import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | U1R",
  description: "Refund & Cancellation Policy for U1R Food Products India LLP",
};

export default function RefundCancellationPolicyPage() {
  return (
    <main className="bg-white text-gray-800">
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-3 text-sm text-gray-600">U1R FOOD PRODUCTS INDIA LLP</p>

        <div className="mt-10 space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-3">
              This Refund &amp; Cancellation Policy governs the cancellation of orders and refund
              eligibility for purchases made through the U1R mobile application and website
              (&quot;Platform&quot;).
            </p>
            <p className="mt-3">
              This policy applies to both B2C (Retail) and B2B (Wholesale) customers, with specific
              provisions for each category.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Order Cancellation</h2>
            <h3 className="mt-4 text-lg font-semibold">A. Before Dispatch (All Customers)</h3>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Orders may be cancelled before dispatch.</li>
              <li>
                Cancellation requests must be made through the app or by contacting customer support.
              </li>
              <li>
                If payment has been made, a full refund will be processed to the original payment
                method.
              </li>
            </ul>
            <h3 className="mt-5 text-lg font-semibold">B. After Dispatch</h3>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Orders cannot be cancelled once dispatched.</li>
              <li>Refund eligibility will be determined as per the conditions below.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. B2C (Retail) Refund Policy</h2>
            <p className="mt-3">Due to the perishable and consumable nature of food products:</p>
            <p className="mt-3 font-medium">Refunds or replacements will be provided only if:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>The product is damaged during delivery</li>
              <li>The wrong product was delivered</li>
              <li>The product is defective or unfit for consumption</li>
            </ul>
            <p className="mt-3 font-medium">Conditions:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Complaint must be raised within 48 hours of delivery</li>
              <li>Photo or video proof may be required</li>
              <li>Product must be unused and in original packaging</li>
            </ul>
            <p className="mt-3 font-medium">Refunds will NOT be issued for:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Change of mind</li>
              <li>Taste preference</li>
              <li>Minor packaging variations</li>
              <li>Improper storage after delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. B2B (Wholesale) Refund Policy</h2>
            <p className="mt-3">For B2B customers:</p>
            <p className="mt-3 font-medium">Refunds or replacements are allowed only for:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Damaged goods</li>
              <li>Incorrect items supplied</li>
              <li>Verified quality defects</li>
            </ul>
            <p className="mt-3 font-medium">Additional Conditions:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Claims must be raised within 24-48 hours of delivery</li>
              <li>
                Bulk orders may require physical inspection or return of goods before approval
              </li>
            </ul>
            <p className="mt-3 font-medium">No refunds will be issued for:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Market price fluctuations</li>
              <li>Unsold stock</li>
              <li>Improper storage or handling by the buyer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Refund Process</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Approved refunds will be processed to the original payment method.</li>
              <li>Refund timelines may vary depending on banks or payment providers.</li>
              <li>Typically, refunds are processed within 5-10 business days.</li>
              <li>
                Payments made through secure gateways such as Razorpay will be refunded via the same
                channel.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Non-Returnable Items</h2>
            <p className="mt-3">The following items are non-returnable:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Opened food products</li>
              <li>Products without original packaging</li>
              <li>Products reported after the complaint window</li>
              <li>Customized or special bulk orders</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Right to Reject Refund Requests</h2>
            <p className="mt-3">U1R FOOD PRODUCTS INDIA LLP reserves the right to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Reject refund claims if misuse is suspected</li>
              <li>Investigate repeated refund requests</li>
              <li>Take necessary action in cases of fraudulent claims</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Dispute Resolution</h2>
            <p className="mt-3">
              Any disputes related to refunds shall be governed by the Terms &amp; Conditions of U1R
              and applicable laws of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Policy Updates</h2>
            <p className="mt-3">
              U1R reserves the right to update this Refund &amp; Cancellation Policy at any time.
              Continued use of the Platform constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Contact Information</h2>
            <p className="mt-3">U1R FOOD PRODUCTS INDIA LLP</p>
            <p className="mt-1">Email: team@u1rfoods.com</p>
          </section>
        </div>
      </section>
    </main>
  );
}
