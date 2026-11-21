import {
  ChartArea,
  FileCheck,
  Layers,
  LogOut,
  Search,
  Settings,
  User2Icon,
  UsersRound,
  X,
} from "lucide-react";
import videoHero from "../assets/Hero_Video.mp4";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Workspace {
  _id: string;
  name: string;
  description: string;
  owner: string;
  createdAt?: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "employee";
  isVerified?: boolean;
}

function Dashboard() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("token");

  // Search & User States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  // Dynamic Arrays (`.length` se counts automatically calculate honge)
  const [members, setMembers] = useState<Member[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // Add Member Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [memberName, setMemberName] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [memberRole, setMemberRole] = useState<"manager" | "employee">("employee");
  const [loadingMember, setLoadingMember] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Role-wise Counts (Calculated directly from `members` array)
  const totalMembers = members.length;
  const ownerCount = members.filter((m) => m.role === "owner").length;
  const managerCount = members.filter((m) => m.role === "manager").length;
  const employeeCount = members.filter((m) => m.role === "employee").length;

  // Search Filter on Members
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSingleWorkspace = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4800/api/auth/workspace/${id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setWorkspace(data.workspace);
        setOwnerEmail(data.owner.email);
        setOwnerName(data.owner.name);

        if (data.members && Array.isArray(data.members)) {
          setMembers(data.members);
        } else if (data.owner) {
          setMembers([
            {
              _id: data.owner._id || "owner-1",
              name: data.owner.name,
              email: data.owner.email,
              role: data.role || "owner",
              isVerified: true,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Workspace fetch error:", error);
    }
  };

  useEffect(() => {
    handleSingleWorkspace();
  }, [id]);

  // Add Member Submit Handler
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoadingMember(true);

    try {
      const response = await fetch(
        `http://localhost:4800/api/auth/workspace/${id}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: memberName,
            email: memberEmail,
            password: memberPassword,
            role: memberRole,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMembers((prev) => [...prev, data.member]);
        setMemberName("");
        setMemberEmail("");
        setMemberPassword("");
        setMemberRole("employee");
        setIsModalOpen(false);
      } else {
        setErrorMsg(data.message || "Failed to add member.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please check your backend server.");
    } finally {
      setLoadingMember(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-700/60 relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-55"
      >
        <source src={videoHero} type="video/mp4" />
      </video>

      <div className="fixed inset-0 bg-transparent backdrop-blur-[2px]" />

      <div className="relative z-10 min-h-screen flex p-4 gap-4">
        <aside className="w-60 shrink-0 rounded-3xl bg-transparent border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-2xl flex flex-col justify-between p-4">
          {/* Top Brand + Nav */}
          <div>
            {/* Brand Pill */}
            <div className="flex items-center gap-2.5 px-2.5 py-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/30">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Nexus<span className="text-blue-600">CRM</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/workspaces")}
              className="w-full mb-20 flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-700 font-semibold text-sm bg-white/30 duration-300 hover:shadow-sm cursor-pointer transition-all"
            >
              <span className="truncate">{workspace?.name || "Workspace"}</span>
            </button>

            {/* Sidebar Link: Dashboard */}
            <nav className="space-y-1.5 flex gap-3 flex-col">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-600 font-medium text-sm hover:bg-white/30 duration-300 hover:shadow-sm cursor-pointer transition-all"
              >
                <ChartArea className="w-4 h-4" />
                <span>Overview</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-600 font-medium text-sm hover:bg-white/30 duration-300 hover:shadow-sm cursor-pointer transition-all"
              >
                <UsersRound className="w-4 h-4" />
                <span>Team Members</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-600 font-medium text-sm hover:bg-white/30 duration-300 hover:shadow-sm cursor-pointer transition-all"
              >
                <User2Icon className="w-4 h-4" />
                <span>Leads & Pipeline</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-600 font-medium text-sm hover:bg-white/30 duration-300 hover:shadow-sm cursor-pointer transition-all"
              >
                <FileCheck className="w-4 h-4" />
                <span>Tasks</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-600 font-medium text-sm hover:bg-white/30 duration-300 hover:shadow-sm cursor-pointer transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Logout Button */}
          <div className="pt-3 border-t border-white/70">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full bg-white/60 hover:bg-red-500 hover:text-white text-slate-700 border border-white/80 font-medium text-sm shadow-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 gap-6">
          <header className="bg-white/10 border border-white rounded-2xl p-5 flex justify-between">
            <div className="relative flex items-center px-3 py-1.5 rounded-2xl bg-white/20 gap-3 w-full max-w-xs border border-white">
              <Search className="h-4 w-4 shrink-0" color="gray" />
              <input
                type="text"
                placeholder="Search members..."
                className="outline-none bg-transparent w-full text-sm text-slate-800 placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex justify-center items-center text-white text-sm font-semibold uppercase">
                {ownerName ? ownerName.slice(0, 2) : ".."}
              </div>
              <div>
                <h2 className="text-slate-700 font-bold">{ownerName}</h2>
                <p className="text-slate-500 text-sm">{ownerEmail}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col gap-4">
            <h2 className="text-4xl font-bold text-slate-800">
              Welcome{" "}
              <span className="text-blue-600">
                {workspace?.name || "Workspace"}
              </span>
            </h2>

            {/* 4 Stat Boxes (Dynamic `.length` Counts) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div className="p-6 flex flex-col gap-3 rounded-3xl bg-white/35 hover:bg-white/50 border border-white/75 shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md transition-all">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-600/10 w-fit px-3 py-1 rounded-full">
                  Members
                </span>
                <h1 className="text-slate-600 font-extrabold text-4xl">
                  {totalMembers}
                </h1>
              </div>

              <div className="p-6 flex flex-col gap-3 rounded-3xl bg-white/35 hover:bg-white/50 border border-white/75 shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md transition-all">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-600/10 w-fit px-3 py-1 rounded-full">
                  Leads & Pipelines
                </span>
                <h1 className="text-slate-600 font-extrabold text-4xl">
                  {leads.length}
                </h1>
              </div>

              <div className="p-6 flex flex-col gap-3 rounded-3xl bg-white/35 hover:bg-white/50 border border-white/75 shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md transition-all">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-600/10 w-fit px-3 py-1 rounded-full">
                  Active Deals
                </span>
                <h1 className="text-slate-600 font-extrabold text-4xl">
                  {deals.length}
                </h1>
              </div>

              <div className="p-6 flex flex-col gap-3 rounded-3xl bg-white/35 hover:bg-white/50 border border-white/75 shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md transition-all">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-600/10 w-fit px-3 py-1 rounded-full">
                  Tasks
                </span>
                <h1 className="text-slate-600 font-extrabold text-4xl">
                  {tasks.length}
                </h1>
              </div>
            </div>

            {/* 4 Boxes Ke Neeche Wala Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
              {/* LEFT 3 COLUMNS */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                {/* Top Row: 3 Dynamic Role Count Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Owners */}
                  <div className="p-5 rounded-3xl bg-white/35 hover:bg-white/45 border border-white/75 shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md flex items-center justify-between transition-all">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-600/10 px-2.5 py-0.5 rounded-full">
                        Owner
                      </span>
                      <h4 className="text-2xl font-extrabold text-slate-800 mt-2">
                        {ownerCount}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Full workspace control
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/15 text-blue-600 flex items-center justify-center font-bold text-sm">
                      OW
                    </div>
                  </div>

                  {/* Card 2: Managers */}
                  <div className="p-5 rounded-3xl bg-white/35 hover:bg-white/45 border border-white/75 shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md flex items-center justify-between transition-all">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-500/15 px-2.5 py-0.5 rounded-full">
                        Manager
                      </span>
                      <h4 className="text-2xl font-extrabold text-slate-800 mt-2">
                        {managerCount}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Team & operations
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      MG
                    </div>
                  </div>

                  {/* Card 3: Employees */}
                  <div className="p-5 rounded-3xl bg-white/35 hover:bg-white/45 border border-white/75 shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md flex items-center justify-between transition-all">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-500/15 px-2.5 py-0.5 rounded-full">
                        Employee
                      </span>
                      <h4 className="text-2xl font-extrabold text-slate-800 mt-2">
                        {employeeCount}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Assigned workspace staff
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold text-sm">
                      EM
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Workspace Members Table */}
                <div className="p-6 rounded-3xl bg-white/35 border border-white/75 shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Workspace Members ({filteredMembers.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Users linked to this workspaceId
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg("");
                        setIsModalOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/25 transition-all cursor-pointer"
                    >
                      + Add Member
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/60 text-xs font-semibold text-slate-600">
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Email</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3 text-right">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/40 text-xs text-slate-700">
                        {filteredMembers.length > 0 ? (
                          filteredMembers.map((member) => (
                            <tr
                              key={member._id}
                              className="hover:bg-white/30 transition-colors"
                            >
                              <td className="py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                                    {member.name.slice(0, 2)}
                                  </div>
                                  <span className="font-semibold text-slate-800">
                                    {member.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 text-slate-600">
                                {member.email}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-md font-semibold capitalize ${
                                    member.role === "owner"
                                      ? "bg-blue-600/15 text-blue-600"
                                      : member.role === "manager"
                                      ? "bg-emerald-500/15 text-emerald-700"
                                      : "bg-amber-500/15 text-amber-700"
                                  }`}
                                >
                                  {member.role}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <span
                                  className={`px-2.5 py-0.5 rounded-md font-semibold ${
                                    member.isVerified
                                      ? "bg-emerald-500/15 text-emerald-700"
                                      : "bg-slate-500/15 text-slate-600"
                                  }`}
                                >
                                  {member.isVerified ? "Verified" : "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-6 text-center text-slate-500"
                            >
                              No members found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* RIGHT 1 COLUMN: Workspace Details & Recent Members */}
              <div className="lg:col-span-1 p-5 rounded-3xl bg-white/35 border border-white/75 shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-3">
                    Workspace Details
                  </h3>

                  {/* Dynamic Workspace Model Box */}
                  <div className="p-3.5 rounded-2xl bg-white/45 border border-white/75 mb-4">
                    <p className="text-xs font-bold text-slate-800">
                      {workspace?.name || "Loading..."}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {workspace?.description || "No description provided."}
                    </p>
                    {workspace?.createdAt && (
                      <p className="text-[10px] text-slate-400 mt-2">
                        Created:{" "}
                        {new Date(workspace.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                    Recent Members ({members.length})
                  </h4>

                  <div className="space-y-2.5">
                    {members.slice(0, 4).map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/35 border border-white/60"
                      >
                        <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                          {member.name.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {member.name}{" "}
                            <span className="text-blue-600 font-medium capitalize">
                              ({member.role})
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-white/50 text-center text-xs text-slate-500">
                  ∨
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ADD MEMBER GLASSMORPHIC MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white/80 border border-white shadow-[0_20px_50px_rgba(15,23,42,0.2)] backdrop-blur-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Add Team Member
                </h3>
                <p className="text-xs text-slate-500">
                  Assign a new member to {workspace?.name || "this workspace"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-3 px-3.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-700 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Raza"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/85 border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="member@company.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/85 border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Temporary Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={memberPassword}
                  onChange={(e) => setMemberPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/85 border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Workspace Role
                </label>
                <select
                  value={memberRole}
                  onChange={(e) =>
                    setMemberRole(e.target.value as "manager" | "employee")
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/85 border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-800"
                >
                  <option value="employee">Employee (Assigned Staff)</option>
                  <option value="manager">Manager (Team & Operations)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/70 hover:bg-white text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingMember}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm shadow-blue-600/25 cursor-pointer"
                >
                  {loadingMember ? "Creating..." : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;