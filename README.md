# Basedpay

Basedpay is a payment solution on Base for both merchants and users to pay in cryptocurrency using Singapore Payment QR Codes.

## Repo

This is a monorepo that contains the following:

-   frontend which is a fork of [onchain-app-template](https://github.com/coinbase/onchain-app-template) from coinbase.
-   contracts which is a hardhat project

## Features

An ERC721 will be used to represent merchant ownership over the UEN.

Scan Payment QR Codes -> Fetch ERC721 by ID -> Get owner's address for payment

### TODOs

General:

-   [ ] Paymaster integration for gasless transactions
-   [ ] Referral system ↓↓

Users:

-   [ ] Users can scan a Singapore Payment QRCode and make a payment using a specific ERC20 (xSGD)
-   [ ] Support multiple ERC20 for payment (Uniswap Router swap to xSGD) ↓

Merchant:

-   [ ] Merchants can claim a Payment QRCode and receive an ERC721
-   [ ] Merchants can receive a notification whenever they receive payment to their Onchain Address
-   [ ] Merchants can have a dashboard to view their earnings ↓
-   [ ] Merchants can verify their UEN ownership by uploading their registration letter ↓
-   [ ] Merchants can verify their phone number ownership via SMS 2FA ↓

\*↓ represents lower priority

## Resources

-   [onchainkit.xyz/](https://onchainkit.xyz/)
-   [smartwallet.dev/guides/paymasters](https://www.smartwallet.dev/guides/paymasters)
-   [poonchuanan/Python-PayNow-QR-Code-Generator](https://github.com/poonchuanan/Python-PayNow-QR-Code-Generator)
