# Bin/IIN Lookup service

![Example image](https://raw.githubusercontent.com/aaronburt/repo-image-host/main/chrome_f60APRpqEe.png "Example image")

The BIN/IIN Lookup Service is a simple web application that allows users to search for information about Bank Identification Numbers (BINs). A BIN is the first six digits of a payment card number and is used to identify the issuing institution. This service reads from a [CSV file](https://github.com/venelinkochev/bin-list-data) containing BIN data and returns detailed information in JSON format.

### Environment
Built with DENO 2.0.6 (Windows)

### Acknowledgments

The data used in this service is provided by the [bin-list-data](https://github.com/venelinkochev/bin-list-data) repository.