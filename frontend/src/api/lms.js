
export async function getCourses() {

const res = await fetch(
"/api/method/custom_hrms.api.lms.get_courses"
);

const data = await res.json();

return data.message;

}

export async function getCourse(course) {

const res = await fetch(
`/api/method/custom_hrms.api.lms.get_course?course=${encodeURIComponent(course)}`
);

const data = await res.json();

return data.message;

}

export async function getLesson(lesson) {

const res = await fetch(
`/api/method/custom_hrms.api.lms.get_lesson?lesson=${encodeURIComponent(lesson)}`
);

const data = await res.json();

return data.message;

}

// export async function getQuiz(quiz) {

// const res = await fetch(
// `/api/method/custom_hrms.api.lms.get_quiz?quiz=${encodeURIComponent(quiz)}`
// );

// const data = await res.json();

// return data.message;

// }

export async function getQuiz(quiz) {

  const res = await fetch(
    `/api/method/custom_hrms.api.lms.get_quiz?quiz=${encodeURIComponent(quiz)}`
  );

  const data = await res.json();

  // =========================
  // Handle frappe error
  // =========================

  if (data.exc) {

    const msg = data._server_messages
      ? JSON.parse(data._server_messages)[0]
      : "Quiz error";

    let message = "Quiz error";

    try {
      const parsed = JSON.parse(msg);
      message = parsed.message || message;
    } catch {
      message = msg;
    }

    alert(message);

    throw new Error(message);
  }

  return data.message;

}




export async function submitQuiz(quiz, answers) {

if (!quiz) {
console.error("Quiz param missing");
return null;
}

const formData = new FormData();

formData.append("quiz", String(quiz));
formData.append("answers", JSON.stringify(answers));

const res = await fetch(
"/api/method/custom_hrms.api.lms.submit_quiz",
{
method: "POST",
body: formData
}
);

const data = await res.json();

console.log("Submit Response:", data);

return data.message;

}



export async function markLessonComplete(lesson) {
  const params = new URLSearchParams();
  params.append("lesson", lesson);

  const res = await fetch(
    "/api/method/custom_hrms.api.lms.mark_lesson_complete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    }
  );

  const data = await res.json();

  if (data.exc) {
    throw new Error(data.exc);
  }

  return data.message;
}


// export async function getQuizTimer(quiz) {

//   const res = await fetch(
//     `/api/method/custom_hrms.api.lms.get_quiz_timer?quiz=${quiz}`
//   )

//   const data = await res.json()

//   return data.message

// }

export async function getQuizTimer(quiz) {

  const res = await fetch(
    `/api/method/custom_hrms.api.lms.get_quiz_timer?quiz=${quiz}`
  )

  const data = await res.json()

  if(!res.ok){
    throw new Error(data?.message || "Timer error")
  }

  return data.message

}

export async function startQuizAttempt(quiz) {

  const res = await fetch(
    `/api/method/custom_hrms.api.lms.start_quiz_attempt?quiz=${encodeURIComponent(quiz)}`
  );

  const data = await res.json();

  return data.message;

}

export async function getQuizResult(quiz){

  const r = await fetch(
    `/api/method/custom_hrms.api.lms.get_quiz_result?quiz=${quiz}`
  );

  const data = await r.json();

  return data.message;

}

export async function getTrainingResults(){

  const r = await fetch(
    "/api/method/custom_hrms.api.lms.get_training_results"
  );

  const data = await r.json();

  return data.message;

}