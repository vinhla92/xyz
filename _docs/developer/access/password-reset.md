---
title: Password Reset
subtitle: Password Reset
tags: [developer]
layout: developer.html
---

The [**user registration endpoint**]() can be used to reset a users password.

The new password will be stored in a separate column in the ACL. A new verification link will be sent to the registered email address for the account. The new password will be set once ownership of the email account has been verified.

Resetting the password will also reset the number of [**failed login attempts**](../failed-login-attempts/).