import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container-page py-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}
