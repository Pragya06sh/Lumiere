"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const cleanNumber = rawNumber.replace(/[^0-9]/g, "");

  if (!cleanNumber) {
    return null;
  }

  const message = encodeURIComponent(
    `Hello ${siteConfig.brandName}, I am interested in your handcrafted candles and have a question regarding an order.`
  );
  const formattedNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;

  return (
    <aside aria-label="Quick WhatsApp assistance">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out px-0 group-hover:px-2 text-xs font-semibold text-black bg-white rounded-md ml-1 shadow-md">
          Chat with us
        </span>
      </a>
    </aside>
  );
}
