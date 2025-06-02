export default async function handler(req, res) {
  const { user, course, date } = req.query;

  if (!user || !course || !date) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const pdfmonkeyKey = process.env.PDFMONKEY_API_KEY;

  const response = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${pdfmonkeyKey}`
    },
    body: JSON.stringify({
      document: {
        document_template_id: "b79ce507-21fc-4955-9cdb-88b3fdd79cf9",
        payload: {
          student_name: user,
          course_name: course,
          completion_date: date,
          instructor_name: "Jane Smith",
          organization_name: "Your Organization"
        }
      }
    })
  });

  const result = await response.json();

  // ✅ Redirect to the preview URL
  if (result.document?.preview_url) {
    return res.redirect(result.document.preview_url);
  }

  // Optional fallback
  if (result.document?.download_url) {
    return res.redirect(result.document.download_url);
  }

  return res.status(500).json({ error: "Failed to generate document", details: result });
}
