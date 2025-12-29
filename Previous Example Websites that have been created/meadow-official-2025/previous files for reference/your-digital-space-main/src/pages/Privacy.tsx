import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Button asChild variant="ghost" className="mb-8">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
            <Shield className="h-5 w-5 text-sage" />
          </div>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        </div>

        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-muted-foreground">
            Privacy policy content will be added here. This is a placeholder page.
          </p>
        </div>
      </div>
    </div>
  );
}
