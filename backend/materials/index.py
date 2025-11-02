'''
Business: API для управления материалами и плитками (CRUD операции)
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict с данными материалов/плиток
'''

import json
import os
import psycopg2
from typing import Dict, Any, List

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            data_type = params.get('type', 'all')
            
            if data_type == 'tiles':
                cur.execute('''
                    SELECT id, name, category, price_per_unit, unit, image, sizes 
                    FROM tile_types 
                    ORDER BY category, name
                ''')
                rows = cur.fetchall()
                tiles = []
                for row in rows:
                    tiles.append({
                        'id': row[0],
                        'name': row[1],
                        'category': row[2],
                        'pricePerUnit': float(row[3]),
                        'unit': row[4],
                        'image': row[5],
                        'sizes': row[6] if row[6] else []
                    })
                result = {'tiles': tiles}
                
            elif data_type == 'materials':
                cur.execute('''
                    SELECT id, category, name, price_per_unit, unit, image, material_category
                    FROM materials 
                    ORDER BY category, name
                ''')
                rows = cur.fetchall()
                materials = {'border': [], 'fence': [], 'monument': []}
                for row in rows:
                    mat = {
                        'id': row[0],
                        'name': row[2],
                        'pricePerUnit': float(row[3]),
                        'unit': row[4]
                    }
                    if row[5]:
                        mat['image'] = row[5]
                    if row[6]:
                        mat['category'] = row[6]
                    materials[row[1]].append(mat)
                result = {'materials': materials}
                
            else:
                cur.execute('SELECT id, name, category, price_per_unit, unit, image, sizes FROM tile_types ORDER BY category, name')
                tile_rows = cur.fetchall()
                tiles = []
                for row in tile_rows:
                    tiles.append({
                        'id': row[0],
                        'name': row[1],
                        'category': row[2],
                        'pricePerUnit': float(row[3]),
                        'unit': row[4],
                        'image': row[5],
                        'sizes': row[6] if row[6] else []
                    })
                
                cur.execute('SELECT id, category, name, price_per_unit, unit, image, material_category FROM materials ORDER BY category, name')
                mat_rows = cur.fetchall()
                materials = {'border': [], 'fence': [], 'monument': []}
                for row in mat_rows:
                    mat = {
                        'id': row[0],
                        'name': row[2],
                        'pricePerUnit': float(row[3]),
                        'unit': row[4]
                    }
                    if row[5]:
                        mat['image'] = row[5]
                    if row[6]:
                        mat['category'] = row[6]
                    materials[row[1]].append(mat)
                
                result = {'tiles': tiles, 'materials': materials}
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'save_tiles':
                tiles = body.get('tiles', [])
                cur.execute('DELETE FROM tile_types')
                
                for tile in tiles:
                    cur.execute('''
                        INSERT INTO tile_types (id, name, category, price_per_unit, unit, image, sizes)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ''', (
                        tile['id'],
                        tile['name'],
                        tile['category'],
                        tile['pricePerUnit'],
                        tile['unit'],
                        tile.get('image'),
                        json.dumps(tile.get('sizes', []))
                    ))
                
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'save_materials':
                materials = body.get('materials', {})
                cur.execute('DELETE FROM materials')
                
                for category, items in materials.items():
                    for item in items:
                        cur.execute('''
                            INSERT INTO materials (id, category, name, price_per_unit, unit, image, material_category)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)
                        ''', (
                            item['id'],
                            category,
                            item['name'],
                            item['pricePerUnit'],
                            item['unit'],
                            item.get('image'),
                            item.get('category')
                        ))
                
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    finally:
        cur.close()
        conn.close()
