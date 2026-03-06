Title: Requirements Writing
Date: 2026-03-06 18:00
Category: Engineering
Tags: Design, Verilog, Verification
Author: morganp
Status: published

Good requirements engineering is fundamental to delivering products that meet customer needs within cost and schedule. A well-formed requirement identifies a specific user or stakeholder, defines a positive end result, and states a measurable success criterion -- for example: *"The internet user shall be able to access their current account balance in less than 5 seconds."* Requirements must be unambiguous, singular (one requirement per statement), and free of escape clauses such as "unless", "except", or "if possible". They should avoid designing the solution, speculating about future needs, or using vague qualitative terms like "user-friendly" or "flexible" that cannot be verified. The normative terms shall, should, and may carry specific and distinct meanings -- using them precisely is critical to a traceable and verifiable requirement set.

> **Note:** The IBM Requirements Writing Training document uses 'shall' or 'will' interchangeably to signal a mandatory requirement. The IEEE Standards Style Manual (also referenced below) deprecates the use of 'will' for mandatory requirements, reserving it for statements of fact only. The IEEE definition is the preferred usage.

## Normative Terms

Normative requirements are normally phrased using one of the three terms below: shall, should, or may. All normative elements that are requirements (shall) are to be followed in all cases in order to be in conformity.

| Term | Priority | Description |
|---|---|---|
| 'Shall' | High | 'Must-have' for minimum viable product (MVP) |
| 'Should' | Medium | 'Desirable' in product and to be considered for phase 1, including any impact |
| 'May' | Low | 'Nice-to-have' and could be included if no impact to key metrics. Should log decision. |

**Use of Special Terms (from IEEE Standards Style Manual)**

> The word **shall** is used to indicate mandatory requirements strictly to be followed in order to conform to the Specification and from which no deviation is permitted (shall equals is required to).
>
> The use of the word **must** is deprecated and shall not be used when stating mandatory requirements; must is used only to describe unavoidable situations.
>
> The use of the word **will** is deprecated and shall not be used when stating mandatory requirements; will is only used in statements of fact.
>
> The word **should** is used to indicate that among several possibilities one is recommended as particularly suitable, without mentioning or excluding others; or that a certain course of action is preferred but not necessarily required; or that (in the negative form) a certain course of action is deprecated but not prohibited (should equals is recommended that).
>
> The word **may** is used to indicate a course of action permissible within the limits of the Specification (may equals is permitted to).
>
> The word **can** is used for statements of possibility and capability, whether material, physical, or causal (can equals is able to).
>
> All sections are normative, unless they are explicitly indicated to be informative.

## Requirement Categories

*The following categories reflect a common industry classification used in semiconductor product development.*

| Category | Definition | Owner |
|---|---|---|
| CR | **Customer Requirement** -- A customer need that the product needs to meet. Gathered from customer interaction, field channels or market research. May not be possible to meet all CRs on a product due to risk or resources. | Marketing, Systems |
| SR | **System Requirement** -- Describes the required black-box behaviour of the device. Customer visible SRs are the primary basis for the datasheet. Often, an SR translates a CR into the plan-of-record for a product. Captures the negotiated attribute. May not fully meet the ideal CR. | Systems |
| DR | **Design Requirement** -- Result of distillation of SR, driven by implementation choices that do not affect the black-box behaviour but need to be defined for the design or verification team. Capture constraints required to implement the SRs. | Design |
| VR | **Verification Requirement** -- Description of what needs to be done to ensure an SR and/or DR is implemented correctly. Linked to at least one SR and/or DR. Checks and coverage information is recorded in VRs. | Verification |
| VAR | **Validation Requirement** -- A concise description of how an SR or DR of any requirement type will be covered with a test case during the emulation or post-silicon phase of development. Validation requirements check whether we implemented the right thing through means of functional testing or parametric silicon measurements. Test conditions are recorded in a VAR. Linked to at least one SR. | Validation |

## Requirement Types

| Type | Definition |
|---|---|
| Functional | Normative functional requirements that can be verified and/or validated. |
| Parametric | Normative parametric requirements that can be verified and/or validated. |
| Register Field | Normative register field requirements. |
| Informative | Informative requirement content, not actionable, but provides context for better interpretation of normative requirements. Informative elements are illustrations, examples, or suggestions that explain the meaning and implications of requirements, as well as case studies on their application. May include diagrams and other attachments which are not to be treated as normative. |
| Use Case | System-level use cases. Commonly captured as diagrams and set context (informative) but can require verification and distillation into further requirements (normative). |

## Resources

- [IBM Requirements Writing Training (PDF)]({static}/pdf/IBM_Requirements_Writing_Training.pdf)
- [2021 IEEE Standards Style Manual (PDF)]({static}/pdf/2021-IEEE-Standards-Style-Manual.pdf)
