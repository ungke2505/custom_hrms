# import frappe
# from frappe.utils import getdate, nowdate
# from datetime, import date, timedelta

# @frappe.whitelist()
# def get_company_announcements():
#     """Ambil daftar pengumuman aktif untuk dashboard"""
#     today = getdate(nowdate())

#     announcements = frappe.get_all(
#         "Company Announcement",
#         filters={
#             "is_active": 1,
#             "docstatus": 1,
#             "start_date": ["<=", today],
#             "end_date": [">=", today],
#         },
#         fields=["name", "title", "content", "start_date", "end_date"],
#         order_by="start_date desc"
#     )

#     return {
#         "status": "success",
#         "announcements": announcements
#     }

# @frappe.whitelist()
# def get_upcoming_events(days_ahead=7):
#     """Ambil data ulang tahun & anniversary karyawan dalam X hari ke depan"""
#     today = date.today()
#     upcoming = today + timedelta(days=int(days_ahead))

#     birthdays = frappe.db.sql("""
#         SELECT name, employee_name, date_of_birth
#         FROM `tabEmployee`
#         WHERE 
#             date_of_birth IS NOT NULL
#             AND status = 'Active'
#             AND DAYOFYEAR(date_of_birth) BETWEEN DAYOFYEAR(%s) AND DAYOFYEAR(%s)
#         ORDER BY DAYOFYEAR(date_of_birth)
#     """, (today, upcoming), as_dict=True)

#     anniversaries = frappe.db.sql("""
#         SELECT name, employee_name, date_of_joining
#         FROM `tabEmployee`
#         WHERE 
#             date_of_joining IS NOT NULL
#             AND status = 'Active'
#             AND DAYOFYEAR(date_of_joining) BETWEEN DAYOFYEAR(%s) AND DAYOFYEAR(%s)
#         ORDER BY DAYOFYEAR(date_of_joining)
#     """, (today, upcoming), as_dict=True)

#     return {"birthdays": birthdays, "anniversaries": anniversaries}

# import frappe
# from frappe.utils import getdate, nowdate
# from datetime import date, timedelta

# @frappe.whitelist()
# def get_company_announcements():
#     """Ambil daftar pengumuman aktif untuk dashboard"""
#     today = getdate(nowdate())

#     announcements = frappe.get_all(
#         "Company Announcement",
#         filters={
#             "is_active": 1,
#             "docstatus": 1,
#             "start_date": ["<=", today],
#             "end_date": [">=", today],
#         },
#         fields=["name", "title", "content", "start_date", "end_date"],
#         order_by="start_date desc"
#     )

#     return {
#         "status": "success",
#         "announcements": announcements
#     }


# @frappe.whitelist()
# def get_upcoming_events(days_ahead=7):
#     """Ambil data ulang tahun & anniversary karyawan dalam X hari ke depan"""
#     today = date.today()
#     upcoming = today + timedelta(days=int(days_ahead))

#     birthdays = frappe.db.sql("""
#         SELECT 
#             name, employee_name, date_of_birth
#         FROM `tabEmployee`
#         WHERE 
#             date_of_birth IS NOT NULL
#             AND status = 'Active'
#             AND DAYOFYEAR(date_of_birth) BETWEEN DAYOFYEAR(%s) AND DAYOFYEAR(%s)
#         ORDER BY DAYOFYEAR(date_of_birth)
#     """, (today, upcoming), as_dict=True)

#     anniversaries = frappe.db.sql("""
#         SELECT 
#             name, employee_name, date_of_joining
#         FROM `tabEmployee`
#         WHERE 
#             date_of_joining IS NOT NULL
#             AND status = 'Active'
#             AND DAYOFYEAR(date_of_joining) BETWEEN DAYOFYEAR(%s) AND DAYOFYEAR(%s)
#         ORDER BY DAYOFYEAR(date_of_joining)
#     """, (today, upcoming), as_dict=True)

#     return {
#         "birthdays": birthdays,
#         "anniversaries": anniversaries
#     }

import frappe
from frappe.utils import getdate, nowdate
from datetime import date

@frappe.whitelist()
def get_company_announcements():
    """Ambil daftar pengumuman aktif untuk dashboard"""
    today = getdate(nowdate())

    announcements = frappe.get_all(
        "Company Announcement",
        filters={
            "is_active": 1,
            "docstatus": 1,
            "start_date": ["<=", today],
            "end_date": [">=", today],
        },
        fields=["name", "title", "content", "start_date", "end_date"],
        order_by="start_date desc"
    )

    return {
        "status": "success",
        "announcements": announcements
    }


@frappe.whitelist()
def get_today_events():
    """Ambil data ulang tahun & anniversary karyawan untuk hari ini"""
    today = date.today()

    birthdays = frappe.db.sql("""
        SELECT name, employee_name, date_of_birth
        FROM `tabEmployee`
        WHERE 
            date_of_birth IS NOT NULL
            AND status = 'Active'
            AND DAY(date_of_birth) = DAY(%s)
            AND MONTH(date_of_birth) = MONTH(%s)
    """, (today, today), as_dict=True)

    anniversaries = frappe.db.sql("""
        SELECT name, employee_name, date_of_joining
        FROM `tabEmployee`
        WHERE 
            date_of_joining IS NOT NULL
            AND status = 'Active'
            AND DAY(date_of_joining) = DAY(%s)
            AND MONTH(date_of_joining) = MONTH(%s)
    """, (today, today), as_dict=True)

    # Tambahkan jumlah tahun kerja
    for a in anniversaries:
        try:
            join_years = today.year - a["date_of_joining"].year
            a["years_of_service"] = join_years
        except Exception:
            a["years_of_service"] = None

    return {
        "birthdays": birthdays,
        "anniversaries": anniversaries
    }