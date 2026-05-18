import frappe
from frappe.utils import time_diff
from frappe.model.document import Document
from custom_hrms.custom_hrms.doctype.stock_opname_session.stock_opname_session import create_deposit_from_session


class StockOpnameLog(Document):
    pass


def before_insert(doc, method):
    validate_log_rules(doc)


def after_insert(doc, method):
    update_session_from_log(doc)


def validate_log_rules(doc):

    open_sessions = frappe.get_all(
        "Stock Opname Session",
        filters={
            "employee": doc.employee,
            "schedule": doc.schedule,
            "warehouse": doc.warehouse,
            "is_closed": 0
        },
        fields=["name"]
    )

    if doc.log_type == "OUT" and not open_sessions:
        frappe.throw("Tidak bisa OUT tanpa IN terlebih dahulu.")

    if doc.log_type == "IN" and open_sessions:
        frappe.throw("Masih ada session yang belum selesai (IN tanpa OUT).")


def update_session_from_log(doc):

    session_name = frappe.db.get_value(
        "Stock Opname Session",
        {
            "employee": doc.employee,
            "schedule": doc.schedule,
            "warehouse": doc.warehouse,
            "is_closed": 0
        },
        "name"
    )

    # =========================
    # HANDLE IN
    # =========================
    if doc.log_type == "IN":

        session_doc = frappe.new_doc("Stock Opname Session")
        session_doc.employee = doc.employee
        session_doc.schedule = doc.schedule
        session_doc.warehouse = doc.warehouse
        session_doc.in_time = doc.log_time
        session_doc.source_in_log = doc.name
        session_doc.insert(ignore_permissions=True)

        return

    # =========================
    # HANDLE OUT
    # =========================
    if doc.log_type == "OUT" and session_name:

        session_doc = frappe.get_doc("Stock Opname Session", session_name)

        session_doc.out_time = doc.log_time
        session_doc.source_out_log = doc.name

        diff = time_diff(session_doc.out_time, session_doc.in_time)
        minutes = diff.total_seconds() / 60 if diff else 0

        if minutes > 0:
            session_doc.total_minutes = int(minutes)
            session_doc.total_hours = round(minutes / 60, 2)
            session_doc.session_status = "Completed"
        else:
            session_doc.session_status = "Invalid"

        session_doc.is_closed = 1

        session_doc.save(ignore_permissions=True)

        # PANGGIL DEPOSIT SETELAH SAVE
        create_deposit_from_session(session_doc)