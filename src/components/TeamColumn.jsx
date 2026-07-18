function TeamColumn({
  title,
  color,
  players,
  limit = 7,
}) {
  const emptyCount = limit - players.length;

  return (
    <div className="team-column">
      <div
        className="team-column-header"
        style={{ borderColor: color }}
      >
        <h2>{title}</h2>

        <span className="team-counter">
          {players.length}/{limit}
        </span>
      </div>

      <div className="team-list">
        {players.map((player, index) => (
          <div
            key={player}
            className="team-player"
          >
            <span className="player-number">
              {index + 1}
            </span>

            <span className="player-name">
              {player}
            </span>
          </div>
        ))}

        {Array.from({ length: emptyCount }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="team-player empty"
          >
            <span className="player-number">
              {players.length + index + 1}
            </span>

            <span className="player-name">
              Oyuncu Bekleniyor...
            </span>
          </div>
        ))}
      </div>

      <div className="team-footer">
        {players.length === limit ? (
          <span className="team-ready">
            ✅ Takım Hazır
          </span>
        ) : (
          <span className="team-waiting">
            {limit - players.length} oyuncu daha gerekli
          </span>
        )}
      </div>
    </div>
  );
}

export default TeamColumn;