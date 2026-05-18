# File: custom_hrms/api/stock_opname.py

import frappe
from frappe.utils import now_datetime, nowdate, get_datetime, add_to_date


# =========================================================
# HELPER: GET ACTIVE SCHEDULE BY DATETIME RANGE
# =========================================================
def _get_active_schedule_for_user(user):
    schedules = frappe.db.sql("""
        SELECT 
            sop.name,
            sop.opname_date,
            sop.start_time,
            sop.auto_close_hours,
            sop.warehouse,
            sop.location
        FROM `tabStock Opname Schedule` sop
        INNER JOIN `tabStock Opname Participant` sop_part
            ON sop_part.parent = sop.name
        WHERE sop_part.user = %s
        AND sop.docstatus = 1
        AND sop.status = 'Ongoing'
        ORDER BY sop.opname_date DESC
    """, (user,), as_dict=True)

    now = now_datetime()

    for s in schedules:
        start_dt = get_datetime(f"{s.opname_date} {s.start_time}")
        end_dt = add_to_date(start_dt, hours=s.auto_close_hours)

        if start_dt <= now <= end_dt:
            return s

    return None


# =========================================================
# GET ACTIVE SCHEDULE
# =========================================================
@frappe.whitelist()
def get_active_stock_opname_schedule():
    user = frappe.session.user

    if user == "Guest":
        return {"status": "error", "message": "User not authenticated"}

    schedule = _get_active_schedule_for_user(user)

    if not schedule:
        return {"status": "no_schedule"}

    return {
        "status": "success",
        "data": {
            "name": schedule["name"],
            "warehouse": schedule["warehouse"],
            "location": schedule["location"],
            "opname_date": schedule["opname_date"],
            "start_time": schedule["start_time"]
        }
    }


# =========================================================
# GET TODAY LOGS (INI TIDAK DIUBAH)
# =========================================================
@frappe.whitelist()
def get_today_logs_stock_opname():
    user = frappe.session.user

    if user == "Guest":
        return {"status": "error", "message": "User not authenticated"}

    today_date = nowdate()
    start_of_day = get_datetime(f"{today_date} 00:00:00")
    end_of_day = get_datetime(f"{today_date} 23:59:59")

    logs = frappe.get_all(
        "Stock Opname Log",
        filters={
            "user": user,
            "log_time": ["between", [start_of_day, end_of_day]]
        },
        fields=["log_type", "log_time"],
        order_by="log_time asc"
    )

    return {
        "status": "success",
        "data": logs
    }


# =========================================================
# GET NEXT ACTION
# =========================================================
@frappe.whitelist()
def get_next_action_stock_opname():
    user = frappe.session.user

    if user == "Guest":
        return {"status": "error", "message": "User not authenticated"}

    schedule = _get_active_schedule_for_user(user)

    if not schedule:
        return {"status": "no_schedule"}

    schedule_name = schedule["name"]

    logs = frappe.get_all(
        "Stock Opname Log",
        filters={
            "schedule": schedule_name,
            "user": user
        },
        fields=["log_type"]
    )

    has_in = any(l.log_type == "IN" for l in logs)
    has_out = any(l.log_type == "OUT" for l in logs)

    if not has_in:
        next_action = "IN"
    elif has_in and not has_out:
        next_action = "OUT"
    else:
        return {"status": "completed"}

    return {
        "status": "success",
        "next_action": next_action,
        "schedule": schedule_name,
        "warehouse": schedule["warehouse"],
        "location": schedule["location"],
        "opname_date": schedule["opname_date"],
        "start_time": schedule["start_time"]
    }