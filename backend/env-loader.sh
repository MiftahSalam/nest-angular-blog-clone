if [ -z $1 ]; then
    echo please provide argument
    echo valid arguments: load, unload
elif [ $1 == "load" ]; then
    echo load variable
    export DATABASE_HOST="ec2-34-194-171-47.compute-1.amazonaws.com"
    export DATABASE_PORT=5432
    export DATABASE_USERNAME=rcmklrbadldmxx
    export DATABASE_PASSWORD=360ba1188353bca81a1abee5515cd65049004c24b2ec3958405f5f0e2be8f85b
    export DATABASE_NAME=d75rlj1426c1b5
    echo variable loaded
elif [ $1 == "unload" ]; then
    echo unload variable
    unset DATABASE_HOST
    unset DATABASE_PORT
    unset DATABASE_USERNAME
    unset DATABASE_PASSWORD
    unset DATABASE_NAME
    echo variable unloaded
else
    echo invalid argument
    echo valid arguments: load, unload
fi