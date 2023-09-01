import json
import mysql.connector

with open('data/taipei-attractions.json', 'r', encoding='utf-8') as json_file:
    data=json.load(json_file)

list = data["result"]["results"]


con = mysql.connector.connect(
        user='root',
        password='1qaz@Wsx',
        host='localhost',
        database='taipei_day_trip_db'
        )

# 創建一個空的字典來儲存已經出現過的車站資料，同時也會儲存車站景點為key
station_to_spots_count = {}

# 根據原始資料來重新組織字典
for j in list:
    station = j['MRT']
    #spot = j['name']
    
    #如果有車站已經被存在station_to_spots，則把該景點直接加為這個車站(key)的value
    #若否，則新增一個車站(key)，其value就是該景點
    if station in station_to_spots_count:
        station_to_spots_count[station]+=1
    else:
        station_to_spots_count[station] = 1

for station, spot_count in station_to_spots_count.items():
    insert_query = "INSERT INTO mrt (mrt, count) VALUES (%s, %s)"
    values = (station, spot_count)
    cursor = con.cursor()
    
    cursor.execute(insert_query, values)
    con.commit() #確定執行


cursor.close()
con.close()
