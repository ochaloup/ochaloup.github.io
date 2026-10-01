> For the complete documentation index, see [llms.txt](https://docs.marinade.finance/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/bond-notifications.md).

# Bond Notifications

How validators are notified of bond-related events including underfunding, auction status changes, and announcements.

{% hint style="info" %}
**TL;DR:** Subscribe via Telegram, email, or the CLI to get alerted on bond underfunding, auction status changes, and announcements. Critical alerts fire below 2 epochs of coverage; warnings below 10. Setting this up is the easiest way to stay ahead of the Bond Risk Reduction Mechanism.
{% endhint %}

## Overview

The notification system monitors the state of validator bonds and alerts the bond authority when something important changes. This page covers how the system works, the notification types, and how to subscribe.

## How Notifications Work

The processing pipeline works as follows:

1. **State monitoring:** The system periodically checks the state of all bonds participating in the SAM Auction (bond balance, auction status, eligibility, and so on).
2. **Change detection:** When a relevant change is detected for a bond (e.g., the bond becomes underfunded, the validator exits the auction), an event is generated.
3. **Notification delivery:** The event is evaluated, prioritized, and delivered through the validator's subscribed channels (Telegram, email, or the CLI notifications view).

Validators only receive notifications when something **changes**. The system does not repeatedly alert about a persistent condition. For ongoing issues (e.g., underfunding), re-alerts are sent at most once per 24 hours and only if the condition changed significantly.

### Notification Types

* **Bond underfunded:** The bond's SOL balance is insufficient to cover SAM Auction costs for the delegated stake. The system tracks how many epochs the current balance can sustain.
  * A **critical** alert fires when coverage drops below 2 epochs, and a **warning** when it drops below 10 epochs.
  * Only deficits ≥ 0.5 SOL trigger a notification.
  * The expected cost calculation now includes the Activating Stake Fee when applicable. Validators receiving new stake will see this reflected in the projected coverage. See the Activating Stake Fee page for the fee mechanics.
  * See also the Bond Risk Reduction Mechanism for what happens when coverage falls below the minimum.
* **Auction exited / entered:** The validator left or joined the SAM Auction. Exiting is **critical**. Act quickly to avoid losing delegated stake.
* **Cap constraint changed:** The binding constraint limiting the validator's delegated stake changed. Only the `BOND` cap type (bond size is the limiting factor) triggers a notification. Other cap types (e.g., country, ASO) are system-managed and suppressed.
* **Bond removed:** Bond is no longer visible in on-chain data. This is a **critical** alert. It may indicate accidental bond closure. All delegated stake will be lost if not resolved.
* **Bond balance changed:** SOL balance on the bond account changed.
* **SAM eligibility changed:** Validator SAM eligibility toggled (e.g., due to delinquency). Ineligibility means Marinade will not delegate to the validator even if the bid is competitive. See Eligibility Criteria.
* **Announcements:** Broadcast messages from Marinade to all validators.

{% hint style="warning" %}
The notification system is currently in beta. Thresholds, priority levels, and notification frequency may change during testing.
{% endhint %}

***

## Subscribing to Notifications

### **Requirements**

* The `validator-bonds` CLI. Install it via [npm](https://www.npmjs.com/package/@marinade.finance/validator-bonds-cli): `npm install -g @marinade.finance/validator-bonds-cli`
* The **bond authority keypair** or **validator identity keypair** (file-based keypair or Ledger hardware wallet).

#### **Subscribe via Telegram**

```bash
validator-bonds subscribe <BOND_OR_VOTE_ACCOUNT> \
  --type telegram \
  --address @YourTelegramHandle \
  --authority /path/to/authority-keypair.json
```

The CLI signs an off-chain message with the authority keypair to prove bond ownership. The browser then opens a Telegram deep link. Press **Start** in the bot to activate. Notifications are not delivered until confirmation in Telegram. If the browser does not open automatically, copy the link from the CLI output manually.

{% hint style="info" %}
Telegram activation is required **every time** a subscription is created or re-created, even for the same bond. Always go through the CLI first.
{% endhint %}

#### **Subscribe via Email**

```bash
validator-bonds subscribe <BOND_OR_VOTE_ACCOUNT> \
  --type email \
  --address your@email.com \
  --authority /path/to/authority-keypair.json
```

Unlike Telegram, email subscriptions are active immediately. No additional confirmation step is needed.

### **Subscription Scope**

A subscription currently covers **all notification types** for the given bond. Granular subscription modes (e.g., subscribing only to critical alerts or specific event types) are not available at this time and may be added in the future.

#### Viewing Your Subscriptions

To see your active subscriptions for a bond:

```bash
validator-bonds subscriptions <BOND_OR_VOTE_ACCOUNT> \
  --authority /path/to/authority-keypair.json
```

Use `-f json` or `-f yaml` for machine-readable output.

## Unsubscribing

#### **Unsubscribe a specific channel address:**

```bash
validator-bonds unsubscribe <BOND_OR_VOTE_ACCOUNT> \
  --type telegram \
  --address @YourTelegramHandle \
  --authority /path/to/authority-keypair.json
```

#### **Unsubscribe All Subscriptions of a Given Type**

Omit `--address`:

```bash
validator-bonds unsubscribe <BOND_OR_VOTE_ACCOUNT> \
  --type telegram \
  --authority /path/to/authority-keypair.json
```

{% hint style="info" %}
Unsubscribing requires signing with the bond authority or validator identity keypair, the same as subscribing.
{% endhint %}

## Viewing Notifications

```bash
validator-bonds show-notifications <BOND_OR_VOTE_ACCOUNT>
```

Notifications have a relevance window (typically 2 to 5 days depending on the event type). Older notifications will no longer appear in this view.

To view broadcast announcements from Marinade:

```bash
validator-bonds show-notifications
```

### Quick Reference

<table><thead><tr><th width="158">Action</th><th>Command</th></tr></thead><tbody><tr><td>Subscribe (Telegram)</td><td><code>validator-bonds subscribe &#x3C;BOND> --type telegram --address @handle --authority keypair.json</code></td></tr><tr><td>Subscribe (Email)</td><td><code>validator-bonds subscribe &#x3C;BOND> --type email --address you@email.com --authority keypair.json</code></td></tr><tr><td>List subscriptions</td><td><code>validator-bonds subscriptions &#x3C;BOND> --authority keypair.json</code></td></tr><tr><td>Unsubscribe specific</td><td><code>validator-bonds unsubscribe &#x3C;BOND> --type telegram --address @handle --authority keypair.json</code></td></tr><tr><td>Unsubscribe all of type</td><td><code>validator-bonds unsubscribe &#x3C;BOND> --type telegram --authority keypair.json</code></td></tr><tr><td>View notifications</td><td><code>validator-bonds show-notifications &#x3C;BOND></code></td></tr><tr><td>View announcements</td><td><code>validator-bonds show-notifications</code></td></tr></tbody></table>

`<BOND>` can be either a **bond account address** or a **vote account address**.

### Ledger Hardware Wallet Support

All subscribe and unsubscribe commands support Ledger hardware wallets. Pass the Ledger as the  `--authority` option and the CLI will prompt to confirm the off-chain message signing on the device.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:

```
GET https://docs.marinade.finance/marinade-protocol/protocol-overview/stake-auction-market/bond-notifications.md?ask=<question>&goal=<endgoal>
```

`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.

The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
