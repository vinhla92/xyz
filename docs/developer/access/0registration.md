---
title: User Account Registration
subtitle: User Account Registration

tags: [developer]
layout: developer.html
---

New accounts consist of an email address and password.

Once a record for the account is stored in the ACL an email with a verification token link is sent. This link must be followed in order to **verify ownership of the email account**.

An email with an approval token link is sent to all site administrators after an account has been verified by its owner. Anyone **administrator must follow the link to approve the newly verified account**. Administrator are asked to provide their login credentials in order to resolve the approval link.

Emails will be sent to inform whether an account has been deleted or approved by an administrator.

Post requests to the [**user registration endpoint**]() are used to register new accounts.

> The email transport key must be set in the [**environment settings**](../../environment_settings/environment-settings/) for the backend to send emails through the [nodemailer](https://nodemailer.com) module.