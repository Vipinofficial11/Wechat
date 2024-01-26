function Navbar() {
  return (
    <nav className="bg-gray-100 shadow">
      <div className="max-w-5xl mx-10 px-1 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex gap-8 items-center">
            <p className="flex-shrink-0 text-4xl font-md">
              <span className="text-indigo-600 font-bold">We</span>
              <span className="text-gray-600">Chat 💻</span>
            </p>
            <span className="text-xl">Talk to random strangers</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
