import uuid

def getUUID(stringUUID):
    if "/" in stringUUID:
        # We are dealing with a URL ID
        stringUUID = stringUUID.split("/")[-1]
    return uuid.UUID(stringUUID)