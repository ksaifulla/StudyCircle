import { useGroups } from "../hooks/useGroups";

const ShowGroups = () => {
  const { loading, groups } = useGroups();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!groups || groups.length === 0) {
    return <p>No groups available</p>;
  }

  return (
    <div>
      {groups.map((group) => (
        <div
          key={group._id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <h3>{group.name || "Unnamed Group"}</h3>
          <p>
            <strong>Subject:</strong> {group.subject || "No subject"} <br></br>
            <strong>Description:</strong>{" "}
            {group.description || "No description"}
          </p>
          <p>
            <strong>Members:</strong>
          </p>
          <ul>
            {group.members && group.members.length > 0 ? (
              group.members.map((member) => (
                <li key={member._id}>{member.username}</li>
              ))
            ) : (
              <li>No members</li>
            )}
          </ul>
          <p>
            <strong>Admins:</strong>
          </p>
          <ul>
            {group.admins && group.admins.length > 0 ? (
              group.admins.map((admin) => (
                <li key={admin._id}>{admin.username}</li>
              ))
            ) : (
              <li>No admins</li>
            )}
          </ul>
          <p>
            <strong>Group Id: </strong>
            {group._id}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ShowGroups;
