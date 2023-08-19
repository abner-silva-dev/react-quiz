function Options({
  question: { options, correctOption },
  dispatch,
  answer,
  status,
}) {
  const hasAnswered = answer !== null || status === "verify";

  return (
    <div className="options">
      {options.map((option, i) => (
        <button
          key={option}
          className={`btn btn-option ${i === answer ? "answer" : ""} ${
            hasAnswered ? (i === correctOption ? "correct" : "wrong") : ""
          }`}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: i })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
