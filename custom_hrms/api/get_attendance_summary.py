import frappe
from frappe import _

@frappe.whitelist()
def get_attendance_summary():
    month = frappe.form_dict.get("month")
    if not month:
        frappe.throw(_("Month is required"))

    from_date = f"{month}-01"
    to_date = frappe.utils.get_last_day(from_date)
    employee = frappe.session.user

    logs = frappe.get_all("Attendance Log", 
        filters={
            "employee": employee,
            "date": ["between", [from_date, to_date]],
        },
        fields=["status", "late_entry", "date"]
    )

    total_present = sum(1 for log in logs if log.status == "Present")
    total_late = sum(1 for log in logs if log.late_entry)
    total_leave = sum(1 for log in logs if log.status == "On Leave")
    total_days = frappe.utils.date_diff(to_date, from_date) + 1

    return {
        "month": month,
        "total_present": total_present,
        "total_late": total_late,
        "total_leave": total_leave,
        "total_days": total_days,
    }
