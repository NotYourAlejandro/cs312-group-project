import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function Listing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${id}`);

        if (!response.ok) {
          throw new Error(`Error fetching listing: ${response.statusText}`);
        }

        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <main className="listing-message">Loading listing...</main>;
  }

  if (error) {
    return <main className="listing-message">Error: {error}</main>;
  }

  if (!listing) {
    return <main className="listing-message">Listing not found.</main>;
  }

  const reviews = listing.reviews || [];
  const images = listing.images || [];

  // Get the rating averages calculated by the backend
  const ratingSummary = listing.ratingSummary || {};
  const propertyRating = ratingSummary.propertyRating;
  const hostRating = ratingSummary.hostRating;
  const amenityRatings = ratingSummary.amenityRatings || {};

  return (
    <main className="listing-content">
      {/* Listing heading */}
      <section className="listing-header">
        <div>
          <h1>{listing.name}</h1>

          <div className="listing-meta">
            <span className="listing-rating">
              ★ {propertyRating != null ? propertyRating.toFixed(1) : "New"}
            </span>
            <span>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
            <div className="description-actions">
              {listing.phone_number && (
                <a
                  href={`tel:${listing.phone_number}`}
                  className="listing-phone"
                  aria-label={`Call ${listing.phone_number}`}
                >
                  <svg
                    className="phone-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M6.6 10.8c1.8 3.5 4.7 6.4 8.2 8.2l2.7-2.7c.3-.3.8-.4 1.2-.3 1.3.4 2.7.6 4.2.6.7 0 1.2.5 1.2 1.2V21c0 .7-.5 1.2-1.2 1.2C11.1 22.2 1.8 12.9 1.8 3.2c0-.7.5-1.2 1.2-1.2h3.1c.7 0 1.2.5 1.2 1.2 0 1.5.2 2.9.6 4.2.1.4 0 .9-.3 1.2l-2.7 2.7z"
                      fill="currentColor"
                    />
                  </svg>
                  {listing.phone_number}
                </a>
              )}
            </div>
          </div>
        </div>

        {listing.owner && (
          <Link to={`/profile/${listing.owner.id}`} className="listing-host">
            {listing.owner.profileImage && (
              <img
                src={listing.owner.profileImage}
                alt=""
                className="host-image"
              />
            )}

            <div>
              <span className="host-label">Hosted by</span>
              <strong>
                {listing.owner.firstName} {listing.owner.lastName}
              </strong>

              <span className="host-rating">
                ★ {hostRating != null ? hostRating.toFixed(1) : "Not rated yet"}
              </span>
            </div>
          </Link>
        )}
      </section>

      {/* Photo gallery */}
      {images.length > 0 && (
        <section className="listing-gallery">
          {images.slice(0, 5).map((image, index) => (
            <div className="gallery-image" key={index}>
              <img src={image} alt={`${listing.name} view ${index + 1}`} />
            </div>
          ))}
        </section>
      )}

      {/* Listing information */}
      <div className="listing-details">
        <section className="listing-description">
          <div className="section-heading">
            <h2>About this listing</h2>
          </div>

          <p>{listing.description}</p>

          <div className="card availability-card mt-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="availability-title mb-0">Schedule a Meeting</h3>
                <span className="badge text-bg-light">Calendar</span>
              </div>

              <input
                id="listing-date"
                type="date"
                className="form-control"
                aria-label="Choose a booking date"
                value={selectedDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setBookingConfirmed(false);
                }}
              />

              <div className="booking-actions mt-3">
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={!selectedDate}
                  onClick={() => setBookingConfirmed(true)}
                >
                  Book time
                </button>
                {bookingConfirmed && (
                  <span className="text-success fw-semibold" role="status" aria-live="polite">
                    Booking confirmed for {selectedDate}.
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="listing-price-card">
          <span className="price-label">Price per night</span>
          <p className="listing-price">
            <span className="listing-price-value">
              ${Number(listing.price).toLocaleString()}
            </span>
            <span> / night</span>
          </p>
        </aside>
      </div>

      {/* Amenity ratings */}
      <section className="listing-amenity-ratings">
        <div className="section-heading">
          <h2>Amenity ratings</h2>
        </div>

        {Object.entries(amenityRatings).length === 0 ? (
          <p>No amenity ratings available yet.</p>
        ) : (
          <div className="amenity-rating-grid">
            {Object.entries(amenityRatings).map(([amenity, rating]) => (
              <div className="amenity-rating" key={amenity}>
                <strong>{amenity}</strong>
                <span>
                  {rating != null ? `★ ${rating.toFixed(1)}` : "Not rated yet"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="listing-reviews">
        <div className="section-heading">
          <h2>Guest reviews</h2>
          {reviews.length > 0 && (
            <span className="review-summary">
              ★ {propertyRating != null ? propertyRating.toFixed(1) : "New"} ·{" "}
              {reviews.length} reviews
            </span>
          )}
        </div>
        <Link
          to={`/listings/${listing.id}/review`}
          className="write-review-button"
        >
          Write a Review
        </Link>

        {reviews.length === 0 ? (
          <p className="no-reviews">
            This listing doesn't have any reviews yet.
          </p>
        ) : (
          <div className="review-grid">
            {reviews.map((review, index) => (
              <article key={index} className="review">
                <div className="review-top">
                  <h3>{review.title}</h3>
                  <span className="review-stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(Math.max(0, 5 - review.rating))}
                  </span>
                </div>

                <p>{review.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Listing;
