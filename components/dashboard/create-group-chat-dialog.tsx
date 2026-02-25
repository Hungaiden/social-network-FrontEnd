"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import conversationService from "@/services/conversationService";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface CreateGroupChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableUsers: User[];
  onGroupCreated?: (group: any) => void;
}

export function CreateGroupChatDialog({
  open,
  onOpenChange,
  availableUsers,
  onGroupCreated,
}: CreateGroupChatDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    // Validation
    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    if (selectedMembers.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 members for a group chat",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await conversationService.createGroupChat({
        name: groupName.trim(),
        memberIds: selectedMembers,
      });

      toast({
        title: "Success",
        description: `Group "${groupName}" has been created successfully`,
      });

      // Call the callback with the created group
      onGroupCreated?.(response);

      // Reset form and close dialog
      setGroupName("");
      setSelectedMembers([]);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create group chat",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setGroupName("");
    setSelectedMembers([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
          <DialogDescription>
            Create a new group chat by entering a name and selecting members.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Group Name Input */}
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Members Selection */}
          <div className="space-y-2">
            <Label>Select Members ({selectedMembers.length} selected)</Label>
            <ScrollArea className="h-[300px] border rounded-md p-4">
              <div className="space-y-3">
                {availableUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No users available
                  </p>
                ) : (
                  availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition"
                    >
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedMembers.includes(user.id)}
                        onCheckedChange={() => handleMemberToggle(user.id)}
                        disabled={isLoading}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Label
                        htmlFor={`user-${user.id}`}
                        className="flex-1 cursor-pointer font-normal"
                      >
                        {user.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreateGroup} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
