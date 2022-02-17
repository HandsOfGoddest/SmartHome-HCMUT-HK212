import sys
from Adafruit_IO import MQTTClient # Dung de ket noi toi server Adafruit
import microbit_port # dung de ket noi voi microbit
import random # tao so ngau nhien
import time # thoi gian

AIO_FEED_ID= ["aka-test1", "aka-temp", "aka-pump"] # Cac Feed mau dung de test
AIO_USERNAME= "AkatsukiDA" # Ten cua Adafruit server
AIO_KEY= "aio_awJr78Cp5wZmuKpXaIZvIZHc9VlI" # key cua server

try:
    ser= microbit_port.ser
except:
    print("Can not found microbit port!")

def connected(client):
    print("Connect successful!")
    for feed in AIO_FEED_ID:
        client.subscribe(feed)

def subscribe(client, userdata, mid, granted_qos):
    print("Subscribe successful!")

def disconnected(client):
    print("Disconnect successful!")
    sys.exit()

def message(client, feed_id, payload):
    print("Get data from " + feed_id + ":" + payload)
    # ser.write((str(payload) + "#").encode())

# def ProcessData(data):
#     data= data.replace("!","")
#     data= data.replace("!","")
#     splitData= data.split(":")
#     print(splitData)
#     if len(splitData) == 3:
#         if(splitData[1] == "TEMP"):
#             Client.publish(AIO_TEMP_FEED_ID, splitData[2])
#     else:
#         print("Error data format!")

# mess = ""
# def readSerial():
#     bytesToRead= ser.inWaiting()
#     if(bytesToRead > 0):
#         global mess
#         mess= mess + ser.read(bytesToRead).decode("UTF-8")
#         while ("#" in mess) and ("!" in mess):
#             start= mess.find("!")
#             end= mess.find("#") +1
#             ProcessData(mess[start:end])
#             if(end == len(mess)):
#                 mess= ""
#             else:
#                 mess= mess[end:]

Client= MQTTClient(AIO_USERNAME, AIO_KEY)
Client.on_connect= connected
Client.on_disconnect= disconnected
Client.on_message= message
Client.on_subscribe= subscribe
Client.connect()
Client.loop_background()

while True:
    value= random.randint(0,100)
    print("Upload data: ", value)
    Client.publish(AIO_FEED_ID[1], value)
    time.sleep(5)