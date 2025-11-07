import {
  LayoutDashboard,
  BarChart3,
  Upload,
  Building2,
  FileBarChart2,
  Settings,
  LogOut,
  Activity,
  Users,
} from "lucide-react";
import { SidebarLink } from "./SidebarLink";

export function Sidebar({ currentView, setCurrentView }) {
  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 p-6">
          <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold tracking-wide text-xl">
            BPJS Insight Hub
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <p className="text-xs text-gray-400 mt-4 mb-2">Menu Utama</p>
          <SidebarLink
            icon={LayoutDashboard}
            active={currentView === "dashboard"}
            onClick={() => setCurrentView("dashboard")}
          >
            Dashboard
          </SidebarLink>
          <SidebarLink
            icon={Upload}
            active={currentView === "upload"}
            onClick={() => setCurrentView("upload")}
          >
            Upload Data
          </SidebarLink>
          <SidebarLink
            icon={Building2}
            active={currentView === "faskes"}
            onClick={() => setCurrentView("faskes")}
          >
            Manajemen Faskes
          </SidebarLink>
          <SidebarLink
            icon={BarChart3}
            active={currentView === "analytics"}
            onClick={() => setCurrentView("analytics")}
          >
            Analitik
          </SidebarLink>
          <SidebarLink
            icon={FileBarChart2}
            active={currentView === "reports"}
            onClick={() => setCurrentView("reports")}
          >
            Laporan
          </SidebarLink>

          <p className="text-xs text-gray-400 mt-6 mb-2">Sistem</p>
          <SidebarLink icon={Settings}>Pengaturan</SidebarLink>
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 flex items-center gap-3 border-t border-gray-200">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <div className="text-sm flex-1">
          <p className="font-medium">Admin BPJS</p>
          <p className="text-gray-500 text-xs">admin@bpjs.go.id</p>
        </div>
        <LogOut className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
      </div>
    </aside>
  );
}
