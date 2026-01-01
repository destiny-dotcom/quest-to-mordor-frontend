import { Card, CardContent } from "@/components/ui";
import { LoginForm } from "@/components/features/auth";

export default function LoginPage() {
  return (
    <Card>
      <CardContent>
        <h2 className="mb-6 text-center text-xl font-semibold">
          Continue Your Quest
        </h2>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
