const express = require('express')
const app = express();
const port = 5000;

app.use(express.json());

// TODO: createplaceholder listing
listings = [ "a", "b", "c" ];

app.get("/api/listings", async (req, res) => {
  console.log(listings);
  res.json(listings);
});

app.post("/api/listings", async (req, res) => {
  res.status(201).json({
    message: "Listing created successfully.",
    post: result.rows[0],
  });
});

app.get("/api/listings/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid listing ID.",
    });
  }

  res.json(listings.filter((item) => {
    item.id == id
  }));
});

app.put("/api/listings/:id", async (req, res) => {
  const id = Number(req.params.id);
  // const { title, content } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid listing ID.",
    });
  }

  //if (!title?.trim() || !content?.trim()) {
  //  return res.status(400).json({
  //    error: "Title and content are required.",
  //  });
  //}

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: "Blog post not found.",
    });
  }

  res.json(listings[id]);
});

app.delete("/api/listings/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid blog post ID.",
    });
  }

  listings = listings.filter((listing) => {
    listing.id != id
  });

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: "Blog post not found.",
    });
  }

  res.json({
    message: "Blog post deleted successfully.",
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
