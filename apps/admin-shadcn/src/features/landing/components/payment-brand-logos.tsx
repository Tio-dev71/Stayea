"use client"

export function VisaLogo({ className = "h-5 w-auto" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 48 16" className={className} aria-label="Visa logo">
      <path
        fill="#1434CB"
        d="M19.4 15.3l2.8-14.6h4.5l-2.8 14.6h-4.5zm17.6-14.3c-0.9-0.4-2.3-0.7-4-0.7-4.4 0-7.5 2.3-7.5 5.6 0 2.4 2.2 3.8 3.9 4.6 1.7 0.8 2.3 1.4 2.3 2.1 0 1.1-1.4 1.7-2.6 1.7-1.8 0-2.7-0.3-4.2-0.9l-0.6-0.3-0.6 3.8c1 0.5 2.9 0.9 4.8 0.9 4.6 0 7.7-2.3 7.7-5.8 0-1.9-1.2-3.4-3.8-4.6-1.6-0.8-2.5-1.4-2.5-2.2 0-0.8 0.9-1.6 2.8-1.6 1.6 0 2.7 0.3 3.6 0.7l0.4 0.2 0.6-3.5zm10.7 0.1h-3.5c-1.1 0-1.9 0.3-2.4 1.4l-6.8 12.8h4.7l0.9-2.6h5.8l0.5 2.6h4.1l-3.3-14.2zm-5.8 8.6l2.4-6.4 1.4 6.4h-3.8zm-29.2-8.7l-4.4 9.9-0.5-2.4c-0.8-2.7-3.4-5.7-6.2-7.2l4.1 14.3h4.7l7.1-14.6h-4.8z"
      />
    </svg>
  )
}

export function MastercardLogo({ className = "h-5 w-auto" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 36 22" className={className} aria-label="Mastercard logo">
      <circle cx="11" cy="11" r="10" fill="#EB001B" />
      <circle cx="25" cy="11" r="10" fill="#F79E1B" fillOpacity="0.88" />
    </svg>
  )
}

export function JcbLogo({ className = "h-5" }: { readonly className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center gap-0.5 px-2 py-0.5 bg-white rounded border border-slate-200 shadow-2xs font-sans select-none ${className}`}
      aria-label="JCB logo"
    >
      <span className="font-black text-xs text-[#0066B3] leading-none">J</span>
      <span className="font-black text-xs text-[#E60012] leading-none">C</span>
      <span className="font-black text-xs text-[#009944] leading-none">B</span>
    </div>
  )
}

export function ApplePayLogo({ className = "h-5 w-auto" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 60 25" className={className} aria-label="Apple Pay logo">
      <path
        fill="#000"
        d="M9.1 7.1c-0.6 0.8-1.6 1.4-2.6 1.3-0.1-1.1 0.4-2.1 1-2.8 0.6-0.7 1.7-1.3 2.6-1.3 0.1 1.1-0.4 2.1-1 2.8zm2.6 1.4c-1.5-0.1-2.7 0.8-3.4 0.8s-1.8-0.8-2.9-0.8c-1.5 0-2.9 0.9-3.7 2.2-1.6 2.7-0.4 6.7 1.1 8.9 0.8 1.1 1.6 2.3 2.8 2.2s1.6-0.7 3-0.7 2.1 0.7 3 0.7c1.3 0 2-1 2.8-2.2 0.9-1.3 1.2-2.5 1.3-2.6-0.1 0-2.4-0.9-2.4-3.6 0-2.3 1.8-3.3 1.9-3.4-1.1-1.5-2.7-1.5-3.5-1.5zm11.3-3.6h4.5c2.6 0 4.4 1.8 4.4 4.3 0 2.6-1.8 4.4-4.4 4.4h-2.1v5.1H23V4.9zm4.3 6.6c1.4 0 2.3-0.9 2.3-2.3s-0.9-2.3-2.3-2.3H25v4.6h2.3zm12.3 8.3c-0.2-0.5-0.4-1.2-0.4-1.7-0.7 1.1-1.9 1.9-3.3 1.9-2 0-3.3-1.3-3.3-3.1 0-2.2 1.8-3.2 4.4-3.2h2v-0.6c0-1-0.8-1.6-2-1.6-1 0-1.8 0.4-2.3 0.9l-0.8-1.5c0.9-0.7 2.1-1.1 3.5-1.1 2.5 0 3.9 1.3 3.9 3.6v4.6c0 0.7 0.1 1.4 0.3 1.8h-2zm-0.2-4.5h-1.7c-1.4 0-2.3 0.5-2.3 1.5 0 0.9 0.7 1.5 1.7 1.5 1.3 0 2.3-0.9 2.3-2.2v-0.8zm10.7 4.5l-2.6-7.3h2.3l1.5 5 1.5-5h2.2l-3.9 10.3c-0.5 1.3-1.3 1.9-2.6 1.9-0.4 0-0.8-0.1-1.1-0.2l0.4-1.8c0.2 0.1 0.5 0.1 0.7 0.1 0.7 0 1.1-0.3 1.5-1.2l0.4-1.8z"
      />
    </svg>
  )
}

export function MomoLogo({ className = "h-6 w-6" }: { readonly className?: string }) {
  return (
    <div
      className={`rounded-lg bg-[#A50064] flex items-center justify-center text-white font-bold text-[9px] tracking-tighter select-none p-1 shadow-2xs ${className}`}
      aria-label="MoMo logo"
    >
      <div className="flex flex-col items-center leading-none">
        <span>mo</span>
        <span>mo</span>
      </div>
    </div>
  )
}

export function VnpayLogo({ className = "h-5 w-auto" }: { readonly className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-1 font-bold text-xs select-none ${className}`}
      aria-label="VNPay logo"
    >
      <div className="relative w-4 h-4 rounded transform rotate-45 bg-[#ED1C24] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#005BAA] [clip-path:polygon(0_0,100%_0,0_100%)]" />
      </div>
      <span className="text-[#005BAA] font-black text-xs tracking-tight">VNPAY</span>
    </div>
  )
}
