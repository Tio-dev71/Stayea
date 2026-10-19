"use client"

import * as React from "react"
import type { AirlineType } from "@/features/landing/data/stayea-mock-data"

export interface AirlineLogoProps {
  readonly type: AirlineType
  readonly name?: string
  readonly className?: string
  readonly size?: "sm" | "md" | "lg"
}

export const AirlineLogo: React.FC<AirlineLogoProps> = ({
  type,
  name,
  className = "",
  size = "md",
}) => {
  const isSm = size === "sm"

  switch (type) {
    case "vietjet":
      return (
        <div className={`flex items-center gap-1.5 select-none ${className}`}>
          <div className="flex flex-col items-start leading-none">
            <span
              className={`font-black italic tracking-tighter text-[#E31B23] ${
                isSm ? "text-sm" : "text-base sm:text-lg"
              }`}
              style={{ fontFamily: "Impact, sans-serif, system-ui" }}
            >
              vietjet<span className="text-[#FDB813] ml-0.5">Air</span>
            </span>
          </div>
          {name && <span className="sr-only">{name}</span>}
        </div>
      )

    case "bamboo":
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          {/* Bamboo Leaf SVG Icon */}
          <svg
            className={isSm ? "w-5 h-5" : "w-6 h-6"}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 26C8 17 15 10 25 7C22 15 17 22 8 25L6 26Z"
              fill="#005C38"
            />
            <path
              d="M13 27C17 20 22 15 28 12C26 19 21 24 14 26L13 27Z"
              fill="#27B066"
            />
          </svg>
          {name && (
            <span
              className={`font-bold text-[#005C38] ${
                isSm ? "text-xs" : "text-sm sm:text-base"
              }`}
            >
              {name}
            </span>
          )}
        </div>
      )

    case "vietnam-airlines":
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          {/* Golden Lotus SVG Icon */}
          <svg
            className={isSm ? "w-5 h-5" : "w-6 h-6"}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 4C17 8 19 12 21 16C19 20 17 24 16 28C15 24 13 20 11 16C13 12 15 8 16 4Z"
              fill="#E5A823"
            />
            <path
              d="M16 11C19.5 13.5 23 16 26.5 19C23 21 19.5 22.5 16 23.5C18 19.5 18 15 16 11Z"
              fill="#D49B24"
            />
            <path
              d="M16 11C12.5 13.5 9 16 5.5 19C9 21 12.5 22.5 16 23.5C14 19.5 14 15 16 11Z"
              fill="#D49B24"
            />
            <path
              d="M16 17C21 18.5 25.5 20.5 29 23.5C24.5 25.5 20 26.5 16 27C18.5 23.5 18 20 16 17Z"
              fill="#B88319"
            />
            <path
              d="M16 17C11 18.5 6.5 20.5 3 23.5C7.5 25.5 12 26.5 16 27C13.5 23.5 14 20 16 17Z"
              fill="#B88319"
            />
          </svg>
          {name && (
            <span
              className={`font-bold text-[#0B3056] ${
                isSm ? "text-xs" : "text-sm sm:text-base"
              }`}
            >
              {name}
            </span>
          )}
        </div>
      )

    default:
      return (
        <div className={`font-semibold text-slate-800 ${className}`}>
          {name || type}
        </div>
      )
  }
}
