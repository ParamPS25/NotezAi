import { Button } from "@/components/ui/button";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { useState,useEffect, useRef } from "react";

const Sidebar = ({ notesList, notesHistory, onSelectNote, isOpen, toggleSidebar, onTitleUpdate, onDeleteNote }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeMenuNoteId, setActiveMenuNoteId] = useState(null);
  
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuNoteId(null); // Close the menu when clicking outside
      }
    };

    // Add event listener to detect clicks outside the menu
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }
  , []); 

  return (
    <>
      {/* Toggle Button (mobile only) (menu / close) */}
      <div className={`md:hidden fixed top-2 ${isOpen ? 'left-50' : 'left-4'} z-50 clickable`}>
        <Button variant="ghost" onClick={toggleSidebar} size="icon">
          {isOpen ? <IoCloseSharp /> : <MdOutlineMenu />}
        </Button>
      </div>

      {/* Sidebar */}
      {/* h-screen -> overflow-y-auto */}
      <aside
        className={`fixed top-0 left-0 z-40 max-h-screen w-64 bg-gray-100 p-4 border-r transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 shadow-2xl overflow-y-auto
        dark:bg-gray-800`}
      >
        <h1 className="text-2xl font-bold text-center mb-6 mt-2 font-serif">EzNotes Ai</h1>

        <h2 className="text-lg font-semibold mb-4 mt-2 text-center">Previous Notes</h2>

        <div className="flex flex-col gap-2">
          {notesList.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No notes yet.</p>
          ) : (
            notesList.map((note, index) => {
              const date = new Date(note.createdAt);
              const formattedDate = date.toLocaleString();

              return (
                <div key={index} className="flex flex-col border rounded bg-amber-100 p-2 dark:text-gray-900 dark:bg-blue-400">

                  <div className="flex items-center justify-between ">
                    <Button
                      title={note.content}
                      variant="ghost"
                      className="justify-start text-left cursor-pointer hover:bg-amber-700 "
                      onClick={() => {
                        onSelectNote(note);  // Pass the entire note object when selecting a note , not just note.content with note._id so, can edit that note separately
                        if (window.innerWidth < 768) toggleSidebar(); // Auto-close on mobile
                      }}
                    >
                      {note.title ? note.title : note.content.slice(0,20).concat("...")}
                    </Button>

                    {/* Three dots for menu */}
                    <div className="relative">
                      <button onClick={() => 
                        setActiveMenuNoteId(activeMenuNoteId === note._id ? null : note._id)
                      }
                        className="text-3xl font-bold hover:text-gray-900 cursor-pointer">
                        ...
                      </button>

                      {activeMenuNoteId === note._id && (
                        <div className="absolute right-0 top-0 bg-white shadow-md rounded-md border"
                          ref={menuRef}       // ref to the menu div -> to close the menu when clicking outside
                        >
                          <div>
                            <input
                              type="text"
                              value={newTitle}
                              onChange={(e) => {
                                setNewTitle(e.target.value)
                              }}
                              placeholder="New title"
                              className="border p-1 rounded-md mb-2 text-center"
                            />
                            <button
                              onClick={() => {
                                onTitleUpdate(note._id, newTitle)
                                setNewTitle("");                   // Clear the input after updating}}
                                setActiveMenuNoteId(null);             
                              }}
                              className="text-blue-500 hover:text-blue-700 w-full cursor-pointer"
                            >
                              Update Title
                            </button>
                          </div>

                          <div>
                            <button
                              onClick={() => {
                                onDeleteNote(note._id)
                                setActiveMenuNoteId(null);          // Close the menu after deleting
                              }}
                              className="text-red-500 hover:text-red-700 mt-2 cursor-pointer w-full"
                            >
                              Delete Note
                            </button>
                          </div>
                        </div>

                      )}
                    </div>
                  </div>

                  <span className="text-xs text-gray-500 pl-2 dark:text-white">{formattedDate}</span>

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
