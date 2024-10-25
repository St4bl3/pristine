import Footer from "@/components/footer";
import { BackgroundLinesDemo } from "@/components/hero";
import { PristineTimeline } from "@/components/hero2";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <BackgroundLinesDemo />
      <PristineTimeline />
      <Footer />
    </div>
  );
}
