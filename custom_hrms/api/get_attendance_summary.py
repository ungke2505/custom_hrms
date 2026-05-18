# import frappe
# from frappe import _

# @frappe.whitelist()
# def get_attendance_summary():
#     month = frappe.form_dict.get("month")
#     if not month:
#         frappe.throw(_("Month is required"))

#     from_date = f"{month}-01"
#     to_date = frappe.utils.get_last_day(from_date)
#     employee = frappe.session.user

#     logs = frappe.get_all("Attendance Log", 
#         filters={
#             "employee": employee,
#             "date": ["between", [from_date, to_date]],
#         },
#         fields=["status", "late_entry", "date"]
#     )

#     total_present = sum(1 for log in logs if log.status == "Present")
#     total_late = sum(1 for log in logs if log.late_entry)
#     total_leave = sum(1 for log in logs if log.status == "On Leave")
#     total_days = frappe.utils.date_diff(to_date, from_date) + 1

#     return {
#         "month": month,
#         "total_present": total_present,
#         "total_late": total_late,
#         "total_leave": total_leave,
#         "total_days": total_days,
#     }

import frappe
from frappe import _
from frappe.utils import get_last_day, date_diff


@frappe.whitelist()
def get_attendance_summary():
    month = frappe.form_dict.get("month")
    if not month:
        frappe.throw(_("Month is required"))

    from_date = f"{month}-01"
    to_date = get_last_day(from_date)

    # =========================
    # Employee Mapping
    # =========================
    user = frappe.session.user

    employee = frappe.db.get_value(
        "Employee",
        {"user_id": user},
        "name"
    )

    if not employee:
        frappe.throw(_("Employee not found for this user"))

    # =========================
    # Attendance Logs (Bulanan)
    # =========================
    logs = frappe.get_all(
        "Attendance Log",
        filters={
            "employee": employee,
            "date": ["between", [from_date, to_date]],
        },
        fields=[
            "status",
            "late_entry",
            "late_minutes",
            "overbreak_minutes",
            "date"
        ]
    )

    total_late_minutes = sum((log.late_minutes or 0) for log in logs)
    total_overbreak_minutes = sum((log.overbreak_minutes or 0) for log in logs)

    # === DENDA RULE ===
    # Asumsi: 1 menit pelanggaran = 1 menit potong deposit
    # Kalau nanti rule beda, tinggal ubah di sini
    late_penalty_minutes = total_late_minutes
    overbreak_penalty_minutes = total_overbreak_minutes

    total_penalty_minutes = late_penalty_minutes + overbreak_penalty_minutes

    # =========================
    # Deposit (Akumulatif)
    # =========================
    deposit_doc = frappe.db.get_value(
        "Stock Opname Deposit",
        {"employee": employee},
        [
            "total_minutes",
            "used_minutes",
            "balance_after_minutes"
        ],
        as_dict=True
    )

    total_deposit_minutes = 0
    total_used_minutes = 0
    remaining_minutes = 0

    if deposit_doc:
        total_deposit_minutes = deposit_doc.total_minutes or 0
        total_used_minutes = deposit_doc.used_minutes or 0
        remaining_minutes = deposit_doc.balance_after_minutes or 0

    # =========================
    # Return
    # =========================
    return {
        # ===== DENDA =====
        "total_late_minutes": total_late_minutes,
        "late_penalty_minutes": late_penalty_minutes,

        "total_overbreak_minutes": total_overbreak_minutes,
        "overbreak_penalty_minutes": overbreak_penalty_minutes,

        "total_penalty_minutes": total_penalty_minutes,

        # ===== DEPOSIT =====
        "total_deposit_minutes": total_deposit_minutes,
        "total_used_minutes": total_used_minutes,
        "remaining_minutes": remaining_minutes,
    }