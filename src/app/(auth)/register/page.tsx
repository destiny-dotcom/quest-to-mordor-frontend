import { Card, CardContent } from "@/components/ui";
import { RegisterForm } from "@/components/features/auth";

export default function RegisterPage() {
  return (
    <Card>
      <CardContent>
        <h2 className="mb-6 text-center text-xl font-semibold">
          Join the Fellowship
        </h2>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
