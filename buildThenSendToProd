#!/bin/bash

npm run build
zip -r dist.zip dist
scp dist.zip ubuntu@neat.af:/var/www
rm dist.zip

echo "dist.zip sent to production"
