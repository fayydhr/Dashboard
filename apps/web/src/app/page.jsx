"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DashboardView } from "@/components/Dashboard/DashboardView";
import { UploadView } from "@/components/Upload/UploadView";
import { PlaceholderView } from "@/components/Dashboard/PlaceholderView";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function BPJSDashboard() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  const {
    stats,
    statsLoading,
    performanceData,
    performanceLoading,
    rankingData,
    rankingLoading,
  } = useDashboardData(selectedRegion, selectedPeriod);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F9FC] font-inter text-[#1E1E1E]">
      {/* Left Sidebar */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Panel */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Toolbar */}
        <DashboardHeader
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />

        {/* Content */}
        {currentView === "dashboard" && (
          <DashboardView
            stats={stats}
            statsLoading={statsLoading}
            performanceData={performanceData}
            performanceLoading={performanceLoading}
            rankingData={rankingData}
            rankingLoading={rankingLoading}
          />
        )}

        {/* Upload View */}
        {currentView === "upload" && <UploadView />}

        {/* Other Views Placeholders */}
        {currentView !== "dashboard" && currentView !== "upload" && (
          <PlaceholderView currentView={currentView} />
        )}
      </main>
    </div>
  );
}
