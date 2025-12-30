import Link from "next/link";
import { notFound } from "next/navigation";

export default function CatchAllPlaceholderPage({ params }: { params: { slug: string[] } }) {
  if (process.env.NODE_ENV === "production") notFound();

  const route = `/${params.slug.join("/")}`;

  return (
    <main id="placeholder-view" className="view active" aria-label="Placeholder">
      <div className="container">
        <div className="card" style={{ maxWidth: 720, margin: "0 auto", padding: 32, borderRadius: "var(--r-2xl)" }}>
          <div className="card-label">Dev Placeholder</div>
          <h1 className="page-title" style={{ marginBottom: 12 }}>
            {route}
          </h1>
          <p className="page-subtitle" style={{ marginBottom: 24 }}>
            This route is in the canonical plan but hasn’t been built yet.
          </p>
          <div className="featured-actions">
            <Link href="/dev/route-index" className="btn btn-primary focus-ring pressable">
              Route Index
            </Link>
            <Link href="/" className="btn focus-ring pressable">
              Home
            </Link>
            <Link href="/connect" className="btn focus-ring pressable">
              Connect
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

