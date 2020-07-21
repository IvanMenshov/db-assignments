'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
        SELECT
            OrderID as "Order Id",
            SUM(UnitPrice * Quantity) as "Order Total Price",
            ROUND(SUM(Discount * Quantity) * 100 / SUM(UnitPrice * Quantity), 3) as "Total Order Discount, %"
        FROM northwind.orderdetails
        GROUP BY OrderID
        ORDER BY OrderID desc;
    `);

    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
        SELECT 
	        CustomerID as "CustomerId",
	        CompanyName as "CompanyName"
        FROM northwind.customers
        WHERE Country = 'USA' and Fax is null;
    `);

    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
        SELECT 
            CustomerID AS 'Customer Id',
            COUNT(OrderID) AS 'Total number of Orders',
            ROUND(CAST(COUNT(OrderID) AS DECIMAL (8 , 5 )) / (SELECT COUNT(CustomerID) from northwind.orders) * 100, 5) AS '% of all orders'
        FROM northwind.orders 
        GROUP BY CustomerID
        ORDER BY COUNT(OrderID) DESC,
            CustomerID ASC;
    `);

    return result[0];
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
        SELECT 
	        ProductID as "ProductId",
            ProductName as "ProductName",
            QuantityPerUnit as "QuantityPerUnit"
        FROM northwind.products
        WHERE ProductName >= 'A' and ProductName < 'G'
        ORDER BY ProductName;
    `);

    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
        SELECT
	        ProductName,
            northwind.categories.CategoryName as "CategoryName",
            northwind.suppliers.CompanyName as "SupplierCompanyName"
        FROM northwind.products 
        JOIN northwind.categories ON products.CategoryID = northwind.categories.CategoryID
        JOIN northwind.suppliers ON products.SupplierID = northwind.suppliers.SupplierID
        ORDER BY ProductName,
            northwind.categories.CategoryID;
    `);

    return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Full Name - title of courtesy with full name.
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
        SELECT 
	        e.EmployeeID as EmployeeId,
            CONCAT(e.FirstName, ' ', e.LastName) as FullName,
            COALESCE(CONCAT(r.FirstName, ' ', r.LastName),'-') as ReportsTo
        FROM northwind.employees e
        LEFT JOIN northwind.employees r ON r.EmployeeID = e.ReportsTo;
    `);

    return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
        SELECT
	        northwind.categories.CategoryName as 'CategoryName',
            COUNT(UnitsInStock) as 'TotalNumberOfProducts'
        FROM northwind.products
        JOIN northwind.categories ON products.CategoryID = northwind.categories.CategoryID
        GROUP BY northwind.categories.CategoryName
        ORDER BY northwind.categories.CategoryName;
    `);

    return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
        SELECT 
	        CustomerID,
            ContactName
        FROM northwind.customers
        WHERE ContactName LIKE 'F__n%'
    `);

    return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
        SELECT
	        ProductID,
            ProductName
        FROM northwind.products
        WHERE Discontinued = 1 
        ORDER BY ProductID;
    `);

    return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
        SELECT 
	        ProductName,
            UnitPrice
        FROM northwind.products
        WHERE UnitPrice >= 5 and UnitPrice <16
        ORDER BY UnitPrice asc,
	        ProductName;
    `);

    return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
        SELECT  ProductName, UnitPrice
            FROM (
                SELECT *
                FROM Products 
                ORDER BY UnitPrice DESC 
                LIMIT 20
        ) a
        ORDER BY a.UnitPrice ASC,
            a.ProductName
    `);

    return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
        SELECT
	        COUNT(ProductName) as 'TotalOfCurrentProducts',
	        (SELECT COUNT(ProductName)
            FROM northwind.products
            WHERE Discontinued = 1) as 'TotalOfDiscontinuedProducts'
        FROM northwind.products;
    `);

    return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
        SELECT
            ProductName,
            UnitsOnOrder,
            UnitsInStock
        FROM northwind.products
        WHERE (((Discontinued) = False) AND ((UnitsInStock) < UnitsOnOrder));
    `);

    return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
        SELECT 
            COUNT(IF(MONTH(OrderDate) = 1, 1, NULL)) AS 'January',
            COUNT(IF(MONTH(OrderDate) = 2, 1, NULL)) AS 'February',
            COUNT(IF(MONTH(OrderDate) = 3, 1, NULL)) AS 'March',
            COUNT(IF(MONTH(OrderDate) = 4, 1, NULL)) AS 'April',
            COUNT(IF(MONTH(OrderDate) = 5, 1, NULL)) AS 'May',
            COUNT(IF(MONTH(OrderDate) = 6, 1, NULL)) AS 'June',
            COUNT(IF(MONTH(OrderDate) = 7, 1, NULL)) AS 'July',
            COUNT(IF(MONTH(OrderDate) = 8, 1, NULL)) AS 'August',
            COUNT(IF(MONTH(OrderDate) = 9, 1, NULL)) AS 'September',
            COUNT(IF(MONTH(OrderDate) = 10, 1, NULL)) AS 'October',
            COUNT(IF(MONTH(OrderDate) = 11, 1, NULL)) AS 'November',
            COUNT(IF(MONTH(OrderDate) = 12, 1, NULL)) AS 'December'
        FROM northwind.orders
        WHERE YEAR(OrderDate) = 1997;
    `);

    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
        SELECT 
	        OrderID,
            CustomerID,
            ShipCountry
        FROM northwind.orders
        WHERE ShipPostalCode IS NOT NULL;
    `);

    return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
        SELECT
	        northwind.categories.CategoryName as 'CategoryName',
            AVG(UnitPrice) as 'AvgPrice'
        FROM northwind.products
        JOIN northwind.categories ON products.CategoryID = northwind.categories.CategoryID
        GROUP BY northwind.categories.CategoryName
        ORDER BY AVG(UnitPrice) desc,
	        northwind.categories.CategoryName;
    `);

    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * Order Date needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
        SELECT 
	        DATE_FORMAT(OrderDate, "%Y-%m-%d %T") as 'OrderDate',
            COUNT(EmployeeID) as 'Total Number of Orders'
        FROM northwind.orders
        WHERE YEAR(OrderDate) = 1998
        GROUP BY OrderDate; 
    `);

    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
            SELECT 
	            o.CustomerID as 'CustomerID',
                c.CompanyName as 'CompanyName',
                SUM(UnitPrice * Quantity) as 'TotalOrdersAmount, $'
            FROM northwind.orderdetails
            JOIN northwind.orders o ON o.OrderID = orderdetails.OrderID
            JOIN northwind.customers c ON c.CustomerID = o.CustomerID
            GROUP BY o.CustomerID
            HAVING SUM(UnitPrice * Quantity) > 10000
            ORDER BY SUM(UnitPrice * Quantity) desc,
	            o.CustomerID;
    `);

    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
        SELECT 
	        o.EmployeeID as 'EmployeeID',
            CONCAT(e.FirstName, ' ', e.LastName) as 'Employee Full Name',
            SUM(UnitPrice * Quantity) as 'Amount, $'
        FROM northwind.orderdetails
        JOIN northwind.orders o ON o.OrderID = orderdetails.OrderID
        JOIN northwind.employees e ON e.EmployeeID = o.EmployeeID
        GROUP BY o.EmployeeID
        ORDER BY SUM(UnitPrice * Quantity) desc
        LIMIT 1;
    `);

    return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
        SELECT
	        OrderID,
            SUM(UnitPrice * Quantity) as 'Maximum Purchase Amount, $'
        FROM northwind.orderdetails
        GROUP BY OrderId
        ORDER BY SUM(UnitPrice * Quantity) desc
        LIMIT 1;
    `);

    return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
        SELECT DISTINCT
	        CompanyName,
            p.ProductName,
            d.UnitPrice as 'PricePerItem'
        FROM northwind.customers
        INNER JOIN northwind.orders o ON customers.CustomerID = o.CustomerID
        INNER JOIN northwind.orderdetails d ON o.OrderID = d.OrderID
        INNER JOIN northwind.products p ON p.ProductID = d.ProductID
        WHERE d.UnitPrice = (SELECT MAX(d.UnitPrice)
            FROM northwind.customers c
            INNER JOIN northwind.orders o ON customers.CustomerID = o.CustomerID
	        INNER JOIN northwind.orderdetails d ON o.OrderID = d.OrderID
            WHERE customers.CompanyName = c.CompanyName)
        ORDER BY PricePerItem desc,
	        CompanyName,
            p.ProductName;
    `);

    return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
