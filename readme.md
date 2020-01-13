# Tweet Printer

This is a script that takes tweets and prints them to a Star TSP100 or similar CUPS compatible receipt printer on 80mm wide paper.

## Requirements

To use this you require:

- Node.js
- CUPS

## Installation

1. Install Node.js, CUPS, printer drivers.
1. Setup printer in CUPS as shared.
1. Install dependencies using `npm install`.
1. Copy `.env.example` to `.env` and enter your Twitter and printer settings.
1. Run script `npm run start`
