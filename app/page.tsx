import HeroSlider from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import Navbar from "@/components/NavBar";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen">
      <main className="flex flex-1 w-full  flex-col items-center justify-between  bg-white dark:bg-black sm:items-start">
        <Navbar />
        <HeroSlider />
        <MarqueeBanner />
      </main>
    </div>
  );
}
