const express = require("express");

const app = express();
const port = 5000;

const users = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    bio: "Weekend host and avid traveler who loves helping guests discover the city.",
    city: "Portland",
    listings: [1, 3],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Roe",
    email: "jane.roe@example.com",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    bio: "Design-minded host with a love for cozy stays and local food spots.",
    city: "Seattle",
    listings: [2],
  },
  {
    id: 3,
    firstName: "Alicia",
    lastName: "Nguyen",
    email: "alicia@example.com",
    profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
    bio: "Host and photographer capturing the best corners of the city.",
    city: "Austin",
    listings: [4],
  },
];

let listings = [
  {
    id: 1,
    authorId: 1,
    name: "Modern Downtown Loft",
    description: "A bright downtown loft with a full kitchen, rooftop access, and walking distance to all the best restaurants.",
    price: 180,
    location: "Portland, OR",
    phone_number: "(503) 555-0121",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Wi-Fi", "Kitchen", "Parking", "Gym"],
    reviews: [
      {
        authorId: 2,
        rating: 5,
        hostRating: 4,
        amenityRatings: { "Wi-Fi": 5, Kitchen: 4, Parking: 3, Gym: 4 },
        title: "Lovely stay",
        content: "The apartment was clean, bright, and a perfect base for exploring the city.",
      },
    ],
  },
  {
    id: 2,
    authorId: 2,
    name: "Lakefront Cabin Retreat",
    description: "A cozy cabin near the water with a deck, fireplace, and sunset views over the lake.",
    price: 220,
    location: "Seattle, WA",
    phone_number: "(206) 555-0198",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Fireplace", "Lake view", "Workspace", "Wi-Fi"],
    reviews: [
      {
        authorId: 1,
        rating: 4,
        hostRating: 5,
        amenityRatings: { "Wi-Fi": 4, "Lake view": 5, Workspace: 5 },
        title: "Peaceful and comfortable",
        content: "The place felt calm, stylish, and perfectly suited for a weekend away.",
      },
    ],
  },
  {
    id: 3,
    authorId: 1,
    name: "Garden Studio",
    description: "A private studio tucked behind a garden with a soaking tub and balcony seating.",
    price: 140,
    location: "Portland, OR",
    phone_number: "(503) 555-0137",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Private bath", "Patio", "Wi-Fi", "Laundry"],
    reviews: [],
  },
  {
    id: 4,
    authorId: 3,
    name: "Sunset Rooftop Escape",
    description: "A stylish rooftop apartment with city views, a bar cart, and tune-ready sound system.",
    price: 210,
    location: "Austin, TX",
    phone_number: "(512) 555-0104",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Rooftop", "Wi-Fi", "Coffee bar", "Parking"],
    reviews: [],
  },
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function calculateAverage(ratings) {
  if (!ratings.length) return null;
  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Number((total / ratings.length).toFixed(1));
}

function calculateRatingSummary(listing) {
  const reviews = listing.reviews || [];
  const propertyRating = calculateAverage(reviews.map((review) => review.rating));
  const hostListings = listings.filter((item) => item.authorId === listing.authorId);
  const hostRatings = hostListings.flatMap((item) =>
    (item.reviews || []).map((review) => review.hostRating).filter((rating) => Number.isInteger(rating)),
  );

  const hostRating = calculateAverage(hostRatings);
  const amenityRatings = {};

  for (const amenity of listing.amenities || []) {
    const ratings = reviews
      .filter((review) => review.amenityRatings?.[amenity] !== undefined)
      .map((review) => review.amenityRatings[amenity]);
    amenityRatings[amenity] = calculateAverage(ratings);
  }

  return { propertyRating, hostRating, amenityRatings };
}

function serializeUser(user) {
  const userListings = listings.filter((listing) => listing.authorId === user.id);
  const ratings = userListings.flatMap((listing) =>
    (listing.reviews || []).map((review) => review.hostRating).filter((rating) => Number.isInteger(rating)),
  );

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileImage: user.profileImage,
    bio: user.bio,
    city: user.city,
    listings: userListings.map((listing) => ({
      id: listing.id,
      name: listing.name,
      price: listing.price,
      location: listing.location,
      description: listing.description,
      images: listing.images || [],
      amenities: listing.amenities || [],
    })),
    rating: calculateAverage(ratings) ?? 0,
  };
}

app.get("/api/listings", (req, res) => {
  res.json(listings);
});

app.post("/api/listings", (req, res) => {
  const { authorId, name, description, price, images, amenities, location, phone_number } = req.body;

  if (!Number.isInteger(authorId) || !name?.trim() || !description?.trim() || !Number.isFinite(Number(price)) || Number(price) <= 0) {
    return res.status(400).json({ error: "Please provide valid listing information." });
  }

  const owner = users.find((user) => user.id === authorId);
  if (!owner) {
    return res.status(404).json({ error: "User not found." });
  }

  if (images !== undefined && (!Array.isArray(images) || !images.every((image) => typeof image === "string"))) {
    return res.status(400).json({ error: "Images must be an array of strings." });
  }

  if (amenities !== undefined && (!Array.isArray(amenities) || !amenities.every((amenity) => typeof amenity === "string"))) {
    return res.status(400).json({ error: "Amenities must be an array of strings." });
  }

  const newListing = {
    id: listings.length > 0 ? Math.max(...listings.map((listing) => listing.id)) + 1 : 1,
    authorId,
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    location: location || "Unknown location",
    phone_number: phone_number || "",
    images: images || [],
    amenities: amenities || [],
    reviews: [],
  };

  listings.push(newListing);
  owner.listings = owner.listings || [];
  owner.listings.push(newListing.id);

  res.status(201).json({ message: "Listing created successfully.", listing: newListing });
});

app.get("/api/listings/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid listing ID." });
  }

  const listing = listings.find((item) => item.id === id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found." });
  }

  const owner = users.find((user) => user.id === listing.authorId);

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
    ratingSummary: calculateRatingSummary(listing),
  });
});

app.get("/api/users", (req, res) => {
  res.json(users.map(serializeUser));
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid user ID.",
      message: "Please provide a valid user ID.",
    });
  }

  const user = users.find((member) => member.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json(serializeUser(user));
});

app.post("/api/listings/:id/reviews", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid listing ID." });
  }

  const listing = listings.find((item) => item.id === id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found." });
  }

  const { authorId, rating, hostRating, amenityRatings, title, content } = req.body;

  if (!Number.isInteger(authorId) || authorId <= 0) {
    return res.status(400).json({ error: "A valid author ID is required." });
  }

  const reviewer = users.find((user) => user.id === authorId);
  if (!reviewer) {
    return res.status(404).json({ error: "User not found." });
  }

  if (listing.reviews.some((review) => review.authorId === authorId)) {
    return res.status(409).json({ error: "You have already reviewed this listing." });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Property rating must be between 1 and 5." });
  }

  if (!Number.isInteger(hostRating) || hostRating < 1 || hostRating > 5) {
    return res.status(400).json({ error: "Host rating must be between 1 and 5." });
  }

  if (typeof title !== "string" || !title.trim() || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Review title and content are required." });
  }

  const ratings = amenityRatings ?? {};
  if (typeof ratings !== "object" || ratings === null || Array.isArray(ratings)) {
    return res.status(400).json({ error: "Amenity ratings must be an object." });
  }

  for (const [amenity, amenityRating] of Object.entries(ratings)) {
    if (!listing.amenities.includes(amenity)) {
      return res.status(400).json({ error: `${amenity} is not an amenity offered by this listing.` });
    }

    if (!Number.isInteger(amenityRating) || amenityRating < 1 || amenityRating > 5) {
      return res.status(400).json({ error: `Rating for ${amenity} must be between 1 and 5.` });
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

  res.status(201).json({ message: "Review submitted successfully.", review: newReview });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
