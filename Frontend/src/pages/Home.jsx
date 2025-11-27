import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";

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
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const initials = useMemo(() => {
    if (profile?.email) return profile.email.charAt(0).toUpperCase();
    return "U";
  }, [profile]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        setProfile(res.data);
      } catch (e) {
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
      } catch (e) {
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
    <div className="min-h-screen bg-[#0a1f12] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/70 to-slate-900/80" />
        <div className="relative mx-auto max-w-6xl px-6 py-8 lg:py-10 space-y-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <span className="text-sm font-semibold">Profile</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-100/80">ScoreSaga</p>
                <h1 className="text-xl font-semibold text-white">Your fantasy home</h1>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowProfile((s) => !s)}
                className="flex items-center gap-2 rounded-full bg-white text-emerald-900 font-semibold px-4 py-2 shadow-lg"
              >
                <FiUser /> {profile?.email || "Guest"} <FiChevronDown />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white text-emerald-900 shadow-2xl p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold">{profile?.email || "Guest"}</p>
                      <p className="text-sm text-emerald-700">{profile?.role || "Unauthenticated"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link
                      to="/register"
                      className="flex-1 text-center rounded-full border border-emerald-600 text-emerald-800 py-2 hover:bg-emerald-50 transition"
                    >
                      Register
                    </Link>
                    <Link
                      to="/login"
                      className="flex-1 text-center rounded-full bg-[#b7ff3b] text-black font-semibold py-2 hover:brightness-95 transition"
                    >
                      Login
                    </Link>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-900 text-white py-2 hover:bg-emerald-800 transition"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-900/30">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/40">
                <span className="h-2 w-2 rounded-full bg-lime-300 animate-pulse" />
                Upcoming fixtures · Live-ready data
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mt-4">
                See what’s next in cricket and football.
              </h2>
              <p className="text-lg text-emerald-50/90 max-w-3xl mt-3">
                One home for your matches: fixtures, kickoff times, and leagues. Flip tabs, lock your picks, and never miss a whistle.
              </p>
              <div className="flex gap-3 mt-6">
                {sportsTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveSport(tab.value)}
                    className={`px-5 py-2 rounded-full font-semibold ${
                      activeSport === tab.value
                        ? "bg-[#b7ff3b] text-black"
                        : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    } transition`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl shadow-emerald-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-100/80">Your profile</p>
                  <h3 className="text-2xl font-semibold">Manage your account</h3>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-emerald-900/40 p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#b7ff3b] text-black font-bold flex items-center justify-center">
                  {initials}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{profile?.email || "Guest"}</p>
                  <p className="text-sm text-emerald-100/80">{profile?.role || "Unauthenticated"}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-full bg-white text-emerald-900 font-semibold shadow hover:bg-emerald-50 transition"
                >
                  Logout
                </button>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/register"
                  className="flex-1 text-center rounded-full border border-white/60 text-white py-2.5 hover:bg-white/10 transition"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="flex-1 text-center rounded-full bg-[#b7ff3b] text-black font-semibold py-2.5 shadow-md shadow-emerald-900/20 hover:brightness-95 transition"
                >
                  Login
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-emerald-950/50 p-4">
                <h4 className="text-lg font-semibold">Stay on top</h4>
                <ul className="text-emerald-100/80 text-sm space-y-1 mt-2">
                  <li>• Real-time lineup nudges before lock.</li>
                  <li>• Quick swap suggestions for underperformers.</li>
                  <li>• Cross-sport dashboard to compare your picks.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-emerald-950/70 p-6 shadow-xl shadow-emerald-900/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-200/80">Fixtures</p>
                <h3 className="text-2xl font-semibold">Upcoming {activeSport.toLowerCase()}</h3>
              </div>
              {loading && <span className="text-sm text-emerald-100/80">Loading...</span>}
            </div>
            <div className="space-y-3">
              {matches.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-white/10 bg-emerald-900/60 px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase tracking-wide text-emerald-200/80">
                      {leagueByTeams(m.homeTeam, m.awayTeam)}
                    </p>
                    <p className="text-lg font-semibold">
                      {m.homeTeam} <span className="text-emerald-200/80">vs</span> {m.awayTeam}
                    </p>
                    <p className="text-sm text-emerald-100/80">{formatTime(m.startTime)}</p>
                  </div>
                  <span className="text-sm text-black bg-[#b7ff3b] px-3 py-1 rounded-full font-semibold shadow-md shadow-emerald-900/25 border border-emerald-700/20">
                    {m.status}
                  </span>
                </div>
              ))}
              {!loading && matches.length === 0 && (
                <p className="text-emerald-100/80 text-sm">No fixtures found for this sport.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
