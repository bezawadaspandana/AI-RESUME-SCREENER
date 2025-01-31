const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");

const app = express();
const upload = multer();

app.use(cors()); 
app.use(express.json()); 

const skillsList = [
  "python", "java", "react", "sql", "machine learning", 
  "power bi", "flask", "nlp", "node.js", "express","mongodb","data science","full stack developer","web developer","frontend developer","backend developer",
];
const extractSkills = (resumeText) => {
  resumeText = resumeText.toLowerCase();
  return skillsList.filter(skill => resumeText.includes(skill));
};

const calculateMatchScore = (resumeText, jobDescription) => {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);
  const commonSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
  const matchScore = (commonSkills.length / jobSkills.length) * 100; 
  return matchScore.toFixed(2);
};
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    const jobDescription = req.body.job_description || "";
    const pdfText = await pdfParse(req.file.buffer);
    const resumeText = pdfText.text;

    const extractedSkills = extractSkills(resumeText);
    const matchScore = calculateMatchScore(resumeText, jobDescription);

    res.json({
      extracted_skills: extractedSkills,
      match_score: matchScore
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing resume" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
