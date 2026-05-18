import frappe
from frappe.utils import now_datetime, today, add_years

def validate_course_completion(user, course):
    """
    Validate if user completed all lessons and passed quiz
    """
    modules = frappe.get_all(
        "LMS Module",
        filters={
            "course": course,
            "is_active": 1
        },
        fields=["name"]
    )

    if not modules:
        return False

    module_names = [m.name for m in modules]

    lessons = frappe.get_all(
        "LMS Lesson",
        filters={
            "module": ["in", module_names]
        },
        fields=["name"]
    )
    total_lessons = len(lessons)
    if total_lessons == 0:
        return False
    completed_lessons = frappe.db.count(
        "LMS Lesson Progress",
        {
            "user": user,
            "course": course,
            "completed": 1
        }
    )
    if completed_lessons < total_lessons:
        return False
    quiz = frappe.db.get_value(
        "LMS Quiz",
        {"course": course},
        "name"
    )
    if quiz:
        passed = frappe.db.exists(
            "LMS Quiz Attempt",
            {
                "quiz": quiz,
                "user": user,
                "passed": 1
            }
        )
        if not passed:
            return False
    return True


def process_course_completion(user, course):


    if not validate_course_completion(user, course):
        return

    employee = frappe.db.get_value(
        "Employee",
        {"user_id": user},
        "name"
    )

    if not employee:
        return

    score = calculate_course_score(user, course)
    attempts = calculate_attempts(user, course)

    passing_score = frappe.db.get_value(
        "LMS Course",
        course,
        "passing_score"
    ) or 60

    passed = score >= passing_score

    existing = frappe.db.exists(
        "LMS Course Result",
        {
            "employee": employee,
            "course": course
        }
    )

    if existing:
        return existing

    result = frappe.get_doc({
        "doctype": "LMS Course Result",
        "user": user,
        "employee": employee,
        "course": course,
        "score": score,
        "passed": passed,
        "attempts": attempts,
        "completed_at": now_datetime()
    })

    result.insert(ignore_permissions=True)

    certificate = None

    if passed:
        certificate = generate_certificate(
            employee,
            course,
            result.name,
            score
        )

        result.certificate = certificate
        result.save(ignore_permissions=True)

    update_employee_training_history(
        employee,
        course,
        score,
        certificate,
        completion_date=today()
    )

    return result.name


def calculate_course_score(user, course):


    attempts = frappe.get_all(
        "LMS Quiz Attempt",
        filters={
            "user": user,
            "course": course
        },
        fields=["score"]
    )

    if not attempts:
        return 0

    scores = [a.score for a in attempts if a.score is not None]

    if not scores:
        return 0

    return max(scores)


def calculate_attempts(user, course):


    return frappe.db.count(
        "LMS Quiz Attempt",
        {
            "user": user,
            "course": course
        }
    )


def generate_certificate(employee, course, course_result, score):


    existing = frappe.db.exists(
        "LMS Certificate",
        {
            "employee": employee,
            "course": course
        }
    )

    if existing:
        return existing

    valid_until = add_years(today(), 2)

    cert = frappe.get_doc({
        "doctype": "LMS Certificate",
        "employee": employee,
        "course": course,
        "score": score,
        "issue_date": today(),
        "valid_until": valid_until,
        "course_result": course_result
    })

    cert.insert(ignore_permissions=True)

    return cert.name


def update_employee_training_history(employee, course, score, certificate, completion_date=None):

    emp = frappe.get_doc("Employee", employee)

    emp.append("training_history", {
        "course": course,
        "score": score,
        "certificate": certificate,
        "completion_date": completion_date or today()
    })

    emp.save(ignore_permissions=True)

