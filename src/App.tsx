import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Ticker } from "./components/Ticker";
import { OrgChart } from "./components/OrgChart";
import { Team } from "./components/Team";
import { Stack } from "./components/Stack";
import { Governance } from "./components/Governance";
import { KillSwitch } from "./components/KillSwitch";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <OrgChart />
        <Team />
        <Stack />
        <Governance />
        <KillSwitch />
      </main>
      <Footer />
    </>
  );
}
