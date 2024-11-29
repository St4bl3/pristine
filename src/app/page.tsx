import Footer from "@/components/footer";
import { PristineTimeline } from "@/components/hero2";
import { ImagesSliderDemo } from "@/components/heromain";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <ImagesSliderDemo />
      <PristineTimeline />
      <Footer />
    </div>
  );
}
