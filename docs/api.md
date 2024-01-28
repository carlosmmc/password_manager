# API Documentation

All endpoints are protected by user authentication.

## Create an Account

POST /api/v1/accounts

### Request to POST /api/v1/accounts

**Path Parameters:** None  
**Request Body Required?** Yes  
**Request Body Format:** JSON

**Request Attributes**

| Name  | Description                                   | Type   | Required? |
| ----- | --------------------------------------------- | ------ | --------- |
| email | Email address used to sign up for the service | String | Yes       |

**Request Example**

```JSON
{
  "email": "abc@123.com"
}
```

### Response to POST /api/v1/accounts

**Response Body Format:** JSON

**Response Statuses**

| Outcome | Status Code        | Notes                                 |
| ------- | ------------------ | ------------------------------------- |
| Success | 201 Created        |                                       |
| Failure | 400 Bad Request    | Missing email or has extra attributes |
| Success | 401 Unauthorized   | No auth token or bad auth token       |
| Success | 406 Not Acceptable | "Accept" header does not include JSON |

**Response Examples**

_Status: 201 Created_

```JSON
{
  "id": 1234,
  "self": "http://localhost:8080/api/v1/accounts/1234"
}
```

_Status: 400 Bad Request_

```JSON
{
  "Error": "The request is missing one or more required attributes"
}
```

## Create a Set of Credentials

POST /api/v1/accounts/:account_id/items

### Request to POST /api/v1/accounts/:account_id/items

**Path Parameters**

| Name       | Description           |
| ---------- | --------------------- |
| account_id | The user's account ID |

**Request Body Required?** Yes  
**Request Body Format** JSON  
**Request Attributes**

| Name | Description                                    | Type   | Required? |
| ---- | ---------------------------------------------- | ------ | --------- |
| kid  | The ID of the key used to encrypt the data     | String | Yes       |
| enc  | The encryption algorithm                       | String | Yes       |
| cty  | Content type of the key. Should always be JWK. | String | Yes       |
| data | Encrypted credential info                      | String | Yes       |

**Request Example**

```JSON
{
  "kid": "867fghjkl",
  "enc": "A256GCM",
  "cty": "b5+jwk+json",
  "data": "rdfthyukjlA4nmajhgf"
}
```

### Response to POST /api/v1/accounts/:account_id/items

**Response Body Format** JSON

**Response Statuses**

| Outcome | Status Code        | Notes                                               |
| ------- | ------------------ | --------------------------------------------------- |
| Success | 201 Created        |                                                     |
| Failure | 400 Bad Request    | Missing required attributes or has extra attributes |
| Success | 401 Unauthorized   | No auth token or bad auth token                     |
| Success | 406 Not Acceptable | "Accept" header does not include JSON               |

**Response Examples**

_Status: 201 Created_

```JSON
{
  "id": 8910,
  "self": "http://localhost:8080/accounts/1234/items/8910"
}
```

_Status: 400 Bad Request_

```JSON
{
  "Error": "The request is missing one or more required attributes"
}
```

## View all Credential Overviews for an Account

GET /api/v1/accounts/:account_id/items

### Request to GET /api/v1/accounts/:account_id/items

**Path Parameters**

| Name       | Description           |
| ---------- | --------------------- |
| account_id | The user's account ID |

**Request Body Required?** No  
**Request Body Format** N/A  
**Request Attributes** N/A  
**Request Example** N/A

### Response to GET /api/v1/accounts/:account_id/items

**Response Body Format** JSON  
**Response Statuses**

| Outcome | Status Code        | Notes                                 |
| ------- | ------------------ | ------------------------------------- |
| Success | 200 OK             |                                       |
| Success | 401 Unauthorized   | No auth token or bad auth token       |
| Success | 406 Not Acceptable | "Accept" header does not include JSON |

**Response Examples**

```JSON
[
  {
    "id": 8910,
    "kid": "867fghjkl",
    "enc": "A256GCM",
    "cty": "b5+jwk+json",
    "data": "rdfthyukjlA4nmajhgf",
    "self": "http://localhost:8080/api/v1/accounts/1234/items/8910"
  },
  {
    "id": 5678,
    "kid": "867fghjkl",
    "enc": "A256GCM",
    "cty": "b5+jwk+json",
    "data": "jemccouandsfbfrh7au",
    "self": "http://localhost:8080/api/v1/accounts/1234/items/5678"
  }
]
```

_Status: 406 Not Acceptable_

```JSON
{
  "Error": "Accept header must include JSON"
}
```

## Get a Set of Credentials

GET /api/v1/accounts/:account_id/credentials/:credential_id

### Request to GET /api/v1/accounts/:account_id/credentials/:credential_id

**Path Parameters**

| Name          | Description           |
| ------------- | --------------------- |
| account_id    | The user's account ID |
| credential_id | The credential's ID   |

**Request Body Required?** No  
**Request Body Format** N/A  
**Request Attributes** N/A  
**Request Example** N/A

### Response to GET /api/v1/accounts/:account_id/credentials/:credential_id

**Response Body Format** JSON

**Response Statuses**

| Outcome | Status Code        | Notes                                 |
| ------- | ------------------ | ------------------------------------- |
| Success | 200 OK             |                                       |
| Success | 401 Unauthorized   | No auth token or bad auth token       |
| Success | 406 Not Acceptable | "Accept" header does not include JSON |

**Response Examples**

```JSON
{
  "id": 8910,
  "kid": "867fghjkl",
  "enc": "A256GCM",
  "cty": "b5+jwk+json",
  "data": "rdfthyukjlA4nmajhgf"
}
```

_Status: 406 Not Acceptable_

```JSON
{
  "Error": "Accept header must include JSON"
}
```

## Edit a Set of Credentials

PUT /api/v1/accounts/:account_id/items/:credential_id

### Request to PUT /api/v1/accounts/:account_id/items/:credential_id

**Path Parameters**

| Name          | Description           |
| ------------- | --------------------- |
| account_id    | The user's account ID |
| credential_id | The credential's ID   |

**Request Body Required?** Yes  
**Request Body Format** JSON

**Request Attributes**

| Name | Description                                    | Type   | Required? |
| ---- | ---------------------------------------------- | ------ | --------- |
| kid  | The ID of the key used to encrypt the data     | String | Yes       |
| enc  | The encryption algorithm                       | String | Yes       |
| cty  | Content type of the key. Should always be JWK. | String | Yes       |
| data | Encrypted credential info                      | String | Yes       |

**Request Example**

```JSON
{
  "id": 8910,
  "kid": "867fghjkl",
  "enc": "A256GCM",
  "cty": "b5+jwk+json",
  "data": "rdfthyukjlA4nmajhgf"
}
```

### Response to PUT /api/v1/accounts/:account_id/items/:item_id

**Response Body Format** JSON

**Response Statuses**

| Outcome | Status Code        | Notes                                 |
| ------- | ------------------ | ------------------------------------- |
| Success | 200 OK             |                                       |
| Failure | 400 Bad Request    | Missing email or has extra attributes |
| Success | 401 Unauthorized   | No auth token or bad auth token       |
| Success | 406 Not Acceptable | "Accept" header does not include JSON |

**Response Examples**

**Response Examples**

_Status: 200 OK_

```JSON
{
  "id": 8910,
  "self": "http://localhost:8080/api/v1/accounts/1234/items/8910"
}
```

_Status: 400 Bad Request_

```JSON
{
  "Error": "The request is missing one or more required attributes"
}
```

## Delete a Set of Credentials

DELETE /api/v1/accounts/:account_id/items/:credential_id

### Request to DELETE /api/v1/accounts/:account_id/items/:credential_id

**Path Parameters**

| Name          | Description           |
| ------------- | --------------------- |
| account_id    | The user's account ID |
| credential_id | The credential's ID   |

**Request Body Required?** No  
**Request Body Format** N/A  
**Request Attributes** N/A  
**Request Example** N/A

### Response to DELETE /api/v1/accounts/:account_id/items/:credential_id

**Response Body Format** JSON

**Response Statuses**

| Outcome | Status Code    | Notes                                  |
| ------- | -------------- | -------------------------------------- |
| Success | 204 No Content |                                        |
| Success | 404 Not Found  | No credentials with that credential_id |

**Response Examples**

_Status: 404 Not Found_

```JSON
{
  "Error": "Item not found"
}
```
