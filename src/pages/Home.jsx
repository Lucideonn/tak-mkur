import { useState, useEffect } from "react";
import { players } from "../data/players";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

function Home() {
  const [user, setUser] = useState("");
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setTeamA([]);
      setTeamB([]);
      setMessage("");
      return;
    }

    loadVote();
  }, [user]);

  async function loadVote() {
    try {
      const voteRef = doc(db, "votes", user);
      const voteSnap = await getDoc(voteRef);

      if (voteSnap.exists()) {
        const data = voteSnap.data();

        setTeamA(data.teamA || []);
        setTeamB(data.teamB || []);
        setMessage("✅ Daha önce kaydettiğin oyun yüklendi.");
      } else {
        setTeamA([]);
        setTeamB([]);
        setMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  }

  function togglePlayer(team, playerName) {
    if (team === "A") {
      if (teamB.includes(playerName)) return;

      if (teamA.includes(playerName)) {
        setTeamA(teamA.filter((p) => p !== playerName));
      } else {
        if (teamA.length >= 7) {
          alert("Takım A en fazla 7 kişi olabilir.");
          return;
        }

        setTeamA([...teamA, playerName]);
      }
    }

    if (team === "B") {
      if (teamA.includes(playerName)) return;

      if (teamB.includes(playerName)) {
        setTeamB(teamB.filter((p) => p !== playerName));
      } else {
        if (teamB.length >= 7) {
          alert("Takım B en fazla 7 kişi olabilir.");
          return;
        }

        setTeamB([...teamB, playerName]);
      }
    }
  }

  async function submitVote() {
    if (!user) {
      alert("Lütfen ismini seç.");
      return;
    }

    if (teamA.length !== 7 || teamB.length !== 7) {
      alert("Her takımda tam 7 oyuncu olmalıdır.");
      return;
    }

    try {
      setLoading(true);

      await setDoc(doc(db, "votes", user), {
        voter: user,
        teamA,
        teamB,
        updatedAt: new Date().toISOString(),
      });

      setMessage("✅ Oyun başarıyla kaydedildi.");
    } catch (err) {
      console.error(err);
      alert("Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1>⚽ Halısaha Takım Kur</h1>

      <h3>Oy Veren</h3>

      <select
        value={user}
        onChange={(e) => setUser(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          marginBottom: "15px",
        }}
      >
        <option value="">İsmini seç</option>

        {players.map((player) => (
          <option key={player.id} value={player.name}>
            {player.name}
          </option>
        ))}
      </select>

      {message && (
        <div
          style={{
            background: "#1f5132",
            color: "white",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "60px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2>🟦 Takım A ({teamA.length}/7)</h2>

          {players.map((player) => (
            <div key={"A" + player.id}>
              <label>
                <input
                  type="checkbox"
                  checked={teamA.includes(player.name)}
                  disabled={teamB.includes(player.name)}
                  onChange={() => togglePlayer("A", player.name)}
                />{" "}
                {player.name}
              </label>
            </div>
          ))}
        </div>

        <div>
          <h2>🟥 Takım B ({teamB.length}/7)</h2>

          {players.map((player) => (
            <div key={"B" + player.id}>
              <label>
                <input
                  type="checkbox"
                  checked={teamB.includes(player.name)}
                  disabled={teamA.includes(player.name)}
                  onChange={() => togglePlayer("B", player.name)}
                />{" "}
                {player.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <br />

      <button
        onClick={submitVote}
        disabled={loading}
        style={{
          padding: "12px 30px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        {loading ? "Kaydediliyor..." : "💾 Oyumu Kaydet"}
      </button>
    </div>
  );
}

export default Home;