# AthensDAO 2025: Realms DAO used in Marinade

AthensDAO: https://www.athensdao.com

Presentation is at link:./slides/[slides/]

This is a presentation on how the [Realms DAO](https://github.com/solana-labs/solana-program-library/tree/master/governance)
is used within Marinade.

The GUI of the Solana DAO app is at https://www.realms.today/

Documentation:

* https://docs.realms.today/spl-governance
* https://github.com/solana-labs/solana-program-library/tree/master/governance
* https://github.com/marinade-finance/vote-aggregator

## Reveal.js slides dev

See README at https://github.com/hakimel/reveal.js

`reveal.js` is an open source HTML presentation framework
how to install in details check https://revealjs.com/installation/

## Installation

[source,sh]
----
git clone --depth 1 https://github.com/hakimel/reveal.js \
  -b 5.1.0 slides

cd slides
rm -rf .git

# in slides/ folder
npm install
# needed after changed scss files
npm run build
# in slides/ folder
npm start
----

To check the slides got to http://localhost:8000

To get https://revealjs.com/pdf-export/[PDF version] of the slides
to to http://localhost:8000/?print-pdf and `Save as PDF`.

NOTE: images created with https://excalidraw.com/