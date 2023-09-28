from flask import *
import mysql.connector
import jwt
from datetime import datetime, timedelta

key = "secret"

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


@app.route("/api/user", methods = ["POST"]) #註冊新會員
def signup():
	
	signup_data = request.get_json()

	name = signup_data["name"]
	email = signup_data["email"]
	password = signup_data["password"]

	# name = request.form["name"]
	# email = request.form["email"]
	# password = request.form["password"]


	try:
		con = mysql.connector.connect(
			user='root',
			password='1qaz@Wsx',
			host='localhost',
			database='taipei_day_trip_db'
			)
		
		cursor = con.cursor()
		cursor.execute("SELECT email from member_table WHERE email = %s", (email,))
		existing_user = cursor.fetchone()

		if existing_user:
			response_error400 = json.dumps({'error': True,'message': '此信箱已被註冊，請使用其他信箱註冊'},ensure_ascii=False)
			return response_error400, 400 # 定義 http error code 400				

		
		else:
			cursor.execute("INSERT INTO member_table (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
			con.commit() #確定執行

			response_success = json.dumps({'ok': True},ensure_ascii=False)
			return response_success, 200 # 定義 http code 200


			

	except Exception as e:
		response_error500 = json.dumps({'error': True,'message': '伺服器內部錯誤'},ensure_ascii=False)
		return response_error500, 500 # 定義 http error code 500

	finally:
		if con.is_connected():
			cursor.close()
			con.close()



@app.route("/api/user/auth")

def auth():
	try:
		authorization_header = request.headers.get('Authorization')
		
		parts = authorization_header.split()
		token = parts[1]
		bearer = parts[0]
		print("bearer:", bearer)
		
		if bearer == "Bearer" and token:
			decoded_token = jwt.decode(token, key, algorithms="HS256")
			print("decode",decoded_token)

			expiredTime = decoded_token["exp"]
			currentTime = int(datetime.utcnow().timestamp())

			id = decoded_token['id']
			email = decoded_token['email']
			name = decoded_token['name']
	
	except Exception as e:
		response_error500 = json.dumps(None, ensure_ascii=False)
		return response_error500, 500 # 定義 http error code 500

	

	try:
		con = mysql.connector.connect(
			user='root',
			password='1qaz@Wsx',
			host='localhost',
			database='taipei_day_trip_db'
			)
		
		cursor = con.cursor()
		cursor.execute("SELECT id, email, name from member_table WHERE id = %s and email = %s and name = %s", (id, email, name))
		existing_user = cursor.fetchone()

		if existing_user and expiredTime > currentTime:
			response_success = json.dumps({'id': decoded_token['id'], 'name': decoded_token['name'], 'email': decoded_token['email']},ensure_ascii=False)
		# 若檢查成功，那就要JWT加密然後返回token給前端
			return response_success, 200 # 定義 http code 200			
		else:
			response_error400 = json.dumps(None,ensure_ascii=False)
			return response_error400, 400 # 定義 http code 400
	
	except Exception as e:
		response_error500 = json.dumps({'error': True,'message': '伺服器內部錯誤'},ensure_ascii=False)
		return response_error500, 500 # 定義 http error code 500
			
	finally:
		if con.is_connected():
			cursor.close()
			con.close()
	



	#把解碼的資料，拿去跟資料庫比對
	#需要檢查exp是否過期...

#可能是要先拿到前端存的token，然後再解碼，得到ㄓemail & password，然後去資料庫query會員資料，然提供前端id, name, email？


@app.route("/api/user/auth", methods = ["PUT"])
def signin():
# 先拿到用戶輸入的email, password，然後去資料庫比對。
	
	signin_data = request.get_json()
	# print(signin_data)

	
	email = signin_data["email"] 
	# print("email: ", email)
	#這個接收資料的方式需要設定form上面的功能，當提交表單時，啟動js函式把資料傳給api。
	# 但 signin_data = request.get_json() # 接收 JSON 資料轉為 dictionary  這樣就不特別設定form參數，直接用js操作拿到value後，變成json傳給api，然後後端在把json變成字典。
	# signin_data 裡面自然會有定義好的email, password
	password = signin_data["password"]
	# print("password: ", password)


	try:
		con = mysql.connector.connect(
			user='root',
			password='1qaz@Wsx',
			host='localhost',
			database='taipei_day_trip_db'
			)
		
		cursor = con.cursor()
		cursor.execute("SELECT id, email, password, name from member_table WHERE email = %s and password = %s", (email, password))
		existing_user = cursor.fetchone()


		if existing_user:
			user_data = {
				"id": existing_user[0],
				"email": existing_user[1],
				"name": existing_user[3],
				 "exp": datetime.utcnow() + timedelta(days=7)
				
			}
			token = jwt.encode(user_data, key, algorithm="HS256")
			response_success = json.dumps({'token': token},ensure_ascii=False)
			# 若檢查成功，那就要JWT加密然後返回token給前端
			return response_success, 200 # 定義 http code 200				

		
		else:
			response_error400 = json.dumps({'error': True,'message': '信箱或密碼輸入錯誤'},ensure_ascii=False)
			return response_error400, 400 # 定義 http code 400
	
	except Exception as e:
		response_error500 = json.dumps({'error': True,'message': '伺服器內部錯誤'},ensure_ascii=False)
		return response_error500, 500 # 定義 http error code 500

	
	finally:
		if con.is_connected():
			cursor.close()
			con.close()

# 比對成功，就給為期7天的token
# 比對失敗，報錯400 or 500


app.run(host="0.0.0.0", port=3000)

