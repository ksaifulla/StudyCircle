import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { SideBarIcon } from "./MainSidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function AddGroup() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/v1/groups",
        {
          name,
          subject,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setSuccess("Group created successfully!");
      setError("");
      setName("");
      setSubject("");
      setDescription("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the group",
      );
      setSuccess("");
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/v1/groups/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setSuccess("Joined group successfully!");
      setError("");
      setGroupId("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while joining the group",
      );
      setSuccess("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SideBarIcon icon={<BsPlus size="32" />} />
      </DialogTrigger>
      <DialogContent className="bg-soft-500 shadow-lg text-white rounded-lg sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-200">
            Create or Join Group
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Create a new group or join an existing one. Click on save when you
            are done.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-800 border-l-4 border-red-600 text-red-100 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-800 border-l-4 border-green-600 text-green-100 p-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Create Group Form */}
        <div className="grid gap-4 py-4">
          <form onSubmit={handleCreateGroup} className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-gray-200">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                className="col-span-3 bg-gray-800 text-gray-100 border-gray-700"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right text-gray-200">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                className="col-span-3 bg-gray-800 text-gray-100 border-gray-700"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-gray-200">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter group description"
                className="col-span-3 bg-gray-800 text-gray-100 border-gray-700"
                rows="3"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-fuchsia-700 hover:bg-fuchsia-800"
              >
                Create Group
              </Button>
            </DialogFooter>
          </form>

          {/* OR Divider */}
          <div className="flex items-center justify-center my-4">
            <hr className="w-full border-gray-600" />
            <span className="mx-4 text-gray-400 font-semibold">OR</span>
            <hr className="w-full border-gray-600" />
          </div>

          {/* Join Group Form */}
          <form onSubmit={handleJoinGroup} className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupId" className="text-right text-gray-200">
                Group ID
              </Label>
              <Input
                id="groupId"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="Enter group ID"
                className="col-span-3 bg-gray-800 text-gray-100 border-gray-700"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-fuchsia-700 hover:bg-fuchsia-800"
              >
                Join Group
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}