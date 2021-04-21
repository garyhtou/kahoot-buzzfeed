# Kahoot-Buzzfeed


## Firebase Real-Time Database Rules

Change `@wafbla.org` to the domain of your admin users.

```json
{
	"rules": {
		".read": true,
		"games": {
			".write": "auth.token.email.endsWith('@wafbla.org')",
			"$gameID": {
				"users": {
					".write": "auth != null",
					"$user_id": {
						"answers": {
							".write": "auth.uid == $user_id"
						},
						"name": {
							".write": "auth.uid == $user_id"
						},
						"sban": {
							".write": "auth.token.email.endsWith('@wafbla.org')"
						}
					}
				}
			}
		}
	}
}
```

In the database set `password/myAdminDashboardPassword` to `true`.