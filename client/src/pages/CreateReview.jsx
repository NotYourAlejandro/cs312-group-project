import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CreateReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    rating: 0,
    hostRating: 0,
    amenityRatings: {},
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${id}`);

        if (!response.ok) {
          throw new Error("Could not load listing.");
        }

        const data = await response.json();
        setListing(data);

        const amenityRatings = {};
        (data.amenities || []).forEach((amenity) => {
          amenityRatings[amenity] = 0;
        });

        setFormData((previous) => ({
          ...previous,
          amenityRatings,
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAmenityRating = (amenity, rating) => {
    setFormData((previous) => ({
      ...previous,
      amenityRatings: {
        ...previous.amenityRatings,
        [amenity]: rating,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (formData.rating === 0 || formData.hostRating === 0) {
      setError("Please rate both the property and the host.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/listings/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorId: 1,
          rating: Number(formData.rating),
          hostRating: Number(formData.hostRating),

          // Only submit amenities that received a rating
          amenityRatings: Object.fromEntries(
            Object.entries(formData.amenityRatings)
              .filter(([amenity, rating]) => rating > 0)
              .map(([amenity, rating]) => [amenity, Number(rating)]),
          ),

          title: formData.title,
          content: formData.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (selectedRating, onRate) => (
    <div className="review-rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= selectedRating ? "star selected" : "star"}
          onClick={() => onRate(star)}
          aria-label={`Rate ${star} out of 5`}
          aria-pressed={star === selectedRating}
        >
          ★
        </button>
      ))}
    </div>
  );

  if (loading) {
    return <main className="listing-message">Loading listing...</main>;
  }

  if (error && !listing) {
    return <main className="listing-message">Error: {error}</main>;
  }

  if (!listing) {
    return <main className="listing-message">Listing not found.</main>;
  }

  return (
    <main className="create-review-page">
      <div className="create-review-container">
        <div className="create-review-heading">
          <h1>Write a Review</h1>
          <p>Share your experience at {listing.name}.</p>
        </div>

        <form onSubmit={handleSubmit} className="create-review-form">
          {error && <p className="create-review-error">{error}</p>}

          <section className="review-form-section">
            <h2>Rate the Property</h2>
            <p>How would you rate your overall experience?</p>

            {renderStars(formData.rating, (rating) =>
              setFormData((previous) => ({ ...previous, rating })),
            )}
          </section>

          <section className="review-form-section">
            <h2>Rate the Host</h2>
            <p>How was your experience with the property owner?</p>

            {renderStars(formData.hostRating, (hostRating) =>
              setFormData((previous) => ({ ...previous, hostRating })),
            )}
          </section>

          <section className="review-form-section">
            <h2>Rate the Amenities</h2>
            <p>Rate the amenities available at this property.</p>

            {(listing.amenities || []).length === 0 ? (
              <p>No amenities have been listed for this property.</p>
            ) : (
              listing.amenities.map((amenity) => (
                <div className="amenity-review-row" key={amenity}>
                  <strong>{amenity}</strong>

                  {renderStars(
                    formData.amenityRatings[amenity] || 0,
                    (rating) => handleAmenityRating(amenity, rating),
                  )}
                </div>
              ))
            )}
          </section>

          <section className="review-form-section">
            <h2>Write Your Review</h2>

            <div className="review-form-group">
              <label htmlFor="title">Review Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div className="review-form-group">
              <label htmlFor="content">Your Review</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Tell others about your experience..."
                rows="5"
                required
              />
            </div>
          </section>

          <button
            type="submit"
            className="create-review-button"
            disabled={submitting}
          >
            {submitting ? "Submitting Review..." : "Submit Review"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateReview;
