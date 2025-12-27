import frappe
import base64
from frappe.utils import nowdate, nowtime
from frappe.utils.file_manager import save_file


@frappe.whitelist(allow_guest=False)
def create_sick_leave(employee, reason=None, attachment=None):
    """Buat dokumen Sick Leave Permit langsung dari frontend dengan validasi foto (kamera belakang)."""

    # 🧩 Pastikan user login
    if not frappe.session.user or frappe.session.user == "Guest":
        frappe.throw("Kamu harus login terlebih dahulu sebelum mengirim izin sakit.")

    # 🧩 Validasi field wajib
    if not employee:
        frappe.throw("Field 'employee' wajib diisi.")
    if not reason:
        frappe.throw("Field 'reason' wajib diisi.")

    # 🧩 Ambil nama karyawan dari master Employee
    employee_name = frappe.db.get_value("Employee", employee, "employee_name")
    if not employee_name:
        frappe.throw(f"Data Employee '{employee}' tidak ditemukan di sistem.")

    # 🧩 Buat dokumen baru
    doc = frappe.get_doc({
        "doctype": "Sick Leave Permit",
        "employee": employee,
        "employee_name": employee_name,
        "date": nowdate(),
        "time": nowtime(),
        "reason": reason.strip(),
    })

    # Simpan dulu agar dapat doc.name
    doc.insert(ignore_permissions=True)

    # 🧩 Jika ada foto bukti dari kamera belakang (base64)
    if attachment:
        try:
            # Pastikan format base64 valid
            if "," in attachment:
                attachment = attachment.split(",")[1]
            filedata = base64.b64decode(attachment)

            # Simpan file ke dokumen
            file_doc = save_file(
                f"{employee}-sick-leave.jpg",
                filedata,
                "Sick Leave Permit",
                doc.name,
                decode=False
            )

            # Update URL file di dokumen
            doc.attachment = file_doc.file_url
            doc.save(ignore_permissions=True)

        except Exception:
            frappe.log_error(frappe.get_traceback(), "Sick Leave Attachment Save Error")
            frappe.throw("Gagal menyimpan foto bukti izin sakit.")

    frappe.db.commit()

    # ✅ Kembalikan response terstruktur
    return {
        "status": "success",
        "message": "Izin sakit berhasil dikirim.",
        "name": doc.name,
        "employee": doc.employee,
        "employee_name": doc.employee_name,
        "date": doc.date,
        "time": doc.time,
        "reason": doc.reason,
        "attachment": doc.attachment or None
    }
