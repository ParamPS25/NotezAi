import { Button } from "@/components/ui/button";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";

import { useState,useEffect, useRef } from "react";

import NoteMenuPortal from "@/components/NoteMenuPortal";


const Sidebar = ({ notesList, notesHistory, onSelectNote, isOpen, toggleSidebar, onTitleUpdate, onDeleteNote }) => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [selectedNote, setSelectedNote] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [activeMenuNoteId, setActiveMenuNoteId] = useState(null);
  
  // const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  return (
    <>
      {/* Toggle Button (mobile only) (menu / close) */}
      <div className={`md:hidden fixed top-2 ${isOpen ? 'left-44' : 'left-4'} z-50 clickable`}>
        <Button variant="ghost" onClick={toggleSidebar} size="icon">
          {isOpen ? <IoCloseSharp /> : <MdOutlineMenu />}
        </Button>
      </div>

      {/* Sidebar */}
      {/* h-screen -> overflow-y-auto */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-58 sm:60 md:62 bg-gray-100 border-r transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 shadow-2xl overflow-y-auto
        dark:bg-gray-800`}
      >

        <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 p-4 pt-8 md:pt-4 sm:pt-8 lg:pt-4">
          <div className="flex items-center justify-between">
            <img
              src="/logo.svg"
              alt="EzNotes Ai Logo"
              className="w-10 h-10 mx-auto mb-2 mt-2 rounded-full border-2 border-gray-300 dark:border-gray-700"
            ></img>
            <h1 className="text-2xl font-bold text-center font-serif">EzNotes Ai</h1>
          </div>
          <h2 className="text-lg font-semibold mb-0 mt-5 text-center">Previous Notes</h2>
        </div>

        <div className="flex flex-col gap-2 p-4">
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
                      className="justify-start text-left cursor-pointer hover:bg-amber-400 "
                      onClick={() => {
                        onSelectNote(note);  // Pass the entire note object when selecting a note , not just note.content with note._id so, can edit that note separately
                        if (window.innerWidth < 768) toggleSidebar(); // Auto-close on mobile
                      }}
                    >
                      {note.title ? note.title : note.content.slice(0,15).concat("...")}
                    </Button>

                    {/* Three dots for menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();

                          const viewportHeight = window.innerHeight;
                          const menuHeight = 120; // approx-height of menu (can fine-tune later)
                          
                          // Check if there is enough space below the button to show the menu . If not, show it above the button
                          const hasSpaceBelow = rect.bottom + menuHeight < viewportHeight;

                          const topPosition = hasSpaceBelow
                            ? rect.bottom + window.scrollY             // show below the button
                            : rect.top + window.scrollY - menuHeight; // show above the button

                          setMenuPosition({
                            top: topPosition,
                            left: rect.left + window.scrollX - 50,
                          });

                          setActiveMenuNoteId(activeMenuNoteId === note._id ? null : note._id);
                        }}
                      >
                        <HiDotsVertical className="text-gray-500 hover:text-gray-700" size={20} />
                      </button>
                 
                    </div>
                  </div>

                  <span className="text-xs text-gray-500 pl-2 dark:text-white">{formattedDate}</span>

                </div>
              );
            }) 
          )}
        </div>
      </aside>


      {/* Note Menu Portal */}
      {activeMenuNoteId && (
        <NoteMenuPortal
          onClose={() => setActiveMenuNoteId(null)} // Close the menu when clicking outside
          position={menuPosition}                  // Position of the menu
        >
          <div className="min-h-30 min-w-28 px-4 py-4 absolute right-0 top-0 dark:bg-blue-200 bg-white shadow-md rounded-md border z-99"
            // ref={menuRef}       // ref to the menu div -> to close the menu when clicking outside
          >
            <div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value)
                }}
                placeholder="New title"
                className="border p-1 rounded-md mb-2 text-center dark:text-black dark:border-gray-500"
              />
              <button
                onClick={() => {
                  onTitleUpdate(activeMenuNoteId, newTitle)
                  setNewTitle("");                   // Clear the input after updating
                  setActiveMenuNoteId(null);             
                }}
                className="text-blue-700 hover:bg-cyan-500 rounded-md hover:text-black w-full cursor-pointer"
              >
                Update Title
              </button>
            </div>

            <div>
              <button
                onClick={() => {
                  onDeleteNote(activeMenuNoteId) 
                  setActiveMenuNoteId(null);          // Close the menu after deleting
                }}
                className="text-red-400 hover:bg-red-300 rounded-md hover:text-red-700 mt-2 cursor-pointer w-full"
              >
                Delete Note
              </button>
            </div>
          </div>
        </NoteMenuPortal>
      )}
    </>
  );  
};

export default Sidebar;   