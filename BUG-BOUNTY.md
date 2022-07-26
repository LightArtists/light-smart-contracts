# Light Smart Contracts Bug Bounty :bug: = :moneybag:

*This documents Light's bug bounty program and how you can get rewarded for finding problems with the Light Smart Contracts.*

:star: No programming experience is required.

:rainbow: There are entirely new concepts in here including pre-programed, self-running drop phases; an [EIP-2981](https://eips.ethereum.org/EIPS/eip-2981) royalties implementation connected to a [EIP-5313 (DRAFT)](https://eips.ethereum.org/EIPS/eip-5313) ownership implement with three-role safety; and reusable access lists including per-person quantities. All this is open sourced and by reading along you may find ideas & code to steal for your next project.

:thumbsup: Here is what our responses have looked like on a past bug bounty: https://github.com/LightArtists/area-ethereum-contracts/issues/5 https://github.com/LightArtists/area-ethereum-contracts/issues/1

Start time: July 27, 2022, Noon, UTC

End time: July 29, 2002, Noon, UTC

## Sponsors

This bug bounty is sponsored by [Light](https://light.art) and personally by William Entriken, Light's technical advisor and developer of these smart contracts. He has included his own personal money to pay you, dear reader, for any problems you find.

The total bounty value is over USD 10,000 including a Meebit and USD 2,000 in cash or equivalent, and much more.

## Scope of this bounty program

Help us find any problems with the Light smart contracts. Any reports and suggestions for code, operations, and style improvement will be appreciated and taken into consideration.

All source code that is deployable (i.e. all Solidity files not in the mocks folder) are in scope. The documentation, mocks and JavaScript tests are there to help you but are not in scope for the bounty program.

Social engineering, XKCD#538 attacks, bringing down Ethereum Mainnet/Infura, and other problems outside of the deployable contracts are not in scope.

You may test this contract as deployed on Görli Testnet:

-  XXX @lightartists please put address here XXX

## Sensitivity

Any found error with these smart contracts is eligible for this bounty program. Of course this includes:

- Any unexpected, dangerous functionality
- Stealing tokens
- Privilege escalation
- Denial of service (by other than the owner of the contract)

But also it includes these kinds of problems (excluding copied vendor code):

* Typos
* Violations of the Solidity style guide (except line length limit)
* Inconsistent usage of whitespace

We are inspired by the Chinese idiom 一字千金.

## Rules and rewards

- Problems that have already been published here or are already disclosed to the Light team are not eligible for rewards (a corollary, the Light team members are ineligible for rewards).
- GitHub Issues is the only way to report problems and request rewards.
- The Light team has complete and final judgment on the acceptability of bug reports.
- This program is governed under the laws of Hong Kong, if there is a party that we are unable to pay due to trade embargoes or other restrictions, then we won't pay. But we are happy to cooperate by making alternate arrangements.

Following is a [risk rating model](https://www.owasp.org/index.php/OWASP_Risk_Rating_Methodology) that judges the severity of a problem based on its likelihood and impact.

|                 | LOW LIKELIHOOD  | :left_right_arrow: | HIGH LIKELIHOOD  |
| --------------- | --------------- | ------------------ | ---------------- |
| **HIGH IMPACT** | Medium severity | High severity      | Highest severity |
| :arrow_up_down: | Low severity    | Medium severity    | High severity    |
| **LOW IMPACT**  | *Notable*       | Low severity       | Medium severity  |

Rewards:

- **Highest severity (first found)** —  a Meebit
- **High severity** — partial payout of the bug bounty (USD 2,000)
- **Medium severity** — partial payout of the bug bounty (USD 1,000)
- Every accepted problem report will also receive
  - xxx @lightartists add tee shirt if we have one xxx
  - One Area NFT token from our other token drop
  - Public acknowledgement from the Light team and personally from the contract developer on Twitter (if you allow)

Examples of impact:

- *High impact* — steal an asset/value from someone else, impersonate the ledger owner, drop order distributes assets incorrectly
- *Medium impact* — cause a function to fail or perform a wrong operation
- *Low impact* — an obvious mistake in the documentation that affects the development process and validity of the applied code
- *Notable* — typos, missing comments

Examples of likelihood:

* *High likelihood* — affects all users of the ledger performing a certain function
* *Medium likelihood* — affects a number of end users in a scenario that actually happens naturally in production deployments
* *Low likelihood* — hurts two end users only if they are cooperating together to hurt themselves
* *Notable* — affects developers and grammarians but not end users

How to win:

- Be descriptive and detailed when reporting your problem
- Fix it — recommend a way to solve the problem

Rules for bounty sponsor:

- We will respond quickly to your questions
- We will adjudicate all prizes quickly

## More questions

* If you prefer to reach us privately, please contact: support @ light.art. You are welcome to make a hashed bug report (set issue body to hash of your message). This will still be eligible for payment and recognition.
* Will things change during the bounty program?
  * Yes, we will update the code and redeploy the contract. So, click :star: STAR and :eye: WATCH above on this repo for updates.

- Taxes?
  - If you earn so much money that you will need to fill out a tax form, then we will ask you to do so. This program is subject to the laws of Hong Kong.

## Thank you

Thank you for your interest in Light, for reading to the end of this file and for reading my code. Even if you don't find any problems, I'd love to hear your thoughts. Please hit up [@light_artists](https://twitter.com/light_artists) and [@fulldecent](https://twitter.com/fulldecent) or reach out other ways. See you on [the Discord](https://t.co/Im1hwogS3F).

William Entriken / 2022-07-26
