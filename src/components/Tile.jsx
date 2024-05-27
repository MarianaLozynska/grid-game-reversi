const Tile = ({ tileValue, rowIndex, colIndex, onClick }) => {
  return (
    <div
      onClick={() => onClick(rowIndex, colIndex)}
      style={{
        width: "80px",
        height: "80px",
        border: "1px solid black",
        background: "lightgray",
        color: "black",
        fontSize: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {tileValue}
    </div>
  );
};
export default Tile;
