import frappe

def execute(filters=None):
    if not filters:
        filters = {}

    report_type = filters.get("report_type", "Session")

    if report_type == "Session":
        columns = get_session_columns()
        data = get_session_data(filters)

    elif report_type == "Log":
        columns = get_log_columns()
        data = get_log_data(filters)

    elif report_type == "Balance":
        columns = get_balance_columns()
        data = get_balance_data(filters)

    elif report_type == "Participation":
        columns = get_participation_columns()
        data = get_participation_data(filters)

    elif report_type == "Summary":
        columns = get_summary_columns()
        data = get_summary_data(filters)

    else:
        columns, data = [], []

    return columns, data


# =====================================================
# SESSION REPORT
# =====================================================
def get_session_columns():
    return [
        {"label": "Opname Date", "fieldname": "opname_date", "fieldtype": "Date"},
        {"label": "Employee", "fieldname": "employee", "fieldtype": "Link", "options": "Employee"},
        {"label": "Employee Name", "fieldname": "employee_name", "fieldtype": "Data"},
        {"label": "Schedule", "fieldname": "schedule", "fieldtype": "Link", "options": "Stock Opname Schedule"},
        {"label": "Warehouse", "fieldname": "warehouse", "fieldtype": "Link", "options": "Warehouse"},
        {"label": "Location", "fieldname": "location", "fieldtype": "Link", "options": "Shift Location"},
        {"label": "In Time", "fieldname": "in_time", "fieldtype": "Datetime"},
        {"label": "Out Time", "fieldname": "out_time", "fieldtype": "Datetime"},
        {"label": "Total Minutes", "fieldname": "total_minutes", "fieldtype": "Int"},
        {"label": "Total Hours", "fieldname": "total_hours", "fieldtype": "Float"},
        {"label": "Status", "fieldname": "session_status", "fieldtype": "Data"},
    ]


def get_session_data(filters):
    conditions = []
    values = {}

    if filters.get("employee"):
        conditions.append("ses.employee = %(employee)s")
        values["employee"] = filters.get("employee")

    if filters.get("branch"):
        conditions.append("emp.branch = %(branch)s")
        values["branch"] = filters.get("branch")

    if filters.get("warehouse"):
        conditions.append("sch.warehouse = %(warehouse)s")
        values["warehouse"] = filters.get("warehouse")

    if filters.get("location"):
        conditions.append("sch.location = %(location)s")
        values["location"] = filters.get("location")

    if filters.get("from_date"):
        conditions.append("sch.opname_date >= %(from_date)s")
        values["from_date"] = filters.get("from_date")

    if filters.get("to_date"):
        conditions.append("sch.opname_date <= %(to_date)s")
        values["to_date"] = filters.get("to_date")

    where_clause = " AND ".join(conditions)
    if where_clause:
        where_clause = "WHERE " + where_clause

    query = f"""
        SELECT
            sch.opname_date,
            ses.employee,
            ses.employee_name,
            ses.schedule,
            sch.warehouse,
            sch.location,
            ses.in_time,
            ses.out_time,
            ses.total_minutes,
            ses.total_hours,
            ses.session_status
        FROM `tabStock Opname Session` ses
        LEFT JOIN `tabStock Opname Schedule` sch
            ON ses.schedule = sch.name
        LEFT JOIN `tabEmployee` emp
            ON emp.name = ses.employee
        {where_clause}
        ORDER BY sch.opname_date DESC, ses.in_time DESC
    """

    return frappe.db.sql(query, values, as_dict=True)


# =====================================================
# LOG REPORT
# =====================================================
def get_log_columns():
    return [
        {"label": "Opname Date", "fieldname": "opname_date", "fieldtype": "Date"},
        {"label": "Employee", "fieldname": "employee", "fieldtype": "Link", "options": "Employee"},
        {"label": "Employee Name", "fieldname": "employee_name", "fieldtype": "Data"},
        {"label": "Schedule", "fieldname": "schedule", "fieldtype": "Link", "options": "Stock Opname Schedule"},
        {"label": "Warehouse", "fieldname": "warehouse", "fieldtype": "Link", "options": "Warehouse"},
        {"label": "Location", "fieldname": "location", "fieldtype": "Link", "options": "Shift Location"},
        {"label": "Log Type", "fieldname": "log_type", "fieldtype": "Data"},
        {"label": "Log Time", "fieldname": "log_time", "fieldtype": "Datetime"},
        {"label": "Distance", "fieldname": "distance", "fieldtype": "Float"},
    ]


def get_log_data(filters):
    conditions = []
    values = {}

    if filters.get("employee"):
        conditions.append("log.employee = %(employee)s")
        values["employee"] = filters.get("employee")

    if filters.get("branch"):
        conditions.append("emp.branch = %(branch)s")
        values["branch"] = filters.get("branch")

    if filters.get("warehouse"):
        conditions.append("log.warehouse = %(warehouse)s")
        values["warehouse"] = filters.get("warehouse")

    if filters.get("location"):
        conditions.append("log.location = %(location)s")
        values["location"] = filters.get("location")

    if filters.get("from_date"):
        conditions.append("sch.opname_date >= %(from_date)s")
        values["from_date"] = filters.get("from_date")

    if filters.get("to_date"):
        conditions.append("sch.opname_date <= %(to_date)s")
        values["to_date"] = filters.get("to_date")

    where_clause = " AND ".join(conditions)
    if where_clause:
        where_clause = "WHERE " + where_clause

    query = f"""
        SELECT
            sch.opname_date,
            log.employee,
            log.employee_name,
            log.schedule,
            log.warehouse,
            log.location,
            log.log_type,
            log.log_time,
            log.distance
        FROM `tabStock Opname Log` log
        LEFT JOIN `tabStock Opname Schedule` sch
            ON log.schedule = sch.name
        LEFT JOIN `tabEmployee` emp
            ON emp.name = log.employee
        {where_clause}
        ORDER BY sch.opname_date DESC, log.log_time DESC
    """

    return frappe.db.sql(query, values, as_dict=True)


# =====================================================
# BALANCE REPORT
# =====================================================
def get_balance_columns():
    return [
        {"label": "Employee", "fieldname": "employee", "fieldtype": "Link", "options": "Employee"},
        {"label": "Employee Name", "fieldname": "employee_name", "fieldtype": "Data"},
        {"label": "Earned Minutes", "fieldname": "earned_minutes", "fieldtype": "Int"},
        {"label": "Used Minutes", "fieldname": "used_minutes", "fieldtype": "Int"},
        {"label": "Balance Minutes", "fieldname": "balance_minutes", "fieldtype": "Int"},
        {"label": "Balance Hours", "fieldname": "balance_hours", "fieldtype": "Float"},
    ]


def get_balance_data(filters):
    conditions = []
    values = {}

    if filters.get("employee"):
        conditions.append("dep.employee = %(employee)s")
        values["employee"] = filters.get("employee")

    if filters.get("branch"):
        conditions.append("emp.branch = %(branch)s")
        values["branch"] = filters.get("branch")

    where_clause = " AND ".join(conditions)
    if where_clause:
        where_clause = "WHERE " + where_clause

    query = f"""
        SELECT
            dep.employee,
            dep.employee_name,
            SUM(CASE WHEN dep.transaction_type = 'Earned' THEN dep.minutes ELSE 0 END) as earned_minutes,
            SUM(CASE WHEN dep.transaction_type = 'Used' THEN dep.minutes ELSE 0 END) as used_minutes,
            MAX(dep.balance_after_minutes) as balance_minutes,
            MAX(dep.balance_after_minutes)/60 as balance_hours
        FROM `tabStock Opname Deposit` dep
        LEFT JOIN `tabEmployee` emp
            ON emp.name = dep.employee
        {where_clause}
        GROUP BY dep.employee, dep.employee_name
    """

    return frappe.db.sql(query, values, as_dict=True)


# =====================================================
# PARTICIPATION REPORT
# =====================================================
def get_participation_columns():
    return [
        {"label": "Opname Date", "fieldname": "opname_date", "fieldtype": "Date"},
        {"label": "Schedule", "fieldname": "schedule", "fieldtype": "Link", "options": "Stock Opname Schedule"},
        {"label": "Warehouse", "fieldname": "warehouse", "fieldtype": "Link", "options": "Warehouse"},
        {"label": "Location", "fieldname": "location", "fieldtype": "Link", "options": "Shift Location"},
        {"label": "Employee", "fieldname": "employee", "fieldtype": "Link", "options": "Employee"},
        {"label": "In Time", "fieldname": "in_time", "fieldtype": "Datetime"},
        {"label": "Out Time", "fieldname": "out_time", "fieldtype": "Datetime"},
        {"label": "Total Hours", "fieldname": "total_hours", "fieldtype": "Float"},
        {"label": "Status", "fieldname": "session_status", "fieldtype": "Data"},
    ]


def get_participation_data(filters):
    conditions = []
    values = {}

    if filters.get("branch"):
        conditions.append("emp.branch = %(branch)s")
        values["branch"] = filters.get("branch")

    if filters.get("warehouse"):
        conditions.append("sch.warehouse = %(warehouse)s")
        values["warehouse"] = filters.get("warehouse")

    if filters.get("location"):
        conditions.append("sch.location = %(location)s")
        values["location"] = filters.get("location")

    if filters.get("from_date"):
        conditions.append("sch.opname_date >= %(from_date)s")
        values["from_date"] = filters.get("from_date")

    if filters.get("to_date"):
        conditions.append("sch.opname_date <= %(to_date)s")
        values["to_date"] = filters.get("to_date")

    where_clause = " AND ".join(conditions)
    if where_clause:
        where_clause = "WHERE " + where_clause

    query = f"""
        SELECT
            sch.opname_date,
            sch.name as schedule,
            sch.warehouse,
            sch.location,
            part.employee,
            ses.in_time,
            ses.out_time,
            ses.total_hours,
            ses.session_status
        FROM `tabStock Opname Schedule` sch
        LEFT JOIN `tabStock Opname Participant` part
            ON part.parent = sch.name
        LEFT JOIN `tabStock Opname Session` ses
            ON ses.schedule = sch.name
            AND ses.employee = part.employee
        LEFT JOIN `tabEmployee` emp
            ON emp.name = part.employee
        {where_clause}
        ORDER BY sch.opname_date DESC
    """

    return frappe.db.sql(query, values, as_dict=True)


# =====================================================
# SUMMARY REPORT
# =====================================================
def get_summary_columns():
    return [
        {"label": "Employee", "fieldname": "employee", "fieldtype": "Link", "options": "Employee"},
        {"label": "Employee Name", "fieldname": "employee_name", "fieldtype": "Data"},
        {"label": "Total Session", "fieldname": "total_session", "fieldtype": "Int"},
        {"label": "Total Minutes", "fieldname": "total_minutes", "fieldtype": "Int"},
        {"label": "Total Hours", "fieldname": "total_hours", "fieldtype": "Float"},
        {"label": "Deposit Earned", "fieldname": "deposit_earned", "fieldtype": "Int"},
        {"label": "Deposit Used", "fieldname": "deposit_used", "fieldtype": "Int"},
        {"label": "Deposit Balance", "fieldname": "deposit_balance", "fieldtype": "Int"},
    ]


def get_summary_data(filters):
    conditions = []
    values = {}

    if filters.get("employee"):
        conditions.append("ses.employee = %(employee)s")
        values["employee"] = filters.get("employee")

    if filters.get("branch"):
        conditions.append("emp.branch = %(branch)s")
        values["branch"] = filters.get("branch")

    if filters.get("warehouse"):
        conditions.append("sch.warehouse = %(warehouse)s")
        values["warehouse"] = filters.get("warehouse")

    if filters.get("location"):
        conditions.append("sch.location = %(location)s")
        values["location"] = filters.get("location")

    if filters.get("from_date"):
        conditions.append("sch.opname_date >= %(from_date)s")
        values["from_date"] = filters.get("from_date")

    if filters.get("to_date"):
        conditions.append("sch.opname_date <= %(to_date)s")
        values["to_date"] = filters.get("to_date")

    where_clause = " AND ".join(conditions)
    if where_clause:
        where_clause = "WHERE " + where_clause

    query = f"""
        SELECT
            ses.employee,
            ses.employee_name,
            COUNT(ses.name) as total_session,
            SUM(ses.total_minutes) as total_minutes,
            SUM(ses.total_hours) as total_hours,
            IFNULL(dep.deposit_earned, 0) as deposit_earned,
            IFNULL(dep.deposit_used, 0) as deposit_used,
            IFNULL(dep.deposit_balance, 0) as deposit_balance
        FROM `tabStock Opname Session` ses
        LEFT JOIN `tabStock Opname Schedule` sch
            ON ses.schedule = sch.name
        LEFT JOIN `tabEmployee` emp
            ON emp.name = ses.employee
        LEFT JOIN (
            SELECT
                employee,
                SUM(CASE WHEN transaction_type = 'Earned' THEN minutes ELSE 0 END) as deposit_earned,
                SUM(CASE WHEN transaction_type = 'Used' THEN minutes ELSE 0 END) as deposit_used,
                MAX(balance_after_minutes) as deposit_balance
            FROM `tabStock Opname Deposit`
            GROUP BY employee
        ) dep ON dep.employee = ses.employee
        {where_clause}
        GROUP BY ses.employee, ses.employee_name
        ORDER BY ses.employee
    """

    return frappe.db.sql(query, values, as_dict=True)