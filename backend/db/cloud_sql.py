import os
import uuid
import sqlalchemy
from google.cloud.sql.connector import Connector, IPTypes
from api.helpers import ParamValidation


# Helper method to get database connection
def get_db_connection():
    return connector.connect(
        os.getenv("CLOUD_SQL_CONNECTION_NAME"),
        "pg8000",
        user=os.getenv("CLOUD_SQL_USER"),
        password=os.getenv("CLOUD_SQL_PASSWORD"),
        db=os.getenv("CLOUD_SQL_DATABASE_NAME"),
    )


# create a connector and pool for shared access
connector = Connector()

# variables for local connection
# u = os.getenv("LOCAL_DB_USER")
# pw = os.getenv("LOCAL_DB_PW")

pool = sqlalchemy.create_engine(
    "postgresql+pg8000://",
    creator=get_db_connection,
    # f"postgresql+pg8000://{u}:{pw}@localhost:5432/prod"
)


# helper method for executing queries against the DB
def execute_query(query, params=None, result_func=lambda res: res.fetchone()):
    with pool.connect() as conn:
        result = conn.execute(sqlalchemy.text(query), params or {})
        return result_func(result) if result_func else result


def execute_insert_query(query, params=None, result_func=lambda res: res.fetchone()):
    with pool.connect() as conn:
        conn.execute(sqlalchemy.text(query), params or {})
        conn.commit()


def create_user_account(user_email_address, public_key, private_key, account_key):
    """
    Creates a new user account.

    :param user_email_address: The email address of the user
    :type user_email_address: str
    :param public_key: a string representation of the user's public key
    :type public_key: str
    :param private_key: The user's encrypted private key
    :type private_key: str
    :param account_key: The user's encrypted account key
    :type account_key: str
    :return: (Boolean, array)
    :rtype: ParamValidation
    """
    # check if this user exists
    us_query = "SELECT id from Users where email = :user_email_address;"
    e_result = execute_query(
        us_query,
        {"user_email_address": user_email_address},
        lambda res: res.fetchall(),
    )
    if e_result != []:
        return ParamValidation(False, {"Error": ["email address must be unique"]})

    # create the user's key set
    kid = uuid.uuid4().hex

    ki_query = "INSERT INTO Keys (id, public_key, private_key, account_key) VALUES (:id, :public_key, :private_key, :account_key);"
    execute_insert_query(
        ki_query,
        {
            "id": kid,
            "public_key": public_key,
            "private_key": private_key,
            "account_key": account_key,
        },
        lambda res: res.fetchall(),
    )

    # create new user
    usid = uuid.uuid4().hex
    ui_query = (
        "INSERT INTO Users (id, email, kid) VALUES (:usid, :user_email_address, :kid);"
    )
    execute_insert_query(
        ui_query, {"usid": usid, "user_email_address": user_email_address, "kid": kid}
    )

    return ParamValidation(True, [usid, kid])


def find_user_account(email):
    """
    Finds a user account based on the email.

    :param email: The email address to search for.
    :type email: str
    :return: (Boolean, dict)
    :rtype: ParamValidation
    """
    # try to find the user
    us_query = "SELECT CAST(id AS text), kid from Users WHERE email = :email;"
    e_result = execute_query(
        us_query,
        {"email": email},
        lambda res: res.fetchall(),
    )
    if e_result == []:
        return ParamValidation(False, {"Error": ["email address not found"]})

    k_query = "SELECT public_key, private_key, account_key from Keys WHERE id = :id;"
    k_result = execute_query(
        k_query,
        {"id": e_result[0][1]},
        lambda res: res.fetchall(),
    )

    user_info = {
        "id": e_result[0][0],
        "kid": e_result[0][1],
        "public_key": k_result[0][0],
        "private_key": k_result[0][1],
        "account_key": k_result[0][2],
    }

    return ParamValidation(True, user_info)


def get_user_passwords(user_email_address, limit=5):
    """
    Fetches passwords for a given user up to a specified limit.

    :param user_email_address: The email address of the user to retrieve passwords for.
    :type user_email_address: str
    :param limit: The maximum number of password entries to retrieve, defaults to 5.
    :type limit: int, optional
    :return: A list of tuples containing website and password information.
    :rtype: list
    """
    query = "SELECT website, password FROM password_vault WHERE user_id = :user_id LIMIT :limit"
    return execute_query(
        query,
        {"user_id": user_email_address, "limit": limit},
        lambda res: res.fetchall(),
    )


def create_item(account_id, kid, overview, details):
    """
    Creates a new set of user credentials.

    :param account_id: The user's account id (uuid)
    :type account_id: str
    :param kid: The user's key id (uuid)
    :type kid: str
    :param overview: The encrypted item overview
    :type overview: str
    :param details: The encrypted item details
    :type details: str
    :return: (Boolean, str) with str = new item uuid if successful, str= error if not
    :rtype: ParamValidation
    """
    # create the item ID
    iid = uuid.uuid4().hex

    i_query = "INSERT INTO Items (id, usid, kid, overview, details) VALUES (:iid, :account_id, :kid, :overview, :details);"
    execute_insert_query(
        i_query,
        {
            "iid": iid,
            "account_id": account_id,
            "kid": kid,
            "overview": overview,
            "details": details,
        },
        lambda res: res.fetchall(),
    )

    return ParamValidation(True, iid)


def find_user_items(account_id):
    """
    Finds the items belonging to a user.

    :param account_id: The user's account id
    :type account_id: str
    :return: (Boolean, array)
    :rtype: ParamValidation
    """

    i_query = "SELECT CAST(Items.id AS text), CAST(Items.kid AS text), Items.overview, Keys.enc FROM Items LEFT OUTER JOIN Keys ON Items.kid = Keys.id WHERE Items.usid = :account_id;"
    i_result = execute_query(
        i_query,
        {"account_id": account_id},
        lambda res: res.fetchall(),
    )
    if i_result == []:
        return ParamValidation(False, {"Error": ["no items found"]})

    items = []

    for row in i_result:
        new_item = {
            "id": row[0],
            "kid": row[1],
            "data": row[2],
            "enc": row[3],
        }
        items.append(new_item)

    return ParamValidation(True, items)


def find_item(account_id, item_id):
    """
    Finds a specific item by item id.

    :param account_id: The user's account id
    :type account_id: str
    :param item_id: The item's id
    :type item_id: str
    :return: (Boolean, dict)
    :rtype: ParamValidation
    """
    i_query = "SELECT CAST(Items.id AS text), CAST(Items.kid AS text), Items.details, Keys.enc FROM Items LEFT OUTER JOIN Keys ON Items.kid = Keys.id WHERE Items.id = :item_id AND Items.usid = :account_id;"
    i_result = execute_query(
        i_query,
        {"item_id": item_id, "account_id": account_id},
        lambda res: res.fetchall(),
    )

    if i_result == []:
        return ParamValidation(False, {"Error": ["no items found"]})

    item = {
        "id": i_result[0][0],
        "kid": i_result[0][1],
        "data": i_result[0][2],
        "enc": i_result[0][3],
    }

    return ParamValidation(True, item)


def update_item(item_id, account_id, kid, enc, overview, details):
    """
    Updates a set of user credentials.

    :param item_id: The user's account id (uuid)
    :type item_id: str
    :param account_id: The user's account id (uuid)
    :type account_id: str
    :param kid: The user's key id (uuid)
    :type kid: str
    :param enc: The type of encryption used for this item
    :type enc: str
    :param overview: The encrypted item overview
    :type overview: str
    :param details: The encrypted item details
    :type details: str
    :return: (Boolean, str)
    :rtype: ParamValidation
    """
    ks_query = "SELECT id FROM Keys WHERE id = :kid;"
    ks_result = execute_query(
        ks_query,
        {"kid": kid},
        lambda res: res.fetchall(),
    )

    if ks_result == []:
        return ParamValidation(False, {"Error": ["item not found"]})

    is_query = "SELECT id FROM Items WHERE id = :item_id AND usid = :account_id;"
    is_result = execute_query(
        is_query,
        {"item_id": item_id, "account_id": account_id},
        lambda res: res.fetchall(),
    )

    if is_result == []:
        return ParamValidation(False, {"Error": ["item not found"]})

    k_query = "UPDATE Keys SET enc = :enc WHERE id = :kid;"
    execute_insert_query(
        k_query,
        {
            "kid": kid,
            "enc": enc,
        },
        lambda res: res.fetchall(),
    )

    i_query = "UPDATE Items SET kid = :kid, overview = :overview, details = :details WHERE id = :item_id AND usid = :account_id;"
    execute_insert_query(
        i_query,
        {
            "kid": kid,
            "overview": overview,
            "details": details,
            "item_id": item_id,
            "account_id": account_id,
        },
        lambda res: res.fetchall(),
    )

    return ParamValidation(True, item_id)


# delete_item item_id, account_id
def delete_item(account_id, item_id):
    """
    Finds a specific item by item id.

    :param account_id: The user's account id
    :type account_id: str
    :param item_id: The item's id
    :type item_id: str
    :return: (Boolean, dict)
    :rtype: ParamValidation
    """
    is_query = "SELECT id FROM Items WHERE id = :item_id AND usid = :account_id;"
    is_result = execute_query(
        is_query,
        {"item_id": item_id, "account_id": account_id},
        lambda res: res.fetchall(),
    )

    if is_result == []:
        return ParamValidation(False, {"Error": ["item not found"]})

    # DELETE FROM films WHERE kind <> 'Musical';
    i_query = "DELETE FROM Items WHERE id = :item_id AND usid = :account_id;"
    execute_insert_query(
        i_query,
        {"item_id": item_id, "account_id": account_id},
        lambda res: res.fetchall(),
    )

    return ParamValidation(True, {})
