// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getQuiz, submitQuiz, getQuizTimer } from "../api/lms";

// export default function QuizPage() {

//   const { quiz } = useParams();

//   const [data, setData] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [timeLeft, setTimeLeft] = useState(0);
//   const [timerReady, setTimerReady] = useState(false);

//   useEffect(() => {
//     loadQuiz();
//   }, [quiz]);

//   function parseFrappeDatetime(dt) {

//     if (!dt) return null;

//     const [datePart, timePart] = dt.split(" ");

//     const [y, m, d] = datePart.split("-").map(Number);
//     const [hh, mm, ss] = timePart.split(":").map(Number);

//     return new Date(y, m - 1, d, hh, mm, ss);

//   }

//   async function loadQuiz() {

//     try {

//       const resQuiz = await getQuiz(quiz);
//       setData(resQuiz);

//       await fetch(
//         `/api/method/custom_hrms.api.lms.start_quiz_attempt?quiz=${encodeURIComponent(quiz)}`
//       );

//       const timer = await getQuizTimer(quiz);

//       console.log("Timer Data:", timer);

//       if (timer?.start_time && timer?.time_limit) {

//         const start = parseFrappeDatetime(timer.start_time);

//         const now = new Date();

//         const limitSeconds = timer.time_limit * 60;

//         const elapsed = Math.floor(
//           (now.getTime() - start.getTime()) / 1000
//         );

//         const remaining = limitSeconds - elapsed;

//         setTimeLeft(remaining > 0 ? remaining : 0);

//       } else {

//         console.warn("Timer invalid:", timer);

//         setTimeLeft(timer?.time_limit ? timer.time_limit * 60 : 0);

//       }

//       setTimerReady(true);

//     } catch (err) {

//       console.error("Failed to load quiz:", err);
//       alert("Failed to load quiz");

//     } finally {

//       setLoading(false);

//     }

//   }

//   useEffect(() => {

//     if (!timerReady) return;

//     const interval = setInterval(() => {

//       setTimeLeft(prev => {

//         if (prev <= 0) {

//           clearInterval(interval);

//           alert("Waktu habis. Quiz akan otomatis disubmit.");

//           handleSubmit(true);

//           return 0;

//         }

//         return prev - 1;

//       });

//     }, 1000);

//     return () => clearInterval(interval);

//   }, [timerReady]);

//   function handleSelect(question, option) {

//     setAnswers(prev => ({
//       ...prev,
//       [question]: option
//     }));

//   }

//   async function handleSubmit(force = false) {

//     if (!data) return;

//     if (!force && Object.keys(answers).length !== data.questions.length) {

//       alert("Please answer all questions before submitting.");
//       return;

//     }

//     try {

//       setSubmitting(true);

//       const result = await submitQuiz(quiz, answers);

//       if (!result) {

//         alert("Quiz Submission Failed");
//         return;

//       }

//       alert(
//         `Score: ${result.score}%\n\nStatus: ${
//           result.passed ? "PASSED" : "FAILED"
//         }`
//       );

//     } catch (err) {

//       console.error("Submit failed:", err);
//       alert("Failed to submit quiz");

//     } finally {

//       setSubmitting(false);

//     }

//   }

//   function formatTime(sec) {

//     const minutes = Math.floor(sec / 60);
//     const seconds = sec % 60;

//     return `${minutes}:${seconds.toString().padStart(2,"0")}`;

//   }

//   if (loading) return <div className="p-6 text-center">Loading quiz...</div>;
//   if (!data) return <div className="p-6 text-center">Quiz not found.</div>;

//   const { quiz: quizInfo, questions } = data;

//   return (

// <div className="max-w-2xl mx-auto p-6">

// <h1 className="text-2xl font-bold mb-6 text-center">
// {quizInfo.quiz_title}
// </h1>

// <div className="text-right font-bold text-red-600 text-lg mb-6">
// Waktu Tersisa: {formatTime(timeLeft)}
// </div>

// <div className="space-y-6">

// {questions.map((q, i) => (

// <div key={q.name} className="border rounded-lg p-4 bg-white shadow-sm">

// <div
// className="font-medium mb-4"
// dangerouslySetInnerHTML={{
// __html: `${i + 1}. ${q.question}`
// }}
// />

// <div className="space-y-2">

// {["A","B","C","D"].map((opt) => {

// const value = q[`option_${opt.toLowerCase()}`];

// if (!value) return null;

// return (

// <label key={opt} className="flex items-center space-x-2 cursor-pointer">

// <input
// type="radio"
// name={q.name}
// value={opt}
// checked={answers[q.name] === opt}
// onChange={() => handleSelect(q.name, opt)}
// />

// <span>{value}</span>

// </label>

// );

// })}

// </div>

// </div>

// ))}

// </div>

// <button
// onClick={() => handleSubmit()}
// disabled={submitting}
// className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
// >

// {submitting ? "Submitting..." : "Submit Quiz"}

// </button>

// </div>

// );

// }



import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz, getQuizTimer, startQuizAttempt } from "../api/lms";

export default function QuizPage() {

  const { quiz } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerReady, setTimerReady] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [quiz]);

  function parseFrappeDatetime(dt) {

    if (!dt) return null;

    const [datePart, timePart] = dt.split(" ");

    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm, ss] = timePart.split(":").map(Number);

    return new Date(y, m - 1, d, hh, mm, ss);

  }

  async function loadQuiz() {

    try {

      const resQuiz = await getQuiz(quiz);
      setData(resQuiz);

      // memastikan attempt aktif
      await startQuizAttempt(quiz);

      const timer = await getQuizTimer(quiz);

      console.log("Timer Data:", timer);

      if (timer?.start_time && timer?.time_limit) {

        const start = parseFrappeDatetime(timer.start_time);
        const now = new Date();

        const limitSeconds = timer.time_limit * 60;

        const elapsed = Math.floor(
          (now.getTime() - start.getTime()) / 1000
        );

        const remaining = limitSeconds - elapsed;

        setTimeLeft(remaining > 0 ? remaining : 0);

      } else {

        console.warn("Timer invalid:", timer);

        setTimeLeft(timer?.time_limit ? timer.time_limit * 60 : 0);

      }

      setTimerReady(true);

    } catch (err) {

      console.error("Failed to load quiz:", err);
      alert("Failed to load quiz");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    if (!timerReady) return;

    const interval = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 0) {

          clearInterval(interval);

          alert("Waktu habis. Quiz akan otomatis disubmit.");

          handleSubmit(true);

          return 0;

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [timerReady]);

  function handleSelect(question, option) {

    setAnswers(prev => ({
      ...prev,
      [question]: option
    }));

  }

  async function handleSubmit(force = false) {

    if (!data) return;

    if (!force && Object.keys(answers).length !== data.questions.length) {

      alert("Please answer all questions before submitting.");
      return;

    }

    try {

      setSubmitting(true);

      const result = await submitQuiz(quiz, answers);

      if (!result) {

        alert("Quiz Submission Failed");
        return;

      }

      // redirect ke halaman result
      navigate(`/quiz-result/${quiz}`);

    } catch (err) {

      console.error("Submit failed:", err);
      alert("Failed to submit quiz");

    } finally {

      setSubmitting(false);

    }

  }

  function formatTime(sec) {

    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;

    return `${minutes}:${seconds.toString().padStart(2,"0")}`;

  }

  if (loading) return <div className="p-6 text-center">Loading quiz...</div>;
  if (!data) return <div className="p-6 text-center">Quiz not found.</div>;

  const { quiz: quizInfo, questions } = data;

  return (

    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6 text-center">
        {quizInfo.quiz_title}
      </h1>

      <div className="text-right font-bold text-red-600 text-lg mb-6">
        Waktu Tersisa: {formatTime(timeLeft)}
      </div>

      <div className="space-y-6">

        {questions.map((q, i) => (

          <div key={q.name} className="border rounded-lg p-4 bg-white shadow-sm">

            <div
              className="font-medium mb-4"
              dangerouslySetInnerHTML={{
                __html: `${i + 1}. ${q.question}`
              }}
            />

            <div className="space-y-2">

              {["A","B","C","D"].map((opt) => {

                const value = q[`option_${opt.toLowerCase()}`];

                if (!value) return null;

                return (

                  <label key={opt} className="flex items-center space-x-2 cursor-pointer">

                    <input
                      type="radio"
                      name={q.name}
                      value={opt}
                      checked={answers[q.name] === opt}
                      onChange={() => handleSelect(q.name, opt)}
                    />

                    <span>{value}</span>

                  </label>

                );

              })}

            </div>

          </div>

        ))}

      </div>

      <button
        onClick={() => handleSubmit()}
        disabled={submitting}
        className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
      >

        {submitting ? "Submitting..." : "Submit Quiz"}

      </button>

    </div>

  );

}

