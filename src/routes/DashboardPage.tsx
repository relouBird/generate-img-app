import { useSeoHead } from "@/composables/useSeoHead";

export default function DashboardPage() {
  useSeoHead({
    title: "Tableau de Bord",
    subtitle: "Visualisez les vos données de façon claire et concise",
    forcePrefix: true,
  });
  return (
    <>
      <h1>DashboardPage</h1>
    </>
  );
}
