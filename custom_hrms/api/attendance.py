import frappe
from frappe import _

@frappe.whitelist()
def get_monthly_attendance(employee, month):
    # Format: month = "2025-06"
    from_date = f"{month}-01"
    to_date = frappe.utils.get_last_day(from_date)

    # Ambil log kehadiran dalam periode
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


# @frappe.whitelist(allow_guest=False)
# def check_in_out(employee, latitude, longitude):
#     """
#     Check-In atau Check-Out untuk employee.
#     - Jika belum check-in hari ini, buat record check-in.
#     - Jika sudah check-in, buat record check-out.
#     """
#     from datetime import date, datetime

#     today = date.today()
    
#     # Cek apakah ada Attendance hari ini
#     attendance = frappe.get_all(
#         "Attendance",
#         filters={"employee": employee, "attendance_date": today},
#         limit=1
#     )

#     if attendance:
#         # Sudah check-in, lakukan check-out
#         att = frappe.get_doc("Attendance", attendance[0].name)
#         att.check_out = datetime.now().time()
#         att.check_out_location = f"{latitude},{longitude}"
#         att.save()
#         frappe.db.commit()
#         return {"status": "checked_out"}
#     else:
#         # Belum check-in, buat record baru
#         att = frappe.get_doc({
#             "doctype": "Attendance",
#             "employee": employee,
#             "attendance_date": today,
#             "check_in": datetime.now().time(),
#             "check_in_location": f"{latitude},{longitude}"
#         })
#         att.insert()
#         frappe.db.commit()
#         return {"status": "checked_in"}
