import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Listing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  return (
    <main className="listing-content">
      {/* Listing heading */}
      <section className="listing-header">
        <div>
          <h1>{listing.name}</h1>

          <div className="listing-meta">
            <span className="listing-rating">
              ★ {averageRating > 0 ? averageRating.toFixed(1) : "New"}
            </span>
            <span>{reviews.length} reviews</span>
          </div>
        </div>

        {listing.owner && (
          <div className="listing-host">
            {listing.owner.profileImage && (
              <img
                src={listing.owner.profileImage}
                alt="Host"
                className="host-image"
              />
            )}

            <div>
              <span className="host-label">Hosted by</span>
              <strong>
                {listing.owner.firstName} {listing.owner.lastName}
              </strong>
            </div>
          </div>
        )}
      </section>

      {/* Photo gallery */}
      {images.length > 0 && (
        <section className="listing-gallery">
          {images.slice(0, 5).map((image, index) => (
            <div className="gallery-image" key={index}>
              <img src={image} alt={`${listing.name} - Photo ${index + 1}`} />
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
        </section>

        <aside className="listing-price-card">
          <span className="price-label">Price per night</span>
          <p className="listing-price">
            ${Number(listing.price).toLocaleString()}
            <span> / night</span>
          </p>
        </aside>
      </div>

      {/* Reviews */}
      <section className="listing-reviews">
        <div className="section-heading">
          <h2>Guest reviews</h2>
          {reviews.length > 0 && (
            <span className="review-summary">
              ★ {averageRating.toFixed(1)} · {reviews.length} reviews
            </span>
          )}
        </div>

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
