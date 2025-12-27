# import frappe
# from frappe.utils import get_first_day, get_last_day

# @frappe.whitelist()
# def get_total_late_fines(year=None, month=None):
#     user = frappe.session.user
#     employee = frappe.db.get_value("Employee", {"user_id": user}, "name")

#     if not employee:
#         return {"total_late_fines": 0}

#     if not year or not month:
#         return {"total_late_fines": 0}

#     from datetime import date

#     start_date = get_first_day(date(int(year), int(month), 1))
#     end_date = get_last_day(date(int(year), int(month), 1))

#     late_fines = frappe.db.sql("""
#         SELECT COALESCE(SUM(late_fines), 0)
#         FROM `tabAttendance`
#         WHERE employee = %s
#         AND attendance_date BETWEEN %s AND %s
#     """, (employee, start_date, end_date))

#     total_fine = float(late_fines[0][0]) if late_fines and late_fines[0][0] is not None else 0.0

#     return {"total_late_fines": total_fine}

# import frappe
# from frappe import _

# @frappe.whitelist()
# def get_total_late_fines(year=None, month=None):
#     """Mengembalikan total late_fines untuk user yang sedang login."""
#     try:
#         # Ambil user login
#         user = frappe.session.user

#         # Pastikan bukan Guest
#         if user == "Guest":
#             frappe.throw(_("Silakan login terlebih dahulu."))

#         # Cari employee yang terkait dengan user login
#         employee = frappe.db.get_value("Employee", {"user_id": user}, "name")
#         if not employee:
#             frappe.throw(_("Employee untuk user ini tidak ditemukan."))

#         # Jika tidak dikirim bulan/tahun, pakai current date
#         from datetime import datetime
#         now = datetime.now()
#         year = int(year) if year else now.year
#         month = int(month) if month else now.month

#         # Hitung rentang tanggal bulan tersebut
#         from calendar import monthrange
#         start_date = f"{year}-{month:02d}-01"
#         end_date = f"{year}-{month:02d}-{monthrange(year, month)[1]}"

#         # Ambil total late fines
#         total = frappe.db.sql(
#             """
#             SELECT SUM(COALESCE(late_fines, 0))
#             FROM `tabAttendance`
#             WHERE employee = %s
#               AND attendance_date BETWEEN %s AND %s
#               AND docstatus = 1
#             """,
#             (employee, start_date, end_date),
#         )[0][0] or 0.0

#         return {"employee": employee, "total_late_fines": round(float(total), 2)}

#     except Exception as e:
#         frappe.log_error(f"Error in get_total_late_fines: {e}", "Employee API Error")
#         frappe.throw(_("Terjadi kesalahan saat mengambil total denda."))

     
import frappe
from frappe import _

@frappe.whitelist()
def get_total_late_fines(from_date=None, to_date=None):
    """Mengembalikan total late_fines untuk user yang sedang login berdasarkan range tanggal."""
    try:
        user = frappe.session.user

        if user == "Guest":
            frappe.throw(_("Silakan login terlebih dahulu."))

        # Ambil employee berdasarkan user login
        employee = frappe.db.get_value("Employee", {"user_id": user}, "name")
        if not employee:
            frappe.throw(_("Data Employee untuk user ini tidak ditemukan."))

        # Jika from/to date tidak dikirim, gunakan bulan berjalan
        from datetime import datetime
        from calendar import monthrange

        now = datetime.now()
        if not from_date or not to_date:
            from_date = f"{now.year}-{now.month:02d}-01"
            to_date = f"{now.year}-{now.month:02d}-{monthrange(now.year, now.month)[1]}"

        # Pastikan format tanggal valid
        frappe.utils.getdate(from_date)
        frappe.utils.getdate(to_date)

        # Query total denda
        result = frappe.db.sql(
            """
            SELECT 
                SUM(COALESCE(late_fines, 0)) AS total_late_fines
            FROM `tabAttendance`
            WHERE employee = %(employee)s
              AND attendance_date BETWEEN %(from_date)s AND %(to_date)s
              AND docstatus = 1
            """,
            {"employee": employee, "from_date": from_date, "to_date": to_date},
            as_dict=True
        )

        total = result[0].get("total_late_fines") or 0.0
        return {"employee": employee, "total_late_fines": round(float(total), 2)}

    except Exception as e:
        frappe.log_error(f"Error in get_total_late_fines: {e}", "Employee API Error")
        frappe.throw(_("Terjadi kesalahan saat mengambil total denda."))
