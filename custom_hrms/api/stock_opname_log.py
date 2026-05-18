# File: custom_hrms/api/stock_opname_log.py

import frappe
import math
import base64
from frappe.utils import now_datetime, getdate, nowdate, get_datetime
from datetime import datetime
# =========================================================
# MAIN API
# =========================================================
@frappe.whitelist(allow_guest=False)
def create_stock_opname_log():
    try:
        data = frappe.form_dict
        user = frappe.session.user

        _validate_authenticated_user(user)

        payload = _extract_and_validate_payload(data)

        schedule = _get_valid_schedule(payload["schedule_name"])
        employee = _get_valid_participant(schedule.name, user)

        _validate_log_flow(schedule.name, user, payload["log_type"])

        distance = _validate_location_radius(
            schedule.location,
            payload["latitude"],
            payload["longitude"],
        )

        file_doc = _save_photo(payload["photo"])

        _create_log(schedule, user, employee, payload, distance, file_doc)

        frappe.db.commit()

        return {
            "status": "success",
            "message": f"Stock Opname {payload['log_type']} berhasil direkam"
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Stock Opname API Error")
        return {"status": "error", "message": str(e)}


# =========================================================
# VALIDATION & DATA EXTRACTION
# =========================================================
def _validate_authenticated_user(user):
    if not user or user == "Guest":
        frappe.throw("User not authenticated")


def _extract_and_validate_payload(data):
    schedule_name = data.get("schedule_name")
    log_type = (data.get("log_type") or "").strip().upper()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    photo = data.get("photo")

    if not schedule_name:
        frappe.throw("Schedule tidak ditemukan")

    if log_type not in ["IN", "OUT"]:
        frappe.throw(f"Invalid log type: {log_type}")

    if not latitude or not longitude:
        frappe.throw("Location coordinates are required")

    if not photo:
        frappe.throw("Photo is required")

    return {
        "schedule_name": schedule_name,
        "log_type": log_type,
        "latitude": float(latitude),
        "longitude": float(longitude),
        "photo": photo,
    }


def _get_valid_schedule(schedule_name):
    try:
        schedule = frappe.get_doc("Stock Opname Schedule", schedule_name)
    except frappe.DoesNotExistError:
        frappe.throw("Schedule tidak ditemukan / kadaluarsa")

    if schedule.status != "Ongoing" or schedule.docstatus != 1:
        frappe.throw("Schedule tidak aktif")

    # Validasi tanggal
    from frappe.utils import add_to_date

    start_datetime = get_datetime(f"{schedule.opname_date} {schedule.start_time}")
    end_datetime = add_to_date(start_datetime, hours=schedule.auto_close_hours)

    now = now_datetime()

    if now < start_datetime:
        frappe.throw("Schedule belum dimulai")

    if now > end_datetime:
        frappe.throw("Schedule sudah berakhir")


    return schedule

def _get_valid_participant(schedule_name, user):
    participant = frappe.db.get_value(
        "Stock Opname Participant",
        {"parent": schedule_name, "user": user},
        ["employee"],
        as_dict=True
    )

    if not participant:
        frappe.throw("Anda tidak terdaftar di schedule ini")

    return participant.employee


# =========================================================
# BUSINESS RULE VALIDATION
# =========================================================

def _validate_log_flow(schedule_name, user, log_type):
    logs = frappe.get_all(
        "Stock Opname Log",
        filters={"schedule": schedule_name, "user": user},
        fields=["log_type", "log_time"],
        order_by="log_time asc"
    )

    if not logs:
        # Belum ada log → hanya boleh IN
        if log_type != "IN":
            frappe.throw("Harus check in terlebih dahulu")
        return

    last_log = logs[-1]
    # ===============================
    # RULE BERBASIS SEQUENCE
    # ===============================
    if log_type == "IN":
        if last_log.log_type == "IN":
            frappe.throw("Anda masih dalam sesi kerja, tidak bisa check in lagi")

    elif log_type == "OUT":
        if last_log.log_type != "IN":
            frappe.throw("Tidak ada sesi aktif untuk check out")


def _validate_location_radius(location_name, lat, lon):
    location_doc = frappe.get_doc("Shift Location", location_name)

    if not location_doc.latitude or not location_doc.longitude:
        frappe.throw("Shift Location tidak memiliki koordinat")

    if not location_doc.radius:
        frappe.throw("Radius shift tidak diatur")

    distance = calculate_distance(
        lat,
        lon,
        float(location_doc.latitude),
        float(location_doc.longitude)
    )

    if distance > float(location_doc.radius):
        frappe.throw("Anda berada di luar radius lokasi")

    return distance


# =========================================================
# LOG CREATION
# =========================================================
def _create_log(schedule, user, employee, payload, distance, file_doc):
    log = frappe.get_doc({
        "doctype": "Stock Opname Log",
        "schedule": schedule.name,
        "user": user,
        "employee": employee,
        "warehouse": schedule.warehouse,
        "location": schedule.location,
        "log_type": payload["log_type"],
        "log_time": now_datetime(),
        "latitude": payload["latitude"],
        "longitude": payload["longitude"],
        "distance": distance,
        "photo": file_doc.file_url
    })

    log.insert(ignore_permissions=True)


# =========================================================
# HELPERS
# =========================================================
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2)
        * math.sin(delta_lambda / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def _save_photo(photo_base64):
    if "," not in photo_base64:
        frappe.throw("Format foto tidak valid")

    try:
        header, encoded = photo_base64.split(",", 1)
        file_data = base64.b64decode(encoded)
    except Exception:
        frappe.throw("Foto tidak valid atau rusak")

    file_doc = frappe.get_doc({
        "doctype": "File",
        "file_name": f"stock_opname_{now_datetime().timestamp()}.jpg",
        "is_private": 1,
        "content": file_data
    })

    file_doc.save(ignore_permissions=True)
    return file_doc