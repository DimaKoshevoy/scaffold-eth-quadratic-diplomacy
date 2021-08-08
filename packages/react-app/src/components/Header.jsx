import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/DimaKoshevoy/scaffold-eth-quadratic-diplomacy" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🏗 scaffold-eth"
        subTitle="Quadratic Diplomacy"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
