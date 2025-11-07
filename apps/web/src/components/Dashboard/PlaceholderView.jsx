export function PlaceholderView({ currentView }) {
  const getTitle = () => {
    switch (currentView) {
      case "faskes":
        return "Manajemen Faskes";
      case "analytics":
        return "Analitik Lanjutan";
      case "reports":
        return "Laporan";
      default:
        return "Fitur";
    }
  };

  return (
    <section className="p-6">
      <div className="text-center p-12 bg-white rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold mb-2">{getTitle()}</h3>
        <p className="text-gray-500">Fitur ini akan dikembangkan selanjutnya</p>
      </div>
    </section>
  );
}
