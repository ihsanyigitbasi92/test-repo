from PIL import Image
import sys
out=sys.argv[1]; fs=sys.argv[2:]
ims=[Image.open(f).convert('RGB') for f in fs]
h=900; row=[im.resize((int(im.width*h/im.height),h)) for im in ims]
W=sum(r.width for r in row)+10*len(row)
c=Image.new('RGB',(W,h),'white');x=0
for r in row: c.paste(r,(x,0)); x+=r.width+10
c.save(out)
