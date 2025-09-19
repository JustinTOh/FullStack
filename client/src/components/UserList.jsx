import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const User = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.user.name}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.user.position}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      {props.user.level}
    </td>
    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.user._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteUser(props.user._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function UserList() {
  const [users, setUsers] = useState([]);

  // This method fetches the users from the database.
  useEffect(() => {
    async function getUsers() {
      const response = await fetch(`http://localhost:5050/user/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const users = await response.json();
      setUsers(users);
    }
    getUsers();
    return;
  }, [users.length]);

  // This method will delete a user
  async function deleteUser(id) {
    await fetch(`http://localhost:5050/user/${id}`, {
      method: "DELETE",
    });
    const newUsers = users.filter((el) => el._id !== id);
    setUsers(newUsers);
  }

  // This method will map out the users on the table
  function userList() {
    return users.map((user) => {
      return (
        <User
          user={user}
          deleteUser={() => deleteUser(user._id)}
          key={user._id}
        />
      );
    });
  }

  // This following section will display the table with the users of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">User Users</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Position
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Level
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {userList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}