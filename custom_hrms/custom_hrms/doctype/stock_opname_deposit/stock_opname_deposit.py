import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


class StockOpnameDeposit(Document):
    pass


def create_deposit_from_session(session_name):
    session = frappe.get_doc("Stock Opname Session", session_name)

    # ============================
    # VALIDATION
    # ============================

    if not session.is_closed:
        frappe.throw("Session belum ditutup")

    if session.session_status != "Completed":
        frappe.throw("Session belum completed")

    if not session.employee:
        frappe.throw("Employee tidak ditemukan pada session")

    if not session.total_minutes:
        frappe.throw("Total minutes tidak ditemukan")

    # Cegah double ledger
    existing = frappe.db.exists(
        "Stock Opname Deposit",
        {
            "reference_doctype": "Stock Opname Session",
            "reference_name": session.name
        }
    )

    if existing:
        return

    earned_minutes = int(session.total_minutes)

    # ============================
    # GET LAST BALANCE
    # ============================

    last_balance = frappe.db.sql("""
        SELECT balance_after_minutes
        FROM `tabStock Opname Deposit`
        WHERE employee = %s
        ORDER BY posting_datetime DESC
        LIMIT 1
    """, session.employee)

    last_balance = last_balance[0][0] if last_balance else 0
    new_balance = int(last_balance) + earned_minutes

    # ============================
    # CREATE LEDGER ENTRY
    # ============================

    doc = frappe.get_doc({
        "doctype": "Stock Opname Deposit",
        "employee": session.employee,
        "posting_datetime": now_datetime(),
        "schedule": session.schedule,
        "session": session.name,
        "transaction_type": "Earned",
        "minutes": earned_minutes,
        "balance_after_minutes": new_balance,
        "reference_doctype": "Stock Opname Session",
        "reference_name": session.name,
        "remarks": "Auto generated from completed Stock Opname Session"
    })

    doc.insert(ignore_permissions=True)
    doc.submit()