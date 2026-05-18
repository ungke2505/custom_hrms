import frappe
from frappe.utils import now_datetime, add_to_date
from custom_hrms.api.completion import process_course_completion


@frappe.whitelist()
def get_courses():
    user = frappe.session.user

    # Ambil course yang user sudah enrolled
    enrolments = frappe.get_all(
        "LMS Enrollment",
        filters={
            "user": user,
            "status": ["in", ["Enrolled", "In Progress", "Completed"]]
        },
        fields=["course"]
    )
    enrolled_courses = [e.course for e in enrolments]

    if not enrolled_courses:
        return []

    courses = frappe.get_all(
        "LMS Course",
        fields=[
            "name",
            "course_title",
            "description",
            "level",
            "estimated_duration_minutes",
            "status"
        ],
        filters={
            "status": "Published",
            "name": ["in", enrolled_courses]
        },
        order_by="modified desc"
    )

    return courses


@frappe.whitelist()
def get_course(course):
    user = frappe.session.user

    # Cek enrolment
    enrolled = frappe.db.exists(
        "LMS Enrollment",
        {
            "user": user,
            "course": course,
            "status": ["in", ["Enrolled", "In Progress", "Completed"]]
        }
    )
    if not enrolled:
        frappe.throw("You are not enrolled in this course.")

    course_doc = frappe.get_doc("LMS Course", course)

    modules = frappe.get_all(
        "LMS Module",
        fields=[
            "name",
            "module_title",
            "sequence",
            "description"
        ],
        filters={
            "course": course,
            "is_active": 1
        },
        order_by="sequence asc"
    )

    module_names = [m.name for m in modules]

    lessons = []

    if module_names:

        lessons = frappe.get_all(
            "LMS Lesson",
            fields=[
                "name",
                "lesson_title",
                "lesson_type",
                "video_url",
                "attachment",
                "content",
                "duration_minutes",
                "module",
                "sequence"
            ],
            filters={
                "module": ["in", module_names]
            },
            order_by="sequence asc"
        )

    quiz = frappe.get_all(
        "LMS Quiz",
        fields=[
            "name",
            "quiz_title",
            "passing_score",
            "time_limit_minutes",
            "max_attempt"
        ],
        filters={
            "course": course
        }
    )

    # Ambil progress lessons yang sudah dikompleti user
    progress = frappe.get_all(
        "LMS Lesson Progress",
        filters={
            "course": course,
            "user": user,
            "completed": 1
        },
        fields=["lesson"]
    )
    completed_lessons = [p.lesson for p in progress]

    # ============================
    # Quiz Status (Tambahan saja)
    # ============================

    quiz_status = None
    quiz_score = None

    if quiz:

        quiz_name = quiz[0].name

        attempt = frappe.db.get_value(
            "LMS Quiz Attempt",
            {
                "quiz": quiz_name,
                "user": user,
                "passed": 1
            },
            ["score"],
            as_dict=True
        )

        if attempt:
            quiz_status = "passed"
            quiz_score = attempt.score

    return {
        "course": course_doc,
        "modules": modules,
        "lessons": lessons,
        "quiz": quiz,
        "completed_lessons": completed_lessons,
        "quiz_status": quiz_status,
        "quiz_score": quiz_score
    }



@frappe.whitelist()
def get_lesson(lesson):

    lesson_doc = frappe.get_doc(
        "LMS Lesson",
        lesson
    )

    return lesson_doc

@frappe.whitelist()
def mark_lesson_complete():
    lesson = frappe.form_dict.get("lesson")
    if not lesson:
        frappe.throw("Lesson missing")

    user = frappe.session.user

    # Ambil course via module
    module_name = frappe.db.get_value("LMS Lesson", lesson, "module")
    if not module_name:
        frappe.throw("Lesson has no module")

    course = frappe.db.get_value("LMS Module", module_name, "course")
    if not course:
        frappe.throw("Module has no course")

    # Cek apakah progress sudah ada
    exists = frappe.db.exists(
        "LMS Lesson Progress",
        {"lesson": lesson, "user": user}
    )
    if exists:
        return {"status": "already completed"}

    doc = frappe.get_doc({
        "doctype": "LMS Lesson Progress",
        "lesson": lesson,
        "course": course,
        "user": user,
        "completed": 1,
        "completed_on": frappe.utils.now_datetime()
    })

    doc.insert(ignore_permissions=True)

    return {"status": "ok"}


@frappe.whitelist()
def get_quiz(quiz):

    quiz_doc = frappe.get_doc("LMS Quiz", quiz)

    questions = []

    for q in quiz_doc.questions:
        questions.append({
            "name": q.name,
            "question": q.question,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d
        })

    return {
        "quiz": {
            "name": quiz_doc.name,
            "quiz_title": quiz_doc.quiz_title,
            "passing_score": quiz_doc.passing_score,
            "time_limit_minutes": quiz_doc.time_limit_minutes
        },
        "questions": questions
    }


@frappe.whitelist()
def start_quiz(quiz_name):
    user = frappe.session.user
    passed = frappe.db.exists(
        "LMS Quiz Attempt",
        {
            "quiz": quiz,
            "user": user,
            "passed": 1
        }
    )

    if passed:
        frappe.throw("You already passed this quiz.")

    # Cek apakah sudah ada attempt yang belum mulai
    attempt = frappe.get_all(
        "LMS Quiz Attempt",
        filters={
            "quiz": quiz_name,
            "user": user,
            "start_time": ["is", "not set"]
        },
        limit=1
    )

    if attempt:
        doc = frappe.get_doc("LMS Quiz Attempt", attempt[0].name)
    else:
        doc = frappe.new_doc("LMS Quiz Attempt")
        doc.quiz = quiz_name
        doc.user = user
        doc.attempt_date = now_datetime()

    doc.start_time = now_datetime()
    doc.insert(ignore_permissions=True)

    return {"start_time": doc.start_time}


# @frappe.whitelist()
# def submit_quiz():

#     quiz_name = frappe.form_dict.get("quiz")
#     answers = frappe.form_dict.get("answers")

#     if not quiz_name:
#         frappe.throw("Quiz missing")

#     if not answers:
#         frappe.throw("Answers missing")

#     answers = frappe.parse_json(answers)

#     quiz = frappe.get_doc("LMS Quiz", quiz_name)
#     user = frappe.session.user

#     # =============================
#     # AMBIL ATTEMPT AKTIF
#     # =============================

#     attempt = frappe.get_all(
#         "LMS Quiz Attempt",
#         filters={
#             "quiz": quiz_name,
#             "user": user,
#             "status": "In Progress"
#         },
#         fields=["name", "start_time"],
#         limit=1
#     )

#     if not attempt:
#         frappe.throw("Active quiz attempt not found.")

#     attempt_doc = frappe.get_doc("LMS Quiz Attempt", attempt[0].name)

#     # =============================
#     # VALIDASI TIMER
#     # =============================

#     if attempt_doc.start_time and quiz.time_limit_minutes:

#         end_time = add_to_date(
#             attempt_doc.start_time,
#             minutes=quiz.time_limit_minutes
#         )

#         if now_datetime() > end_time:
#             attempt_doc.status = "Expired"
#             attempt_doc.failed = "Yes"
#             attempt_doc.save(ignore_permissions=True)

#             frappe.throw("Time is up! Quiz expired.")

#     # =============================
#     # HITUNG SCORE
#     # =============================

#     correct_count = 0
#     total = len(quiz.questions)

#     attempt_doc.set("answer", [])

#     for q in quiz.questions:

#         selected = answers.get(q.name)

#         if selected == q.correct_answer:
#             correct_count += 1

#         attempt_doc.append("answer", {
#             "question": q.name,
#             "answer": selected
#         })

#     score = (correct_count / total) * 100 if total > 0 else 0

#     attempt_doc.score = score
#     attempt_doc.passed = score >= (quiz.passing_score or 0)
#     attempt_doc.failed = "No" if attempt_doc.passed else "Yes"

#     attempt_doc.status = "Submitted"

#     attempt_doc.save(ignore_permissions=True)

#     return {
#         "score": attempt_doc.score,
#         "passed": attempt_doc.passed
#     }

# import frappe
# from frappe.utils import now_datetime, add_to_date
# from custom_hrms.api.completion import process_course_completion


@frappe.whitelist()
def submit_quiz():

    quiz_name = frappe.form_dict.get("quiz")
    answers = frappe.form_dict.get("answers")

    if not quiz_name:
        frappe.throw("Quiz missing")

    if not answers:
        frappe.throw("Answers missing")

    answers = frappe.parse_json(answers)

    quiz = frappe.get_doc("LMS Quiz", quiz_name)
    user = frappe.session.user

    # =============================
    # AMBIL ATTEMPT AKTIF
    # =============================

    attempt = frappe.get_all(
        "LMS Quiz Attempt",
        filters={
            "quiz": quiz_name,
            "user": user,
            "status": "In Progress"
        },
        fields=["name", "start_time"],
        limit=1
    )

    if not attempt:
        frappe.throw("Active quiz attempt not found.")

    attempt_doc = frappe.get_doc("LMS Quiz Attempt", attempt[0].name)

    # =============================
    # VALIDASI TIMER
    # =============================

    if attempt_doc.start_time and quiz.time_limit_minutes:

        end_time = add_to_date(
            attempt_doc.start_time,
            minutes=quiz.time_limit_minutes
        )

        if now_datetime() > end_time:

            attempt_doc.status = "Expired"
            attempt_doc.failed = "Yes"
            attempt_doc.save(ignore_permissions=True)

            frappe.throw("Time is up! Quiz expired.")

    # =============================
    # HITUNG SCORE
    # =============================

    correct_count = 0
    total = len(quiz.questions)

    attempt_doc.set("answer", [])

    for q in quiz.questions:

        selected = answers.get(q.name)

        if selected == q.correct_answer:
            correct_count += 1

        attempt_doc.append("answer", {
            "question": q.name,
            "answer": selected
        })

    score = (correct_count / total) * 100 if total else 0

    passing_score = quiz.passing_score or 60
    passed = score >= passing_score

    attempt_doc.score = score
    attempt_doc.passed = passed
    attempt_doc.failed = "No" if passed else "Yes"
    attempt_doc.status = "Submitted"

    attempt_doc.save(ignore_permissions=True)

    # =============================
    # COURSE COMPLETION ENGINE
    # =============================

    if quiz.course:
        process_course_completion(user, quiz.course)

    return {
        "score": score,
        "passed": passed
    }

@frappe.whitelist()
def start_quiz_attempt(quiz):

    user = frappe.session.user
    quiz_doc = frappe.get_doc("LMS Quiz", quiz)

    # ======================
    # CEK SUDAH PASS
    # ======================

    passed = frappe.db.exists(
        "LMS Quiz Attempt",
        {
            "quiz": quiz,
            "user": user,
            "passed": 1
        }
    )

    if passed:
        frappe.throw("You already passed this quiz.")

    # ======================
    # CEK ATTEMPT AKTIF
    # ======================

    active_attempt = frappe.get_all(
        "LMS Quiz Attempt",
        filters={
            "quiz": quiz,
            "user": user,
            "status": "In Progress"
        },
        fields=["name"],
        limit=1
    )

    if active_attempt:

        frappe.response["message"] = {
            "attempt": active_attempt[0].name,
            "resume": True
        }

        return

    # ======================
    # CEK MAX ATTEMPT
    # ======================

    max_attempt = quiz_doc.max_attempt or 0

    attempt_count = frappe.db.count(
        "LMS Quiz Attempt",
        {
            "quiz": quiz,
            "user": user,
            "status": "Submitted"
        }
    )

    if max_attempt and attempt_count >= max_attempt:
        frappe.throw(
            f"You have reached the maximum attempt ({max_attempt})"
        )

    # ======================
    # BUAT ATTEMPT BARU
    # ======================

    attempt = frappe.get_doc({
        "doctype": "LMS Quiz Attempt",
        "quiz": quiz,
        "course": quiz_doc.course,
        "user": user,
        "start_time": frappe.utils.now(),
        "status": "In Progress"
    })

    attempt.insert(ignore_permissions=True)

    frappe.db.commit()

    frappe.response["message"] = {
        "attempt": attempt.name,
        "resume": False
    }



@frappe.whitelist()
def get_quiz_timer(quiz):

    user = frappe.session.user

    attempt = frappe.get_all(
        "LMS Quiz Attempt",
        filters={
            "quiz": quiz,
            "user": user,
            "status": "In Progress"
        },
        fields=["name", "start_time"],
        order_by="creation desc",
        limit=1
    )

    if not attempt:
        return None

    quiz_doc = frappe.get_doc("LMS Quiz", quiz)

    return {
        "attempt": attempt[0].name,
        "start_time": attempt[0].start_time,
        "time_limit": quiz_doc.time_limit_minutes
    }


@frappe.whitelist()
def get_quiz_result(quiz):

    user = frappe.session.user

    attempt = frappe.db.get_value(
        "LMS Quiz Attempt",
        {
            "quiz": quiz,
            "user": user,
            "status": "Submitted"
        },
        [
            "name",
            "course",
            "quiz",
            "score",
            "passed",
            "start_time",
        ],
        order_by="creation desc",

        as_dict=True
    )

    if not attempt:
        frappe.throw("Quiz attempt not found")

    return attempt    

@frappe.whitelist()
def get_training_results():

    user = frappe.session.user

    results = frappe.get_all(
        "LMS Quiz Attempt",
        filters={"user": user},
        fields=[
            "name",
            "course",
            "quiz",
            "score",
            "passed",
            "start_time",
            "creation"
        ],
        order_by="creation desc"
    )

    return results    