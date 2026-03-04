import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">SeaTrees Demo</h1>
        <p className="text-muted-foreground mb-8">
          Marine Biodiversity Intelligence Dashboard
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all"
        >
          Launch Dashboard
        </Link>
      </div>
    </div>
  );
}
