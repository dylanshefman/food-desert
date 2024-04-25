import requests
import csv

points = []
with open('rep_points.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    for row in reader:
        latitude = float(row[0])
        longitude = float(row[1])
        points.append((latitude, longitude))

api_key = 'pKx0zZhOsU6yYCT3I56WNwJMvorIvGtNph26MhIBSWZL0VFy8qq-_lKHj92IfDMuameja_9GkeP0GOF9te9bdNR2DmBKBAeSNmUUFGU8430hIS4je_4JRJJtHUQjZnYx'
url = 'https://api.yelp.com/v3/businesses/search'
headers = {
    'Authorization': f'Bearer {api_key}'
}

# locations and health scores
places = ["grocery store",
          "restaurant",
          "fast casual",
          "dollar store",
          "fast food",
          "gas station"]


with open('businessesx.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['id', 'name', 'price', 'type', 'latitude', 'longitude', 'categories'])
    for point in points:
        for place in places:
            print(point, place)
            params = {
                'term': place,
                'latitude': point[0],
                'longitude': point[1],
                'limit': 50
            }
            
            response = requests.get(url, headers=headers, params=params)
            if response.status_code == 200:
                data = response.json()
                businesses = data['businesses']
                for business in businesses:
                    id = business["id"]
                    name = business["name"]
                    try:
                        price = business["price"]
                    except:
                        price = "N/A"
                    lat = business["coordinates"]["latitude"]
                    lon = business["coordinates"]["longitude"]
                    categories = []
                    for category in business["categories"]:
                        categories.append(category["title"])
                    categories_str = "/".join(categories)
                    
                    writer.writerow([id, name, price, place, lat, lon, categories_str])
            else:
                print('Error:', response)
