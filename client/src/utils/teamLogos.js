import abahani from "../assets/logos/Abhani Dhaka.webp";
import kings from "../assets/logos/Boshundora kings.webp";
import mohammedan from "../assets/logos/Mohamedan.webp";
import rahmatganj from "../assets/logos/Rahmatgonj FC.webp";
import fortis from "../assets/logos/Fortis fc.webp";
import police from "../assets/logos/BD police.webp";
import brothers from "../assets/logos/Brothers Union.webp";
import arambagh from "../assets/logos/Arambag.webp";
import fakirerpool from "../assets/logos/Fokira.jpg";
import pwt from "../assets/logos/PWT fc.webp";
import bangladesh from "../assets/logos/bangladesh.png";

const clubLogoMap = {
  "bashundhara kings": kings,
  "bashundhara kings fc": kings,
  "kings": kings,
  "abahani limited": abahani,
  "abahani dhaka": abahani,
  "abahani ltd": abahani,
  "chittagong abahani": abahani,
  "mohammedan sc": mohammedan,
  "mohammedan": mohammedan,
  "rahmatganj mfs": rahmatganj,
  "rahmatganj": rahmatganj,
  "fortis fc": fortis,
  "fortis": fortis,
  "bangladesh police fc": police,
  "police fc": police,
  "brothers union": brothers,
  "arambagh ks": arambagh,
  "arambagh": arambagh,
  "fakirerpool yc": fakirerpool,
  "fakirerpool": fakirerpool,
  "pwt fc": pwt,
  "bangladesh": bangladesh,
  "bangladesh national team": bangladesh,
};

export const getTeamLogo = (teamName) => {
  if (!teamName) return null;
  const key = teamName.toLowerCase().trim();
  return clubLogoMap[key] || null;
};

export const getTeamInitials = (teamName) => {
  if (!teamName) return "FC";
  const words = teamName.trim().split(" ");
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return teamName.slice(0, 2).toUpperCase();
};
