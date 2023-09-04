import json
import mysql.connector
import re

with open('data/taipei-attractions.json', 'r', encoding='utf-8') as json_file:
    data=json.load(json_file)

list = data["result"]["results"]


con = mysql.connector.connect(
        user='root',
        password='1qaz@Wsx',
        host='localhost',
        database='taipei_day_trip_db'
        )




pattern = r'(https?://[^\s]+(?:\.jpg|\.png))'


for i in list:
    id = i["_id"]
    name = i["name"]
    category = i["CAT"]
    description = i["description"]
    address = i["address"]
    transport = i["direction"]
    mrt = i["MRT"]
    lat = i["latitude"]
    lng = i["longitude"]
    imageList = re.findall(pattern,i["file"].lower().replace("http"," http")) #先把file中"http"取代為" http"，然後比對正則，讓url被分割出來
    imageList_json = json.dumps(imageList) #需要將python list在轉換成json才能寫入mysql
    #print(imageList) 這裡輸出沒有 '\'。


    
    cursor = con.cursor()
    cursor.execute("INSERT INTO attractions(id, name, category, address, transport, mrt, lat, lng, description, images) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)" ,(id, name, category, address, transport, mrt, lat, lng, description, imageList_json))

    con.commit() #確定執行


cursor.close()
con.close()


