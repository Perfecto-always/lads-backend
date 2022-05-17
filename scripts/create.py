#!/usr/bin/env 
import os
import sys

# Checks whether the file already exists
# in the provided list and returns boolean value
# based on the result
def search(list, n):
    for i in list:
        if i == n:
            return True
    return False


# The file name you want to give
def write(): 
    foldername = str(sys.argv[1])

    # The template that you are trying to create
    routes = open("template.ts", "r").read()

    # Creating the file and writing the template 
    # we obtained from the above file
    try:
        list = os.listdir("../routes")
        # Needs to check whether the file already exists or not
        # if we found its present we return else we create the file
        # and write the template to it.
        if search(list, f"{foldername}.ts"): 
            return print("❌ File already exists")
        else:    
            file = open(f"../routes/{foldername}.ts", "w")
            file.write(routes)
            file.close()
            print("✅ File created successfully")
    # This exception could be thrown for number of reasons which I don't knwo
    # But I use this cuz the file was not creating because of the folder not present
    # so we first create the folder and call the write funciton again.
    except:
        os.makedirs(f"../routes/")
        write()
write()

exit(0)