---
title: Failed Login attempts
subtitle: Failed Login attempts
tag: developer
tags: [developer]
layout: root.html
---

Failed logins are recorded when the provided password for a registered user account does not match the password stored in the ACL.

Account verification will be removed if the number of failed logins reaches the maximum number of allowed failed login attempts \(default 3\).

The maximum number for failed login attempts can be set in the [**FAILED\_ATTEMPTS environment setting**](../../environment_settings/access-control/).

A new verification request can be generated with the [**registration**](../registration/) / [**password reset endpoint**](../password-reset/).