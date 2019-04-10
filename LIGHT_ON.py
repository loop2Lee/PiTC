import RPi.GPIO as gpio
import time

gpio.setmode(gpio.BCM)
GPIO.setwarnings(False)
GPIO.setup(18,GPIO.OUT)
print("LED on")
GPIO.output(18,GPIO.HIGH)
