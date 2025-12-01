import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiLogOut, FiUser } from "react-icons/fi";
import logo from "../assets/ScoreSaga Logo.png";

const sportsTabs = [
  { label: "Cricket", value: "CRICKET" },
  { label: "Football", value: "FOOTBALL" },
];

const leagueByTeams = (home, away) => {
  const pair = `${home} vs ${away}`.toLowerCase();
  if (pair.includes("barcelona") || pair.includes("madrid") || pair.includes("sevilla")) return "La Liga";
  if (pair.includes("arsenal") || pair.includes("liverpool") || pair.includes("chelsea") || pair.includes("city"))
    return "Premier League";
  if (pair.includes("csk") || pair.includes("mi") || pair.includes("rcb")) return "IPL";
  if (pair.includes("india") || pair.includes("pakistan") || pair.includes("england") || pair.includes("australia"))
    return "International";
  return "Club";
};

const formatTime = (iso) => {
  const dt = new Date(iso);
  return dt.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
};

export default function Home() {
  const [activeSport, setActiveSport] = useState("CRICKET");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ScoreSaga | Home";
  }, []);

  const initials = useMemo(() => {
    if (profile?.email) return profile.email.charAt(0).toUpperCase();
    return "U";
  }, [profile]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        setProfile(res.data);
      } catch {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const res = await api.get("/matches", {
          params: { sport: activeSport, status: "UPCOMING" },
        });
        setMatches(res.data || []);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, [activeSport]);

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* App bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="ScoreSaga logo" className="h-10 w-auto" />
            <p className="text-sm font-semibold text-slate-900">ScoreSaga</p>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4 text-sm text-slate-700">
              <Link to="/contests" className="hover:text-slate-900 transition">Contests</Link>
              <Link to="/my-contests" className="hover:text-slate-900 transition">My Contests</Link>
              <Link to="/leagues" className="hover:text-slate-900 transition">Leagues</Link>
            </nav>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Profile"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                {initials}
              </span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
        {/* Page heading + tabs */}
        <section className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              See what’s next.
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Browse upcoming fixtures, switch between cricket and football,
              and plan your fantasy picks before lock.
            </p>
          </div>

          <nav
            aria-label="Select sport"
            className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm"
          >
            {sportsTabs.map((tab) => {
              const isActive = activeSport === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveSport(tab.value)}
                  className={[
                    "relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                    isActive
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </section>

        {/* Fixtures card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Fixtures
              </p>
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Upcoming {activeSport === "CRICKET" ? "cricket" : "football"} fixtures
              </h2>
            </div>
            {loading && (
              <p className="text-xs font-medium text-slate-500">
                Updating live…
              </p>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && matches.length === 0 && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded-full bg-slate-200" />
                    <div className="h-4 w-40 rounded-full bg-slate-200" />
                    <div className="h-3 w-32 rounded-full bg-slate-200" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          )}

          {/* Fixtures list */}
          {!loading && matches.length > 0 && (
            <ul className="space-y-3">
              {matches.map((m) => (
                <li
                  key={m.id}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/60"
                >
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {leagueByTeams(m.homeTeam, m.awayTeam)}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 sm:text-base">
                      {m.homeTeam}{" "}
                      <span className="text-slate-500">vs</span> {m.awayTeam}
                    </p>
                    <p className="text-xs text-slate-600">
                      {formatTime(m.startTime)}
                    </p>
                  </div>
                  <span className="whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                    {m.status}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Empty state */}
          {!loading && matches.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
              <p className="text-sm font-semibold text-slate-800">
                No fixtures yet.
              </p>
              <p className="max-w-xs text-xs text-slate-500">
                When new {activeSport.toLowerCase()} fixtures are scheduled,
                they’ll appear here with kickoff times and status.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
