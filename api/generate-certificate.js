export default async function handler(req, res) {
  const { user, course, date } = req.query;

  if (!user || !course || !date) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const pdfmonkeyKey = process.env.PDFMONKEY_API_KEY;

  try {
    const response = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${pdfmonkeyKey}`
      },
      body: JSON.stringify({
        document: {
          document_template_id: "b79ce507-21fc-4955-9cdb-88b3fdd79cf9",
          payload: JSON.stringify({
            student_name: user,
            course_name: course,
            completion_date: date,
            instructor_name: "Jane Smith",           // Replace or make dynamic if needed
            organization_name: "Your Organization"   // Replace or make dynamic if needed
          })
        }
      })
    });

    const result = await response.json();

    if (result.document && result.document.download_url) {
      // Redirect to the generated PDF file
      return res.redirect(result.document.download_url);
    } else {
      // Return the full API result for debugging
      return res.status(500).json({
        error: "Failed to generate document",
        details: result
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "An unexpected error occurred",
      message: error.message
    });
  }
}
