function DashFooter() {
  return (
    <footer className="bg-white/90 backdrop-blur-sm shadow-inner w-full">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 py-3 text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} techNotes. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default DashFooter;
