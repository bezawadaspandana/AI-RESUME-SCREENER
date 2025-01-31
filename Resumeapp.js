import React, { useState } from "react";
import axios from "axios";

function Resumeapp() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [matchScore, setMatchScore] = useState(null);

  const handleResumeChange = (event) => {
    setResume(event.target.files[0]);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSkills(response.data.extracted_skills);
      setMatchScore(response.data.match_score);
    } catch (error) {
      console.error("Error uploading the resume:", error);
    }
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col justify-center items-center py-10">
      <h1 className="text-center text-4xl font-bold text-gray-800 mb-8">
        AI Resume Screener
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl"
      >
        <div className="mb-6">
          <label
            htmlFor="resume"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf"
            onChange={handleResumeChange}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="job_description"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Job Description
          </label>
          <textarea
            id="job_description"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Enter the job description"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          Submit
        </button>
      </form>

      {/* Display extracted skills */}
      {skills.length > 0 && (
        <div className="mt-10 w-full max-w-2xl bg-white p-6 shadow-xl rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">Extracted Skills:</h2>
          <ul className="mt-4 space-y-2">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="bg-gray-200 p-3 rounded-lg text-gray-700 font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display match score */}
      {matchScore !== null && (
        <div className="mt-5 w-full max-w-2xl bg-white p-6 shadow-xl rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            Match Score: {matchScore}%
          </h2>
        </div>
      )}
    </div>
  );
}

export default Resumeapp;
