<h1>EzNotezAI - AI Notes Maker</h1>
<p>
  EzNotez AI is a web application that allows users to upload screenshots and instantly generate summarized notes using AI. Notez AI streamlines your note-taking process and helps you focus on what matters most — learning and understanding.
</p>

<h2>🚀 Features</h2>
<ul>
  <li>AI-Powered Summarization: Extracts and summarizes text from uploaded screenshots using Gemini 2.0 Flash model or OpenAI Vision API.</li>
  <li>Multi-image Upload: Upload multiple screenshots at once for batch processing.</li>
  <li>Save & Manage Notes: Automatically saves generated notes for each user; accessible anytime via a sidebar interface.</li>
  <li>Secure Authentication: Google Sign-In with Passport.js + JWT + Sessions for secure and smooth login.</li>
  <li>Export as PDF: Download your AI-generated notes in PDF format using react-pdf / jspdf.</li>
  <li>Auto Cleanup: Backend script cleans up uploaded files after processing.</li>
  <li>Dark/Light Mode: Toggle theme based on system preference and save it via localStorage.</li>
</ul>

<h2>🧱 Tech Stack</h2>

<ul>
  <li><strong>Frontend:</strong>
    <ul>
      <li>React + Vite</li>
      <li>Tailwind CSS for styling</li>
      <li>ShadCN/UI for sleek components</li>
    </ul>
  </li>
  <li><strong>Backend:</strong>
    <ul>
      <li>Node.js + Express.js</li>
      <li>MongoDB</li>
      <li>JWT with HTTP-only cookies for secure authentication</li>
      <li>Passport.js (Google OAuth)</li>
      <li>Gemini/OpenAI Vision API for image summarization</li>
    </ul>
  </li>
</ul>

<h2>📸 How It Works</h2>
<ol>
  <li>Sign in with Google.</li>
  <li>Upload screenshots (JPG, PNG, etc.).</li>
  <li>AI reads and summarizes content.</li>
  <li>View, manage, and export your notes.</li>
</ol>
