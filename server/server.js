// core libraries
const express = require('express')
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

users = [
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
    lastName: "Doodleloo",
    email: "jane.doodleloo@example.com",
    passwordHash: "hashed_password_2",
    profileImage: "https://via.placeholder.com/150",
    listings: [1],
  }

]

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
    reviews: [
      {
        authorId: 2,
        rating: 5,
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
