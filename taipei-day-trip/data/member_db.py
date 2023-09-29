import mysql.connector

con = mysql.connector.connect(
        user='root',
        password='1qaz@Wsx',
        host='localhost',
        database='taipei_day_trip_db'
        )

cursor = con.cursor()
cursor.execute("INSERT INTO attractions(id, name, category, address, transport, mrt, lat, lng, description, images) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)" ,(id, name, category, address, transport, mrt, lat, lng, description, imageList_json))

con.commit() #確定執行


cursor.close()
con.close()