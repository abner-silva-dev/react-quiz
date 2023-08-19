import { Fragment, useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "../StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import PreviousButton from "./PreviousButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  filterQuestions: [],

  // 'Loading' , 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  answers: [],
  points: 0,
  highscore: JSON.parse(localStorage.getItem("highscore")),
  secondsRemaining: 0,
  difficulty: "all",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        filterQuestions: action.payload,
      };
    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.filterQuestions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.filterQuestions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
        answers: [...state.answers, action.payload],
      };
    case "nextQuestion":
      const iterator =
        state.index + 1 < state.filterQuestions.length
          ? state.index + 1
          : state.index;

      return {
        ...state,
        index: iterator,
        answer: state.answers.at(iterator) ? state.answers.at(iterator) : null,
      };
    case "prevQuestion":
      const index = state.index - 1 >= 0 ? state.index - 1 : state.index;

      return {
        ...state,
        index,
        answer: state.answers.at(index) ? state.answers.at(index) : null,
      };

    case "finish":
      const highscore =
        state.points >= state.highscore ? state.points : state.highscore;

      localStorage.setItem("highscore", JSON.stringify(highscore));

      return {
        ...state,
        index: 0,
        status: "finished",
        highscore,
      };
    case "reset":
      return {
        ...initialState,
        status: "ready",
        highscore: state.highscore,
        questions: state.questions,
        filterQuestions: state.filterQuestions,
        difficulty: state.difficulty,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "seeAnswers":
      return { ...state, answer: state.answers[state.index], status: "verify" };
    case "setDifficulty":
      return {
        ...state,
        difficulty: action.payload,
        filterQuestions:
          action.payload === "all"
            ? state.questions
            : state.questions.filter(
                (question) => question.difficulty === action.payload
              ),
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    {
      // questions,
      filterQuestions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      difficulty,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = filterQuestions.length;
  const totalPoints = filterQuestions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  useEffect(() => {
    fetch(`http://localhost:3000/questions.json`)
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "dataReceived", payload: data.questions })
      )
      .catch((err) => dispatch({ type: "dataFail" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            highscore={highscore}
            difficulty={difficulty}
          />
        )}
        {(status === "active" || status === "verify") && (
          <Fragment>
            <Progress
              index={index}
              numQuestions={filterQuestions.length}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question
              question={filterQuestions.at(index)}
              dispatch={dispatch}
              answer={answer}
              status={status}
            />

            <Footer>
              {status !== "verify" && (
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />
              )}
              {status === "verify" && (
                <PreviousButton dispatch={dispatch} index={index} />
              )}

              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={filterQuestions.length}
                index={index}
                points={points}
                status={status}
              />
            </Footer>
          </Fragment>
        )}
        {status === "finished" && (
          <FinishScreen
            dispatch={dispatch}
            points={points}
            totalPoints={totalPoints}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}
