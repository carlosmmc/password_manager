import os
import uuid
import sqlalchemy
from google.cloud.sql.connector import Connector, IPTypes
from api.helpers import (
    ParamValidation
)


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
# u = os.getenv('LOCAL_DB_USER')
# pw = os.getenv('LOCAL_DB_PW')

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
    :return: (Boolean, str)
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
        {"id": kid, "public_key": public_key, "private_key": private_key,
         "account_key": account_key},
        lambda res: res.fetchall(),
    )

    # create new user
    usid = uuid.uuid4().hex
    ui_query = "INSERT INTO Users (id, email, kid) VALUES (:usid, :user_email_address, :kid);"
    execute_insert_query(
        ui_query,
        {"usid": usid, "user_email_address": user_email_address, "kid": kid}
    )

    # return userid[0][0].hex
    return ParamValidation(True, usid)


def find_user_account(email):
    """
    Finds a user account based on the email.

    :param email: The email address to search for.
    :type email: str
    :return: (Boolean, dict)
    :rtype: ParamValidation
    """
    # try to find the user
    us_query = "SELECT CAST(id AS text), kid from Users where email = :email;"
    e_result = execute_query(
        us_query,
        {"email": email},
        lambda res: res.fetchall(),
    )
    if e_result == []:
        return ParamValidation(False, {"Error": ["email address not found"]})

    k_query = "SELECT public_key, private_key, account_key from Keys where id = :id;"
    k_result = execute_query(
        k_query,
        {"id": e_result[0][1]},
        lambda res: res.fetchall(),
    )

    user_info = {
        'id': e_result[0][0],
        'public_key': k_result[0][0],
        'private_key': k_result[0][1],
        'account_key': k_result[0][2],
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
