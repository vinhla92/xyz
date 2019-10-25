---
title: 3rd Party API Keys
subtitle: 3rd Party API Keys
tag: developer
tags: [developer]
layout: root.html
---

Keys for 3rd party service provider can be stored in the environment. The client will send all requests to the XYZ server. Here the requests are decorated with the key and proxied to the provider. This allows the use of 3rd party providers without ever exposing the key to the client side.

`"KEY_GOOGLE": "key=***"`

A [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) required for base maps and services requested from the Google Maps API.

`"KEY_MAPBOX": "access_token=pk.***"`

A [Mapbox access token](https://www.mapbox.com/help/how-access-tokens-work) required for base maps and services requested from the Mapbox API.

`"KEY_HERE": "app_id=***&app_code=***"`

A [HERE API](https://developer.here.com) key required for base maps and services requested from the HERE Maps API.

`"CLOUDINARY": "api_key api_secret cloud_name folder"`

A [Cloudinary](https://cloudinary.com/) key, secret and folder for images to be stored.