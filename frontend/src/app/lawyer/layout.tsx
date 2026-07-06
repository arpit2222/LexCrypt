import React from "react";
import LawyerLayoutClient from "@/components/LawyerLayoutClient";

export default function LawyerLayout({ children }: { children: React.ReactNode }) {
  return <LawyerLayoutClient>{children}</LawyerLayoutClient>;
}
