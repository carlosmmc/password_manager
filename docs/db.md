# Data Model

## Tables

The "Unique?" column indicates whether or not the database will enforce uniqueness for the column. PostgreSQL automatically indexes unique columns.

### Users

| Property | Type        | Unique? | Notes                                                          |
| -------- | ----------- | ------- | -------------------------------------------------------------- |
| id       | uuid        | Yes     | Primary Key for this row                                       |
| email    | varchar(50) | Yes     | Email address used to sign up for the service                  |
| kid      | uuid        | Yes     | ID of the public/private key set for this user. FK on Key Sets |

### Items

| Property | Type          | Unique? | Notes                                                  |
| -------- | ------------- | ------- | ------------------------------------------------------ |
| id       | uuid          | Yes     | Primary Key for this row                               |
| usid     | uuid          | Yes     | User that owns this item. Foreign Key on Users         |
| kid      | uuid          | Yes     | Key used to decrypt this item. Foreign Key on Key Sets |
| overview | varchar(1024) | No      | Encrypted identifying info                             |
| details  | varchar(1024) | No      | Encrypted item details                                 |

### Key Sets

| Property    | Type          | Unique? | Notes                                          |
| ----------- | ------------- | ------- | ---------------------------------------------- |
| id          | uuid          | Yes     | Auto-generated Primary Key for this row        |
| uid         | uuid          | Yes     | User that owns this key. Foreign Key on Users. |
| enc         | varchar(50)   | No      | Encryption scheme used for this key set        |
| public_key  | varchar(1024) | No      | JWK with the unencrypted public key            |
| private_key | varchar(1024) | No      | Encrypted private key                          |
| account_key | varchar(1024) | No      | Encrypted key that unlocks the user's data     |

## Relationships Between Entities

- Each user can access one or more items
- Access to items is unlocked with keys
- Each user has one set of keys
- The keys are used to unencrypt user data in the following sequence:

  secret key (in client only) -> account_key -> public_key -> private_key

The way keys are used in this design is based on the design outlined in the whitepaper [1Password Security Design](https://1passwordstatic.com/files/security/1password-white-paper.pdf) in the chapters "How Vaults are Securely Shared" and "A deeper look at keys". The concept of vault-specific keys is removed from this design because we are not supporting multiple item repositories per user in this project.
