import { Link } from "react-router-dom";

function ListingGrid({ listings = [], showAmenities = true, className = "" }) {
  return (
    <div className={`listings-grid ${className}`.trim()}>
      {listings.map((listing) => (
        <Link to={`/listings/${listing.id}`} className="listing-card" key={listing.id}>
          <div className="listing-card-image">
            <img
              src={
                (listing.images && listing.images[0]) ||
                "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
              }
              alt={listing.name}
            />
          </div>

          <div className="listing-card-body">
            <div className="listing-card-top">
              <h2>{listing.name}</h2>
              <span className="listing-price">${listing.price}/night</span>
            </div>

            <p className="listing-location">{listing.location}</p>
            <p className="listing-description">{listing.description}</p>

            {showAmenities && (
              <div className="listing-amenities">
                {(listing.amenities || []).slice(0, 3).map((amenity) => (
                  <span key={`${listing.id}-${amenity}`}>{amenity}</span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ListingGrid;
