import os
import sqlalchemy
from google.cloud.sql.connector import Connector, IPTypes


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
pool = sqlalchemy.create_engine(
    "postgresql+pg8000://",
    creator=get_db_connection,
)


# helper method for executing queries against the DB
def execute_query(query, params=None, result_func=lambda res: res.fetchone()):
    with pool.connect() as conn:
        result = conn.execute(sqlalchemy.text(query), params or {})
        return result_func(result) if result_func else result


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
