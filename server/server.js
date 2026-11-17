const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

const users = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    passwordHash: "hashed_password_1",
    profileImage: "https://via.placeholder.com/150",
    listings: [1],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Roe",
    email: "jane.roe@example.com",
    passwordHash: "hashed_password_",
    profileImage: "https://via.placeholder.com/153",
    listings: [],
  },
];

// TODO: createplaceholder listing
let listings = [
  {
    id: 1,
    authorId: 1,
    name: "Test Listing",
    description: "This is a test listing.",
    price: 100,
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/151",
    ],
    amenities: ["Wi-Fi", "Pool", "Parking"],
    reviews: [
      {
        authorId: 2,
        rating: 5,
        hostRating: 4,
        amenityRatings: {
          "Wi-Fi": 5,
          Pool: 4,
          Parking: 3,
        },
        title: "Great listing!",
        content:
          "I had a wonderful experience staying at this listing. Highly recommend!",
      },
    ],
  },
];

app.get("/api/listings", async (req, res) => {
  console.log(listings);
  res.json(listings);
});

app.post("/api/listings", (req, res) => {
  const { authorId, name, description, price, images, amenities } = req.body;

  // Validate the required fields
  if (
    !Number.isInteger(authorId) ||
    !name?.trim() ||
    !description?.trim() ||
    !Number.isFinite(Number(price)) ||
    Number(price) <= 0
  ) {
    return res.status(400).json({
      error: "Please provide valid listing information.",
    });
  }

  // Make sure the user exists
  const owner = users.find((user) => user.id === authorId);

  if (!owner) {
    return res.status(404).json({
      error: "User not found.",
    });
  }

  // Validate optional arrays
  if (
    (images !== undefined &&
      (!Array.isArray(images) ||
        !images.every((image) => typeof image === "string"))) ||
    (amenities !== undefined &&
      (!Array.isArray(amenities) ||
        !amenities.every((amenity) => typeof amenity === "string")))
  ) {
    return res.status(400).json({
      error: "Images and amenities must be arrays of strings.",
    });
  }

  // Create the new listing
  const newListing = {
    id:
      listings.length > 0
        ? Math.max(...listings.map((listing) => listing.id)) + 1
        : 1,
    authorId,
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    images: images || [],
    amenities: amenities || [],
    reviews: [],
  };

  listings.push(newListing);

  // Update the owner's listings
  owner.listings.push(newListing.id);

  res.status(201).json({
    message: "Listing created successfully.",
    listing: newListing,
  });
});

app.get("/api/listings/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Invalid listing ID.",
      });
    }

    const listing = listings.find((item) => item.id === id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found.",
      });
    }

    const owner = users.find((user) => user.id === listing.authorId);

    const ratingSummary = calculateRatingSummary(listing);

    res.json({
      ...listing,
      owner: owner
        ? {
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            profileImage: owner.profileImage,
          }
        : null,
      ratingSummary,
    });
  } catch (error) {
    console.error("Error fetching listing:", error);

    res.status(500).json({
      error: "Failed to fetch listing.",
    });
  }
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
    listing.id != id;
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

app.post("/api/listings/:id/reviews", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid listing ID.",
    });
  }

  const listing = listings.find((item) => item.id === id);

  if (!listing) {
    return res.status(404).json({
      error: "Listing not found.",
    });
  }

  const { authorId, rating, hostRating, amenityRatings, title, content } =
    req.body;

  if (!Number.isInteger(authorId) || authorId <= 0) {
    return res.status(400).json({
      error: "A valid author ID is required.",
    });
  }

  const reviewer = users.find((user) => user.id === authorId);

  if (!reviewer) {
    return res.status(404).json({
      error: "User not found.",
    });
  }

  const existingReview = listing.reviews.find(
    (review) => review.authorId === authorId,
  );

  if (existingReview) {
    return res.status(409).json({
      error: "You have already reviewed this listing.",
    });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      error: "Property rating must be between 1 and 5.",
    });
  }

  if (!Number.isInteger(hostRating) || hostRating < 1 || hostRating > 5) {
    return res.status(400).json({
      error: "Host rating must be between 1 and 5.",
    });
  }

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof content !== "string" ||
    !content.trim()
  ) {
    return res.status(400).json({
      error: "Review title and content are required.",
    });
  }

  const ratings = amenityRatings ?? {};

  if (
    typeof ratings !== "object" ||
    ratings === null ||
    Array.isArray(ratings)
  ) {
    return res.status(400).json({
      error: "Amenity ratings must be an object.",
    });
  }

  for (const [amenity, amenityRating] of Object.entries(ratings)) {
    if (!listing.amenities.includes(amenity)) {
      return res.status(400).json({
        error: `${amenity} is not an amenity offered by this listing.`,
      });
    }

    if (
      !Number.isInteger(amenityRating) ||
      amenityRating < 1 ||
      amenityRating > 5
    ) {
      return res.status(400).json({
        error: `Rating for ${amenity} must be between 1 and 5.`,
      });
    }
  }

  const newReview = {
    authorId,
    rating,
    hostRating,
    amenityRatings: ratings,
    title: title.trim(),
    content: content.trim(),
  };

  listing.reviews.push(newReview);

  res.status(201).json({
    message: "Review submitted successfully.",
    review: newReview,
  });
});

function calculateAverage(ratings) {
  if (ratings.length === 0) {
    return null;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);

  return Number((total / ratings.length).toFixed(1));
}

function calculateRatingSummary(listing) {
  const reviews = listing.reviews || [];

  const propertyRating = calculateAverage(
    reviews.map((review) => review.rating),
  );

  const hostListings = listings.filter(
    (item) => item.authorId === listing.authorId,
  );

  const hostRatings = hostListings.flatMap((item) =>
    (item.reviews || [])
      .map((review) => review.hostRating)
      .filter((rating) => Number.isInteger(rating)),
  );

  const hostRating = calculateAverage(hostRatings);

  const amenityRatings = {};

  for (const amenity of listing.amenities || []) {
    const ratings = reviews
      .filter((review) => review.amenityRatings?.[amenity] !== undefined)
      .map((review) => review.amenityRatings[amenity]);

    amenityRatings[amenity] = calculateAverage(ratings);
  }

  return {
    propertyRating,
    hostRating,
    amenityRatings,
  };
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
