import mysql.connector
import uuid
import json
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

# 数据库连接配置
db_config = {
    'host': '156.253.9.249',
    'user': 'pom',
    'password': 'chen7xia',
    'database': 'mood_bottle'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

def determine_mood(content):
    # 简单的情绪判断逻辑
    positive_keywords = ['好', '希望', '温暖', '美好', '喜悦']
    encouraging_keywords = ['相信', '度过', '终将', '值得']
    
    for word in positive_keywords:
        if word in content:
            return 'positive'
    for word in encouraging_keywords:
        if word in content:
            return 'encouraging'
    return 'neutral'

@app.route('/bottles', methods=['GET'])
def get_bottles():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, content, translations, country, mood, created_at 
            FROM bottles 
            ORDER BY created_at DESC 
            LIMIT 10
        """)
        
        bottles = cursor.fetchall()
        
        # 处理datetime对象为字符串
        for bottle in bottles:
            if bottle['created_at']:
                bottle['created_at'] = bottle['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            if isinstance(bottle['translations'], str):
                bottle['translations'] = json.loads(bottle['translations'])
        
        return jsonify({"success": True, "data": bottles})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()

@app.route('/bottle', methods=['POST'])
def create_bottle():
    try:
        content = request.json.get('content')
        if not content:
            return jsonify({"success": False, "error": "内容不能为空"}), 400
        
        bottle_id = str(uuid.uuid4())
        translations = json.dumps({"en": ""})
        country = request.json.get('country', 'CN')
        mood = determine_mood(content)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        insert_query = """
        INSERT INTO bottles (id, content, translations, country, mood)
        VALUES (%s, %s, %s, %s, %s)
        """
        
        cursor.execute(insert_query, (bottle_id, content, translations, country, mood))
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "漂流瓶已发送",
            "data": {
                "id": bottle_id,
                "content": content,
                "mood": mood,
                "country": country
            }
        })
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()

@app.route('/bottle/<bottle_id>', methods=['GET'])
def get_bottle(bottle_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, content, translations, country, mood, created_at 
            FROM bottles 
            WHERE id = %s
        """, (bottle_id,))
        
        bottle = cursor.fetchone()
        
        if not bottle:
            return jsonify({"success": False, "error": "漂流瓶不存在"}), 404
        
        # 处理datetime对象为字符串
        if bottle['created_at']:
            bottle['created_at'] = bottle['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        if isinstance(bottle['translations'], str):
            bottle['translations'] = json.loads(bottle['translations'])
        
        return jsonify({"success": True, "data": bottle})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
