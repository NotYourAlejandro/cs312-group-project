const express = require("express");
const app = express();
import { Client, Pool } from "pg";

// auth libraries
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";

const port = 5000;

// db vars
const PG_HOST     = "127.0.0.1";
const PG_PORT     = 5432;
const PG_DATABASE = process.env.PG_DATABASE;
const PG_USER     = process.env.PG_USER;
const PG_PASSWORD = process.env.PG_PASSWORD;

// db setup
// const db = new Client({
//   host: PG_HOST,
//   port: PG_PORT,
//   database: PG_DATABASE,
//   user: PG_USER,
//   password: PG_PASSWORD,
// });
// await db.connect();

// make a pool just to store auth session data
// const sessionPool = new Pool({
//   host: PG_HOST,
//   port: PG_PORT,
//   database: PG_DATABASE,
//   user: PG_USER,
//   password: PG_PASSWORD,
// });
// const PgSessionStore = connectPgSimple(session);
// const sessionSecret = "superSecretSecret";

// middleware setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
//   store: new PgSessionStore({ pool: sessionPool, createTableIfMissing: true }),
//   secret: sessionSecret,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" },
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });

// // setup passport's local strategy
// passport.use(new Strategy(async (username, password, cb) => {
//   try {
//     const users = await db.query(
//       "SELECT uid, name, password FROM users WHERE name = $1",
//       [username]
//     );
//     const user = users.rows[0];
// 
//     // check if user exists and password is right
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return cb(null, false);
//     }
// 
// 
//     if (bcrypt.getRounds(user.password) !== 10) {
//       const passwordHash = await bcrypt.hash(password, 10);
//       await db.query("UPDATE users SET password = $1 WHERE uid = $2", [passwordHash, user.uid]);
//     }
//     return cb(null, { uid: user.uid, name: user.name });
//   } catch (error) {
//     return cb(error);
//   }
// }));
// 
// passport.serializeUser((user, done) => done(null, user.uid));
// passport.deserializeUser(async (uid, done) => {
//   try {
//     const result = await db.query("SELECT uid, name FROM users WHERE uid = $1", [uid]);
//     done(null, result.rows[0] || false);
//   } catch (error) {
//     done(error);
//   }
// });

// ----------------------------- //

// MOCK DATA PREP //

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
listings = [
  {
    id: 1,
    authorId: 1,
    name: "Test Listing 1",
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
        content: "I had a wonderful experience staying at this listing. Highly recommend!"
      }
    ]
  },
  {
    id: 2,
    authorId: 2,
    name: "Test Listing 2",
    description: "This is ALSO a test listing.",
    price: 100,
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/151",
    ],
    reviews: [
      {
        authorId: 1,
        rating: 2,
        title: "Everything was okay, until I found a rat",
        content: "I was having a jolly good time with my friends, but that was until we smelled something strange. My family and I searched all around for the smell, and we eventually found it behind the fridge. It stunk like nothing I've ever experienced, and it ruined our evening."
      }
    ]
  }
];

// LISTINGS API //

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
