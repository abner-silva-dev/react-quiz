import { Fragment } from "react";

function FinishScreen({ dispatch, points, totalPoints, highscore }) {
  const percentage = (points / totalPoints) * 100;

  let emoji;

  if (percentage === 100) emoji = "🏅";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙂";
  if (percentage >= 0 && percentage < 50) emoji = "🤔";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <Fragment>
      <p className="result">
        {emoji} Your scored <strong>{points}</strong> out of {totalPoints} (
        {Math.ceil(percentage)}%)
      </p>

      <p className="highscore">(Highscore: {highscore} points)</p>
      <div className="btn-container">
        <button
          className="btn"
          onClick={() => dispatch({ type: "seeAnswers" })}
        >
          See answers
        </button>
        <button className="btn" onClick={() => dispatch({ type: "reset" })}>
          Restart quiz
        </button>
      </div>
    </Fragment>
  );
}

export default FinishScreen;
