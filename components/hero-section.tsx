"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Banner } from "@/lib/types"

const defaultImages = [
  { src: "/images/hero-acai.jpg", alt: "Acai delicioso" },
  { src: "/images/acai-copo.jpg", alt: "Acai no copo" },
  { src: "/images/acai-garrafa.jpg", alt: "Acai na garrafa" },
]

interface HeroSectionProps {
  banners: Banner[]
}

export function HeroSection({ banners }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const images = banners.length > 0 
    ? banners.map(b => ({ src: b.image_url, alt: b.title || "Banner" }))
    : defaultImages

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <section className="relative bg-gradient-to-b from-pink-50 to-white">
      {/* Image container with modern shape */}
      <div className="relative h-[260px] md:h-[320px] overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentIndex 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-110"
            }`}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-purple-500/10" />
      </div>

      {/* Content card */}
      <div className="relative -mt-16 mx-4 md:mx-6">
        <div className="bg-white rounded-3xl shadow-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Naju Gourmet
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Faca seu pedido e receba em casa
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Aberto agora
                </span>
              </div>
            </div>
            
            {/* Dots indicator */}
            {images.length > 1 && (
              <div className="flex flex-col gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "w-2 h-6 bg-[#e91e8c]" 
                        : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
