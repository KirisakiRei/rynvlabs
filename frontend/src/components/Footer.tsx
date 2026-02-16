import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border px-6 py-8">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
      <Link to="/" className="font-heading text-sm font-bold text-foreground">
        rynvlabs
      </Link>
      <nav className="flex gap-6 text-xs text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">Beranda</Link>
        <Link to="/academy" className="transition-colors hover:text-foreground">Academy</Link>
        <a href="/#portfolio" className="transition-colors hover:text-foreground">Portfolio</a>
        <a href="/#contact" className="transition-colors hover:text-foreground">Kontak</a>
      </nav>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} rynvlabs. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
