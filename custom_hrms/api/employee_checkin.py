import frappe
from frappe.utils import now_datetime, nowdate
import math


def haversine(lat1, lon1, lat2, lon2):
    """Hitung jarak (meter) antara dua titik koordinat."""
    R = 6371  # radius bumi (km)
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c * 1000  # hasil meter


# @frappe.whitelist()
# def employee_checkin(log_type, latitude=None, longitude=None):
#     """Validasi lokasi shift dan buat Employee Checkin"""
#     try:
#         user = frappe.session.user
#         employee = frappe.get_value("Employee", {"user_id": user}, "name")

#         if not employee:
#             return {"status": "error", "message": "Employee tidak ditemukan."}

#         shift_assignment = frappe.db.get_value(
#             "Shift Assignment",
#             {"employee": employee, "status": "Active"},
#             ["shift_location", "shift_type"],
#             as_dict=True,
#         )

#         if not shift_assignment:
#             return {"status": "error", "message": "Shift aktif tidak ditemukan."}

#         if not shift_assignment.shift_location:
#             return {"status": "error", "message": "Shift location belum ditetapkan."}

#         shift_location = frappe.db.get_value(
#             "Shift Location",
#             shift_assignment.shift_location,
#             ["latitude", "longitude", "radius", "location_name"],
#             as_dict=True,
#         )

#         if not shift_location:
#             return {"status": "error", "message": "Data lokasi shift tidak ditemukan."}

#         if not latitude or not longitude:
#             return {"status": "error", "message": "Koordinat lokasi tidak diterima dari perangkat."}

#         distance = haversine(
#             float(latitude),
#             float(longitude),
#             float(shift_location.latitude),
#             float(shift_location.longitude),
#         )

#         # 🔒 Validasi radius wajib
#         if distance > float(shift_location.radius):
#             return {
#                 "status": "error",
#                 "message": f"Anda berada di luar area shift ({distance:.1f} m dari {shift_location.location_name}).",
#             }

#         # ✅ Simpan ke Employee Checkin
#         checkin = frappe.get_doc({
#             "doctype": "Employee Checkin",
#             "employee": employee,
#             "time": now_datetime(),
#             "log_type": log_type,
#             "shift": shift_assignment.shift_type,
#             "shift_location": shift_assignment.shift_location,
#             "custom_latitude": latitude,
#             "custom_longitude": longitude,
#         })
#         checkin.insert(ignore_permissions=True)
#         frappe.db.commit()

#         return {
#             "status": "success",
#             "message": f"Berhasil {log_type.replace('_', ' ')}.",
#             "shift_location": shift_location.location_name,
#         }

#     except Exception as e:
#         frappe.log_error(f"Employee checkin error: {str(e)}", "Employee Checkin API Error")
#         return {"status": "error", "message": f"Server error: {str(e)}"}
# @frappe.whitelist()
# def employee_checkin(log_type, latitude=None, longitude=None, photo=None):
#     """Validasi lokasi shift, simpan foto, dan buat Employee Checkin"""
#     try:
#         user = frappe.session.user
#         employee = frappe.get_value("Employee", {"user_id": user}, "name")

#         if not employee:
#             return {"status": "error", "message": "Employee tidak ditemukan."}

#         shift_assignment = frappe.db.get_value(
#             "Shift Assignment",
#             {"employee": employee, "status": "Active"},
#             ["shift_location", "shift_type"],
#             as_dict=True,
#         )

#         if not shift_assignment:
#             return {"status": "error", "message": "Shift aktif tidak ditemukan."}

#         if not shift_assignment.shift_location:
#             return {"status": "error", "message": "Shift location belum ditetapkan."}

#         shift_location = frappe.db.get_value(
#             "Shift Location",
#             shift_assignment.shift_location,
#             ["latitude", "longitude", "radius", "location_name"],
#             as_dict=True,
#         )

#         if not shift_location:
#             return {"status": "error", "message": "Data lokasi shift tidak ditemukan."}

#         if not latitude or not longitude:
#             return {"status": "error", "message": "Koordinat lokasi tidak diterima dari perangkat."}

#         distance = haversine(
#             float(latitude),
#             float(longitude),
#             float(shift_location.latitude),
#             float(shift_location.longitude),
#         )

#         # 🔒 Validasi radius
#         if distance > float(shift_location.radius):
#             return {
#                 "status": "error",
#                 "message": f"Anda berada di luar area shift ({distance:.1f} m dari {shift_location.location_name}).",
#             }

#         # 📸 Simpan foto (jika dikirim dari aplikasi)
#         photo_url = None
#         if photo:
#             try:
#                 # Simpan file di folder private employee checkin
#                 filedoc = frappe.get_doc({
#                     "doctype": "File",
#                     "file_name": f"{employee}-{nowdate()}.jpg",
#                     "is_private": 1,
#                     "content": photo,
#                     "attached_to_doctype": "Employee Checkin",
#                     "attached_to_field": "custom_photo",
#                 })
#                 filedoc.save(ignore_permissions=True)
#                 photo_url = filedoc.file_url
#             except Exception as e:
#                 frappe.log_error(f"Gagal menyimpan foto checkin: {str(e)}")

#         # ✅ Simpan ke Employee Checkin
#         checkin = frappe.get_doc({
#             "doctype": "Employee Checkin",
#             "employee": employee,
#             "time": now_datetime(),
#             "log_type": log_type,
#             "shift": shift_assignment.shift_type,
#             "shift_location": shift_assignment.shift_location,
#             "custom_latitude": latitude,
#             "custom_longitude": longitude,
#             "custom_photo": photo_url,  # <-- field foto
#         })
#         checkin.insert(ignore_permissions=True)
#         frappe.db.commit()

#         return {
#             "status": "success",
#             "message": f"Berhasil {log_type.replace('_', ' ')}.",
#             "shift_location": shift_location.location_name,
#         }

#     except Exception as e:
#         frappe.log_error(f"Employee checkin error: {str(e)}", "Employee Checkin API Error")
#         return {"status": "error", "message": f"Server error: {str(e)}"}

@frappe.whitelist()
def employee_checkin(log_type, latitude=None, longitude=None, photo=None):
    try:
        user = frappe.session.user
        employee = frappe.get_value("Employee", {"user_id": user}, "name")

        if not employee:
            return {"status": "error", "message": "Employee tidak ditemukan."}

        shift_assignment = frappe.db.get_value(
            "Shift Assignment",
            {"employee": employee, "status": "Active"},
            ["shift_location", "shift_type"],
            as_dict=True,
        )

        if not shift_assignment:
            return {"status": "error", "message": "Shift aktif tidak ditemukan."}

        if not shift_assignment.shift_location:
            return {"status": "error", "message": "Shift location belum ditetapkan."}

        shift_location = frappe.db.get_value(
            "Shift Location",
            shift_assignment.shift_location,
            ["latitude", "longitude", "radius", "location_name"],
            as_dict=True,
        )

        if not latitude or not longitude:
            return {"status": "error", "message": "Koordinat lokasi tidak diterima dari perangkat."}

        # 🔍 Validasi jarak dengan Haversine
        distance = haversine(
            float(latitude),
            float(longitude),
            float(shift_location.latitude),
            float(shift_location.longitude),
        )

        if distance > float(shift_location.radius):
            return {
                "status": "error",
                "message": f"Anda berada di luar area shift ({distance:.1f} m dari {shift_location.location_name}).",
            }

        # 📝 Simpan ke Employee Checkin
        checkin = frappe.get_doc({
            "doctype": "Employee Checkin",
            "employee": employee,
            "time": now_datetime(),
            "log_type": log_type,
            "shift": shift_assignment.shift_type,
            "shift_location": shift_assignment.shift_location,
            "custom_latitude": latitude,
            "custom_longitude": longitude,
        })
        checkin.insert(ignore_permissions=True)  # ⬅️ Insert dulu biar punya name

        # 📸 Simpan foto base64 (jika ada)
        if photo:
            import base64
            from frappe.utils.file_manager import save_file

            try:
                image_data = base64.b64decode(photo.split(",")[1])
                file_doc = save_file(
                    f"{employee}_{log_type}.jpg",
                    image_data,
                    "Employee Checkin",
                    checkin.name,  # ✅ sekarang sudah valid
                    is_private=True,
                )
                checkin.attendance_photo = file_doc.file_url
                checkin.save(ignore_permissions=True)
            except Exception as e:
                frappe.log_error(f"Employee photo save error: {str(e)}", "Employee Checkin Photo Error")

        frappe.db.commit()

        return {
            "status": "success",
            "message": f"Berhasil {log_type.replace('_', ' ')}.",
            "shift_location": shift_location.location_name,
        }

    except Exception as e:
        frappe.log_error(f"Employee checkin error: {str(e)}", "Employee Checkin API Error")
        return {"status": "error", "message": f"Server error: {str(e)}"}



def get_employee_shift(employee):
    """Ambil shift aktif dan lokasi shift karyawan."""
    shift_assignment = frappe.db.get_value(
        "Shift Assignment",
        {"employee": employee, "status": "Active"},
        ["shift_type", "shift_location"],
        as_dict=True,
    )
    if not shift_assignment:
        return {"shift_type": None, "shift_location": None}
    return {
        "shift_type": shift_assignment.shift_type,
        "shift_location": shift_assignment.shift_location,
    }

# ================================working version=================================
# @frappe.whitelist()
# def get_next_action():
#     from frappe.utils import nowdate

#     user = frappe.session.user
#     employee = frappe.get_value("Employee", {"user_id": user}, "name")

#     if not employee:
#         return {
#             "status": "error",
#             "message": "Employee tidak ditemukan",
#             "next_actions": [],
#         }

#     today = nowdate()
#     shift_info = get_employee_shift(employee)
#     shift_type = shift_info.get("shift_type")

#     if not shift_type:
#         return {
#             "status": "error",
#             "message": "Shift aktif tidak ditemukan.",
#             "next_actions": [],
#         }

#     last_log = frappe.db.get_value(
#         "Employee Checkin",
#         {"employee": employee, "time": (">=", today)},
#         ["log_type", "time"],
#         order_by="time desc",
#     )

#     last_log_type = last_log[0] if last_log else None

#     transitions = {
#         None: ["IN"],
#         "IN": ["BREAK_OUT", "OUT"],
#         "BREAK_OUT": ["BREAK_IN"],
#         "BREAK_IN": ["BREAK_OUT", "OUT"],
#         "OUT": [],
#     }

#     next_actions = transitions.get(last_log_type, [])
#     default_action = next_actions[0] if next_actions else None

#     return {
#         "status": "success",
#         "last_log": last_log_type,
#         "next_actions": next_actions,
#         "default_action": default_action,
#         "shift_type": shift_type,
#         "shift_location": shift_info.get("shift_location"),
#     }
# =================================working version=================================

@frappe.whitelist()
def get_next_action():
    from frappe.utils import nowdate

    user = frappe.session.user
    employee = frappe.get_value("Employee", {"user_id": user}, "name")

    if not employee:
        return {
            "status": "error",
            "message": "Employee tidak ditemukan",
            "next_actions": [],
        }

    today = nowdate()
    shift_info = get_employee_shift(employee)
    shift_type = shift_info.get("shift_type")

    if not shift_type:
        return {
            "status": "error",
            "message": "Shift aktif tidak ditemukan.",
            "next_actions": [],
        }

    last_log = frappe.db.get_value(
        "Employee Checkin",
        {"employee": employee, "time": (">=", today)},
        ["log_type", "time"],
        order_by="time desc",
    )

    last_log_type = last_log[0] if last_log else None

    transitions = {
        None: ["IN"],
        "IN": ["BREAK_OUT", "OUT"],
        "BREAK_OUT": ["BREAK_IN"],
        "BREAK_IN": ["BREAK_OUT", "OUT"],
        "OUT": [],
    }

    next_actions = transitions.get(last_log_type, [])
    default_action = next_actions[0] if next_actions else None

    # 🔍 Tambahkan detail lokasi shift
    shift_location_detail = None
    if shift_info.get("shift_location"):
        shift_location_detail = frappe.db.get_value(
            "Shift Location",
            shift_info.get("shift_location"),
            ["latitude", "longitude", "radius", "location_name"],
            as_dict=True,
        )

    return {
        "status": "success",
        "last_log": last_log_type,
        "next_actions": next_actions,
        "default_action": default_action,
        "shift_type": shift_type,
        "shift_location": shift_info.get("shift_location"),
        "shift_location_detail": shift_location_detail,
    }
