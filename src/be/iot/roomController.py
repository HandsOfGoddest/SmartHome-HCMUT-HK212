from .models import Room, User

def query_User(userID):
    return User.objects(userID=userID)
def createRoom(Id, owner, userIDs, deviceIDs):
    users= "decoi";
    room= Room(
        Id= Id,
        owner= owner,
        users= users,
        devices= deviceIDs,
    ).save()
def updateRoom(Id, owner=None, userIDs=[], deviceIDs=[]): pass