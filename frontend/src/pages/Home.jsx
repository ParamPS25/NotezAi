import { useState , useEffect} from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; 
import UploadForm from "../components/UploadForm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

import UserAuthStatus from "../components/UserAuthStatus";

import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

import { MdLightMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { LuMaximize } from "react-icons/lu";
import { LuMinimize } from "react-icons/lu";
import { MdModeEdit } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { TbCancel } from "react-icons/tb";


import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const [notes, setNotes] = useState("");
  const [editedNotes, setEditedNotes] = useState("");
  const [notesHistory, setNotesHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); 
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();
  const {theme,toggleTheme} = useTheme(); 

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  }

  const handleSaveNotes = async () => {
    try{
      const res = await axios.post(`http://localhost:5000/api/generate/save/${selectedNoteId}`, 
        { notes: editedNotes }, 
        { withCredentials: true}
      );
      if (res.data.success) {
        setNotesList((prev) => prev.map(note => note._id === selectedNoteId ? { ...note, content: editedNotes } : note));
        setNotes(res.data.note.content); // Update the notes state with the saved note content
        // setEditedNotes("");
        setIsEditing(false);
        toast("Notes saved successfully!", {
          description: "Your notes have been saved.",
          duration: 3000,
        });
      }
    }
    catch (err) {
      // alert("Error saving notes. Please try again.");
      toast.error("Error saving notes. Please try again.", {
        description: "An error occurred while saving your notes.",
        duration: 3000,
      });
      console.error("Error saving notes:", err);
      // setEditedNotes("");
    }
  }

  useEffect(() => {
    const fetchNotesHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/generate/history", {
          withCredentials: true,
        });
        if (res.data.success) {
          setNotesList(res.data.notes);
        }
      } catch (err) {
        console.error("Failed to fetch notes history:", err);
      }
    };
  
    fetchNotesHistory();
  }, [notes,user]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await axios.post("http://localhost:5000/api/generate", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNotes(res.data.notes);
      // setEditedNotes(res.data.notes);
      setNotesHistory((prev) => [res.data.notes, ...prev]);
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error("Daily note generation limit reached (5 per day).", {
          description: "You have reached the maximum number of notes you can generate today.",
          duration: 3000,
        });
      } else {
        toast.error("Error generating notes. Please try again.", {
          description: "An error occurred while generating your notes.",
          duration: 3000,
        });
      }
      console.error("Error uploading images:", err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/download-pdf",
        { notes: notes },
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `EzNotesAi.pdf`;
      link.click();
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };

  const handleNotesChange = (event) => {
    setEditedNotes(event.target.value);
  };

  // Handle note selection from sidebar , to accept a note object, not just a string - to edit it separately with note._id and content
  // This function is called when a note is selected from the sidebar
  const handleSelectNote = (note) => {
    setNotes(note.content);
    setEditedNotes(note.content);
    setSelectedNoteId(note._id);                         // Store the selected note ID
    window.scrollTo({ top: 0, behavior: "smooth" });    // Scroll to top when a note is selected
  };

  const handleUpdateTitle = async (noteId, newTitle) => {
      try{
        if(!newTitle) {
          toast.error("Title cannot be empty.", {
            description: "Please provide a valid title.",
            duration: 3000,
          });
          return;
        }
        if(newTitle.length > 20) {
          toast.error("Title is too long.", {
            description: "Please provide a title with less than 20 characters.",
            duration: 3000,
          });
          return;
        }
        const res = await axios.post(`http://localhost:5000/api/generate/update/${noteId}`, 
          { title : newTitle }, 
          { withCredentials: true}
        );
        if (res.data.success) {
          setNotesList((prev) => prev.map(note => note._id === noteId ? { ...note, title: newTitle } : note));
          toast("Note title updated successfully!", {
            description: "Your note title has been updated.",
            duration: 3000,
          });
        }
      } catch (err) {
        console.error("Error updating note title:", err);
        toast.error("Error updating note title. Please try again.", {
          description: "An error occurred while updating the note title.",
          duration: 3000,
        });
      }
  }

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/generate/delete/${noteId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setNotesList((prev) => prev.filter((note) => note._id !== noteId));
        setNotes("");                 // Clear notes when a note is deleted
        setEditedNotes(""); 
        setSelectedNoteId(null);      // Clear selected note ID
        toast("Note deleted successfully!", {
          description: "Your note has been deleted.",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Error deleting note. Please try again.", {
        description: "An error occurred while deleting the note.",
        duration: 3000,
      });
    }
  }

  // Layout
  // div.flex.h-screen.overflow-hidden: wraps everything, takes full height, hides overflow
  // Sidebar: fixed width, scrollable inside (overflow-y-auto)
  // main.flex-1.overflow-y-auto: scrolls independently

  return (
    <div className="flex h-screen overflow-hidden dark:bg-gray-900">  
      {/* Sidebar */}
      <Sidebar
        notesList={notesList}
        notesHistory={notesHistory}
        onSelectNote={handleSelectNote}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        onDeleteNote={handleDeleteNote}
        onTitleUpdate={handleUpdateTitle}
      />

      {/* Main Content */}
      <main className="flex-1 p-2 md:ml-6 mt-3 md:mt-0 overflow-y-auto dark:bg-gray-900">

          {/* header and user auth status */}
          <div className="p-4 border-b flex justify-between items-center ">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold mt-2">AI Notes Maker</h1>
                <Button 
                  onClick={toggleTheme}
                  className="bg-blue-300 text-black rounded-full font-bold hover:bg-blue-400 transition duration-200 mt-2 
                    dark:bg-transparent dark:text-white dark:hover:bg-blue-200 dark:hover:text-black"
                  variant="outline"
                >
                    {theme === "dark" ? <MdOutlineLightMode size={20}/> : <MdLightMode size={20} />}
                </Button>
            </div>
              <UserAuthStatus />
          </div>
        
        
        {/* Upload Form */}
        <UploadForm onUpload={handleUpload} />

        {/* Notes Display */}
        {notes && (
        <div className={`mt-8 p-4 bg-white shadow rounded ${isExpanded ? "w-full md:h-[86vh] mb-4 sm:h-[86vh]" : "md:w-[900px] w-full"} 
          mx-auto dark:bg-gray-800 dark:text-white transition-all duration-300`}>
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-2 mt-2 dark:text-white">
                  Generated Notes : {" "}
                  {isEditing ? 
                    <span className="text-[16px] text-green-900 dark:text-green-500 mb-4">(you can edit the notes here)</span> : 
                    <span className="text-[16px] text-green-900 dark:text-green-500 mb-4">(View mode)</span>
                  }
                </h2>

                <Button className="" onClick={toggleExpand}>
                  {isExpanded ? <LuMinimize size={20} /> : <LuMaximize size={20} />}
                </Button>
            </div>
            

            <Textarea
                value={isEditing ? editedNotes : notes}
                onChange={isEditing ? handleNotesChange : undefined}
                readOnly={!isEditing}
                className={`w-full ${isExpanded ? "h-[65vh]" : "h-48"} mb-4 dark:bg-gray-700 resize-none`}
            />

            <div className="flex justify-between items-center mt-4 flex-col-reverse sm:flex-row md:flex-row gap-2">
              <Button className={`dark:bg-gray-200`} onClick={handleDownloadPDF}>
                <IoMdDownload size={20} /> Download as PDF
              </Button>

              {isEditing ? (
                <div className="flex gap-2 md:gap-6 ">
                  <Button onClick={handleSaveNotes}
                    className={`bg-green-400 hover:bg-green-600  text-black transition duration-200`}>
                    <FaRegSave size={20} /> Save Notes
                  </Button>

                  <Button 
                    className = {'bg-red-400 hover:bg-red-500  text-black transition duration-200'}
                    onClick={() => {
                    setIsEditing(false);
                    setEditedNotes(notes);  // Reset edits if canceled
                  }}>
                    <TbCancel size={20} /> Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  className={`dark:bg-cyan-200 dark:hover:bg-cyan-500 bg-blue-500 hover:bg-blue-700 text-black transition duration-200`}
                  onClick={() => setIsEditing(true)}>
                  <MdModeEdit size={20} /> Edit Notes
                </Button>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
