function PlayerCard({
  player,
  teamA,
  teamB,
  onSelect,
}) {
  const inTeamA = teamA.includes(player.name);
  const inTeamB = teamB.includes(player.name);

  return (
    <div
      className={`player-card ${
        inTeamA ? "team-a-card" : ""
      } ${inTeamB ? "team-b-card" : ""}`}
    >
      <div className="player-card-header">
        <div className="player-avatar">
          ⚽
        </div>

        <div className="player-info">
          <h3>{player.name}</h3>

          <span>
            {inTeamA
              ? "Takım A"
              : inTeamB
              ? "Takım B"
              : "Takım seçilmedi"}
          </span>
        </div>
      </div>

      <div className="player-buttons">
        <button
          className={`team-btn team-a ${
            inTeamA ? "active" : ""
          }`}
          disabled={inTeamB}
          onClick={() => onSelect("A", player.name)}
        >
          🟦 Takım A
        </button>

        <button
          className={`team-btn team-b ${
            inTeamB ? "active" : ""
          }`}
          disabled={inTeamA}
          onClick={() => onSelect("B", player.name)}
        >
          🟥 Takım B
        </button>
      </div>
    </div>
  );
}

export default PlayerCard;