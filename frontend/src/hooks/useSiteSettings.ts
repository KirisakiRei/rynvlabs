import { useEffect, useState } from "react";
import publicApi from "@/lib/publicApi";

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  brand_name: string;
  wa_number: string;
  footer_text: string;
  nav_links: NavLink[];
  footer_links: NavLink[];
}

const defaultSettings: SiteSettings = {
  brand_name: "rynvlabs",
  wa_number: "6283192801660",
  footer_text: "© {year} rynvlabs. All rights reserved.",
  nav_links: [
    { label: "Layanan", href: "/#services" },
    { label: "Produk", href: "/products" },
    { label: "Project", href: "/projects" },
    { label: "Academy", href: "/academy" },
    { label: "Kontak", href: "/contact" },
  ],
  footer_links: [
    { label: "Beranda", href: "/" },
    { label: "Academy", href: "/academy" },
    { label: "Portfolio", href: "/#portfolio" },
    { label: "Kontak", href: "/contact" },
  ],
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .get("/site-settings")
      .then((res) => {
        const data = res.data.data ?? res.data;
        setSettings({ ...defaultSettings, ...data });
      })
      .catch((err) => {
        console.error("[useSiteSettings] Failed to load site settings:", err.message);
        // Keep default settings on error
      })
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
};
