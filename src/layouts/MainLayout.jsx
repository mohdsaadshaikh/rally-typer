import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-brand-dark-1 relative overflow-x-hidden">
      {/* Background Pattern - Spans entire layout */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url('/images/bg-hero.svg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
