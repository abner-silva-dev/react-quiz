import Options from "./Options";
import FinishButton from "./FinishButton";

function Question({ question, dispatch, answer, status }) {
  return (
    <div className="question">
      <h4>{question.question}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        answer={answer}
        status={status}
      />

      {status === "verify" && <FinishButton dispatch={dispatch} />}
    </div>
  );
}

export default Question;
