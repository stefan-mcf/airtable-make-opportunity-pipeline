# Architecture and route controls

## Authority boundaries

Airtable is the operating system of record for this workflow. Make can transform and route admitted records, but it cannot decide whether to contact someone, spend platform credits, submit an application or accept work.

The stable `opportunity_key` is calculated before any write. A retry searches for that key and stops on the duplicate route, which keeps execution retries from creating another opportunity.

## Route order

1. Admit an owner-approved source record.
2. Normalise source and title into a stable key.
3. Check required fields and publication state.
4. Search for an existing opportunity key.
5. Select `accepted`, `duplicate`, `invalid` or `owner_review`.
6. Write only to the table allowed for that outcome.
7. Save a terminal processing status and activity entry.

## Write matrix

| Outcome | Intake Queue | Opportunities | Activities | Exceptions |
| --- | ---: | ---: | ---: | ---: |
| Accepted | update | create or match | append | no write |
| Duplicate | update | match only | append | no write |
| Invalid | update | no write | append | create |
| Owner review | update | create or match | append | create |

## Release boundary

The repository contains provider-neutral contracts and controlled examples. Airtable workspace IDs, Make organisation IDs, connection IDs, prospect details and private operating records are deliberately excluded.
