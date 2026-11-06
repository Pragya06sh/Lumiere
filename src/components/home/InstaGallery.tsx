import Image from "next/image";
import { siteConfig } from "@/config/site";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const gallery = [
  { img: "/images/products/rose-pearl-reveal.jpg", caption: "@festiveglow • Rose Pearl Reveal glowing softly" },
  { img: "/images/products/lotus-diya-jar.jpg", caption: "@festivehome • Lotus Diya Jar with Chandan and Kesar" },
  { img: "/images/products/petal-jewel-gel-candle.jpg", caption: "@candleloversofindia • Petal Jewel Box gel candle reveal!" },
  { img: "/images/products/sunflower-tray-candle.jpg", caption: "@warmspaces • Sunflower Garden Tray Candle centerpiece" },
];

export function InstaGallery() {
  return (
    <section className="py-16 bg-[#FAF6F0] border-b border-[#B8893C]/15">
      <div className="container-wide mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <span className="text-xs text-[#B8893C] uppercase tracking-wider font-medium">
              Tag @lumierecandles on Instagram
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-[#3A2A22] font-medium">
              In warm Diwali homes
            </h3>
          </div>
          <a
            href={siteConfig.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 sm:mt-0 text-xs text-[#3A2A22] hover:text-[#B8893C] inline-flex items-center gap-2 font-medium py-2 px-5 rounded-full border border-[#B8893C]/30 bg-white transition-all shadow-xs"
          >
            <InstagramIcon className="w-4 h-4 text-[#B8893C]" />
            <span>Follow our journey</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-2xl overflow-hidden border border-[#B8893C]/20 group bg-white shadow-xs"
            >
              <Image
                src={item.img}
                alt={item.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-[11px] text-[#FAF6F0] leading-snug">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
