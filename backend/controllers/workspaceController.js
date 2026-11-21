import Workspace from '../model/workspace.js'
import User from '../model/user.js'
import bcrypt from 'bcrypt'

export const createWorkspace = async (req, resp) => {
    try {
        if (req.user.role !== 'owner') {
            return resp.status(403).json({
                success: false,
                message: "Only owner can create Workspace!"
            })
        }

        const { name, description } = req.body
        if (!name || !name.trim()) {
            return resp.status(400).json({
                success: false,
                message: "name fields are required!"
            })
        }


        const workspace = await Workspace.findOne({ name: name.trim(), owner: req.user.userId })
        if (workspace) {
            return resp.status(400).json({
                success: false,
                message: "Workspace name already exist try deffirent name!"
            })
        }

        const newWorkspace = new Workspace({ name: name.trim(), description: description?.trim(), owner: req.user.userId })
        await newWorkspace.save()

        return resp.status(201).json({
            success: true,
            message: "Workspace created successfully. You can access.",
            workspace: newWorkspace
        })

    } catch (error) {
        console.error("Create workspace error :", error)
        resp.status(500).json({ error: "internal server error!" })
    }
}
export const getWorkspace = async (req, resp) => {
    try {

        if (req.user.role !== 'owner') {
            return resp.status(403).json({
                success: false,
                message: "Only owner can view workspaces!"
            })
        }

        const workspaces = await Workspace.find({ owner: req.user.userId }).sort({ createdAt: -1 })
        const owner = await User.findById(req.user.userId).select('name email')

        return resp.status(200).json({
            success: true,
            count: workspaces.length,
            owner,
            workspaces
        })

    } catch (error) {
        resp.status(500).json({ error: "internal server error!" })
    }
}
export const getSingleWorkspace = async (req, resp) => {
    try {
        const { id } = req.params;

        const workspace = await Workspace.findById(id);

        if (!workspace) {
            return resp.status(404).json({
                success: false,
                message: "workspace not found maybe Id was wronge!"
            });
        }

        const isOwner = workspace.owner.toString() === req.user.userId;
        const isMember = req.user.workspaceId && req.user.workspaceId.toString() === id;

        if (!isOwner && !isMember) {
            return resp.status(403).json({
                success: false,
                message: "Access denied: You are not part of this workspace!"
            });
        }

        // 1. Workspace Owner fetch karein
        const owner = await User.findById(workspace.owner).select('name email role isVerified');

        // 2. Is workspaceId se linked saare team members fetch karein
        const teamMembers = await User.find({ workspaceId: id })
            .select('name email role isVerified')
            .sort({ createdAt: -1 });

        // 3. Owner aur Team Members ko ek array mein combine karein (duplicate avoid karke)
        const members = owner
            ? [owner, ...teamMembers.filter((m) => m._id.toString() !== owner._id.toString())]
            : teamMembers;

        return resp.status(200).json({
            success: true,
            role: req.user.role,
            workspace,
            owner,
            members
        });
    } catch (error) {
        return resp.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
export const addWorkspaceMember = async (req, resp) => {
    try {
        const { id } = req.params; // workspaceId
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return resp.status(400).json({
                success: false,
                message: "All fields (name, email, password, role) are required!"
            });
        }

        if (!['manager', 'employee'].includes(role)) {
            return resp.status(400).json({
                success: false,
                message: "Role must be either manager or employee!"
            });
        }

        const workspace = await Workspace.findById(id);
        if (!workspace) {
            return resp.status(404).json({
                success: false,
                message: "Workspace not found!"
            });
        }

        // Sirf is workspace ka Owner ya Manager hi naya member add kar sake
        const isOwner = workspace.owner.toString() === req.user.userId;
        const isManager = req.user.role === 'manager' && req.user.workspaceId?.toString() === id;

        if (!isOwner && !isManager) {
            return resp.status(403).json({
                success: false,
                message: "Only workspace owner or manager can add members!"
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return resp.status(400).json({
                success: false,
                message: "User with this email already exists!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newMember = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
            workspaceId: id,
            createdBy: req.user.userId,
            isVerified: true // Owner/Manager ne banaya hai isliye direct verified
        });

        return resp.status(201).json({
            success: true,
            message: "Team member added successfully!",
            member: {
                _id: newMember._id,
                name: newMember.name,
                email: newMember.email,
                role: newMember.role,
                isVerified: newMember.isVerified
            }
        });
    } catch (error) {
        return resp.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};