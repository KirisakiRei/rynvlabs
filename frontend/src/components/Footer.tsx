import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();
  const footerText = settings.footer_text.replace("{year}", new Date().getFullYear().toString());

  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link to="/" className="font-heading text-sm font-bold text-foreground">
          {settings.brand_name}
        </Link>
        <nav className="flex gap-6 text-xs text-muted-foreground">
          {settings.footer_links.map((link) => (
            link.href.startsWith("/#") ? (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ) : (
              <Link key={link.href} to={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            )
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">{footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;
