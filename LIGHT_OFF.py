import RPi.GPIO as GPIO
import time

GPIO.setmode(gpio.BCM)
GPIO.setwarnings(False)
GPIO.setup(17,GPIO.OUT)
print("LED on")
GPIO.output(17,GPIO.LOW)
