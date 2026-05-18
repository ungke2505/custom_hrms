// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getCourse, markLessonComplete } from "../api/lms";

// export default function CourseDetail() {

//   const { course } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [activeLesson, setActiveLesson] = useState(null);
//   const [completed, setCompleted] = useState([]);

//   useEffect(() => {
//     loadCourse();
//   }, [course]);

//   async function loadCourse() {
//     try {

//       const res = await getCourse(course);

//       setData(res);

//       const backendCompleted = res?.completed_lessons || [];

//       setCompleted(backendCompleted);

//       localStorage.setItem(
//         `progress_${course}`,
//         JSON.stringify(backendCompleted)
//       );

//     } catch (err) {

//       console.error(err);
//       alert("Failed to load course");

//     }
//   }

//   async function handleComplete(lessonName) {
//     try {

//       const res = await markLessonComplete(lessonName);

//       if (res.status === "ok" || res.status === "already completed") {

//         const updated = [...new Set([...completed, lessonName])];

//         setCompleted(updated);

//         localStorage.setItem(
//           `progress_${course}`,
//           JSON.stringify(updated)
//         );

//       }

//     } catch (err) {

//       console.error(err);
//       alert("Failed to mark lesson as completed");

//     }
//   }

//   if (!data) {
//     return <div className="p-4">Loading...</div>;
//   }

//   const courseData = data.course || {};
//   const lessons = data.lessons || [];
//   const quiz = data.quiz || [];

//   const progress = lessons.length
//     ? Math.round((completed.length / lessons.length) * 100)
//     : 0;

//   function renderContent(lesson) {

//     if (lesson.lesson_type === "Video" && lesson.video_url) {

//       let url = lesson.video_url;

//       if (url.includes("youtube.com/watch")) {
//         url = url.replace("watch?v=", "embed/");
//       }

//       if (url.includes("youtu.be/")) {
//         const id = url.split("youtu.be/")[1];
//         url = `https://www.youtube.com/embed/${id}`;
//       }

//       return (
//         <div className="mb-4">
//           <div className="aspect-video">
//             <iframe
//               src={url}
//               className="w-full h-full rounded"
//               allowFullScreen
//               title="Lesson Video"
//             />
//           </div>
//         </div>
//       );

//     }

//     return (
//       <div
//         className="prose max-w-none text-sm"
//         dangerouslySetInnerHTML={{
//           __html: lesson.content || "<p>No content</p>"
//         }}
//       />
//     );
//   }

//   async function startQuiz() {

//   if (!quiz || quiz.length === 0) return;

//   try {

//     const quizName = quiz[0].name;

//     const res = await fetch(
//       `/api/method/custom_hrms.api.lms.start_quiz_attempt?quiz=${encodeURIComponent(quizName)}`
//     );

//     const result = await res.json();

//     console.log("Start Attempt:", result);

//     if (!result?.message) {

//       alert("Quiz failed to start.");
//       return;

//     }

//     navigate(`/quiz/${quizName}`);

//   } catch (err) {

//     console.error(err);
//     alert("Failed to start quiz");

//   }

// }

//   return (
//     <div className="p-4 max-w-xl mx-auto">

//       <h1 className="text-xl font-bold mb-2">
//         {courseData.course_title}
//       </h1>

//       <div
//         className="mb-6 text-gray-600 text-sm"
//         dangerouslySetInnerHTML={{ __html: courseData.description || "" }}
//       />

//       <div className="mb-6">

//         <div className="flex justify-between text-sm mb-1">
//           <span>Course Progress</span>
//           <span>{progress}%</span>
//         </div>

//         <div className="w-full bg-gray-200 rounded h-3">
//           <div
//             className="bg-green-500 h-3 rounded"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//       </div>

//       {progress < 100 && (
//         <>
//           <h2 className="font-semibold mb-3">Lessons</h2>

//           <div className="space-y-3">

//             {lessons.map((lesson) => (

//               <div
//                 key={lesson.name}
//                 className="border rounded-lg overflow-hidden"
//               >

//                 <div
//                   onClick={() => setActiveLesson(lesson)}
//                   className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between"
//                 >

//                   <div>
//                     <div className="font-medium">
//                       {lesson.lesson_title}
//                     </div>

//                     <div className="text-sm text-gray-500">
//                       {lesson.lesson_type} • {lesson.duration_minutes || 0} min
//                     </div>
//                   </div>

//                   {completed.includes(lesson.name) && (
//                     <div className="text-green-600 font-bold">✔</div>
//                   )}

//                 </div>

//                 {activeLesson?.name === lesson.name && (

//                   <div className="border-t p-4 bg-gray-50">

//                     {renderContent(lesson)}

//                     <button
//                       onClick={() => handleComplete(lesson.name)}
//                       disabled={completed.includes(lesson.name)}
//                       className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
//                     >

//                       {completed.includes(lesson.name)
//                         ? "Completed ✔"
//                         : "Mark as Completed"}

//                     </button>

//                   </div>

//                 )}

//               </div>

//             ))}

//           </div>
//         </>
//       )}

//       {progress === 100 && quiz.length > 0 && (

//         <div className="mt-8">

//           <div className="text-center mb-4 font-semibold text-green-700">
//             All lessons completed 🎉
//           </div>

//           <button
//             onClick={startQuiz}
//             className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg"
//           >
//             Start Quiz
//           </button>

//         </div>

//       )}

//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourse, markLessonComplete } from "../api/lms";

export default function CourseDetail() {

  const { course } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    loadCourse();
  }, [course]);

  async function loadCourse() {

    try {

      const res = await getCourse(course);

      setData(res);

      const backendCompleted = res?.completed_lessons || [];

      setCompleted(backendCompleted);

      localStorage.setItem(
        `progress_${course}`,
        JSON.stringify(backendCompleted)
      );

    } catch (err) {

      console.error(err);
      alert("Failed to load course");

    }

  }

  async function handleComplete(lessonName) {

    try {

      const res = await markLessonComplete(lessonName);

      if (res.status === "ok" || res.status === "already completed") {

        const updated = [...new Set([...completed, lessonName])];

        setCompleted(updated);

        localStorage.setItem(
          `progress_${course}`,
          JSON.stringify(updated)
        );

      }

    } catch (err) {

      console.error(err);
      alert("Failed to mark lesson as completed");

    }

  }

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  const courseData = data.course || {};
  const lessons = data.lessons || [];
  const quiz = data.quiz || [];

  const quizStatus = data.quiz_status;
  const quizScore = data.quiz_score;

  const progress = lessons.length
    ? Math.round((completed.length / lessons.length) * 100)
    : 0;

  function renderContent(lesson) {

    if (lesson.lesson_type === "Video" && lesson.video_url) {

      let url = lesson.video_url;

      if (url.includes("youtube.com/watch")) {
        url = url.replace("watch?v=", "embed/");
      }

      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1];
        url = `https://www.youtube.com/embed/${id}`;
      }

      return (
        <div className="mb-4">
          <div className="aspect-video">
            <iframe
              src={url}
              className="w-full h-full rounded"
              allowFullScreen
              title="Lesson Video"
            />
          </div>
        </div>
      );

    }

    return (
      <div
        className="prose max-w-none text-sm"
        dangerouslySetInnerHTML={{
          __html: lesson.content || "<p>No content</p>"
        }}
      />
    );
  }

  async function startQuiz() {

    if (!quiz || quiz.length === 0) return;

    try {

      const quizName = quiz[0].name;

      const res = await fetch(
        `/api/method/custom_hrms.api.lms.start_quiz_attempt?quiz=${encodeURIComponent(quizName)}`
      );

      const result = await res.json();

      if (!res.ok) {

        let message = "Failed to start quiz";

        if (result?._server_messages) {

          try {

            const msgs = JSON.parse(result._server_messages);
            const msgObj = JSON.parse(msgs[0]);

            message = msgObj.message;

          } catch (e) {}

        }

        alert(message);
        return;

      }

      navigate(`/quiz/${quizName}`);

    } catch (err) {

      console.error(err);
      alert("Failed to start quiz");

    }

  }

  return (
    <div className="p-4 max-w-xl mx-auto">

      <h1 className="text-xl font-bold mb-2">
        {courseData.course_title}
      </h1>

      <div
        className="mb-6 text-gray-600 text-sm"
        dangerouslySetInnerHTML={{ __html: courseData.description || "" }}
      />

      <div className="mb-6">

        <div className="flex justify-between text-sm mb-1">
          <span>Course Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded h-3">
          <div
            className="bg-green-500 h-3 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

      {progress < 100 && (
        <>
          <h2 className="font-semibold mb-3">Lessons</h2>

          <div className="space-y-3">

            {lessons.map((lesson) => (

              <div
                key={lesson.name}
                className="border rounded-lg overflow-hidden"
              >

                <div
                  onClick={() => setActiveLesson(lesson)}
                  className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between"
                >

                  <div>

                    <div className="font-medium">
                      {lesson.lesson_title}
                    </div>

                    <div className="text-sm text-gray-500">
                      {lesson.lesson_type} • {lesson.duration_minutes || 0} min
                    </div>

                  </div>

                  {completed.includes(lesson.name) && (
                    <div className="text-green-600 font-bold">✔</div>
                  )}

                </div>

                {activeLesson?.name === lesson.name && (

                  <div className="border-t p-4 bg-gray-50">

                    {renderContent(lesson)}

                    <button
                      onClick={() => handleComplete(lesson.name)}
                      disabled={completed.includes(lesson.name)}
                      className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
                    >

                      {completed.includes(lesson.name)
                        ? "Completed ✔"
                        : "Mark as Completed"}

                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>
        </>
      )}

      {progress === 100 && quiz.length > 0 && (

        <div className="mt-8">

          <div className="text-center mb-4 font-semibold text-green-700">
            All lessons completed 🎉
          </div>

          {quizStatus === "passed" ? (

            <div className="text-center">

              <div className="mb-2 font-semibold text-green-700">
                Quiz Status : Passed ✔
              </div>

              <div className="mb-4 text-sm text-gray-600">
                Score : {quizScore}
              </div>

              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-lg text-lg cursor-not-allowed"
              >
                Quiz Completed
              </button>

            </div>

          ) : (

            <button
              onClick={startQuiz}
              className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg"
            >
              Start Quiz
            </button>

          )}

        </div>

      )}

    </div>
  );
}

