import sys
import json
import requests
from bs4 import BeautifulSoup


def scrape_diy_crafts(object_name):
    url = "https://www.diyncrafts.com/?s=" + object_name.replace(" ", "+")
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find_all('article')

    crafts = []
    for result in results:
        title = result.find('h2').text.strip()
        link = result.find('a')['href']
        img_url = None
        img_div = result.find('a', class_='entry-image-link')
        if img_div is not None:
            img = img_div.find('img')
            if img is not None:
                img_url = img['src']
        
        crafts.append({'title': title, 'link': link, 'img_url': img_url})
    
    return json.dumps(crafts)

if __name__ == '__main__':
    object_name = sys.argv[1]
    crafts_json = scrape_diy_crafts(object_name)
    print(crafts_json)
