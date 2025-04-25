import { useState , useEffect} from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; 
import UploadForm from "../components/UploadForm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import UserAuthStatus from "../components/UserAuthStatus";

import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";


import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const [notes, setNotes] = useState("");
  const [editedNotes, setEditedNotes] = useState("");
  const [notesHistory, setNotesHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notesList, setNotesList] = useState([]);

  const { user } = useAuth();
  const {theme,toggleTheme} = useTheme(); 

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
      setEditedNotes(res.data.notes);
      setNotesHistory((prev) => [res.data.notes, ...prev]);
    } catch (err) {
      console.error("Error uploading images:", err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/download-pdf",
        { notes: editedNotes },
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
      link.download = "notes.pdf";
      link.click();
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };

  const handleNotesChange = (event) => {
    setEditedNotes(event.target.value);
  };

  const handleSelectNote = (note) => {
    setNotes(note);
    setEditedNotes(note);
    window.scrollTo({ top: 0, behavior: "smooth" });    // Scroll to top when a note is selected
  };

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
      />

      {/* Main Content */}
      <main className="flex-1 p-2 md:ml-6 mt-3 md:mt-0 overflow-y-auto dark:bg-gray-900">

          {/* header and user auth status */}
          <div className="p-4 border-b flex justify-between items-center ">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold mt-2">AI Notes Maker</h1>
                <Button 
                  onClick={toggleTheme}
                  className="bg-blue-300 text-black rounded-full font-bold hover:bg-blue-400 transition duration-200 mt-2"
                  variant="outline"
                >
                    {theme === "dark" ? <MdOutlineDarkMode size={20} /> : <MdDarkMode size={20} />}
                </Button>
            </div>
              <UserAuthStatus />
          </div>
        
        
        {/* Upload Form */}
        <UploadForm onUpload={handleUpload} />

        {/* Notes Display */}
        {notes && (
          <div className="mt-8 p-4 bg-white shadow rounded md:w-[900px] w-full mx-auto dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              Generated Notes : {" "}
              <span className="text-[16px] text-green-900 dark:text-green-500">(You can edit the notes here)</span>
            </h2>
            <Textarea
              value={editedNotes}
              onChange={handleNotesChange}
              className="w-full h-48 mb-4 dark:bg-gray-700"
            />
            <Button className="mt-2 dark:hover:text-[15px]" onClick={handleDownloadPDF}>
              Download as PDF
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
