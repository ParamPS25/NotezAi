import { Button } from "@/components/ui/button";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

const Sidebar = ({ notesList, notesHistory, onSelectNote, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Toggle Button (mobile only) (menu / close) */}
      <div className={`md:hidden fixed top-2 ${isOpen ? 'left-54' : 'left-4'} z-50 clickable`}> 
        <Button variant="ghost" onClick={toggleSidebar} size="icon">
          {isOpen ? <IoCloseSharp /> : <MdOutlineMenu />}
        </Button>
      </div>

      {/* Sidebar */}
      {/* h-screen -> overflow-y-auto */}
      <aside
        className={`fixed top-0 left-0 z-40 max-h-screen w-64 bg-gray-100 p-4 border-r transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 shadow-2xl overflow-y-auto`}
      >
        <h1 className="text-2xl font-bold text-center mb-6 mt-2 font-serif">EzNotes Ai</h1>

        <h2 className="text-lg font-semibold mb-4 mt-2 text-center">Previous Notes</h2>
        <div className="flex flex-col gap-2">
          {notesList.length === 0 ? (
            <p className="text-sm text-gray-500">No notes yet.</p>
          ) : (
            notesList.map((note, index) => {
              const date = new Date(note.createdAt);
              const formattedDate = date.toLocaleString();

              return (
                <div key={index} className="flex flex-col border rounded bg-amber-100 p-2">
                  <Button
                    title={note.content}
                    variant="ghost"
                    className="justify-start text-left cursor-pointer hover:bg-amber-300"
                    onClick={() => {
                      onSelectNote(note.content);
                      if (window.innerWidth < 768) toggleSidebar(); // Auto-close on mobile
                    }}
                  >
                    {note.content.slice(0, 20)}...
                  </Button>
                  <span className="text-xs text-gray-500 pl-2">{formattedDate}</span>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
