
# # import frappe
# # from frappe.model.document import Document
# # from frappe.utils import now_datetime


# # class StockOpnameSession(Document):

# #     def on_update(self):
# #         self.process_deposit_posting()

# #     def process_deposit_posting(self):
# #         frappe.logger().info("MASUK PROCESS DEPOSIT")

# #         if not (
# #             self.session_status == "Completed"
# #             and self.is_closed
# #             and not self.is_posted_deposit
# #         ):
# #             return

# #         if not self.total_minutes or self.total_minutes <= 0:
# #             return

# #         # Cegah double posting
# #         existing = frappe.db.exists(
# #             "Stock Opname Deposit",
# #             {
# #                 "reference_doctype": "Stock Opname Session",
# #                 "reference_name": self.name
# #             }
# #         )

# #         if existing:
# #             return

# #         earned_minutes = int(self.total_minutes)

# #         # =========================
# #         # GET LAST BALANCE
# #         # =========================

# #         last_balance = frappe.db.sql("""
# #             SELECT balance_after_minutes
# #             FROM `tabStock Opname Deposit`
# #             WHERE employee = %s
# #             ORDER BY posting_datetime DESC
# #             LIMIT 1
# #         """, self.employee)

# #         last_balance = last_balance[0][0] if last_balance else 0

# #         new_balance = last_balance + earned_minutes

# #         # =========================
# #         # CREATE LEDGER ENTRY
# #         # =========================

# #         ledger = frappe.get_doc({
# #             "doctype": "Stock Opname Deposit",
# #             "employee": self.employee,
# #             "posting_datetime": frappe.utils.now_datetime(),
# #             "schedule": self.schedule,
# #             "session": self.name,
# #             "transaction_type": "Earned",
# #             "minutes": earned_minutes,
# #             "balance_after_minutes": new_balance,
# #             "reference_doctype": "Stock Opname Session",
# #             "reference_name": self.name,
# #             "remarks": "Auto generated from completed session"
# #         })

# #         ledger.insert(ignore_permissions=True)
# #         ledger.submit()

# #         self.db_set("is_posted_deposit", 1, update_modified=False)

# #         frappe.msgprint("DEPOSIT BERHASIL DIBUAT")

# import frappe
# from frappe.model.document import Document
# from frappe.utils import now_datetime


# class StockOpnameSession(Document):
#     pass


# def create_deposit_from_session(session_doc):

#     # =========================
#     # DEBUG AWAL (WAJIB)
#     # =========================
#     frappe.logger().info(
#         f"[DEPOSIT] Triggered | "
#         f"Session: {session_doc.name} | "
#         f"Status: {session_doc.session_status} | "
#         f"Closed: {session_doc.is_closed} | "
#         f"Posted: {session_doc.is_posted_deposit} | "
#         f"Minutes: {session_doc.total_minutes}"
#     )

#     # =========================
#     # VALIDASI KONDISI
#     # =========================
#     if session_doc.session_status != "Completed":
#         frappe.logger().info("[DEPOSIT] Skip - status not Completed")
#         return

#     if not session_doc.is_closed:
#         frappe.logger().info("[DEPOSIT] Skip - session not closed")
#         return

#     if session_doc.is_posted_deposit:
#         frappe.logger().info("[DEPOSIT] Skip - already posted")
#         return

#     if not session_doc.total_minutes or session_doc.total_minutes <= 0:
#         frappe.logger().info("[DEPOSIT] Skip - invalid minutes")
#         return

#     # =========================
#     # CEGAH DOUBLE POSTING
#     # =========================
#     existing = frappe.db.exists(
#         "Stock Opname Deposit",
#         {
#             "reference_doctype": "Stock Opname Session",
#             "reference_name": session_doc.name
#         }
#     )

#     if existing:
#         frappe.logger().info("[DEPOSIT] Skip - ledger already exists")
#         return

#     earned_minutes = int(session_doc.total_minutes)

#     # =========================
#     # GET LAST BALANCE
#     # =========================
#     last_balance = frappe.db.sql("""
#         SELECT balance_after_minutes
#         FROM `tabStock Opname Deposit`
#         WHERE employee = %s
#         ORDER BY posting_datetime DESC
#         LIMIT 1
#     """, session_doc.employee)

#     last_balance = last_balance[0][0] if last_balance else 0
#     new_balance = last_balance + earned_minutes

#     # =========================
#     # CREATE LEDGER ENTRY
#     # =========================
#     ledger = frappe.get_doc({
#         "doctype": "Stock Opname Deposit",
#         "employee": session_doc.employee,
#         "posting_datetime": now_datetime(),
#         "schedule": session_doc.schedule,
#         "session": session_doc.name,
#         "transaction_type": "Earned",
#         "minutes": earned_minutes,
#         "balance_after_minutes": new_balance,
#         "reference_doctype": "Stock Opname Session",
#         "reference_name": session_doc.name,
#         "remarks": "Auto generated from completed session"
#     })

#     ledger.insert(ignore_permissions=True)

#     # Mark as posted
#     session_doc.db_set("is_posted_deposit", 1, update_modified=False)

#     frappe.logger().info(
#         f"[DEPOSIT] SUCCESS | Session: {session_doc.name} | "
#         f"Earned: {earned_minutes} | New Balance: {new_balance}"
#     )


import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


class StockOpnameSession(Document):
    pass


def process_pending_deposits():

    sessions = frappe.get_all(
        "Stock Opname Session",
        filters={
            "session_status": "Completed",
            "is_closed": 1,
            "is_posted_deposit": 0
        },
        fields=["name"]
    )

    for s in sessions:
        session_doc = frappe.get_doc("Stock Opname Session", s.name)
        create_deposit_from_session(session_doc)


def create_deposit_from_session(session_doc):

    if not session_doc.total_minutes or session_doc.total_minutes <= 0:
        return

    existing = frappe.db.exists(
        "Stock Opname Deposit",
        {
            "reference_doctype": "Stock Opname Session",
            "reference_name": session_doc.name
        }
    )

    if existing:
        session_doc.db_set("is_posted_deposit", 1)
        return

    earned_minutes = int(session_doc.total_minutes)

    last_balance = frappe.db.sql("""
        SELECT balance_after_minutes
        FROM `tabStock Opname Deposit`
        WHERE employee = %s
        ORDER BY posting_datetime DESC
        LIMIT 1
    """, session_doc.employee)

    last_balance = last_balance[0][0] if last_balance else 0
    new_balance = last_balance + earned_minutes

    ledger = frappe.get_doc({
        "doctype": "Stock Opname Deposit",
        "employee": session_doc.employee,
        "posting_datetime": now_datetime(),
        "schedule": session_doc.schedule,
        "session": session_doc.name,
        "transaction_type": "Earned",
        "minutes": earned_minutes,
        "balance_after_minutes": new_balance,
        "reference_doctype": "Stock Opname Session",
        "reference_name": session_doc.name,
        "remarks": "Auto generated from completed session (Scheduler)"
    })

    ledger.insert(ignore_permissions=True)
    ledger.submit()

    session_doc.db_set("is_posted_deposit", 1)