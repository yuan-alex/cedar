import {
  AccountSettingsCards,
  SecuritySettingsCards,
} from "@daveyplate/better-auth-ui";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/account/$accountView")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = useParams({
    from: "/account/$accountView",
    shouldThrow: false,
  });
  const navigate = useNavigate();

  const currentView =
    params?.accountView === "security" ? "security" : "account";

  return (
    <main className="container mx-auto max-w-3xl px-4 md:px-6">
      <section className="my-6">
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and security settings.
        </p>
      </section>
      <Separator className="mb-4" />

      <Tabs
        value={currentView}
        onValueChange={(value) =>
          navigate({
            to: "/account/$accountView",
            params: { accountView: value as "account" | "security" },
          })
        }
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountSettingsCards />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettingsCards />
        </TabsContent>
      </Tabs>
    </main>
  );
}
