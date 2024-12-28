'''
                                           PHILIPS SCOTT INC.

Author: Michael Adogeri
Subject: Technical Challenge - Automated Action on Sales Order Confirmation
Date: 9-14-24
Key Objective:
	- Identify the line with the highest total price when sale order is confirmed ! before discount
	- Store product name in the order's Customer Reference Fields ! before discount

'''

# Available variables:
#  - env: environment on which the action is triggered
#  - model: model of the record on which the action is triggered; is a void recordset
#  - record: record on which the action is triggered; may be void
#  - records: recordset of all records on which the action is triggered in multi-mode; may be void
#  - time, datetime, dateutil, timezone: useful Python libraries
#  - float_compare: utility function to compare floats based on specific precision
#  - b64encode, b64decode: functions to encode/decode binary data
#  - log: log(message, level='info'): logging function to record debug information in ir.logging table
#  - _logger: _logger.info(message): logger to emit messages in server logs
#  - UserError: exception class for raising user-facing warning messages
#  - Command: x2many commands namespace
# To return an action, assign: action = {...}

#  ************************************  CODE IMPLEMENTATION  ************************************************

# record: will be our primary object variable used to access data in the Sales Order (sale.order) Model
# order_line : is a one2many field that links to the order lines of the sale order.
# other fields will be mapped based on their technical field names as shown below

# Technical Field Terms | Field Name Identifier
# Price of each unit    | price_unit
# Product quantity      | product_uom_qty
# Product name          | prduct_template_id.name
# Customer reference    ! client_order_ref

# variables 
# highest_total_price: used to hold the current highest price in the sales order
# product_name: used to store the current product when the highest price is found

#  ************************************  CODE IMPLEMENTATION  ************************************************

# initialized variable before code executes
product_name = None
highest_total_price = 0.0

if records:                              # checks to make sure value isn't null
    for record in records:
        order_lines = record.order_line  # using thw record object var to fetch order_line
        for order_line in order_lines:   # accessing each line item in the list of order items
            total_price = order_line.price_unit * order_line.product_uom_qty
            if total_price > highest_total_price:
                highest_total_price = total_price # setting the current highest price in the ordered list
                product_name = order_line.product_template_id.name  # sets the current product name with the highest total price

    if product_name:
        records.write({'client_order_ref': product_name})  # to update the customer's reference field for the records


