"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Sparkles, Truck, Save, RefreshCw } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [festiveMode, setFestiveMode] = useState<boolean>(true);
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(999);
  const [codFee, setCodFee] = useState<number>(49);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setFestiveMode(data.settings.festiveMode);
        setAnnouncementText(data.settings.announcementText || "");
        setFreeShippingThreshold(
          Math.round((data.settings.freeShippingThreshold || 99900) / 100)
        );
        setCodFee(Math.round((data.settings.codFee || 4900) / 100));
      } else {
        toast.error("Failed to load settings from database");
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
      toast.error("Network error fetching settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          festiveMode,
          announcementText,
          freeShippingThreshold: freeShippingThreshold * 100,
          codFee: codFee * 100,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Site settings saved to database");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (err) {
      toast.error("Network error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8893C]/20 pb-5">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Store Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium">
            Site Controls
          </h1>
        </div>

        <button
          onClick={fetchSettings}
          className="btn-outline bg-white text-xs py-2 px-3 flex items-center gap-1.5 shadow-xs w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Reload</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-[#B8893C]/20 p-8">
          <RefreshCw className="w-6 h-6 text-[#B8893C] animate-spin mx-auto" />
          <p className="text-xs text-[#8C7768]">Loading configuration from database...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Festive Mode Switch */}
          <div className="bg-white border border-[#B8893C]/20 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#B8893C]/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF8EE] border border-[#E8A33D] flex items-center justify-center text-[#E8A33D]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base text-[#3A2A22] font-medium">
                    Seasonal Theme Mode
                  </h3>
                  <p className="text-xs text-[#6B5548]">
                    When disabled, the site displays the calm, minimal evergreen candle theme.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={festiveMode}
                  onChange={(e) => setFestiveMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#EAD8CB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B8893C]" />
              </label>
            </div>

            <div>
              <label className="text-xs text-[#6B5548] font-medium block mb-1.5">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="input-field"
                placeholder="e.g. Free pan-India delivery on orders above ₹799"
              />
            </div>
          </div>

          {/* Shipping & COD Parameters */}
          <div className="bg-white border border-[#B8893C]/20 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#B8893C]/15 pb-4">
              <Truck className="w-5 h-5 text-[#B8893C]" />
              <h3 className="font-display text-base text-[#3A2A22] font-medium">
                Shipping & Cash on Delivery Parameters
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[#6B5548] font-medium block mb-1.5">
                  Free Delivery Threshold (₹ INR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={freeShippingThreshold}
                  onChange={(e) =>
                    setFreeShippingThreshold(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="input-field font-mono"
                />
                <span className="text-[10px] text-[#8C7768] mt-1 block">
                  Orders equal or above this amount receive free delivery.
                </span>
              </div>

              <div>
                <label className="text-[#6B5548] font-medium block mb-1.5">
                  Cash on Delivery Fee (₹ INR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={codFee}
                  onChange={(e) =>
                    setCodFee(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="input-field font-mono"
                />
                <span className="text-[10px] text-[#8C7768] mt-1 block">
                  Convenience fee charged for handling cash upon doorstep delivery.
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-xs py-3 px-6 shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving to Database..." : "Save Changes"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
