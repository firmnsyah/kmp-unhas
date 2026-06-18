// Public API modul struktur organisasi
export { DepartmentCard } from "./components/department-card";
export { MemberGrid } from "./components/member-grid";
export { OrgChart } from "./components/org-chart";
export { PersonCard } from "./components/person-card";
export {
  getDepartmentBySlug,
  getDepartments,
  getDepartmentsWithMembers,
  getOrgMembers,
  type DepartmentWithMembers,
} from "./queries";

// --- Dashboard (admin) ---
export {
  deleteDepartment,
  deleteDeptMember,
  deleteDeptProgram,
  deleteMember,
  saveDepartment,
  saveDeptMember,
  saveDeptProgram,
  saveMember,
} from "./admin-actions";
export { getAllOrgMembers, getDepartmentById } from "./admin-queries";
export { DepartmentManager } from "./components/department-manager";
export { DeptMemberManager } from "./components/dept-member-manager";
export { DeptProgramManager } from "./components/dept-program-manager";
export { MemberManager } from "./components/member-manager";
