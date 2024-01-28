# Data Model

## Tables

### Users

| Property | Type    | Notes                                                          |
| -------- | ------- | -------------------------------------------------------------- |
| id       | Integer | Auto-generated Primary Key for this row                        |
| api_id   | String  | 26-character public-facing id made up of numbers and letters   |
| email    | String  | Email address used to sign up for the service                  |
| key      | Integer | ID of the public/private key set for this user. FK on Key Sets |

### Items

| Property | Type    | Notes                                                        |
| -------- | ------- | ------------------------------------------------------------ |
| id       | Integer | Auto-generated Primary Key for this row                      |
| uid      | Integer | User that owns this item. Foreign Key on Users.              |
| api_id   | String  | 26-character public-facing id made up of numbers and letters |
| key      | Integer | Key used to decrypt this item. Foreign Key on Key Sets       |
| overview | String  | Encrypted identifying info for the item                      |
| details  | String  | Encrypted item details                                       |

### Key Sets

| Property    | Type    | Notes                                                      |
| ----------- | ------- | ---------------------------------------------------------- |
| id          | Integer | Auto-generated Primary Key for this row                    |
| uid         | Integer | User that owns this key. Foreign Key on Users.             |
| api_id      | String  | 26-character public-facing id made up of numbers & letters |
| public_key  | String  | JWK with the unencrypted public key                        |
| private_key | String  | Encrypted private key                                      |
| account_key | String  | Key that unlocks the user's data                           |

## Relationships Between Entities

- Each user can access one or more items
- Access to items is unlocked with keys
- Each user has one set of keys
- The keys are used to unencrypt user data in the following sequence:

  secret key (in client only) -> account_key -> public_key -> private_key

The way keys are used in this design is based on the design outlined in the whitepaper [1Password Security Design](https://1passwordstatic.com/files/security/1password-white-paper.pdf) in the chapters "How Vaults are Securely Shared" and "A deeper look at keys". The concept of vault-specific keys is removed from this design because we are not supporting multiple item repositories per user in this project.
