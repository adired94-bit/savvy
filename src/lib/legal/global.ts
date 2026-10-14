import type { LegalGround } from "@/types/claims";

/**
 * Consumer-law grounds for the United States, the European Union and the United Kingdom.
 *
 * Same rules as `il.ts`: a product draft, not legal advice. Statute names are cited as written
 * in law; section or article numbers are included only where well established. Every entry must
 * be reviewed by a qualified attorney in the relevant jurisdiction before a letter is sent.
 *
 * US note: the FTC's 2024 "Click-to-Cancel" amendment to the Negative Option Rule was vacated by
 * the Eighth Circuit in July 2025, so it is NOT cited as binding law. Cancellation complaints rest
 * on ROSCA and state automatic-renewal laws, which the FTC and state AGs actively enforce.
 */
export const GLOBAL_GROUNDS: LegalGround[] = [
  // ---------------------------------------------------------------- United States
  {
    id: "us-rosca",
    jurisdiction: "US",
    language: "en",
    topics: ["subscription", "telecom", "product"],
    plain: "A seller must clearly disclose recurring charges, get your informed consent, and give you a simple way to cancel.",
    law: "Restore Online Shoppers' Confidence Act (ROSCA)",
    section: "15 U.S.C. §§ 8401-8405",
    letterClause:
      "Under the Restore Online Shoppers' Confidence Act, 15 U.S.C. §§ 8401-8405, a seller of an online negative-option feature must clearly disclose all material terms before obtaining billing information, obtain the consumer's express informed consent to the charge, and provide a simple mechanism to stop recurring charges.",
  },
  {
    id: "us-state-arl",
    jurisdiction: "US",
    language: "en",
    topics: ["subscription", "telecom"],
    plain: "Many states require clear renewal terms, a reminder before renewal, and easy online cancellation.",
    law: "State automatic renewal laws (for example, California Business and Professions Code § 17600 et seq.)",
    letterClause:
      "State automatic renewal laws, including California Business and Professions Code § 17600 et seq. where applicable, require clear disclosure of automatic renewal terms, affirmative consent, and an easy cancellation method, and provide for refunds where these requirements are not met.",
  },
  {
    id: "us-fcba",
    jurisdiction: "US",
    language: "en",
    topics: ["banking", "subscription", "product", "telecom"],
    plain: "If a credit card statement has a billing error, you can dispute it in writing within 60 days and the issuer must investigate.",
    law: "Fair Credit Billing Act",
    section: "15 U.S.C. § 1666",
    letterClause:
      "This letter is written notice of a billing error under the Fair Credit Billing Act, 15 U.S.C. § 1666. I dispute the charge described above and request that it be investigated and corrected.",
  },
  {
    id: "us-efta",
    jurisdiction: "US",
    language: "en",
    topics: ["banking"],
    plain: "For debit and bank-account errors, the bank must investigate when you report them within 60 days.",
    law: "Electronic Fund Transfer Act",
    section: "15 U.S.C. § 1693f",
    letterClause:
      "Under the Electronic Fund Transfer Act, 15 U.S.C. § 1693f, I am notifying you of an error on my account and request that you investigate and correct it.",
  },
  {
    id: "us-ftc-act",
    jurisdiction: "US",
    language: "en",
    topics: ["subscription", "telecom", "insurance", "banking", "product", "flight"],
    plain: "Deceptive or unfair billing practices are illegal under federal law.",
    law: "Federal Trade Commission Act, Section 5",
    section: "15 U.S.C. § 45",
    letterClause:
      "Charging a consumer for services not authorized, or misrepresenting material terms of a charge, may constitute an unfair or deceptive act or practice under Section 5 of the Federal Trade Commission Act, 15 U.S.C. § 45.",
  },
  {
    id: "us-fcc-billing",
    jurisdiction: "US",
    language: "en",
    topics: ["telecom"],
    plain: "Phone and internet bills must be clear and must not include charges you did not authorize.",
    law: "FCC Truth-in-Billing rules",
    section: "47 C.F.R. § 64.2401",
    letterClause:
      "The FCC's Truth-in-Billing rules, 47 C.F.R. § 64.2401, require that carrier bills be clear and non-misleading and that charges be described accurately.",
  },
  {
    id: "us-dot-refund",
    jurisdiction: "US",
    language: "en",
    topics: ["flight"],
    plain: "Airlines must automatically refund you in cash if they cancel or significantly change your flight and you don't take the alternative.",
    law: "U.S. Department of Transportation airline refund rule",
    section: "14 C.F.R. Part 260",
    letterClause:
      "Under the U.S. Department of Transportation's refund rule, 14 C.F.R. Part 260, a passenger whose flight is cancelled or significantly changed, and who does not accept the alternative offered, is entitled to a prompt refund to the original form of payment.",
  },

  // ---------------------------------------------------------------- European Union
  {
    id: "eu-261",
    jurisdiction: "EU",
    language: "en",
    topics: ["flight"],
    plain: "A cancelled flight, or one that arrives 3 or more hours late, can entitle you to fixed compensation set by EU law.",
    law: "Regulation (EC) No 261/2004 (EU261)",
    section: "Articles 5 and 7",
    letterClause:
      "Under Regulation (EC) No 261/2004, Articles 5 and 7, a passenger whose flight is cancelled, or who reaches the final destination three hours or more after the scheduled arrival time, is entitled to fixed compensation, without having to prove any loss, unless the carrier proves extraordinary circumstances.",
  },
  {
    id: "eu-crd",
    jurisdiction: "EU",
    language: "en",
    topics: ["product", "subscription"],
    plain: "For online and distance purchases you generally have 14 days to cancel for any reason and get your money back.",
    law: "Consumer Rights Directive 2011/83/EU",
    section: "Articles 9-14",
    letterClause:
      "Under Directive 2011/83/EU on consumer rights, Articles 9 to 14, I am entitled to withdraw from a distance contract within 14 days without giving any reason and to be reimbursed all payments received.",
  },
  {
    id: "eu-ucpd",
    jurisdiction: "EU",
    language: "en",
    topics: ["subscription", "telecom", "insurance", "banking", "product"],
    plain: "Misleading prices, hidden fees and unclear terms are banned as unfair commercial practices.",
    law: "Unfair Commercial Practices Directive 2005/29/EC",
    section: "Article 6",
    letterClause:
      "The conduct described above may constitute a misleading commercial practice under Article 6 of Directive 2005/29/EC on unfair business-to-consumer commercial practices, as transposed into national law.",
  },
  {
    id: "eu-psd2",
    jurisdiction: "EU",
    language: "en",
    topics: ["banking"],
    plain: "If a payment was made without your authorization, your bank generally must refund it promptly.",
    law: "Payment Services Directive (EU) 2015/2366 (PSD2)",
    section: "Article 73",
    letterClause:
      "Under Article 73 of Directive (EU) 2015/2366, where a payment transaction was not authorised, the payment service provider must refund the amount to the payer immediately, and in any event by the end of the following business day.",
  },
  {
    id: "eu-goods",
    jurisdiction: "EU",
    language: "en",
    topics: ["product"],
    plain: "Goods that don't match what was promised or break early must be repaired, replaced, or refunded.",
    law: "Sale of Goods Directive (EU) 2019/771",
    letterClause:
      "Under Directive (EU) 2019/771 on the sale of goods, as transposed into national law, the consumer is entitled to have goods that do not conform to the contract brought into conformity by repair or replacement or, where applicable, to a price reduction or termination of the contract with a refund.",
  },
  {
    id: "eu-gdpr-erasure",
    jurisdiction: "EU",
    language: "en",
    topics: ["subscription", "telecom", "insurance", "banking", "product"],
    plain: "When you cancel, you can ask the company to delete your personal data.",
    law: "General Data Protection Regulation (GDPR)",
    section: "Articles 15 and 17",
    letterClause:
      "Pursuant to Articles 15 and 17 of Regulation (EU) 2016/679 (GDPR), I request confirmation of the personal data you hold about me and, once the contract is terminated and no legal retention duty applies, the erasure of that data.",
  },

  // ---------------------------------------------------------------- United Kingdom
  {
    id: "uk-261",
    jurisdiction: "UK",
    language: "en",
    topics: ["flight"],
    plain: "A cancelled or long-delayed flight can entitle you to fixed compensation under UK law.",
    law: "Regulation (EC) No 261/2004 as it forms part of UK law (UK261)",
    letterClause:
      "Under Regulation (EC) No 261/2004 as retained in UK law (UK261), a passenger whose flight is cancelled, or who arrives three hours or more late, is entitled to fixed compensation without having to prove any loss, unless the carrier shows extraordinary circumstances.",
  },
  {
    id: "uk-cra",
    jurisdiction: "UK",
    language: "en",
    topics: ["product", "telecom", "subscription", "insurance", "banking"],
    plain: "Goods must be as described and of satisfactory quality, and services must be carried out with reasonable care and skill.",
    law: "Consumer Rights Act 2015",
    letterClause:
      "Under the Consumer Rights Act 2015, goods must be of satisfactory quality and as described, and services must be performed with reasonable care and skill, failing which I am entitled to the remedies provided by that Act, including repeat performance, a price reduction or a refund.",
  },
  {
    id: "uk-ccr",
    jurisdiction: "UK",
    language: "en",
    topics: ["product", "subscription"],
    plain: "For online and distance purchases you generally have 14 days to cancel and get a refund.",
    law: "Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013",
    letterClause:
      "Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, I am entitled to cancel this distance contract within the cancellation period and to be refunded all payments made.",
  },
  {
    id: "uk-s75",
    jurisdiction: "UK",
    language: "en",
    topics: ["product", "flight", "subscription"],
    plain: "If you paid by credit card, the card company can be equally responsible if the seller breaks the contract.",
    law: "Consumer Credit Act 1974",
    section: "section 75",
    letterClause:
      "As I paid using a credit card, my card issuer is jointly and severally liable with the supplier for any breach of contract or misrepresentation under section 75 of the Consumer Credit Act 1974.",
  },
  {
    id: "uk-dmcc",
    jurisdiction: "UK",
    language: "en",
    topics: ["subscription", "telecom", "insurance", "banking", "product"],
    plain: "Misleading and aggressive sales practices, including hidden fees, are prohibited.",
    law: "Digital Markets, Competition and Consumers Act 2024",
    letterClause:
      "The conduct described above may amount to an unfair commercial practice prohibited by the Digital Markets, Competition and Consumers Act 2024, including misleading actions and omissions about price and terms.",
  },
  {
    id: "uk-gdpr-erasure",
    jurisdiction: "UK",
    language: "en",
    topics: ["subscription", "telecom", "insurance", "banking", "product"],
    plain: "When you cancel, you can ask the company to delete your personal data.",
    law: "UK GDPR and the Data Protection Act 2018",
    section: "Articles 15 and 17",
    letterClause:
      "Under Articles 15 and 17 of the UK GDPR, I request confirmation of the personal data you hold about me and, once the contract has ended and no legal retention duty applies, its erasure.",
  },
];
