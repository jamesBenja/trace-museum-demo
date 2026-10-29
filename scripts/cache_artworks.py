"""Cache genuine museum reference images for TRACE's internal educational proof of concept.
Source artworks are recorded with their museum records. Fortin is excluded until rights clearance.
"""
from pathlib import Path
from io import BytesIO
from urllib.parse import urljoin, quote
import requests
from bs4 import BeautifulSoup
from PIL import Image

OUT=Path('artworks'); OUT.mkdir(exist_ok=True)
ART={
 'mmfa-marrel': {
  'page':'https://www.mbam.qc.ca/en/works/58585/',
  'candidates':['https://collections.mbam.qc.ca/2014/GWeb/2014_56_IN2_RET.jpg']},
 'mmfa-witte': {
  'page':'https://www.mbam.qc.ca/en/works/8709/',
  'candidates':['https://collections.mbam.qc.ca/1894/GWeb/1894_41_IN5.jpg']},
 # This work has a named rights holder, so do not copy it without permission.
 'pamm-masks': {
  'page':'https://www.pamm.org/en/artwork/2012.107',
  'candidates':['https://livepammdotorg.imgix.net/wp-content/uploads/2025/04/300420251746035656.jpg']},
 'pamm-delano': {
  'page':'https://www.pamm.org/en/artwork/2020.248',
  'candidates':['https://tile.loc.gov/storage-services/service/pnp/fsac/1a34000/1a34000/1a34040v.jpg',
  'https://cdn.loc.gov/service/pnp/fsac/1a34000/1a34000/1a34040v.jpg']},
 'pamm-grid': {
  'page':'https://www.pamm.org/en/artwork/2012.104',
  'candidates':['https://livepammdotorg.imgix.net/wp-content/uploads/2026/10/161020261792184028.jpg']},
}
session=requests.Session()
session.headers.update({'User-Agent':'Mozilla/5.0 (compatible; TRACE educational prototype; public collection image evaluation)'})

def webpage_images(url):
 try:
  r=session.get(url,timeout=20);r.raise_for_status()
  soup=BeautifulSoup(r.text,'html.parser');result=[]
  for el in soup.find_all('meta'):
   if el.get('property') in ['og:image','og:image:secure_url'] or el.get('name') in ['twitter:image']:
    if el.get('content'):result.append(urljoin(url,el['content']))
  for el in soup.select('img'):
   label=(el.get('alt','')+' '+' '.join(el.get('class',[]))).lower()
   if any(word in label for word in ('artwork','marrel','witte','torres','delano','painting','construcc','flowers')):
    href=el.get('data-src') or el.get('src')
    if href:result.append(urljoin(url,href))
  return list(dict.fromkeys(result))[:18]
 except Exception as e:
  print('PAGE ERROR',url,str(e)[:120]);return []

def download(url):
 try:
  r=session.get(url,timeout=23);r.raise_for_status()
  if not r.content or len(r.content)>15000000:raise ValueError('Invalid content length')
  im=Image.open(BytesIO(r.content));im.load()
  if min(im.size)<220 or max(im.size)<280:raise ValueError('Image too small')
  if im.mode!='RGB':im=im.convert('RGB')
  im.thumbnail((1200,1200))
  return im
 except Exception as e:
  print('IMAGE ERROR',url,str(e)[:125]);return None

for name,record in ART.items():
 dest=OUT/(name+'.jpg')
 if dest.exists():continue
 candidates=record['candidates']+webpage_images(record['page'])
 candidates+=['https://images.weserv.nl/?url='+quote(u,safe='')+'&w=1000&output=jpg' for u in record['candidates']]
 for url in dict.fromkeys(candidates):
  im=download(url)
  if im is None:continue
  im.save(dest,format='JPEG',quality=84,optimize=True)
  print('SAVED',dest,im.size,'SOURCE',url)
  break
 else:print('NO IMAGE FOUND',name)
