import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { FaUserShield, FaUserTie, FaUser, FaEnvelope, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import useAxiosSecure from "../../../hooks/useAxiosSecure/useAxiosSecure.jsx";
import useAuth from "../../../hooks/useAuth/useAuth.jsx";
import Loader from "../../../components/shared/Loader/Loader";

const Profile = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm();

    // Fetch user data using email
    const { data: userDetails, isLoading } = useQuery({
        queryKey: ["userProfile", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    useEffect(() => {
        if (userDetails) {
            reset({
                name: userDetails.name || "",
                email: userDetails.email || "",
            });
            setPreview(userDetails.photoURL || "");
        }
    }, [userDetails, reset]);

    const updateProfile = useMutation({
        mutationFn: async (updatedData) => {
            const res = await axiosSecure.patch(`/users/${user.email}`, updatedData);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Profile updated successfully!");
            queryClient.invalidateQueries(["userProfile", user?.email]);
        },
        onError: () => {
            toast.error("Failed to update profile.");
        },
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            setPreview(res.data.secure_url);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!data.name || !preview) {
            toast.error("Name and photo are required.");
            return;
        }
        const updatedData = {
            name: data.name,
            photoURL: preview,
            lastLogin: new Date().toISOString(),
        };
        updateProfile.mutate(updatedData);
    };

    const getBadge = (role) => {
        switch (role) {
            case "admin":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-200 text-xs">
                        <FaUserShield /> Admin
                    </span>
                );
            case "agent":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-xs">
                        <FaUserTie /> Agent
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral text-white text-xs">
                        <FaUser /> Customer
                    </span>
                );
        }
    };

    return (
        <section className="bg-gray-50 min-h-screen flex items-center justify-center">
            {isLoading ? (
                <Loader />
            ) : (
                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white shadow-2xl rounded-3xl max-w-md w-full p-8"
                >
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative w-28 h-28">
                            <img
                                src={preview}
                                alt="User"
                                className="rounded-full w-28 h-28 object-cover border-4 border-blue-500 shadow"
                            />
                            <label className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition">
                                <FaCamera className="text-white text-sm" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <div className="mt-3">{getBadge(userDetails?.role)}</div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600">Name</label>
                            <input
                                {...register("name", { required: true })}
                                type="text"
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Email</label>
                            <div className="mt-1 px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 flex items-center gap-2">
                                <FaEnvelope className="text-gray-500" />
                                <span>{user?.email || "N/A"}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Last Login</label>
                            <div className="mt-1 px-4 py-2 border rounded-lg bg-gray-100 text-gray-700">
                                {userDetails?.lastLogin
                                    ? new Date(userDetails.lastLogin).toLocaleString()
                                    : "No login data available"}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || updateProfile.isPending || uploading}
                            className="cursor-pointer w-full mt-4 bg-blue-800 text-white py-2 rounded-lg hover:opacity-75 transition disabled:opacity-50"
                        >
                            {updateProfile.isPending || isSubmitting || uploading ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </motion.form>
            )}
        </section>
    );
};

export default Profile;