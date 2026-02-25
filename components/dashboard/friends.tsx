"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Check, X } from "lucide-react";
import friendService, {
  type FriendRequest as ApiFriendRequest,
} from "@/services/friendService";
import { useToast } from "@/hooks/use-toast";

interface Friend {
  userId: string;
  displayName: string;
  avatar: string | null;
  status?: "online" | "offline";
}

export default function Friends({ currentUser, onMessageFriend }) {
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [friendRequests, setFriendRequests] = useState<ApiFriendRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Fetch friends from API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await friendService.getMyFriends({
          page: currentPage,
          size: 20,
        });

        if (response.code === 0 && response.result) {
          setFriends(response.result.content);
          setTotalPages(response.result.totalPages);
          setTotalElements(response.result.totalElements);
        }
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setError("Failed to load friends. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load friends",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [currentPage, toast]);

  // Fetch friend requests from API
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        setIsLoadingRequests(true);
        const response = await friendService.getMyFriendRequests();

        if (response.code === 1000 && response.result) {
          setFriendRequests(response.result);
        }
      } catch (err) {
        console.error("Failed to fetch friend requests:", err);
        toast({
          title: "Error",
          description: "Failed to load friend requests",
          variant: "destructive",
        });
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchFriendRequests();
  }, [toast]);

  const [suggestedUsers] = useState<Friend[]>([
    {
      id: "7",
      name: "Jessica Lee",
      username: "jessicaL",
      avatar: "/placeholder.svg?key=jess01",
      status: "online",
    },
    {
      id: "8",
      name: "Chris Martin",
      username: "chrism",
      avatar: "/placeholder.svg?key=chris01",
      status: "offline",
    },
    {
      id: "9",
      name: "Laura Garcia",
      username: "laurag",
      avatar: "/placeholder.svg?key=laura01",
      status: "online",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleAcceptRequest = async (requestId: string, receiverId: string) => {
    try {
      const response = await friendService.respondFriendRequest({
        requestId,
        receiverId,
        action: "ACCEPT",
      });

      if (response.code === 1000) {
        setFriendRequests(
          friendRequests.filter((r) => r.requestId !== requestId),
        );
        toast({
          title: "Friend request accepted",
          description: "You are now friends!",
        });
      }
    } catch (err) {
      console.error("Failed to accept friend request:", err);
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (
    requestId: string,
    receiverId: string,
  ) => {
    try {
      const response = await friendService.respondFriendRequest({
        requestId,
        receiverId,
        action: "REJECT",
      });

      if (response.code === 1000) {
        setFriendRequests(
          friendRequests.filter((r) => r.requestId !== requestId),
        );
        toast({
          title: "Friend request declined",
        });
      }
    } catch (err) {
      console.error("Failed to decline friend request:", err);
      toast({
        title: "Error",
        description: "Failed to decline friend request",
        variant: "destructive",
      });
    }
  };

  const handleAddFriend = (userId: string) => {
    const user = suggestedUsers.find((u) => u.id === userId);
    if (user) {
      setFriends([...friends, user]);
    }
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter((f) => f.id !== friendId));
  };

  const filteredFriends = friends.filter((f) =>
    f.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Friends</h1>
          <p className="text-muted-foreground">
            Manage your connections and friend requests
          </p>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="friends">Friends ({totalElements})</TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({friendRequests.length})
            </TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            <div className="mb-4">
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoading ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Loading friends...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-red-500">{error}</p>
                </CardContent>
              </Card>
            ) : filteredFriends.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No friends found"
                      : "You have no friends yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.map((friend) => (
                  <Card
                    key={friend.userId}
                    className="hover:shadow-md transition"
                  >
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="relative inline-block mb-3">
                          <img
                            src={friend.avatar || "/placeholder.svg"}
                            alt={friend.displayName}
                            className="w-16 h-16 rounded-full"
                          />
                          {friend.status && (
                            <div
                              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                                friend.status === "online"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />
                          )}
                        </div>
                        <p className="font-semibold">{friend.displayName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          size="sm"
                          onClick={() => onMessageFriend?.(friend.userId)}
                        >
                          Message
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFriend(friend.userId)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {isLoadingRequests ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Loading requests...</p>
                </CardContent>
              </Card>
            ) : friendRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    No pending friend requests
                  </p>
                </CardContent>
              </Card>
            ) : (
              friendRequests.map((request) => (
                <Card key={request.requestId}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {request.senderDisplayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">
                              {request.senderDisplayName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Status: {request.status}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {request.message && (
                          <p className="text-sm mt-2 text-foreground/80">
                            "{request.message}"
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAcceptRequest(
                                request.requestId,
                                request.receiverId,
                              )
                            }
                            disabled={request.status !== "PENDING"}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeclineRequest(
                                request.requestId,
                                request.receiverId,
                              )
                            }
                            disabled={request.status !== "PENDING"}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="relative inline-block mb-3">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                            user.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleAddFriend(user.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add Friend
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
