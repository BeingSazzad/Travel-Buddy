import React from "react";
import ProfileSheet from "@/components/profile/ProfileSheet";

const CONTENT = {
  terms: {
    title: "Terms",
    body: [
      "Seluna is a members-only travel and social community for women. By using Seluna you agree to use the community respectfully and lawfully.",
      "Membership requires an active subscription. You may cancel at any time; access continues until the end of your billing period.",
      "You are responsible for the accuracy of your profile and for your interactions with other members. Seluna is a platform and does not verify every member or listing.",
      "We may suspend or terminate accounts that violate these terms or our community guidelines. Deal redemptions are provided by third-party partners and are subject to their own terms.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect the information you provide during registration and profile setup, plus limited trip, event and message data you create in the app.",
      "Your approximate location is used only for matching, nearby events and recommendations. Your exact home address is never shown to other members.",
      "You control who can see your age, upcoming trips and current city from your Privacy settings at any time.",
      "Messages are visible only to participants. Reviews and saved items are tied to your account. You may request deletion of your data by contacting Seluna support.",
    ],
  },
  help: {
    title: "Help",
    body: [
      "Need a hand? Most settings — privacy, notifications and blocked users — can be managed right here in your profile.",
      "For account, billing or safety concerns, contact Seluna support through the app and our team will help you.",
      "To report a member or a review, use the Report option where you see it. Reports are reviewed by our moderation team.",
    ],
  },
};

export default function LegalSheet({ kind, onClose }) {
  const c = CONTENT[kind] || CONTENT.help;
  return (
    <ProfileSheet title={c.title} onClose={onClose}>
      <div className="space-y-3">
        {c.body.map((p, i) => (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
        ))}
      </div>
    </ProfileSheet>
  );
}