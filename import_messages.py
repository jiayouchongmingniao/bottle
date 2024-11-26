import mysql.connector
import uuid
import json
from datetime import datetime

# 数据库连接配置
db_config = {
    'host': '156.253.9.249',
    'user': 'pom',
    'password': 'chen7xia',
    'database': 'mood_bottle'
}

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

try:
    # 连接到数据库
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    
    # 读取messages.txt文件
    with open('messages.txt', 'r', encoding='utf-8') as file:
        messages = file.read().strip().split('\n\n')
    
    # 准备插入语句
    insert_query = """
    INSERT INTO bottles (id, content, translations, country, mood)
    VALUES (%s, %s, %s, %s, %s)
    """
    
    # 处理每条消息
    for message in messages:
        if message.strip():
            bottle_id = str(uuid.uuid4())
            content = message.strip()
            translations = json.dumps({"en": ""})  # 空的英文翻译
            country = 'CN'  # 默认中国
            mood = determine_mood(content)
            
            # 执行插入
            cursor.execute(insert_query, (bottle_id, content, translations, country, mood))
    
    # 提交事务
    conn.commit()
    print(f"成功导入 {len(messages)} 条消息到数据库")

except mysql.connector.Error as err:
    print(f"数据库错误: {err}")
except Exception as e:
    print(f"发生错误: {e}")
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()
        print("数据库连接已关闭")
