
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
import { ServiceGrid } from "@/components/home/ServiceGrid";

export default function InicioPage() {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner />
      <ServiceGrid />
    </div>
  );
}

