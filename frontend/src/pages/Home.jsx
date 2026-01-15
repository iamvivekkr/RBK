import Header from "../components/Header";
import MainCard from "../components/MainCard";
import QuickMenu from "../components/QuickMenu";
import RecentHistory from "../components/RecentHistory";
import FloatingButton from "../components/FloatingButton";

export default function Home() {
  return (
    <>
      <Header />
      <MainCard />
      <QuickMenu />
      <RecentHistory />
      <FloatingButton />
    </>
  );
}
