import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(22, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

input_state_1 = GPIO.input(22)
input_state_2 = GPIO.input(23)

if input_state_1 == False and input_state_2 == True:
    print(-1)
elif input_state_1 == True and input_state_2 == False:
    print(1)
else:
    print(0)


