# Cryptographic Algorithms

**`user` Table**

| row | algorithm
| --- | --- |
| uid | none |
| sign | bcrypt |

<br>

-----

**`records` Table**

| row | algorithm |
| --- | --- |
| uid | none |
| username | none |
| platform | none |
| password | SHA256, SPRStrG AES256-GCM |

<br>

-----

**Session `ukey` encryption - login**
| requirements | origin |
| --- | --- |
| sessionIV | `SPRStrG` |
| session key encryption | `AES256-GCM` |
| SESSION_KEY | `.env` |