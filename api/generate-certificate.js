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
          name: user,
          course: course,
          date: date
        }
      }
    })
  });

  const result = await response.json();

  // ✅ Redirect to preview_url if available
  if (result.document && result.document.preview_url) {
    return res.redirect(result.document.preview_url);
  } else {
    return res.status(500).json({ error: "Failed to generate document", details: result });
  }
}
