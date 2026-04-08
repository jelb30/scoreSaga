import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/ScoreSaga Logo.png";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ScoreSaga | Profile";
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/user/profile");
        setProfile(res.data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const initials = profile?.email ? profile.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ScoreSaga logo" className="h-10 w-auto" />
            <h1 className="text-lg font-semibold text-slate-900">Profile</h1>
          </div>
          <button
            onClick={() => navigate("/home")}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Back to home
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white">
              {initials}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-900">{profile?.email || "Guest"}</h2>
              <p className="text-sm text-slate-500">{profile?.role || "Unauthenticated"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard label="Email" value={profile?.email || "Not available"} />
            <InfoCard label="Role" value={profile?.role || "Not available"} />
            <InfoCard label="Username" value={profile?.username || "Not available"} />
            <InfoCard label="Status" value={profile?.status || "Not available"} />
            <InfoCard label="First Name" value={profile?.firstName || "Not available"} />
            <InfoCard label="Last Name" value={profile?.lastName || "Not available"} />
            <InfoCard label="Joined At" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Not available"} />
          </div>

          {loading && <p className="mt-4 text-sm text-slate-500">Loading profile...</p>}
        </div>
      </main>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
