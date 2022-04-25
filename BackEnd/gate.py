# # from iot.gateWay import GatewaySingleton

# # a= GatewaySingleton("COM7")
# # print(a)
# # a.read()
# import socket

# HOST = "127.0.0.1"
# PORT = 65432

# with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#     s.bind((HOST, PORT))
#     s.listen()
#     conn, addr = s.accept()
#     with conn:
#         print('Connected by', addr)
#         data = conn.recv(1024)
#         print(data.decode())
#         conn.sendall(b"nhan hello")

import requests

r = requests.get("http://127.0.0.1:8000/rooms/", data={"token": "123"})
print(r)