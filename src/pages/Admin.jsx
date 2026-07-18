import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { players } from "../data/players";

function Admin() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (authorized) {
      loadVotes();
    }
  }, [authorized]);

  async function loadVotes() {
    const snapshot = await getDocs(collection(db, "votes"));

    const list = [];

    snapshot.forEach((d) => {
      list.push({
        id: d.id,
        ...d.data(),
      });
    });

    setVotes(list);
  }

  async function deleteVote(id) {
    if (!window.confirm("Bu oyu silmek istiyor musun?")) return;

    await deleteDoc(doc(db, "votes", id));

    loadVotes();
  }

  if (!authorized) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "80px auto",
          textAlign: "center",
        }}
      >
        <h1>👑 Admin Girişi</h1>

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 12,
            width: "100%",
            fontSize: 18,
          }}
        />

        <br />
        <br />

        <button
          onClick={() => {
            if (password === "123456") {
              setAuthorized(true);
            } else {
              alert("Şifre yanlış.");
            }
          }}
        >
          Giriş Yap
        </button>
      </div>
    );
  }

  const votedPlayers = votes.map((v) => v.voter);

  const notVoted = players.filter(
    (p) => !votedPlayers.includes(p.name)
  );

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "30px auto",
        padding: 20,
      }}
    >
      <h1>👑 Admin Paneli</h1>

      <h2>Toplam Oy : {votes.length}</h2>

      <hr />

      <h2>✅ Oy Verenler</h2>

      {votedPlayers.map((player) => (
        <p key={player}>{player}</p>
      ))}

      <hr />

      <h2>❌ Oy Vermeyenler</h2>

      {notVoted.map((player) => (
        <p key={player.id}>{player.name}</p>
      ))}

      <hr />

      <h2>Tüm Oylar</h2>

      {votes.map((vote) => (
        <div
          key={vote.id}
          style={{
            border: "1px solid gray",
            padding: 20,
            marginBottom: 20,
            borderRadius: 8,
          }}
        >
          <h3>{vote.voter}</h3>

          <strong>Takım A</strong>

          <ul>
            {vote.teamA.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          <strong>Takım B</strong>

          <ul>
            {vote.teamB.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          <button onClick={() => deleteVote(vote.id)}>
            Oyu Sil
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;