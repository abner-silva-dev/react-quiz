import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const min = String(Math.floor(secondsRemaining / 60)).padStart(2, 0);
  const sec = String(secondsRemaining % 60).padStart(2, 0);

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [dispatch]);

  return (
    <div className="timer">
      {min} : {sec}
    </div>
  );
}

export default Timer;
