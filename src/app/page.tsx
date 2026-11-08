import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function RootPage() {
  const locale = (await cookies()).get("locale")?.value;
  redirect(locale === "en" ? "/en" : "/ko");
}
