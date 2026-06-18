// Public API modul CMS — konten halaman yang dikelola Super Admin (PRD §8.2)
export {
  getAboutContent,
  getChairmanContent,
  getContactContent,
  getHeroContent,
  getMarsContent,
  getPrivacyContent,
  getSettingsContent,
  getStatsContent,
} from "./queries";

// --- Dashboard (admin) ---
export { saveSiteContent } from "./admin-actions";
export { CmsEditor } from "./components/cms-editor";
