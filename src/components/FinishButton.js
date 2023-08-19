function FinishButton({ dispatch }) {
  return (
    <button
      className="btn btn--finish"
      onClick={() => dispatch({ type: "finish" })}
    >
      &rArr;{" "}
    </button>
  );
}

export default FinishButton;
