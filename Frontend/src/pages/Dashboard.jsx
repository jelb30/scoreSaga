import { Link } from "react-router-dom";

const features = [
  { title: "Build your fantasy XI", desc: "Draft across leagues, stack form players, and save multiple squads for match day.", stat: "Syncs with live lineups" },
  { title: "Schedules & lineups", desc: "Every fixture with kickoff times, predicted lineups, and last-minute changes in one view.", stat: "95% lineup accuracy" },
  { title: "Player radar", desc: "Track form, xG/xA, wickets, and clutch moments to pick the best performers.", stat: "2000+ players tracked" },
  { title: "Squad health", desc: "Injury, fatigue, and suspension alerts before you lock your picks.", stat: "Live risk scoring" },
];

const fixtures = [
  { league: "Champions League", teams: "Madrid vs City", time: "Tonight · 9:00 PM", vibe: "🔥 High stakes" },
  { league: "IPL", teams: "RCB vs CSK", time: "Tomorrow · 7:30 PM", vibe: "⚡ Big hitters" },
  { league: "La Liga", teams: "Barca vs Sevilla", time: "Sat · 8:15 PM", vibe: "💥 Classic clash" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/85 via-emerald-700/70 to-slate-900/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(74,222,128,0.25),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(34,197,94,0.2),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8 lg:py-12">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white/10 ring-2 ring-emerald-400/60 flex items-center justify-center font-semibold">
                SS
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-100/80">ScoreSaga</p>
                <h1 className="text-xl font-semibold text-white">Your fantasy war room</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-white/70 text-white hover:bg-white/10 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-[#b7ff3b] text-black font-semibold shadow-lg shadow-emerald-900/40 hover:brightness-95 transition"
                style={{ color: "#000" }}
              >
                Create account
              </Link>
            </div>
          </header>

          <main className="grid gap-10 lg:gap-14 lg:grid-cols-[1.2fr_0.9fr] items-start mt-10 lg:mt-16">
            <section className="space-y-8">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 lg:p-10 shadow-2xl shadow-emerald-900/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_35%)]" />
                <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-emerald-500/25 to-transparent" />
                <div className="relative space-y-6">
                  <p className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/40">
                    <span className="h-2 w-2 rounded-full bg-lime-300 animate-pulse" />
                    Live now · Fantasy-ready data
                  </p>
                  <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                    The dashboard that sells your next winning fantasy squad.
                  </h2>
                  <p className="text-lg text-emerald-50/90 max-w-3xl">
                    Craft lineups with confidence: fixtures, predicted lineups, form curves, injury risk, and player radar
                    in one place. Whether it’s football under the lights or cricket under pressure, lock in the best performers.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/login"
                      className="px-6 py-3 rounded-full bg-[#b7ff3b] text-black font-semibold shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5 hover:brightness-95 transition"
                      style={{ color: "#000" }}
                    >
                      Launch dashboard
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-3 rounded-full border border-white/60 text-white hover:bg-white/10 transition"
                    >
                      Create free profile
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {features.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-emerald-900/45 p-5 shadow-lg shadow-emerald-900/30 backdrop-blur"
                  >
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-emerald-50/80 mt-2">{item.desc}</p>
                    <p className="mt-4 text-emerald-200 font-semibold">{item.stat}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl shadow-emerald-900/30 backdrop-blur">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-sm text-emerald-100/80">Upcoming fixtures</p>
                    <h3 className="text-2xl font-semibold mt-1">Stay ahead of the whistle</h3>
                  </div>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full border border-white/60 text-emerald-50 hover:bg-white/10 transition"
                  >
                    Personalize alerts
                  </Link>
                </div>
                <div className="mt-5 space-y-4">
                  {fixtures.map((game) => (
                    <div
                      key={game.teams}
                      className="rounded-2xl border border-white/5 bg-emerald-950/50 px-4 py-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm text-emerald-200/80 uppercase tracking-wide">{game.league}</p>
                        <p className="text-lg font-semibold mt-1">{game.teams}</p>
                        <p className="text-sm text-emerald-100/80 mt-0.5">{game.time}</p>
                      </div>
                      <span className="text-sm text-black bg-[#b7ff3b] px-3 py-1 rounded-full font-semibold shadow-md shadow-emerald-900/25 border border-emerald-700/20">
                        {game.vibe}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-emerald-950/60 p-6 shadow-xl shadow-emerald-900/40 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/70">Lineup lab</p>
                <h3 className="text-3xl font-semibold mt-2">Lock your best XI</h3>
                <p className="text-emerald-100/85 mt-3">
                  Blend fantasy picks with data-backed edge—form, fixtures, and risk rolled into one clean lineup view.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <StatCard label="Form streak" value="12 hot picks" />
                  <StatCard label="Injury alerts" value="Instant pings" />
                  <StatCard label="Lineup sync" value="Live updates" />
                  <StatCard label="Captain boost" value="+18% avg" />
                </div>
                <Link
                  to="/register"
                  className="mt-6 inline-flex w-full justify-center rounded-full bg-[#b7ff3b] text-black font-semibold py-3 shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5 hover:brightness-95 transition"
                  style={{ color: "#000" }}
                >
                  Build my squad
                </Link>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-emerald-900/30 backdrop-blur">
                <h3 className="text-xl font-semibold">Ready for kickoff?</h3>
                <p className="text-emerald-50/85 mt-2">
                  Log in to unlock personalized score alerts, your watchlist, and a dashboard that adapts to every match day.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center rounded-full border border-white/60 text-white py-2.5 hover:bg-white/10 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center rounded-full bg-[#b7ff3b] text-black font-semibold py-2.5 shadow-md shadow-emerald-900/20 hover:-translate-y-0.5 hover:brightness-95 transition"
                    style={{ color: "#000" }}
                  >
                    Join free
                  </Link>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-emerald-700/40 bg-emerald-900/40 px-3 py-4">
      <p className="text-xs uppercase tracking-wide text-emerald-100/70">{label}</p>
      <p className="mt-1.5 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
