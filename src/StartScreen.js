function StartScreen({ numQuestions, dispatch, highscore, difficulty }) {
  return (
    <div className="start">
      <span className="highscore--start">highscore: {highscore}</span>
      <h2>Welcome to de react Quiz!</h2>
      <h3>{numQuestions} questions to test yout React mastery</h3>

      <div className="difficulty">
        <p>choose the difficulty of the questions: </p>
        <select
          value={difficulty}
          onChange={(e) => {
            console.log(e.target.value);

            dispatch({ type: "setDifficulty", payload: e.target.value });
          }}
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
