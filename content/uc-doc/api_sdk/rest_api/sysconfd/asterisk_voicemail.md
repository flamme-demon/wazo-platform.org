---
subtitle: Delete voicemail
title: Asterisk Voicemail
---

-   [Query](#query)
-   [Parameters](#parameters)
    -   [Mandatory](#mandatory)
    -   [Optional](#optional)
-   [Errors](#errors)
-   [Example requests](#example-requests)
-   [Example response](#example-response)

Query
=====

    GET /delete_voicemail

Parameters
==========

Mandatory
---------

name

:   the voicemail name

Optional
--------

context

:   the voicemail context (default is \'default\')

<a name="rest_api_errors"></a>Errors
======

+------------+---------------+------------------------------+
| Error code | Error message | Description                  |
+============+===============+==============================+
| > 404      | Not found     | The voicemail does not exist |
+------------+---------------+------------------------------+

Example requests
================

    GET /delete_voicemail HTTP/1.1
    Host: wazoserver
    Accept: application/json

Example response
================

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        nothing
    }