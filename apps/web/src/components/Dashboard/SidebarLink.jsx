export function SidebarLink({ icon: Icon, children, active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-blue-50 text-sm font-medium cursor-pointer transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
          : "text-gray-700"
      }`}
    >
      <Icon className="h-5 w-5" />
      {children}
    </div>
  );
}
