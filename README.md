# Stockton Street Co Store SDK

Welcome to the SSCO Store SDK! This SDK provides a webhook handler and related service to be used in building integrations with the Lemon Squeezy platform. 
# 🍋✊🏻

- **Author**: John Grant
- **Version**: 1.0.0
- **License**: Apache License 2.0

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Open Questions](#questions)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Open Questions

Here are some open design questions that need to be addressed:

1. **Should we use Express or leverage Next.js for the server-side framework?**  
> Consider the pros and cons of each framework in terms of performance, scalability, and ease of integration with the Lemon Squeezy platform and future stores on our side.

2. **What database should we use for storing transaction data?**
> Evaluate options like MongoDB, PostgreSQL, and MySQL based on factors such as data consistency, scalability, and ease of use.

3. **Do we implement message queuing and transport with service bus?** 
> Lemon Squeezy docs suggest return 200 immediately from webhooks after storing the json request then use async processing on it later. This implies queuing and transport layers.  

4. **What logging and monitoring tools should we implement?**

Feel free to contribute your thoughts or open an issue on our GitHub repository to discuss these questions further.
