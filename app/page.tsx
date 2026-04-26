import { prisma } from "./lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function createEvent(formData: FormData) {
  "use server";

  const name = String(formData.get("name"));
  const location = String(formData.get("location"));

  await prisma.event.create({
    data: {
      name,
      location,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  revalidatePath("/");
}

export default async function Home() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <main style={{ padding: 40, fontFamily: "Arial", background: "#f6f6f6", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 42, marginBottom: 8 }}>ClearPass</h1>
      <p style={{ marginBottom: 30, color: "#666" }}>Select Event</p>

      <section style={{ background: "white", padding: 24, borderRadius: 16, marginBottom: 30 }}>
        <h2 style={{ marginTop: 0 }}>Create Event</h2>

        <form action={createEvent} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input name="name" placeholder="Event name" required style={inputStyle} />
          <input name="location" placeholder="Location" style={inputStyle} />

          <button type="submit" style={buttonStyle}>
            Create Event
          </button>
        </form>
      </section>

      <div style={{ display: "grid", gap: 16 }}>
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                background: "white",
                padding: 20,
                borderRadius: 12,
                border: "1px solid #eee",
              }}
            >
              <strong>{event.name}</strong>

              <div style={{ color: "#666", fontSize: 14, marginBottom: 10 }}>
                {event.location}
              </div>

              <div style={smallButtonStyle}>Open Event</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  minWidth: 220,
  fontSize: 15,
};

const buttonStyle = {
  padding: "14px 22px",
  borderRadius: 10,
  border: "none",
  background: "#111",
  color: "white",
  fontSize: 15,
  cursor: "pointer",
};

const smallButtonStyle = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#111",
  color: "white",
  cursor: "pointer",
};