frappe.query_reports["Stock Opname Attendance"] = {
    "filters": [
        {
            "fieldname": "report_type",
            "label": "Report Type",
            "fieldtype": "Select",
            "options": [
                "Session",
                "Log",
                "Balance",
                "Participation",
                "Summary"
            ],
            "default": "Session",
            "reqd": 1
        },
        {
            "fieldname": "employee",
            "label": "Employee",
            "fieldtype": "Link",
            "options": "Employee"
        },
        {
            "fieldname": "branch",
            "label": "Branch",
            "fieldtype": "Link",
            "options": "Branch"
        },
        // {
        //     "fieldname": "warehouse",
        //     "label": "Warehouse",
        //     "fieldtype": "Link",
        //     "options": "Warehouse"
        // },
        // {
        //     "fieldname": "location",
        //     "label": "Location",
        //     "fieldtype": "Link",
        //     "options": "Shift Location"
        // },
        {
            "fieldname": "from_date",
            "label": "From Date",
            "fieldtype": "Date"
        },
        {
            "fieldname": "to_date",
            "label": "To Date",
            "fieldtype": "Date"
        }
    ]
};