---
title: Developer
tags: [developer, root]
layout: root.html
---

A [Node.js](https://nodejs.org/) framework to develop web applications and APIs for spatial data.

Here is a public accessible deployment: **​**[**https://geolytix.xyz/open**](https://geolytix.xyz/open)**​**

The XYZ framework is designed to serve spatial data from [PostGIS](https://postgis.net/) data sources without the need of additional services. The framework is modular with dependencies on third party open source modules such as the open GIS engine [Turf](https://github.com/Turfjs/turf), the [Leaflet](https://github.com/Leaflet/Leaflet) javascript engine for interactive maps as well as the [jsoneditor](https://github.com/josdejong/jsoneditor) library used for the modification of JSON workspaces.

XYZ is built with a [PfaJn stack](https://medium.com/@goldrydigital/a-fine-pfajn-stack-to-put-maps-on-the-web-bf1a531cae93) using [Fastify](https://www.fastify.io/) as web server and [JsRender](https://www.jsviews.com/) for server side rendering of views.

The code repository should work out of the box \(zero-configuration\) as [serverless deployments with Zeit Now](https://medium.com/@goldrydigital/the-zeit-is-now-for-serverless-web-mapping-77edebfaf17e).

> **Nomenclature**

The XYZ project consists of a [**backend**](../../../infrastructure/server/) and [**frontend**](../../../infrastructure/client/) component. The frontend will also be referred to as the **client** or **browser** in this documentation. The frontend interface contains a **map control**. Due to the serverless nature of XYZ deployments, we attempt to limit the use of server or serverside when referring to the backend.

> [**Environment Settings**](../environment_settings/environment-settings) define the setup of the backend to serve a [**client application**](../../../infrastructure/client/) and [**API**]().

> [**Workspaces**](../workspaces/workspaces) are a set of instructions which define the use of data as layers and locations to be used by the client application and API.

> An [object **entry**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) is a [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) key/value pair. The **key** being the identifier to look up an entry and retrieve its value. A key must have a **value** associated. Key and value are separated by a colon. Keys must be a string. Values may be a string, numeric, boolean, an array or objects.

> [**Locales**](../locales/locales/) are a collection of regional bounds, gazetteer and layers.

> [**Layers**](../layers/layers/) are data tables which can be displayed and interacted with.

> [**Locations**](../infoj/locations/) are features in data tables which can be selected and interacted with.

> [**Deployment**](../deployment/deployment) is act of deploying code from the repository to run as an XYZ instance.

> [**Endpoints**]() \(also [**routes**]()\) make up the XYZ application interface. Distinct endpoints can be used to request data and edit data or make changes to the application settings themselves. The domain route \(root /\) will request the client interface \(frontend\) which links a graphic user interface and map control to backend endpoints.

> [**Token**](../../../infrastructure/security/jwt-token/) \(also **access token**\) is a signed JSON Web Token used to transmit information about a user account from the client to the XYZ backend.