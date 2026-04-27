import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";
const ACCESS_ZONES = ["VIP", "STABLES", "ARENA", "SHOW OFFICE", "RESTAURANT", "PRESS", "PARKING"];

async function createAccreditation(formData: FormData) {
  "use server";

  const eventId = Number(formData.get("eventId"));
  const name = String(formData.get("name"));
const category = String(formData.get("category"));
  const zones = formData.getAll("zones").map(String);

  const person = await prisma.person.create({
    data: { name, category, eventId },
  });

  await prisma.access.createMany({
    data: zones.map((zone) => ({ zone, personId: person.id })),
  });

  revalidatePath(`/events/${eventId}`);
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const eventId = Number(params.id);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { people: { include: { accesses: true } } },
  });

  if (!event) return <div>Event not found</div>;

  const people = event.people;
  const total = people.length;

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif", background: "#f6f6f6", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 42, marginBottom: 8 }}>{event.name}</h1>
      <p style={{ fontSize: 18, color: "#666", marginBottom: 30 }}>Event Accreditation Management</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
        <Card title="Total" value={total} />
        <Card title="Staff" value={people.filter((p) => p.category === "STAFF").length} />
        <Card title="VIP" value={people.filter((p) => p.category === "VIP").length} />
        <Card title="Media" value={people.filter((p) => p.category === "MEDIA").length} />
      </div>

      <section style={{ background: "white", padding: 28, borderRadius: 18, marginBottom: 30 }}>
        <h2 style={{ marginTop: 0 }}>New Accreditation</h2>

        <form action={createAccreditation} style={{ display: "grid", gap: 18 }}>
          <input type="hidden" name="eventId" value={event.id} />

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input name="name" placeholder="Name" required style={inputStyle} />

            <select name="category" required style={inputStyle}>
              <option value="STAFF">Staff</option>
              <option value="RIDER">Rider</option>
              <option value="GROOM">Groom</option>
              <option value="MEDIA">Media</option>
              <option value="VIP">VIP</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>

          <div>
            <strong>Access Zones</strong>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
              {ACCESS_ZONES.map((zone) => (
                <label key={zone} style={checkboxStyle}>
                  <input type="checkbox" name="zones" value={zone} />
                  {zone}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" style={buttonStyle}>Create Accreditation</button>
        </form>
      </section>

      <section style={{ background: "white", padding: 28, borderRadius: 18 }}>
        <h2 style={{ marginTop: 0 }}>Accreditations</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Category</th>
              <th style={cellStyle}>Access Zones</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={cellStyle}>{p.name}</td>
                <td style={cellStyle}>{p.category}</td>
                <td style={cellStyle}>{p.accesses.map((a) => a.zone).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div style={{ background: "white", padding: 22, borderRadius: 16, minWidth: 140 }}>
      <div style={{ color: "#777", fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 34, fontWeight: "bold" }}>{value}</div>
    </div>
  );
}

const inputStyle = { padding: 12, borderRadius: 10, border: "1px solid #ddd", minWidth: 220, fontSize: 15 };
const checkboxStyle = { padding: "10px 14px", border: "1px solid #ddd", borderRadius: 999, background: "#fafafa", cursor: "pointer" };
const buttonStyle = { padding: "14px 22px", borderRadius: 10, border: "none", background: "#111", color: "white", fontSize: 15, cursor: "pointer", width: "fit-content" };
const cellStyle = { padding: 12 };