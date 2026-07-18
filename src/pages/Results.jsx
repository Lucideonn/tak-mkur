import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

function Results() {
  const [teamAStats, setTeamAStats] = useState({});
  const [teamBStats, setTeamBStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    const snapshot = await getDocs(collection(db, "votes"));

    const a = {};
    const b = {};

    snapshot.forEach((doc) => {
      const vote = doc.data();

      vote.teamA.forEach((player) => {
        a[player] = (a[player] || 0) + 1;
      });

      vote.teamB.forEach((player) => {
        b[player] = (b[player] || 0) + 1;
      });
    });

    setTeamAStats(a);
    setTeamBStats(b);
    setLoading(false);
  }

  if (loading) return <h2 style={{ padding: 30 }}>Yükleniyor...</h2>;

  return (
    <div style={{ padding: 30 }}>
      <h1>📊 Sonuçlar</h1>

      <div
        style={{
          display: "flex",
          gap: 60,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2>Takım A</h2>

          {Object.entries(teamAStats)
            .sort((a, b) => b[1] - a[1])
            .map(([player, count]) => (
              <p key={player}>
                <strong>{player}</strong> — {count} oy
              </p>
            ))}
        </div>

        <div>
          <h2>Takım B</h2>

          {Object.entries(teamBStats)
            .sort((a, b) => b[1] - a[1])
            .map(([player, count]) => (
              <p key={player}>
                <strong>{player}</strong> — {count} oy
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Results;