/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { CompanyCardData } from "./types";

export function serializeCard(card: CompanyCardData): string {
  try {
    const minCard = {
      bn: card.businessName,
      rn: card.representativeName,
      ro: card.role,
      sl: card.slogan,
      ph: card.phone,
      wa: card.whatsapp,
      wm: card.whatsappMessage,
      em: card.email,
      wb: card.website,
      ad: card.address,
      ig: card.instagram,
      li: card.linkedin,
      fb: card.facebook,
      th: card.theme,
      ac: card.accentColor,
      bt: card.badgeText,
      se: card.services,
      lo: card.logoUrl ? (card.logoUrl.length < 50000 ? card.logoUrl : undefined) : undefined // Scale logo safely or skip if too large
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(minCard))));
  } catch (e) {
    console.error("Error serializing card text", e);
    return "";
  }
}

export function deserializeCard(hash: string): CompanyCardData | null {
  try {
    const raw = decodeURIComponent(escape(atob(hash)));
    const min = JSON.parse(raw);
    return {
      businessName: min.bn || "",
      representativeName: min.rn || "",
      role: min.ro || "",
      slogan: min.sl || "",
      phone: min.ph || "",
      whatsapp: min.wa || "",
      whatsappMessage: min.wm || "",
      email: min.em || "",
      website: min.wb || "",
      address: min.ad || "",
      instagram: min.ig || "",
      linkedin: min.li || "",
      facebook: min.fb || "",
      theme: min.th || "cosmic-charcoal",
      accentColor: min.ac || "#f43f5e",
      badgeText: min.bt || "",
      services: min.se || [],
      logoUrl: min.lo || undefined
    };
  } catch (e) {
    console.error("Error parsing serialized url hash", e);
    return null;
  }
}
