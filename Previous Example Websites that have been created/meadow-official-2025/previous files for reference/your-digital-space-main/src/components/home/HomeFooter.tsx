import { Link } from "react-router-dom";

export function HomeFooter() {
  return (
    <footer className="py-9 px-6 border-t border-subtle relative z-10">
      <div className="max-w-[900px] mx-auto flex flex-col md:flex-row items-center justify-between gap-[18px]">
        <Link to="/" className="flex items-center gap-[9px]">
          <div 
            className="w-[22px] h-5 bg-gradient-to-br from-sage-light via-sage to-sage-dark"
            style={{ borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%" }}
          />
          <span className="text-xs font-semibold text-secondary">ORIVYA</span>
        </Link>

        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="text-xs text-muted-custom hover:text-secondary transition-colors">About</a>
          <a href="#" className="text-xs text-muted-custom hover:text-secondary transition-colors">Pricing</a>
          <Link to="/privacy" className="text-xs text-muted-custom hover:text-secondary transition-colors">Privacy</Link>
          <Link to="/terms" className="text-xs text-muted-custom hover:text-secondary transition-colors">Terms</Link>
        </div>

        <div className="text-[11px] text-muted-custom">© 2025 Orivya</div>
      </div>
    </footer>
  );
}
