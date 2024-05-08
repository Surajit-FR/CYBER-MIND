const UserModel = require('../model/user_model');
const SecurePassword = require('../helpers/secure_password');
const CreateToken = require('../helpers/create_token');
const { deleteFile } = require('../helpers/file_utils');
const FamilyModel = require('../model/family_model');
const { generateUniqueFamilyHash } = require('../helpers/family_hash');
const MemberModel = require('../model/member_model');
const { checkAdminPermission } = require('../helpers/check_permission');


// Update User Profile
exports.UpdateUserProfile = async (req, res) => {
    const { full_name, email, phone, city_state } = req.body;
    try {
        // Remove "public" prefix from file path
        const filePath = req?.file?.path?.replace('public', '');

        const decoded_token = req.decoded_token;
        const user_id = decoded_token._id;

        const UpdatedUser = await UserModel.findByIdAndUpdate(
            { _id: user_id },
            {
                full_name,
                profile_img: filePath,
                email,
                phone,
                city_state,
            },
            { new: true }
        );

        const tokenData = CreateToken(UpdatedUser);
        return res.status(201).json({ success: true, message: "Profile updated successfully!", data: UpdatedUser, token: tokenData });

    } catch (exc) {
        // Delete uploaded file if an error occurred during upload
        if (req?.file) {
            try {
                await deleteFile(req?.file?.path);
                console.log("File deleted successfully");
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }
        console.log(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    };
};

// Create Family
exports.CreateFamily = async (req, res) => {
    const { family_name } = req.body;

    try {
        const decoded_token = req.decoded_token;

        // Generate unique family hash
        const family_hash_id = generateUniqueFamilyHash(family_name);

        // Create family
        const newFamily = new FamilyModel({
            family_name,
            family_hash_id
        });

        // Save family to database
        await newFamily.save();

        // Create membership for the user who created the family
        const newMembership = new MemberModel({
            user: decoded_token._id,
            family: newFamily._id,
            role: 'admin' // Set the role as admin
        });

        // Save membership to database
        await newMembership.save();

        // Update user's family field
        const user = await UserModel.findByIdAndUpdate(
            decoded_token._id,
            {
                family: newFamily.family_hash_id,
            },
            { new: true }
        );

        return res.status(201).json({ success: true, message: "Family created successfully", user });

    } catch (exc) {
        console.error(exc);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// Add Member
exports.AddMembers = async (req, res) => {
    const members = req.body;
    try {
        // Check admin permission for each member
        const decoded_token = req.decoded_token; // Assuming the user information is stored in the token
        for (const member of members) {
            const isAdmin = await checkAdminPermission(decoded_token._id, member.family);

            if (!isAdmin) {
                return res.status(403).json({ success: false, message: "You are not authorized to add members to this family" });
            }
        }

        // Iterate through each member and add them to the family
        for (const member of members) {
            const { user, family, role } = member;

            // Check if a membership with the same userId and familyId already exists
            const existingMembership = await MemberModel.findOne({ user, family });
            const _family = await FamilyModel.findOne({ _id: family });

            // If membership already exists, send a response indicating that the user is already a member
            if (existingMembership) continue;

            // Create membership for the user and add them to the family
            const newMembership = new MemberModel({
                user,
                family,
                role
            });

            // Save membership to database
            await newMembership.save();
            await UserModel.findByIdAndUpdate(
                member.userId,
                {
                    family: _family.family_hash_id,
                },
                { new: true }
            );
        }

        return res.status(201).json({ success: true, message: "Members added successfully" });
    } catch (exc) {
        console.error(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};

// Get All Member
exports.GetAllMember = async (req, res) => {
    try {
        const decoded_token = req.decoded_token;

        // Ensure familyId is provided in the request
        const family_hash_id = decoded_token.family;

        // Fetch the FAMILY of logged-in user
        const FAMILY = await FamilyModel.findOne({ family_hash_id });

        // Fetch all members of the family
        const allMembers = await MemberModel.find({ family: FAMILY?._id })
            .populate({
                path: 'user',
                select: '-password -createdAt -updatedAt -__v'
            })
            .populate({
                path: 'family',
                select: '-createdAt -updatedAt -__v'
            })
            .select('-createdAt -updatedAt -__v')
            .lean(); // Convert to plain JavaScript objects for performance

        return res.status(200).json({ success: true, message: allMembers?.length > 0 ? "Data fetched successfully!" : "No data found!", data: allMembers });

    } catch (exc) {
        console.error(exc.message);
        return res.status(500).json({ success: false, message: "Internal server error", error: exc.message });
    }
};