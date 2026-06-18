// Public API modul berita
export { NewsCard } from "./components/news-card";
export { NewsFilters } from "./components/news-filters";
export { NewsPagination } from "./components/news-pagination";
export { ShareButtons } from "./components/share-buttons";
export {
  getCategories,
  getLatestNews,
  getNewsBySlug,
  getNewsList,
  getRelatedNews,
  NEWS_PER_PAGE,
} from "./queries";

// --- Dashboard (admin) ---
export {
  approveNews,
  deleteCategory,
  deleteComment,
  deleteNews,
  fetchNewsPreview,
  rejectNews,
  saveCategory,
  saveNews,
  setCommentHidden,
  submitNews,
  type AdminResult,
} from "./admin-actions";
export {
  getAdminNewsList,
  getNewsForEdit,
  getPendingNews,
  listComments,
  type CommentRow,
  type NewsEditData,
  type NewsListItem,
  type NewsPreviewPayload,
} from "./admin-queries";
export { ApprovalList } from "./components/approval-list";
export { CategoryManager } from "./components/category-manager";
export { CommentTable } from "./components/comment-table";
export { NewsEditor } from "./components/news-editor";
export { NewsPreview } from "./components/news-preview";
export { NewsTable } from "./components/news-table";
