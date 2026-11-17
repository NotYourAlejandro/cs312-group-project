import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ListingGrid from "../components/ListingGrid";

function Profile({ user: fallbackUser }) {
  const { id } = useParams();
  const [user, setUser] = useState(fallbackUser || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetId = id ? Number(id) : fallbackUser?.id || 1;

    fetch(`/api/users/${targetId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load profile.");
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(fallbackUser || null))
      .finally(() => setLoading(false));
  }, [fallbackUser, id]);

  const averageRating = useMemo(() => {
    if (!user || !user.listings) {
      return 0;
    }

    const snapshot = user.listings.map((listing) => listing.rating ?? 0);
    if (!snapshot.length) {
      return 0;
    }

    return snapshot.reduce((sum, rating) => sum + rating, 0) / snapshot.length;
  }, [user]);

  if (loading) {
    return <main className="profile-page"><div className="profile-state">Loading profile...</div></main>;
  }

  if (!user) {
    return <main className="profile-page"><div className="profile-state">Profile not found.</div></main>;
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-image-column">
          <img className="profile-avatar" src={user.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"} alt={`${user.firstName} ${user.lastName}`} />
        </div>

        <div className="profile-content">
          <div className="profile-header-row">
            <h1>{user.firstName} {user.lastName}</h1>
            <div className="profile-score">
              <span>★</span>
              <strong>{averageRating ? averageRating.toFixed(1) : "5.0"}</strong>
            </div>
          </div>

          <p className="profile-city">{user.city || "Remote host"}</p>
          <p className="profile-bio">{user.bio || "This host is new to StayFinder."}</p>

        </div>
      </section>

      <section className="profile-listings">
        <div className="section-heading">
          <h2>{user.firstName}'s listings</h2>
        </div>

        <ListingGrid listings={user.listings || []} showAmenities={false} className="profile-listings-grid" />
      </section>
    </main>
  );
}

export default Profile;