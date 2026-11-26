import { useSettings } from "../settings/useSettings";
import { useTranslation } from "react-i18next";
import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

import Heading from "../../ui/Heading";
import Spinner from "../../ui/spinner/Spinner";
import Empty from "../../ui/Empty";

function toExternalUrl(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function Contact() {
  const { isLoading, settings } = useSettings();
  const [t] = useTranslation();

  if (isLoading) return <Spinner />;
  if (!settings) return <Empty message={t("client.noContactInfo")} />;

  const { Instagram, facebook, whatsAppNumber } = settings || {};
  const whatsAppDigits = String(whatsAppNumber ?? "").replace(/\D/g, "");
  const whatsAppLink = whatsAppDigits ? `https://wa.me/${whatsAppDigits}` : "";

  const contactLinks = [
    { href: toExternalUrl(facebook), label: "Facebook", Icon: FaFacebook },
    { href: toExternalUrl(Instagram), label: "Instagram", Icon: FaInstagramSquare },
    { href: whatsAppLink, label: "WhatsApp", Icon: IoLogoWhatsapp },
  ].filter(({ href }) => href);

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="surface-card p-[10px]">
        <Heading>{t("client.contactInfo")}</Heading>
      </div>
      <div className="surface-card flex items-center gap-[20px] p-[16px]">
        {contactLinks.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-primary transition-all hover:bg-brand-gradient hover:text-white hover:shadow-glow"
          >
            <Icon className="text-3xl" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default Contact;
