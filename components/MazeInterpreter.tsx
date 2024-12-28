export function MazeInterpreter({ maze }: { maze: string[][] }) {
  return (
    <div className="maze">
      {maze.map((row, rowIndex) => (
        <div key={rowIndex} className="maze-row">
          {row.map((cell, cellIndex) => {
            switch (cell) {
              case "#":
                return (
                  <div key={`${rowIndex}-${cellIndex}`} className="wall" />
                );
              case "X":
                return (
                  <div key={`${rowIndex}-${cellIndex}`} className="player" />
                );
              case "E":
                return (
                  <div key={`${rowIndex}-${cellIndex}`} className="objective" />
                );
              default:
                return (
                  <div key={`${rowIndex}-${cellIndex}`} className="path" />
                );
            }
          })}
        </div>
      ))}
    </div>
  );
}
