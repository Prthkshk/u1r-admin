export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#c2c2c2] text-gray-700 pt-16 pb-6 [font-family:var(--font-inder)]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* About */}
        <div>
          <div className="mb-3">
            <img
              src="/images/u1r 2.jpg"
              alt="U1R app icon"
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl border border-[#dcdcdc] object-cover"
            />
          </div>
          <h3 className="font-semibold text-lg mb-2 text-[#5c5c5c] [font-family:var(--font-tilt-warp)]">U1R</h3>
          <p className="text-sm leading-relaxed">
            U1R is committed to providing healthy, high-quality food products
            at honest prices. Serving both homes and businesses with trust and consistency.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <img
              src="/icons/google play.svg"
              alt="Get it on Google Play"
              width={120}
              height={36}
              className="h-9 w-auto"
            />
            <img
              src="/icons/app store.svg"
              alt="Download on the App Store"
              width={120}
              height={36}
              className="h-9 w-auto"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-4 text-[#5c5c5c] [font-family:var(--font-tilt-warp)]">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="inline-block [font-family:var(--font-inder)] transition-all duration-200 hover:translate-x-1 hover:text-[#FF0000]">Dry Fruits</a></li>
            <li><a href="#" className="inline-block [font-family:var(--font-inder)] transition-all duration-200 hover:translate-x-1 hover:text-[#FF0000]">Sundried Fruits</a></li>
            <li><a href="#" className="inline-block [font-family:var(--font-inder)] transition-all duration-200 hover:translate-x-1 hover:text-[#FF0000]">Seeds</a></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-[#5c5c5c] [font-family:var(--font-tilt-warp)]">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/privacy-policy" className="inline-block [font-family:var(--font-inder)] transition-all duration-200 hover:translate-x-1 hover:text-[#FF0000]">Privacy Policy</a></li>
            <li><a href="/terms-and-conditions" className="inline-block [font-family:var(--font-inder)] transition-all duration-200 hover:translate-x-1 hover:text-[#FF0000]">Terms and Conditions</a></li>
            <li><a href="/payment-policy" className="inline-block [font-family:var(--font-inder)] transition-all duration-200 hover:translate-x-1 hover:text-[#FF0000]">Payment Policy</a></li>
            <li><a href="/shipping-delivery-policy" className="inline-block [font-family:var(--font-inder)] transition-all duration-200 hover:translate-x-1 hover:text-[#FF0000]">Shipping &amp; Delivery Policy</a></li>
            <li><a href="/refund-cancellation-policy" className="inline-block [font-family:var(--font-inder)] transition-all duration-200 hover:translate-x-1 hover:text-[#FF0000]">Refund &amp; Cancellation Policy</a></li>
            <li><a href="/delete-account" className="inline-block [font-family:var(--font-inder)] transition-all duration-200 hover:translate-x-1 hover:text-[#FF0000]">Delete Account</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-4 text-[#5c5c5c] [font-family:var(--font-tilt-warp)]">Company</h4>
          <p className="text-sm mb-2">U1R FOOD PRODUCTS INDIA LLP</p>
          <p className="text-sm mb-2">fssai lic No. 20825020000988</p>
          <p className="text-sm">Email: team@u1rfoods.com</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t mt-12 pt-6 text-center text-sm text-gray-500">
        © 2026 U1R. All Rights Reserved.
      </div>
    </footer>
  );
}
