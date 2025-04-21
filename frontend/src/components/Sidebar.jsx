import { Button } from "@/components/ui/button";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

const Sidebar = ({ notesHistory, onSelectNote, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Toggle Button (mobile only) */}
      <div className={`md:hidden fixed top-2 ${isOpen ? 'left-54' : 'left-4'} z-50 clickable`}>
        <Button variant="ghost" onClick={toggleSidebar} size="icon">
          {isOpen ? <IoCloseSharp /> : <MdOutlineMenu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gray-100 p-4 border-r transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 shadow-2xl `}
      >
        <h1 className="text-2xl font-bold text-center mb-6 mt-7">AI Notes Maker</h1>

        <h2 className="text-lg font-semibold mb-2">Previous Notes</h2>
        <div className="flex flex-col gap-2">
          {notesHistory.length === 0 ? (
            <p className="text-sm text-gray-500">No notes yet.</p>
          ) : (
            notesHistory.map((note, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-left cursor-pointer hover:bg-amber-300 bg-amber-200"
                onClick={() => {
                  onSelectNote(note);
                  if (window.innerWidth < 768) toggleSidebar(); // Auto-close on mobile
                }}
              >
                Note - {index + 1} 
              </Button>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
