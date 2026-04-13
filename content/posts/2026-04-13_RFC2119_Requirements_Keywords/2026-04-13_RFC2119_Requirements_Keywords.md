Title: RFC 2119 Requirements Keywords
Date: 2026-04-13
Category: Engineering
Tags: Design, Requirements, Standards, RFC
Slug: rfc-2119-requirements-keywords
Author: morganp
Summary: RFC 2119 defines a vocabulary of requirement keywords -- MUST, SHOULD, MAY and their negatives -- widely used in IETF specifications and software engineering. This post covers the full RFC 2119 keyword set, the capitalisation convention introduced by RFC 8174, and the key differences from the IEEE normative term conventions covered in the earlier requirements writing post.
Status: published

A previous post on [Requirements Writing]({filename}/posts/2026-03-06_Requirements_Writing.md) covered the IEEE normative term conventions used in hardware and semiconductor product development. This post covers a related but distinct standard: [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119), authored by Scott Bradner and published by the IETF in 1997. RFC 2119 defines a small vocabulary of requirement keywords intended for internet protocol specifications, but its usage has spread widely into software engineering, open source project documentation, and API specifications.

## The RFC 2119 Keywords

RFC 2119 defines six levels of requirement, expressed through the following keywords and their synonyms:

| Keyword | Synonyms | Meaning |
|---|---|---|
| **MUST** | REQUIRED, SHALL | An absolute requirement of the specification. |
| **MUST NOT** | SHALL NOT | An absolute prohibition of the specification. |
| **SHOULD** | RECOMMENDED | There may be valid reasons to ignore this in particular circumstances, but the full implications must be understood and weighed before doing so. |
| **SHOULD NOT** | NOT RECOMMENDED | There may be valid reasons when this behaviour is acceptable, but the full implications should be understood before proceeding. |
| **MAY** | OPTIONAL | The item is truly optional. Implementations that omit it and implementations that include it must interoperate correctly. |

RFC 2119 provides explicit definitions for both the positive and negative forms of each level. The negative forms -- MUST NOT and SHOULD NOT -- are first-class entries in the standard, not merely implied.

## The Capitalisation Convention (RFC 8174)

A critical and commonly overlooked aspect of RFC 2119 is that the special meanings apply **only when the keywords appear in ALL CAPITALS**. When the same words appear in lowercase, they carry their ordinary English meanings and make no normative claim. [RFC 8174](https://datatracker.ietf.org/doc/html/rfc8174), published in 2017, was issued specifically to clarify and reinforce this distinction after widespread confusion in practice.

Documents that use RFC 2119 vocabulary should include a boilerplate statement at the top, such as:

> The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC 2119] [RFC 8174] when, and only when, they appear in all capitals, as shown here.

This convention means that an author can write "the system should log errors" as informal guidance without it carrying normative weight, while "the system SHOULD log errors" is a normative SHOULD-level requirement. The IEEE standard has no equivalent mechanism -- every occurrence of "shall", "should", or "may" carries normative meaning regardless of case.

## Key Differences from IEEE Conventions

The IEEE Standards Style Manual and RFC 2119 share the same intent -- precise, unambiguous requirements -- but they make different choices in several areas. The differences are significant enough that mixing vocabulary from both standards in the same document without clarification will cause confusion.

### MUST vs SHALL

This is the sharpest conflict between the two conventions.

**RFC 2119:** MUST and SHALL are exact synonyms. Either may be used to express an absolute requirement, and the choice between them is purely stylistic.

**IEEE:** The word "must" is deprecated for requirements use. "Shall" is the sole term for a mandatory requirement. "Must" is reserved for describing unavoidable situations -- physical constraints or facts of nature -- not obligations imposed by the specification.

In a hardware or semiconductor context following IEEE conventions, writing MUST where the IEEE expects SHALL is non-conforming. In an IETF or software context following RFC 2119, writing "shall" is unusual but not incorrect. When working across both domains, choose one convention and state it explicitly at the outset.

### Negative Forms

The IEEE style manual covers negative requirements through phrasing such as "shall not" but does not give MUST NOT or SHOULD NOT the same explicit definitional treatment that RFC 2119 does. RFC 2119 is more thorough here: MUST NOT is defined as an absolute prohibition on equal footing with MUST as an absolute requirement.

### OPTIONAL as a Synonym for MAY

RFC 2119 defines OPTIONAL as a formal synonym for MAY, emphasising interoperability: if a feature is OPTIONAL, both implementations that include it and those that omit it are conforming, and they must work together. The IEEE treatment of "may" does not carry this interoperability framing -- it signals permission within the specification, not a guarantee of cross-implementation compatibility.

### Scope of Use

RFC 2119 includes explicit guidance that its keywords "must be used with care and sparingly". They should only appear where a requirement is genuinely necessary for interoperability or to prevent harmful behaviour -- not to impose implementation style or preferred approaches. The IEEE standard is similarly precise, but the RFC 2119 framing is explicitly interoperability-first, reflecting its origin in network protocol design.

## When to Use Which Convention

| Context | Recommended convention |
|---|---|
| Hardware, silicon, semiconductor product specs | IEEE Standards Style Manual (shall / should / may) |
| IETF internet protocol specifications | RFC 2119 / RFC 8174 (MUST / SHOULD / MAY in caps) |
| Software project specifications, APIs, open source | RFC 2119 is common; state the convention explicitly |
| Mixed hardware/software systems | Choose one; document it in a definitions section |

Whichever convention is in use, the principle from the requirements writing post applies: terms must be used precisely and consistently. Imprecision in normative vocabulary -- using "should" when "shall" is meant, or omitting MUST NOT when a prohibition is intended -- produces requirements that are untraceable and unverifiable.

## Resources

- [RFC 2119 -- Key Words for Use in RFCs to Indicate Requirement Levels](https://datatracker.ietf.org/doc/html/rfc2119)
- [RFC 8174 -- Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words](https://datatracker.ietf.org/doc/html/rfc8174)
- [Requirements Writing]({filename}/posts/2026-03-06_Requirements_Writing.md) -- IEEE normative terms and requirement categories
