import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | U1R",
  description: "Shipping & Delivery Policy for U1R Food Products India LLP",
};

export default function ShippingDeliveryPolicyPage() {
  return (
    <main className="bg-white text-gray-800">
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="mt-3 text-sm text-gray-600">U1R FOOD PRODUCTS INDIA LLP</p>

        <div className="mt-10 space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-3">
              This Shipping &amp; Delivery Policy outlines the terms governing the dispatch and
              delivery of products ordered through the U1R mobile application and website
              (&quot;Platform&quot;).
            </p>
            <p className="mt-3">
              This policy applies to all orders placed with U1R FOOD PRODUCTS INDIA LLP and varies
              based on whether the customer is registered under B2B (Wholesale) or B2C (Retail)
              mode.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. General Shipping Terms (Applicable to All Orders)</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Orders are processed only after successful payment confirmation.</li>
              <li>
                Delivery timelines are estimates and may vary due to location, weather conditions,
                logistics issues, public holidays, or unforeseen circumstances.
              </li>
              <li>U1R is not liable for delays caused by third-party logistics providers.</li>
              <li>Customers are responsible for providing accurate shipping details.</li>
              <li>
                If delivery fails due to incorrect address or unavailable recipient, re-delivery
                charges may apply.
              </li>
              <li>Risk of loss or damage passes to the customer upon delivery confirmation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. B2C (Retail) Shipping Terms</h2>
            <p className="mt-3">For customers registered under B2C mode:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                Orders are typically delivered within 1-2 working days from the date of dispatch.
              </li>
              <li>Delivery timelines may vary depending on serviceable locations.</li>
              <li>Orders placed after business hours may be processed the next working day.</li>
              <li>
                Delivery attempts will be made by the logistics partner as per standard courier
                practices.
              </li>
              <li>
                Same-day delivery is not guaranteed unless specifically mentioned in promotional
                offers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. B2B (Wholesale) Shipping Terms</h2>
            <p className="mt-3">For customers registered under B2B mode:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                U1R may offer same-day or next-day delivery, subject to order confirmation time and
                stock availability.
              </li>
              <li>Bulk orders may require additional handling time.</li>
              <li>
                Delivery schedules may be coordinated directly with the registered business contact.
              </li>
              <li>
                Minimum order quantities or value thresholds may apply for priority delivery.
              </li>
              <li>U1R reserves the right to schedule deliveries based on operational feasibility.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Dispatch &amp; Order Processing</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Orders are processed during standard business hours.</li>
              <li>
                Dispatch confirmation will be communicated via SMS, email, or app notification.
              </li>
              <li>Estimated delivery timelines begin after dispatch confirmation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Shipping Charges</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Shipping charges, if applicable, will be displayed at checkout.</li>
              <li>Promotional free shipping offers may apply from time to time.</li>
              <li>Additional charges may apply for remote or non-serviceable areas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Damaged or Missing Items</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                Customers must report damaged, defective, or missing products within 48 hours of
                delivery.
              </li>
              <li>Proof such as photographs may be required.</li>
              <li>Resolution will be handled as per the Refund &amp; Cancellation Policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Force Majeure</h2>
            <p className="mt-3">
              U1R shall not be liable for delays or failure to deliver due to events beyond
              reasonable control, including but not limited to:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Natural disasters</li>
              <li>Government restrictions</li>
              <li>Strikes or transportation disruptions</li>
              <li>Public health emergencies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
            <p className="mt-3">
              U1R reserves the right to modify this Shipping &amp; Delivery Policy at any time.
              Updates will be published on the Platform with the revised effective date.
            </p>
            <p className="mt-3">
              Continued use of the Platform constitutes acceptance of the updated policy.
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
