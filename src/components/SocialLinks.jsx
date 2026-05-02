export default function SocialLinks() {
  const links = [
    {
      name: "Instagram",
      url: "https://instagram.com/YOUR_USERNAME",
      color: "bg-pink-500",
    },
    {
      name: "Facebook",
      url: "https://facebook.com/YOUR_PAGE",
      color: "bg-blue-600",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/YOUR_CHANNEL",
      color: "bg-red-600",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow mt-6">
      <h2 className="font-semibold mb-4">Connect With Us</h2>

      <div className="flex gap-4">
        {links.map((l) => (
          <button
            key={l.name}
            onClick={() => window.open(l.url, "_blank")}
            className={`${l.color} text-white px-4 py-2 rounded-lg hover:scale-105 transition`}
          >
            {l.name}
          </button>
        ))}
      </div>
    </div>
  );
}