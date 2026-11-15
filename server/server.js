const express = require('express')
const app = express();
const port = 5000;

app.use(express.json());

users = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    passwordHash: "hashed_password_1",
    profileImage: "https://via.placeholder.com/150",
    listings: [1],
  }
]

// TODO: createplaceholder listing
listings = [{
  id: 1,
  authorId: 1,
  name: "Test Listing",
  description: "This is a test listing.",
  price: 100,
  images: [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/151",
  ],
  reviews: [
    {
      authorId: 2,
      rating: 5,
      title: "Great listing!",
      content: "I had a wonderful experience staying at this listing. Highly recommend!"
    }
  ]
}];

// LISTINGS API //

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

// USERS API //

app.get("/api/users", async (req, res) => {
  res.json(users);
});

app.get("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid user ID.",
      message: "Please provide a valid user ID.",
    });
  }

  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({
      error: "User not found.",
    });
  }

  res.json(user);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
