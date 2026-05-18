# import frappe
# from frappe import _

# @frappe.whitelist()
# def get_total_late_fines(from_date=None, to_date=None):
#     """Mengembalikan total late_fines untuk user yang sedang login berdasarkan range tanggal."""
#     try:
#         user = frappe.session.user

#         if user == "Guest":
#             frappe.throw(_("Silakan login terlebih dahulu."))

#         # Ambil employee berdasarkan user login
#         employee = frappe.db.get_value("Employee", {"user_id": user}, "name")
#         if not employee:
#             frappe.throw(_("Data Employee untuk user ini tidak ditemukan."))

#         # Jika from/to date tidak dikirim, gunakan bulan berjalan
#         from datetime import datetime
#         from calendar import monthrange

#         now = datetime.now()
#         if not from_date or not to_date:
#             from_date = f"{now.year}-{now.month:02d}-01"
#             to_date = f"{now.year}-{now.month:02d}-{monthrange(now.year, now.month)[1]}"

#         # Pastikan format tanggal valid
#         frappe.utils.getdate(from_date)
#         frappe.utils.getdate(to_date)

#         # Query total denda
#         result = frappe.db.sql(
#             """
#             SELECT 
#                 SUM(COALESCE(late_fines, 0)) AS total_late_fines
#             FROM `tabAttendance`
#             WHERE employee = %(employee)s
#               AND attendance_date BETWEEN %(from_date)s AND %(to_date)s
#               AND docstatus = 1
#             """,
#             {"employee": employee, "from_date": from_date, "to_date": to_date},
#             as_dict=True
#         )

#         total = result[0].get("total_late_fines") or 0.0
#         return {"employee": employee, "total_late_fines": round(float(total), 2)}

#     except Exception as e:
#         frappe.log_error(f"Error in get_total_late_fines: {e}", "Employee API Error")
#         frappe.throw(_("Terjadi kesalahan saat mengambil total denda."))


# import frappe
# from frappe import _
# from datetime import datetime
# from calendar import monthrange


# @frappe.whitelist()
# def get_employee_fine_and_deposit(from_date=None, to_date=None):
#     """Mengembalikan ringkasan denda + deposit untuk user login berdasarkan range tanggal."""
#     try:
#         user = frappe.session.user

#         if user == "Guest":
#             frappe.throw(_("Silakan login terlebih dahulu."))

#         # =========================
#         # Ambil Employee
#         # =========================
#         employee = frappe.db.get_value("Employee", {"user_id": user}, "name")
#         if not employee:
#             frappe.throw(_("Data Employee untuk user ini tidak ditemukan."))

#         # =========================
#         # Default bulan berjalan
#         # =========================
#         now = datetime.now()
#         if not from_date or not to_date:
#             from_date = f"{now.year}-{now.month:02d}-01"
#             to_date = f"{now.year}-{now.month:02d}-{monthrange(now.year, now.month)[1]}"

#         frappe.utils.getdate(from_date)
#         frappe.utils.getdate(to_date)

#         # =========================
#         # 1️⃣ DATA DARI ATTENDANCE
#         # =========================
#         attendance_data = frappe.db.sql(
#             """
#             SELECT 
#                 SUM(COALESCE(late_fines, 0)) AS total_late_fines,
#                 SUM(COALESCE(break_hours, 0)) AS total_break_hours,
#                 SUM(COALESCE(deposit_minutes_used, 0)) AS total_deposit_used_from_attendance
#             FROM `tabAttendance`
#             WHERE employee = %(employee)s
#               AND attendance_date BETWEEN %(from_date)s AND %(to_date)s
#               AND docstatus = 1
#             """,
#             {
#                 "employee": employee,
#                 "from_date": from_date,
#                 "to_date": to_date
#             },
#             as_dict=True
#         )[0]

#         total_late_fines = float(attendance_data.get("total_late_fines") or 0)
#         total_break_hours = float(attendance_data.get("total_break_hours") or 0)
#         total_deposit_used_from_attendance = int(
#             attendance_data.get("total_deposit_used_from_attendance") or 0
#         )

#         total_fines = total_late_fines  # Saat ini hanya dari late_fines

#         # =========================
#         # 2️⃣ DEPOSIT (SISTEM LEDGER)
#         # =========================
#         deposit_summary = frappe.db.sql(
#             """
#             SELECT 
#                 SUM(CASE WHEN transaction_type = 'Earned' THEN minutes ELSE 0 END) AS total_earned,
#                 SUM(CASE WHEN transaction_type = 'Used' THEN minutes ELSE 0 END) AS total_used
#             FROM `tabStock Opname Deposit`
#             WHERE employee = %(employee)s
#               AND docstatus = 1
#             """,
#             {"employee": employee},
#             as_dict=True
#         )[0]

#         total_deposit_earned = int(deposit_summary.get("total_earned") or 0)
#         total_deposit_used = int(deposit_summary.get("total_used") or 0)

#         # Ambil saldo terakhir berdasarkan posting_datetime terbaru
#         last_balance = frappe.db.get_value(
#             "Stock Opname Deposit",
#             {"employee": employee, "docstatus": 1},
#             "balance_after_minutes",
#             order_by="posting_datetime desc"
#         )

#         remaining_minutes = int(last_balance or 0)

#         # =========================
#         # RETURN RESPONSE
#         # =========================
#         return {
#             "employee": employee,

#             # DENDA
#             "total_late_fines": round(total_late_fines, 2),
#             "total_break_hours": round(total_break_hours, 2),
#             "total_fines": round(total_fines, 2),

#             # DEPOSIT
#             "total_deposit_earned_minutes": total_deposit_earned,
#             "total_deposit_used_minutes": total_deposit_used,
#             "total_deposit_used_from_attendance": total_deposit_used_from_attendance,
#             "remaining_minutes": remaining_minutes,
#         }

#     except Exception as e:
#         frappe.log_error(
#             f"Error in get_employee_fine_and_deposit: {e}",
#             "Employee API Error"
#         )
#         frappe.throw(_("Terjadi kesalahan saat mengambil data denda & deposit."))


import frappe
from frappe import _
from frappe.utils import getdate
from datetime import datetime
from calendar import monthrange


@frappe.whitelist()
def get_employee_fine_and_deposit(from_date=None, to_date=None):
    try:
        user = frappe.session.user

        if user == "Guest":
            frappe.throw(_("Silakan login terlebih dahulu."))

        # ================================
        # Ambil employee dari user login
        # ================================
        employee = frappe.db.get_value("Employee", {"user_id": user}, "name")
        if not employee:
            frappe.throw(_("Data Employee untuk user ini tidak ditemukan."))

        # ==================================
        # Default tanggal = bulan berjalan
        # ==================================
        now = datetime.now()

        if not from_date or not to_date:
            from_date = f"{now.year}-{now.month:02d}-01"
            to_date = f"{now.year}-{now.month:02d}-{monthrange(now.year, now.month)[1]}"

        getdate(from_date)
        getdate(to_date)

        # ==================================
        # TOTAL TERLAMBAT (MENIT)
        # ==================================
        late_minutes = frappe.db.sql("""
            SELECT SUM(COALESCE(late_minutes,0))
            FROM `tabAttendance`
            WHERE employee = %s
              AND attendance_date BETWEEN %s AND %s
              AND docstatus = 1
        """, (employee, from_date, to_date))[0][0] or 0

        # ==================================
        # TOTAL DENDA (RUPIAH)
        # ==================================
        total_fine = frappe.db.sql("""
            SELECT SUM(COALESCE(late_fines,0))
            FROM `tabAttendance`
            WHERE employee = %s
              AND attendance_date BETWEEN %s AND %s
              AND docstatus = 1
        """, (employee, from_date, to_date))[0][0] or 0

        # ==================================
        # TOTAL DEPOSIT DIDAPAT (MENIT)
        # ==================================
        deposit_earned = frappe.db.sql("""
            SELECT SUM(COALESCE(minutes,0))
            FROM `tabStock Opname Deposit`
            WHERE employee = %s
              AND transaction_type = 'Earned'
              AND DATE(posting_datetime) BETWEEN %s AND %s
              AND docstatus = 1
        """, (employee, from_date, to_date))[0][0] or 0

        # ==================================
        # TOTAL DEPOSIT DIGUNAKAN (MENIT)
        # ==================================
        deposit_used = frappe.db.sql("""
            SELECT SUM(COALESCE(minutes,0))
            FROM `tabStock Opname Deposit`
            WHERE employee = %s
              AND transaction_type = 'Used'
              AND DATE(posting_datetime) BETWEEN %s AND %s
              AND docstatus = 1
        """, (employee, from_date, to_date))[0][0] or 0

        # ==================================
        # SISA DEPOSIT (MENIT)
        # ==================================
        remaining_deposit = (deposit_earned or 0) - (deposit_used or 0)

        # Paksa numeric agar tidak NaN di frontend
        late_minutes = int(late_minutes or 0)
        deposit_earned = int(deposit_earned or 0)
        deposit_used = int(deposit_used or 0)
        remaining_deposit = int(remaining_deposit or 0)
        total_fine = float(total_fine or 0)

        return {
            "employee": employee,

            # MENIT
            "total_late_minutes": late_minutes,
            "total_deposit_earned_minutes": deposit_earned,
            "total_deposit_used_minutes": deposit_used,
            "remaining_deposit_minutes": remaining_deposit,

            # RUPIAH
            "total_fine": round(total_fine, 2)
        }

    except Exception as e:
        frappe.log_error(f"Error in get_employee_fine_and_deposit: {e}", "Employee API Error")
        frappe.throw(_("Terjadi kesalahan saat mengambil data karyawan."))