import Main from "@/components/home/Main";
import Navigation from "@/components/home/Navigation";

export default function Home() {
  return (
    <div className="flex h-full">
      <Navigation></Navigation>
      <Main></Main>
    </div>
  );
}
