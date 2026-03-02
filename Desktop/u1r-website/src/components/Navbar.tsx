"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { sendOtp, verifyOtp } from "@/lib/api";

export default function Navbar() {
  const FALLBACK_OTP = "1234";
  const AUTH_TOKEN_KEY = "u1r_auth_token";
  const AUTH_USER_KEY = "u1r_auth_user";
  const pathname = usePathname();
  const router = useRouter();
  const placeholders = ['Search "Onion Makhana"', 'Search "Apple"', 'Search "Cashew Anardana"'];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [loginStep, setLoginStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendSeconds, setResendSeconds] = useState(60);
  const [authError, setAuthError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const closeLoginModal = () => {
    setIsLoginOpen(false);
    setLoginStep("phone");
    setOtp(["", "", "", ""]);
    setResendSeconds(60);
    setAuthError("");
    setIsSendingOtp(false);
    setIsResendingOtp(false);
    setIsVerifyingOtp(false);
  };

  const openLoginModal = () => {
    setIsLoginOpen(true);
    setLoginStep("phone");
    setOtp(["", "", "", ""]);
    setResendSeconds(60);
    setAuthError("");
    setIsSendingOtp(false);
    setIsResendingOtp(false);
    setIsVerifyingOtp(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(Boolean(token));
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    router.prefetch("/profile");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isLoginOpen) {
      return;
    }

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLoginModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isLoginOpen]);

  useEffect(() => {
    if (!isLoginOpen || loginStep !== "otp" || resendSeconds <= 0) {
      return;
    }

    const countdown = setInterval(() => {
      setResendSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [isLoginOpen, loginStep, resendSeconds]);

  const handleContinue = async () => {
    if (mobileNumber.length !== 10) {
      setAuthError("Please enter a valid 10-digit mobile number");
      return;
    }

    setAuthError("");
    setIsSendingOtp(true);
    try {
      await sendOtp(mobileNumber);
      setLoginStep("otp");
      setOtp(["", "", "", ""]);
      setResendSeconds(60);
    } catch (error) {
      setLoginStep("otp");
      setOtp(["", "", "", ""]);
      setResendSeconds(60);
      setAuthError(
        error instanceof Error
          ? `${error.message}. Temporary fallback OTP: ${FALLBACK_OTP}`
          : `Unable to send OTP. Temporary fallback OTP: ${FALLBACK_OTP}`
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (isResendingOtp) {
      return;
    }

    setAuthError("");
    setIsResendingOtp(true);
    try {
      await sendOtp(mobileNumber);
      setOtp(["", "", "", ""]);
      setResendSeconds(60);
    } catch (error) {
      setOtp(["", "", "", ""]);
      setResendSeconds(60);
      setAuthError(
        error instanceof Error
          ? `${error.message}. Temporary fallback OTP: ${FALLBACK_OTP}`
          : `Unable to resend OTP. Temporary fallback OTP: ${FALLBACK_OTP}`
      );
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const nextValue = value.replace(/[^0-9]/g, "").slice(-1);
    if (authError) {
      setAuthError("");
    }

    setOtp((prev) => {
      const next = [...prev];
      next[index] = nextValue;
      return next;
    });

    if (nextValue && index < otp.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace") {
      return;
    }

    if (otp[index]) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    if (index > 0) {
      event.preventDefault();
      setOtp((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (isLoginOpen && loginStep === "otp") {
      otpInputRefs.current[0]?.focus();
    }
  }, [isLoginOpen, loginStep]);

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setAuthError("Please enter the 4-digit OTP");
      return;
    }

    setAuthError("");
    setIsVerifyingOtp(true);
    try {
      const response = await verifyOtp(mobileNumber, otpCode);
      if (typeof window !== "undefined" && response && typeof response === "object") {
        const data = response as Record<string, unknown>;
        const dataPayload = data.data && typeof data.data === "object" ? (data.data as Record<string, unknown>) : undefined;
        const userPayload = data.user && typeof data.user === "object" ? (data.user as Record<string, unknown>) : undefined;
        const nestedUserPayload =
          dataPayload?.user && typeof dataPayload.user === "object"
            ? (dataPayload.user as Record<string, unknown>)
            : undefined;
        const tokenFromData =
          data.token ||
          data.accessToken ||
          dataPayload?.token ||
          dataPayload?.accessToken;

        const getStringValue = (...values: unknown[]) => {
          for (const value of values) {
            if (typeof value === "string" && value.trim()) {
              return value.trim();
            }
          }
          return "";
        };

        const userName = getStringValue(
          data.name,
          data.fullName,
          data.userName,
          data.customerName,
          dataPayload?.name,
          dataPayload?.fullName,
          dataPayload?.userName,
          dataPayload?.customerName,
          userPayload?.name,
          userPayload?.fullName,
          userPayload?.userName,
          userPayload?.customerName,
          nestedUserPayload?.name,
          nestedUserPayload?.fullName,
          nestedUserPayload?.userName,
          nestedUserPayload?.customerName
        );
        const userMobile = getStringValue(
          data.mobileNumber,
          data.mobile,
          data.phone,
          data.phoneNumber,
          dataPayload?.mobileNumber,
          dataPayload?.mobile,
          dataPayload?.phone,
          dataPayload?.phoneNumber,
          userPayload?.mobileNumber,
          userPayload?.mobile,
          userPayload?.phone,
          userPayload?.phoneNumber,
          nestedUserPayload?.mobileNumber,
          nestedUserPayload?.mobile,
          nestedUserPayload?.phone,
          nestedUserPayload?.phoneNumber,
          mobileNumber
        );
        const userEmail = getStringValue(
          data.email,
          data.emailAddress,
          dataPayload?.email,
          dataPayload?.emailAddress,
          userPayload?.email,
          userPayload?.emailAddress,
          nestedUserPayload?.email,
          nestedUserPayload?.emailAddress
        );
        const userId = getStringValue(
          data.userId,
          data.id,
          data._id,
          dataPayload?.userId,
          dataPayload?.id,
          dataPayload?._id,
          userPayload?.userId,
          userPayload?.id,
          userPayload?._id,
          nestedUserPayload?.userId,
          nestedUserPayload?.id,
          nestedUserPayload?._id
        );

        if (typeof tokenFromData === "string" && tokenFromData) {
          localStorage.setItem(AUTH_TOKEN_KEY, tokenFromData);
        }
        localStorage.setItem(
          AUTH_USER_KEY,
          JSON.stringify({
            userId,
            name: userName,
            mobileNumber: userMobile,
            email: userEmail,
          })
        );
      }

      setIsAuthenticated(true);
      closeLoginModal();
    } catch (error) {
      if (otpCode === FALLBACK_OTP) {
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_TOKEN_KEY, `fallback-token-${mobileNumber}`);
          localStorage.setItem(
            AUTH_USER_KEY,
            JSON.stringify({
              userId: "",
              name: "",
              mobileNumber,
              email: "",
            })
          );
        }
        setIsAuthenticated(true);
        closeLoginModal();
        return;
      }

      setAuthError(
        error instanceof Error
          ? `${error.message}. If backend is down, use fallback OTP ${FALLBACK_OTP}`
          : `Invalid OTP. If backend is down, use fallback OTP ${FALLBACK_OTP}`
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="w-full [font-family:var(--font-inder)]">
      <div className="overflow-hidden whitespace-nowrap bg-[#FF0000] text-xs text-white">
        <div className="inline-block animate-marquee py-1.5">
          <span className="mx-10">
            Discount by shopping above 5000 and get instant delivery{" "}
            <img
              src="/icons/dot.svg"
              alt=""
              width={6}
              height={6}
              className="mx-2 inline"
            />
            Download U1R App to buy products in bulk
            <img
              src="/icons/dot.svg"
              alt=""
              width={6}
              height={6}
              className="mx-2 inline"
            />
          </span>
          <span className="mx-10">
            Download U1R App to buy products in bulk{" "}
            <img
              src="/icons/dot.svg"
              alt=""
              width={6}
              height={6}
              className="mx-2 inline"
            />
            Download U1R App to buy products in bulk
            <img
              src="/icons/dot.svg"
              alt=""
              width={6}
              height={6}
              className="mx-2 inline"
            />
          </span>
        </div>
      </div>

      <div className="border-b border-[#c2c2c2] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            aria-label="Go to home page"
            className="block"
            onClick={(event) => {
              event.preventDefault();
              router.push("/");
            }}
          >
            <img
              src="/images/u1r.jpg"
              alt="U1R"
              width={350}
              height={170}
              className="h-12 w-auto origin-left scale-100"
            />
          </Link>

          <div className="mx-2 flex-1">
            <div className="flex h-10 overflow-hidden rounded-md border border-[#c2c2c2]">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  aria-label="Search products"
                  className="h-full w-full bg-transparent px-4 text-sm text-[#8a8a8a] outline-none"
                />
                {searchText.length === 0 ? (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden px-4 text-sm text-[#8a8a8a]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={placeholders[placeholderIndex]}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.32, ease: "easeInOut" }}
                        className="whitespace-nowrap"
                      >
                        {placeholders[placeholderIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                ) : null}
              </div>
              <button
                className="flex w-11 items-center justify-center bg-[#FF0000] text-white"
                type="button"
              >
                <img
                  src="/icons/search.svg"
                  alt="Search"
                  width={26}
                  height={26}
                />
              </button>
            </div>
          </div>

          <div className="ml-6 hidden items-center gap-7 md:flex">
            <Link
              href="#"
              className="flex min-w-[64px] flex-col items-center justify-center leading-tight text-[#1f1f1f] hover:text-[#FF0000]"
            >
              <img
                src="/icons/wholesale.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
              <span className="mt-1.5 text-sm">Wholesale</span>
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="flex min-w-[64px] cursor-pointer flex-col items-center justify-center leading-tight text-[#1f1f1f] hover:text-[#FF0000]"
              >
                <img
                  src="/icons/login.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
                <span className="mt-1.5 text-sm">Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="flex min-w-[64px] cursor-pointer flex-col items-center justify-center leading-tight text-[#1f1f1f] hover:text-[#FF0000]"
              >
                <img
                  src="/icons/login.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
                <span className="mt-1.5 text-sm">Login</span>
              </button>
            )}
            <Link
              href="#"
              className="flex min-w-[64px] flex-col items-center justify-center leading-tight text-[#1f1f1f] hover:text-[#FF0000]"
            >
              <img src="/icons/cart.svg" alt="" width={24} height={24} aria-hidden="true" />
              <span className="mt-1.5 text-sm">My Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-[#c2c2c2] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 overflow-x-auto px-6 py-2.5 text-sm font-medium text-[#1f1f1f]">
          <Link href="#" className="hover:text-[#FF0000]">Dryfruits</Link>
          <Link href="#" className="hover:text-[#FF0000]">Flavoured Dryfruits</Link>
          <Link href="#" className="hover:text-[#FF0000]">Seeds</Link>
          <Link href="#" className="hover:text-[#FF0000]">WholeSpices</Link>
          <Link href="#" className="hover:text-[#FF0000]">Makhana</Link>
          <Link href="#" className="hover:text-[#FF0000]">Exotic Nuts</Link>
          <Link href="#" className="hover:text-[#FF0000]">Sundried Fruits</Link>
          <Link href="#" className="hover:text-[#FF0000]">Chocolate Chocodip</Link>
        </div>
      </div>

      {isLoginOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2px]"
          onClick={closeLoginModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Login or Signup"
            className="relative w-full max-w-[460px] rounded-[24px] bg-[#f5f5f5] px-4 pb-6 pt-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:px-6 sm:pb-7 sm:pt-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close login popup"
              onClick={closeLoginModal}
              className="absolute right-4 top-3 cursor-pointer text-[28px] font-normal leading-none text-[#e35246] sm:right-4 sm:top-3 sm:text-[32px]"
            >
              x
            </button>

            <div className="relative mx-auto w-full max-w-[380px]">
              <div
                className={`${loginStep === "phone" ? "visible" : "invisible"} pt-6 text-center sm:pt-7`}
                aria-hidden={loginStep !== "phone"}
              >
                <h2 className="text-[27px] font-bold leading-none text-[#4a4d52] [font-family:var(--font-inder)] sm:text-[33px]">
                  Welcome Back{" "}
                  <span role="img" aria-label="waving hand">
                    {"\uD83D\uDC4B"}
                  </span>
                </h2>
                <p className="mt-2.5 text-[18px] leading-tight text-[#63666d] [font-family:var(--font-inder)] sm:text-[21px]">
                  Login or Signup in seconds
                </p>

                <div className="mt-6 flex h-[54px] items-center overflow-hidden rounded-[27px] border border-[#d6d6d6] bg-white px-4 sm:mt-7 sm:h-[60px] sm:px-5">
                  <span className="text-[22px] font-semibold leading-none text-[#4c4f56] sm:text-[24px]">+91</span>
                  <span className="mx-3 h-[28px] w-px bg-[#d0d0d0] sm:mx-3 sm:h-[32px]" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={mobileNumber}
                    onChange={(event) => {
                      setMobileNumber(event.target.value.replace(/[^0-9]/g, "").slice(0, 10));
                      if (authError) {
                        setAuthError("");
                      }
                    }}
                    placeholder="Enter mobile number"
                    className="h-full w-full bg-transparent text-[17px] leading-none text-[#4c4f56] outline-none placeholder:text-[#b3b3b3] sm:text-[19px]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isSendingOtp}
                  className="mt-5 h-[54px] w-full cursor-pointer rounded-[27px] bg-gradient-to-r from-[#b50000] via-[#e11515] to-[#ef2d2d] text-[23px] font-semibold leading-none text-white shadow-[0_14px_24px_rgba(175,20,20,0.28)] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-6 sm:h-[60px] sm:text-[26px]"
                >
                  {isSendingOtp ? "Sending..." : "Continue"}
                </button>

                {authError && loginStep === "phone" ? (
                  <p className="mt-3 text-[13px] leading-tight text-[#d12b2b] sm:text-[14px]">
                    {authError}
                  </p>
                ) : null}

                <p className="mt-5 text-[14px] leading-tight text-[#62666c] sm:mt-6 sm:text-[15px]">
                  By continuing, you agree to our{" "}
                  <Link href="/terms-and-conditions" className="cursor-pointer text-[#ce453f] underline underline-offset-2">
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link href="/privacy-policy" className="cursor-pointer text-[#ce453f] underline underline-offset-2">
                    Privacy
                  </Link>{" "}
                  &{" "}
                  <Link href="/delete-account" className="cursor-pointer text-[#ce453f] underline underline-offset-2">
                    Delete Account
                  </Link>
                </p>
              </div>

              {loginStep === "otp" ? (
                <div className="absolute inset-0 pt-6 text-center sm:pt-7">
                  <h2 className="text-[27px] font-bold leading-none text-[#565a60] [font-family:var(--font-inder)] sm:text-[33px]">
                  Enter OTP
                  </h2>
                  <p className="mt-2.5 text-[18px] leading-tight text-[#1f1f1f] sm:text-[20px]">
                    Sent to +91 {mobileNumber}
                  </p>

                  <div className="mt-6 flex justify-center gap-3 sm:mt-7">
                    {otp.map((digit, index) => (
                      <input
                        key={`otp-${index}`}
                        ref={(element) => {
                          otpInputRefs.current[index] = element;
                        }}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(event) => handleOtpChange(index, event.target.value)}
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        className={`h-[54px] w-[54px] rounded-[12px] border bg-transparent text-center text-[24px] text-[#333] outline-none sm:h-[60px] sm:w-[60px] sm:text-[27px] ${
                          digit ? "border-[#e11515]" : "border-[#cfcfcf]"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifyingOtp}
                    className="mt-5 h-[54px] w-full cursor-pointer rounded-[27px] bg-gradient-to-r from-[#b50000] via-[#e11515] to-[#ff2a30] text-[23px] font-medium leading-none text-white sm:mt-6 sm:h-[60px] sm:text-[26px]"
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify"}
                  </button>

                  {authError && loginStep === "otp" ? (
                    <p className="mt-3 text-[13px] leading-tight text-[#d12b2b] sm:text-[14px]">
                      {authError}
                    </p>
                  ) : null}

                  {resendSeconds > 0 ? (
                    <p className="mt-5 text-[16px] leading-tight text-[#111] sm:mt-6 sm:text-[18px]">
                      Resend OTP in{" "}
                      <span className="text-[#ff1f1f]">
                        {Math.floor(resendSeconds / 60)}:
                        {String(resendSeconds % 60).padStart(2, "0")}
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResendingOtp}
                      className="mt-5 cursor-pointer text-[16px] leading-tight text-[#ff1f1f] underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-6 sm:text-[18px]"
                    >
                      {isResendingOtp ? "Resending..." : "Resend OTP"}
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
