# Observability

This markdown file discusses the different ways the application's performance can be monitored. Broadly speaking there are three fundamental types of observability which production applications should leverage:

* **Logs** - Structured/Unstructured text emitted from the application. Basically distributed print statements which are used to help understand how your application is performing.
* **Metrics** - Numeric based values which are used to get a gauge of how your application is performing. The two fundamental types are counters and gauges. Counters are used to answer questions like "how many requests has this API seen" while gauges are used to answer questions like "how long are these API requests taking".
* **Traces** - More advanced form of observability which traces the lifecycle of an application process (like an API request) and gives you insight into how long each portion of your code is taking.

### Logs
In this applicaiton we leverage GCP's native python logger to emit logs. Logs are structured/unstructured text which are emitted from an application. Below are two examples:

```
# unstructured
"The database has thrown an error!"

# structured
{
    "api": method_x,
    "params": {"foo": "bar", "baz": "taz"},
    "errors": nil
}
```

Logs are emitted at different severity levels to denote their context. Broadly speaking the different levels are:

* debug - mainly just for debugging
* info - just informationl
* warning - semi serious
* error - pretty serious
* critical - most serious omg things are melting down in the reactor

The last thing to note is that a log entry on GCP cannot exceed 16k bytes so be careful how much you're printing.

Below is an example of how to set up a logger in the context of this application:

```python
import google.auth
import google.cloud.logging as cloud_logging

# get the default GCP project
_, project = google.auth.default()

# set up a logging client which points to the project in use
client = cloud_logging.Client(project=project)

# set up a logger with a custom name space
logger = client.logger("CLOUD_SQL_CLIENT")


# emit structured data
log_data = {
    "query_title": "query_x",
    "sql": "select * from table",
}

logger.log_struct(log_data, severity="INFO")

# emit unstructured data
logger.log_text("the goths have breached the walls of rome", severity="CRITICAL")
```

Once you create logs, the next thing you'll want to do is analyze them! The quick way to do so is via the "Logs explorer" on the GCP dashboard. A few notes about this interface:
* There is a very nice "time selector" which lets you choice what date range to query logs for.
* For GCP App Engine logs you'll want to select the "GAE Application" resource from the drop down
* The "Log name" drop down allows you to choose from the different namespaces you've created.
* The "Severity" toggle allows you to easily filter based on the logs severity.
* You can save queries so that way you can easily return to them.

Let's look at an example log:
* Notice the `jsonPayload`, this is structured data being emitted
* Notice the `logName`, this is the custom namespace
* Notice the `timestamp`, this will come in handy!

```JSON
{
  "insertId": "p9b7ipfib15g8",
  "jsonPayload": {
    "status": "200 OK",
    "method": "GET",
    "url": "http://localhost:8080/api/v1/accounts/1234/items",
    "endpoint": "credentials.view_all_credentials"
  },
  "resource": {
    "type": "global",
    "labels": {
      "project_id": "password-manager-osu"
    }
  },
  "timestamp": "2024-02-04T22:35:08.449252591Z",
  "severity": "INFO",
  "logName": "projects/password-manager-osu/logs/HTTPS_REQUEST_LOGS",
  "receiveTimestamp": "2024-02-04T22:35:08.449252591Z"
}
```

Below are some queries which may be useful
```
# filter to a namespace
(logName = "projects/password-manager-osu/logs/HTTPS_REQUEST_LOGS")

# filter to a severity
(logName = "projects/password-manager-osu/logs/HTTPS_REQUEST_LOGS" AND severity="INFO")

# filter to a specific endpoint
(logName = "projects/password-manager-osu/logs/HTTPS_REQUEST_LOGS" AND severity="INFO" AND jsonPayload.endpoint = "credentials.view_all_credentials")
```

The second way you can analyze logs is through GCP's "Log analytics" tab. This is a really neat feature which allows you to write SQL against your logs to more easily analyze historical trends. For example, below is a query which:

* Filters to all logs
* Filters to the https request logs namespace
* Filters to a certain endpoint
* Groups the timestamps by minute
* Gets the count of requests by status

In the dashboard you can run this SQL and then use the built in charting options to easily analyze the data - neat!!

``` SQL
SELECT 
  TIMESTAMP_TRUNC(timestamp, MINUTE) as timestamp,
  JSON_EXTRACT_SCALAR(json_payload, '$.status') AS status,
  COUNT(*) as request_count
FROM `password-manager-osu.global._Default._AllLogs`
WHERE log_name = 'projects/password-manager-osu/logs/HTTPS_REQUEST_LOGS'
  AND JSON_EXTRACT_SCALAR(json_payload, '$.endpoint') = 'credentials.view_all_credentials'
GROUP BY 1, 2
```
