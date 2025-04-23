import { useState , useEffect} from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; 
import UploadForm from "../components/UploadForm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import UserAuthStatus from "../components/UserAuthStatus";

const Home = () => {
  const [notes, setNotes] = useState("");
  const [editedNotes, setEditedNotes] = useState("");
  const [notesHistory, setNotesHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notesList, setNotesList] = useState([]);

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
  }, [notes]);

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
  };

  return (
    <div className="flex">
      <Sidebar
        notesList={notesList}
        notesHistory={notesHistory}
        onSelectNote={handleSelectNote}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <main className="flex-1 p-4 md:ml-16 mt-5 md:mt-10">
          <div className="p-4 border-b flex justify-between items-center">
            <h1 className="text-lg font-bold">AI Notes Maker</h1>
              <UserAuthStatus />
          </div>

        <UploadForm onUpload={handleUpload} />

        {notes && (
          <div className="mt-8 p-4 bg-white shadow rounded md:w-[900px] w-full mx-auto">
            <h2 className="text-xl font-semibold mb-2">
              Generated Notes : {" "}
              <span className="text-[16px] text-green-900">(You can edit the notes here)</span>
            </h2>
            <Textarea
              value={editedNotes}
              onChange={handleNotesChange}
              className="w-full h-48 mb-4"
            />
            <Button className="mt-4" onClick={handleDownloadPDF}>
              Download as PDF
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
