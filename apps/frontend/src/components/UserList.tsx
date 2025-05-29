import { useChatStore } from "@/lib/store/chatStore";

interface UserListProps {
  username: string;
}

const UserList = ({ username }: UserListProps) => {
  const users = useChatStore((s) => s.users);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg text-gray-800">
          👥 Online Users ({users.length})
        </h2>
      </div>
      <div className="p-4 flex-1">
        {users.map((user, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span
              className={`text-sm ${
                user === username ? "font-bold text-blue-600" : "text-gray-700"
              }`}
            >
              {user} {user === username && "(you)"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
