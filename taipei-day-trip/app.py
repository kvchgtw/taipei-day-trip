from flask import *
import mysql.connector

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.run(host="0.0.0.0", port=3000)
#更新protection rule


@app.route("/api/attractions")
def search_attraction():
	keyword = request.args.get("keyword", None)
	page = request.args.get("page", 0)
	keyword_like=f"%{keyword}%" #mysql模糊搜尋的寫法，要加上%
	offset = int(page)*12 #把輸入的頁碼字串轉換為整數，作為搜尋資料庫的offset
	pageNumber = int(page)

	try:

		if keyword:
			con = mysql.connector.connect(
				user='root',
				password='1qaz@Wsx',
				host='localhost',
				database='taipei_day_trip_db'
				)
			
			cursor = con.cursor()
			cursor.execute("SELECT attractionId, id, name, category, description, address, transport, mrt, lat, lng, images from attractions WHERE mrt = %s OR name LIKE %s LIMIT 12 OFFSET %s", (keyword, keyword_like, offset))
			search_data = cursor.fetchall()
			#用來完全比對捷運站名稱、或模糊比對景點名稱的關鍵字，沒有給定則不做篩選

			cursor.execute("SELECT COUNT(*) from attractions WHERE mrt = %s OR name LIKE %s", (keyword, keyword_like)) #計算這一次的搜尋共有幾筆結果
			data_count = cursor.fetchone()[0]


			result = []
			for row in search_data:
				data_json = {
					"id":row[1],
					"name":row[2],
					"category":row[3],
					"description":row[4],
					"address":row[5],
					"transport":row[6],
					"mrt":row[7],
					"lat":row[8],
					"lng":row[9],
					"images":json.loads(row[10]) #因為url在寫入資料庫時，已經轉換成Json字串一次，這裡需要先用json.loads還原一次，後面用dumps才不會跑反斜線出來。
						}
				result.append(data_json)


				#處理分頁問題
			if data_count > (pageNumber + 1) * 12:
				next_page = pageNumber + 1
			else:
				next_page = None
				
			dict={"data":result}
			dict["nextPage"] = next_page
			return json.dumps(dict, ensure_ascii=False)
		
		else:
			con = mysql.connector.connect(
				user='root',
				password='1qaz@Wsx',
				host='localhost',
				database='taipei_day_trip_db'
				)
			
			cursor = con.cursor()
			cursor.execute("SELECT attractionId, id, name, category, description, address, transport, mrt, lat, lng, images from attractions LIMIT 12 OFFSET %s", (offset,))
			search_data = cursor.fetchall()
			#用來完全比對捷運站名稱、或模糊比對景點名稱的關鍵字，沒有給定則不做篩選

			cursor.execute("SELECT COUNT(*) from attractions") #計算這一次的搜尋共有幾筆結果
			data_count = cursor.fetchone()[0]


			result = []
			for row in search_data:
				data_json = {
					"id":row[1],
					"name":row[2],
					"category":row[3],
					"description":row[4],
					"address":row[5],
					"transport":row[6],
					"mrt":row[7],
					"lat":row[8],
					"lng":row[9],
					"images":json.loads(row[10]) #因為url在寫入資料庫時，已經轉換成Json字串一次，這裡需要先用json.loads還原一次，後面用dumps才不會跑反斜線出來。
						}
				result.append(data_json)


				#處理分頁問題
			if data_count > (pageNumber + 1) * 12:
				next_page = pageNumber + 1
			else:
				next_page = None
				
			dict={"data":result}
			dict["nextPage"] = next_page
			return json.dumps(dict, ensure_ascii=False)
		

	except Exception as e:
		response_error500 = json.dumps({'error': True,'message': '伺服器內部錯誤'},ensure_ascii=False)
		return response_error500, 500 # 定義 http error code 500
	
	finally:
		if con.is_connected():
			cursor.close()
			con.close()




@app.route("/api/attraction/<attractionId>")
def get_AttractionId(attractionId):
	try:
		con = mysql.connector.connect(
			user='root',
			password='1qaz@Wsx',
			host='localhost',
			database='taipei_day_trip_db'
			)
		
		cursor = con.cursor()
		cursor.execute("SELECT attractionId, id, name, category, description, address, transport, mrt, lat, lng, images from attractions WHERE id = %s", (attractionId,))
		attraction_data = cursor.fetchall()

		if attraction_data:
			data_json = {
				"id":attraction_data[0][1], #list中，還有一個list，選取內層list的index
				"name":attraction_data[0][2],
				"category":attraction_data[0][3],
				"description":attraction_data[0][4],
				"address":attraction_data[0][5],
				"transport":attraction_data[0][6],
				"mrt":attraction_data[0][7],
				"lat":attraction_data[0][8],
				"lng":attraction_data[0][9],
				"images":json.loads(attraction_data[0][10]) #因為url在寫入資料庫時，已經轉換成Json字串一次，這裡需要先用json.loads還原一次，後面用dumps才不會跑反斜線出來。
				}
		
		
			dict={"data":data_json}

			response_json = json.dumps(dict, ensure_ascii=False)  # 將字典轉換為 JSON 格式，使用 ensure_ascii=False 讓中文字正常顯示。如果沒加，會跑出亂碼。
			#先前輸出有 '\'是因為轉換成json字串時，會把雙引號轉換成\"，所以會多出反斜線。

			return response_json
		else:
			response_error400 = json.dumps({'error': True,'message': '景點編號不正確'},ensure_ascii=False)
			return response_error400, 400 # 定義 http error code 400

	except Exception as e:
		response_error500 = json.dumps({'error': True,'message': '伺服器內部錯誤'},ensure_ascii=False)
		return response_error500, 500 # 定義 http error code 500

	finally:
		if con.is_connected():
			cursor.close()
			con.close()


@app.route("/api/mrts")
def get_mrt():
	try:
		con = mysql.connector.connect(
			user='root',
			password='1qaz@Wsx',
			host='localhost',
			database='taipei_day_trip_db'
			)
		
		cursor = con.cursor()
		cursor.execute("SELECT mrt from mrt  WHERE mrt is not NULL ORDER BY count DESC")
		mrt_data = cursor.fetchall()
		mrt_list=[]

		if mrt_data:
			for i in mrt_data:
				mrt_json = i[0]
				mrt_list.append(mrt_json)

			dict={"data":mrt_list}

			response_json = json.dumps(dict, ensure_ascii=False)  # 將字典轉換為 JSON 格式，使用 ensure_ascii=False 讓中文字正常顯示。如果沒加，會跑出亂碼。
			#先前輸出有 '\'是因為轉換成json字串時，會把雙引號轉換成\"，所以會多出反斜線。

			return response_json
		else:
			response_error400 = json.dumps({'error': True,'message': '景點編號不正確'},ensure_ascii=False)
			return response_error400, 400 # 定義 http error code 400

	except Exception as e:
		response_error500 = json.dumps({'error': True,'message': '伺服器內部錯誤'},ensure_ascii=False)
		return response_error500, 500 # 定義 http error code 500

	finally:
		if con.is_connected():
			cursor.close()
			con.close()


app.run(host="0.0.0.0", port=3000)

