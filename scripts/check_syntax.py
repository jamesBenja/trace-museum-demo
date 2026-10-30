"""Fail CI if TRACE's inline browser entrypoint is syntactically invalid."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess,tempfile,os

class Scripts(HTMLParser):
 def __init__(self):
  super().__init__()
  self.in_script=False
  self.buff=[]
  self.found=[]
 def handle_starttag(self,tag,attrs):
  if tag=="script":
   attrs=dict(attrs)
   self.in_script="src" not in attrs and attrs.get("type","text/javascript") in ("","text/javascript","module")
   self.buff=[]
 def handle_data(self,data):
  if self.in_script:self.buff.append(data)
 def handle_endtag(self,tag):
  if tag=="script" and self.in_script:
   self.found.append("".join(self.buff))
   self.in_script=False

parser=Scripts()
parser.feed(Path("index.html").read_text(encoding="utf-8"))
assert parser.found, "Expected inline app script"
for i,js in enumerate(parser.found):
 with tempfile.NamedTemporaryFile("w",suffix=".js",delete=False,encoding="utf-8") as f:
  f.write(js);file=f.name
 try:subprocess.run(["node","--check",file],check=True)
 finally:os.remove(file)
print("PASS inline app scripts:",len(parser.found))
