import { SITE_URL } from "@/lib/site";

export const CONSULTANCY_SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "PPWR ve CSRD Uyum Danışmanlığı",
  provider: {
    "@type": "Organization",
    name: "Marine Emission Package",
    url: SITE_URL,
  },
  areaServed: {
    "@type": "Country",
    name: "Türkiye",
  },
  description:
    "Avrupa'ya ihracat yapan üreticiler için PPWR, CSRD, Green Claims ve CBAM uyum danışmanlığı.",
  serviceType: [
    "PPWR danışmanlık",
    "CSRD danışmanlık",
    "Green Claims danışmanlık",
    "CBAM danışmanlık",
  ],
};
