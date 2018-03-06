import numpy as np
import cv2
from PIL import Image
cap = cv2.VideoCapture(0)
def get_image() :
	ret, img = cap.read()
	return img

#print ("taking image .. ")
picture = get_image()
file = "/home/pi/hardware/test1.jpg"
cv2.imwrite(file , picture)

img = Image.open('test1.jpg')
img.save('test1','bmp')
del(cap)
