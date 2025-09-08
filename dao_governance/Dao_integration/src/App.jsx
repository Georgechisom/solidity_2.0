import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnectors } from "wagmi";
import { Button } from "@/components/ui/button";
import AppLayout from "./components/Layout";
import MainLayout from "./components/MainLayout";
import Proposals from "./components/Proposals";
import UseChairPerson from "./hooks/UseChairPerson";

function App() {
  const connectors = useConnectors();

  const chairPerson = UseChairPerson();

  console.log("connectors", { connectors });

  return (
    <AppLayout chairPersonAddress={chairPerson.chairPerson}>
      <MainLayout></MainLayout>
      <Proposals></Proposals>
    </AppLayout>
  );
}

export default App;
